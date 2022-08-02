using Authorization;
using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.DAL.Results;
using Instool.DAL.Repositories;
using Instool.Dtos;
using Instool.Enums;
using Instool.Services;
using Instool.Tools.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Instool.RestAPI.Exceptions;
using System.Net.Http.Headers;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/instruments")]
    public class InstrumentApiController : ControllerBase
    {
        private readonly IAuthorizationService _authService;
        private readonly IInstrumentService _service;

        private readonly ILocationRepository _locationRepo;
        private readonly IInstitutionRepository _institutionRepo;

        private readonly IFileRepository _fileRepo;

        public InstrumentApiController(
            IAuthorizationService authService,
            IInstrumentService service,
            ILocationRepository locationRepo,
            IInstitutionRepository institutionRepo,
            IFileRepository fileRepo)
        {
            _authService = authService;
            _service = service;
            _locationRepo = locationRepo;
            _institutionRepo = institutionRepo;
            _fileRepo = fileRepo;
        }

        [HttpGet("{*idOrDoi}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentDTO>> GetInstrument(string idOrDoi)
        {
            var decoded = DoiHelper.DecodeDoi(idOrDoi);
            var instrument = decoded.IsDoi ?
                                await _service.GetByDoi(decoded.Doi!) :
                                await _service.GetById(decoded.NumericalId);
            if (instrument == null)
            {
                return NotFound();
            }
            return Ok(InstrumentDTO.FromEntity(instrument));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentDTO>> GetInstrumentByDoi([FromQuery] string idOrDoi)
        {
            var decoded = DoiHelper.DecodeDoi(idOrDoi);
            var instrument = decoded.IsDoi ?
                                await _service.GetByDoi(decoded.Doi!) :
                                await _service.GetById(decoded.NumericalId);
            if (instrument == null)
            {
                return NotFound();
            }
            return Ok(InstrumentDTO.FromEntity(instrument));
        }

        [HttpPost("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentSearchResult>> Search(
            [FromBody] InstrumentSearchRequest request,
            [FromQuery] string? sortColumn, [FromQuery] string? sortOrder,
            [FromQuery] int start, [FromQuery] int length, [FromQuery] int draw)
        {
            if (!string.IsNullOrWhiteSpace(request.InstrumentType))
            {
                request.InstrumentType = request.InstrumentType.Split("#")[0];
            }
            var instruments = await _service.Search(request, sortColumn, sortOrder, start, length);
            return Ok(new InstrumentSearchResult(instruments, draw));
        }

        [HttpPut("{id}/doi/{*doi}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult> SetDoi([FromRoute] int id, [FromRoute] string doi)
        {
            var instrument = await _service.GetById(id);
            if (instrument == null) { return NotFound(); }
            await AuthHelper.Check(_authService.AuthorizeAsync(User, instrument, Operation.Update));

            await _service.SetDoi(id, doi);
            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<InstrumentDTO>> CreateInstrument([FromBody] InstrumentDTO dto)
        {
            if (dto.InstrumentId != null)
            {
                return BadRequest("InstrumentID is set automatically and has to be empty");
            }
            var instrument = dto.GetEntity();
            await AuthHelper.Check(_authService.AuthorizeAsync(User, instrument, Operation.Create));

            if (dto.Location?.IsReference() == true)
            {
                instrument.LocationId = await LookupLocation(dto.Location);
            }
            // else create location
            if (dto.Institution?.IsReference() == true)
            {
                instrument.InstitutionId = await LookupInstitution(dto.Institution);
            }
            // else create institution

            var contacts = dto.Contacts.Select(c => new InstrumentContact
            {
                InvestigatorId = c.InvestigatorId ?? 0,
                Eppn = c.Eppn,
                Investigator = c.AreDataComplete() ? c.GetEntity() : null,
                Role = c.Role ?? InvestigatorRole.Technical.ID
            });
            var types = dto.InstrumentTypes.Select(t => t.GetEntity());
            var awards = dto.Awards.Select(a => a.GetEntity());
            try
            {
                var created = await _service.CreateInstrument(instrument, contacts, types, awards);
                return InstrumentDTO.FromEntity(created);
            }
            catch (IncompleteDataException e)
            {
                throw new HttpResponseException(StatusCodes.Status412PreconditionFailed, e.Message);
            }
        }

        [HttpPost("{instrumentId}/images"), DisableRequestSizeLimit]
        public async Task<IActionResult> Upload(int instrumentId)
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    using (MemoryStream stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        var bytes = stream.ToArray();

                        var dbFile = new DAL.Models.File()
                        {
                            Filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"') ?? "image.jpeg",
                            InstrumentId = instrumentId,
                            Content = Convert.ToBase64String(bytes)
                        };
                        await _fileRepo.Create(dbFile);
                    }
                    return NoContent();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("{instrumentId}/files/{fileId}")]
        public async Task<FileStreamResult> GetFile([FromRoute] int fileId)
        {
            var file = await _fileRepo.Get(fileId);
            if (file == null)
            {
                throw new HttpResponseException(StatusCodes.Status404NotFound);
            }
            try
            {

                byte[] imageBytes = Convert.FromBase64String(file.Content);
                MemoryStream stream = new(imageBytes, 0, imageBytes.Length);

                // Convert byte[] to Image
                stream.Write(imageBytes, 0, imageBytes.Length);
                stream.Position = 0;

                return File(stream, "image/jpeg", file.Filename);
            }
            catch (Exception e)
            {
                throw new HttpResponseException(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        private async Task<int> LookupInstitution(InstitutionDTO institution)
        {
            if (institution.InstitutionId != null)
            {
                return institution.InstitutionId.Value;
            }
            if (institution.Facility == null)
            {
                throw new HttpResponseException(StatusCodes.Status400BadRequest, "Need Institution ID or facility for lookup");
            }
            var found = await _institutionRepo.Lookup(institution.Facility);
            return found?.InstitutionId ?? throw new HttpResponseException(
                         StatusCodes.Status412PreconditionFailed, "Facility does not exist"
            );
        }

        private async Task<int> LookupLocation(LocationDTO location)
        {
            if (location.LocationId != null)
            {
                return location.LocationId.Value;
            }
            if (location.Building == null)
            {
                throw new HttpResponseException(StatusCodes.Status400BadRequest, "Need Location ID or Building for lookup");
            }
            var found = await _locationRepo.Lookup(location.Building);
            return found?.LocationId ?? throw new HttpResponseException(
                         StatusCodes.Status412PreconditionFailed, "Location does not exist"
            );
        }
    }
}
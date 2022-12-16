using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models;
using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.Dtos;
using Instool.Enums;
using Instool.Exceptions;
using Instool.Mapper;
using Instool.Services;
using Instool.Tools.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<InstrumentDto>> GetInstrument(string idOrDoi)
        {
            var decoded = DoiHelper.DecodeDoi(idOrDoi);
            var instrument = decoded.IsDoi ?
                                await _service.GetByDoi(decoded.Doi!) :
                                await _service.GetById(decoded.NumericalId);
            if (instrument == null)
            {
                return NotFound();
            }
            return Ok(instrument.ConvertToDto());
        }

        /// <summary>
        ///     Search instruments according to a variety of criteria.
        ///     Returns a Instrument Row, with limited data for display in a table.
        ///     
        ///     Returns an empty array if nothing is found.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="sortColumn"></param>
        /// <param name="sortOrder"></param>
        /// <param name="start"></param>
        /// <param name="length"></param>
        /// <param name="draw"></param>
        /// <returns></returns>
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
        /// <summary>
        ///     Lookup an instrument, using the same criteria as the search.
        ///     Returns the full instrument data as Get would.
        ///     
        ///     Return 404 if nothing is found.
        ///     Return 409 if more than one instrument is found. 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        [HttpPost("lookup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status409Conflict)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentDto>> Lookup([FromBody] InstrumentLookupRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.InstrumentType))
            {
                request.InstrumentType = request.InstrumentType.Split("#")[0];
            }
            var instruments = await _service.Lookup(request);
            if (!instruments.Any())
            {
                return NotFound();
            }
            if (instruments.Count() > 1)
            {
                return Conflict(new
                {
                    Error = $"Found {instruments.Count()} matching instruments",
                    Instruments = instruments.Select(i => new { id = i.InstrumentId, doi = i.Doi, name = i.Name })
                });
            }
            return await GetInstrument(instruments.First().InstrumentId.ToString());
        }

        [HttpPatch("{id}/doi/{*doi}")]
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
        public async Task<ActionResult<InstrumentDto>> CreateInstrument([FromBody] InstrumentDto dto)
        {
            if (dto.InstrumentId != null)
            {
                return BadRequest("InstrumentID is set automatically and has to be empty");
            }
            var instrument = dto.ConvertToEntity();
            await AuthHelper.Check(_authService.AuthorizeAsync(User, instrument, Operation.Create));

            if (dto.Location?.IsReference() == true)
            {
                instrument.LocationId = await GetOrCreateLocation(dto.Location);
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
                Investigator = c.AreDataComplete() ? c.ConvertToEntity() : null,
                Role = c.Role ?? InvestigatorRole.Technical.ID
            });
            var types = dto.InstrumentTypes.Select(t => t.ConvertToEntity());
            var awards = dto.Awards.Select(a => a.ConvertToEntity());
            try
            {
                var created = await _service.CreateInstrument(instrument, contacts, types, awards);
                return created.ConvertToDto();
            }
            catch (IncompleteDataException e)
            {
                throw new HttpResponseException(StatusCodes.Status412PreconditionFailed, e.Message);
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<InstrumentDto>> Update([FromRoute] int id, [FromBody] InstrumentDto dto)
        {
            var instrument = await _service.GetById(id);
            if (instrument == null)
            {
                return await this.CreateInstrument(dto);
            }
            await AuthHelper.Check(_authService.AuthorizeAsync(User, instrument, Operation.Update));
            var newEntity = dto.ConvertToEntity();
            // Check again - if the user is not authorized to modify the version they are sending, 
            // we'll throw 403, too. Eg. a technical contact might modify their instrument, but they cannot remove themselves.
            // nor move their instrument into another institution
            await AuthHelper.Check(_authService.AuthorizeAsync(User, instrument, Operation.Update));

            if (dto.Location?.IsReference() == true)
            {
                instrument.LocationId = await GetOrCreateLocation(dto.Location);
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
                Investigator = c.AreDataComplete() ? c.ConvertToEntity() : null,
                Role = c.Role ?? InvestigatorRole.Technical.ID
            });
            var types = dto.InstrumentTypes.Select(t => t.ConvertToEntity());
            var awards = dto.Awards.Select(a => a.ConvertToEntity());
            try
            {
                var created = await _service.UpdateInstrument(instrument, contacts, types, awards);
                return created.ConvertToDto();
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
                    using (MemoryStream stream = new())
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

        private async Task<int> LookupInstitution(InstitutionDto institution)
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

        private async Task<int> GetOrCreateLocation(LocationDto location)
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
            if (found != null)
            {
                return found.LocationId;
            }
            if (location.IsReference())
            {
                throw new HttpResponseException(
                    StatusCodes.Status412PreconditionFailed, $"Location {location.Building} does not exist"
                );
            }
            var created = await _locationRepo.Create(location.ConvertToEntity());
            return created.LocationId;
        }

    }
}
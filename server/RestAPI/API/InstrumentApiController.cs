using Authorization;
using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.DAL.Results;
using Instool.Dtos;
using Instool.Enums;
using Instool.Services;
using Instool.Tools.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/instruments")]
    public class InstrumentApiController : ControllerBase
    {
        private readonly IAuthorizationService _authService;
        private readonly IInstrumentService _service;

        public InstrumentApiController(IAuthorizationService authService, IInstrumentService service)
        {
            _authService = authService;
            _service = service;
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
            var instruments = await _service.Search(request, sortColumn, sortOrder, start, length);
            return Ok(new InstrumentSearchResult(instruments, draw));
        }

        [HttpPut("{id}/doi/{*doi}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult> SetDoi([FromRoute]int id, [FromRoute] string doi)
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
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentDTO>> CreateInstrument([FromBody] InstrumentDTO dto)
        {
            if (dto.InstrumentId != null)
            {
                return BadRequest("InstrumnetID is set automatically and has to be empty");
            }
            var instrument = dto.GetEntity();
            await AuthHelper.Check(_authService.AuthorizeAsync(User, dto, Operation.Create));

            var contacts = dto.Contacts.Select(c => new InstrumentContact
            {
                InvestigatorId = c.InvestigatorId,
                Eppn = c.Eppn,
                Investigator = c.AreDataComplete() ? c.GetEntity() : null, 
                Role = c.Role ?? InvestigatorRole.Technical.ID
            });
            var created = await _service.CreateInstrument(instrument, contacts);

            return InstrumentDTO.FromEntity(created);
        }
    }
}
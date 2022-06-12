using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.DAL.Results;
using Instool.Dtos;
using Instool.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/instrument-types")]
    public class InstrumentTypeApiController : ControllerBase
    {
        private readonly IAuthorizationService _authService;
        private readonly IInstrumentTypeRepository _repo;
        private readonly IInstrumentService _instrumentService;

        public InstrumentTypeApiController(IAuthorizationService authService, IInstrumentTypeRepository repo, IInstrumentService instrumentService)
        {
            _authService = authService;
            _repo = repo;
            _instrumentService = instrumentService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<InstrumentTypeDTO>> GetInstrumentType(int id)
        {
            var type = await _repo.GetById(id);
            if (type == null)
            {
                return NotFound();
            }
            return Ok(InstrumentTypeDTO.FromEntity(type));
        }


        [HttpGet("{id}/instruments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentSearchResult>> GetInstrumentsByType(
            [FromQuery] int id,
            [FromQuery] string? sortColumn, [FromQuery] string? sortOrder,
            [FromQuery] int start, [FromQuery] int length, [FromQuery] int draw)
        {
            // Not really necessary, but maybe helpful if we can return 404 instead of an empty list in that case.
            var type = await _repo.GetById(id);
            if (type == null) { return NotFound(); }

            var instruments = await _instrumentService.Search(
                new InstrumentSearchRequest
                {
                    InstrumentTypeId = type.InstrumentTypeId
                },
                sortColumn, sortOrder, start, length
            );
            return Ok(new InstrumentSearchResult(instruments, draw));
        }

        [HttpGet("{id}/types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentDTO>>> GetSubtypes(int id)
        {
            // Not really necessary, but maybe helpful if we can return 404 instead of an empty list in that case.
            var type = await _repo.GetById(id);
            if (type == null) { return NotFound(); }

            var types = await _repo.GetTypes(id);
            return Ok(types.Select(i => InstrumentTypeDTO.FromEntity(i)));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentTypeDTO>>> GetInstrumentTypes()
        {
            var types = await _repo.GetTypes();
            return Ok(types.Select(i => InstrumentTypeDTO.FromEntity(i)));
        }

        [HttpGet("hierarchie")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentTypeDTO>>> GetInstrumentTypeHierarchie()
        {
            var types = await _repo.LoadHierarchie();
            return Ok(types.Select(i => InstrumentTypeDTO.FromEntity(i)));
        }


    }
}
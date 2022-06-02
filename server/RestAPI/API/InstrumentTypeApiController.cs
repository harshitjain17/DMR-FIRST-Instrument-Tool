using Instool.DAL.Repositories;
using Instool.Dtos;
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

        public InstrumentTypeApiController(IAuthorizationService authService, IInstrumentTypeRepository repo)
        {
            _authService = authService;
            _repo = repo;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
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
        public async Task<ActionResult<ICollection<InstrumentDTO>>> GetInstrumentsByType(int id)
        {
            var type = await _repo.GetById(id);
            if (type == null)
            {
                return NotFound();
            }
            return Ok(type.Instruments.Select(i => InstrumentDTO.FromEntity(i)));
        }

        [HttpGet("{id}/types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
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
        public async Task<ActionResult<ICollection<InstrumentTypeDTO>>> GetInstrumentTypes()
        {
            var types = await _repo.GetTypes();
            return Ok(types.Select(i => InstrumentTypeDTO.FromEntity(i)));
        }


    }
}
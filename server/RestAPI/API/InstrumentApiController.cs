using Instool.DAL.Repositories;
using Instool.Dtos;
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
        private readonly IInstrumentRepository _repo;

        public InstrumentApiController(IAuthorizationService authService, IInstrumentRepository repo)
        {
            _authService = authService;
            _repo = repo;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<InstrumentDTO>> GetInstrument(int id)
        {
            var instrument = await _repo.Get(id);
            if (instrument == null)
            {
                return NotFound();
            } 
            return Ok(InstrumentDTO.FromEntity(instrument));
        }


    }
}
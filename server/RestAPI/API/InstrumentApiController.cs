using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.Dtos;
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
        private readonly IInstrumentRepository _repo;

        public InstrumentApiController(IAuthorizationService authService, IInstrumentRepository repo)
        {
            _authService = authService;
            _repo = repo;
        }

        [HttpGet("{*idOrDoi}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<InstrumentDTO>> GetInstrument(string idOrDoi)
        {
            var decoded = DoiHelper.DecodeDoi(idOrDoi);
            var instrument = decoded.IsDoi ?
                                await _repo.GetByDoi(decoded.Doi!) :
                                await _repo.GetById(decoded.NumericalId);
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
        public Task<ActionResult<ICollection<InstrumentDTO>>> Search(InstrumentSearchRequest request)
        {
            throw new NotImplementedException("TO DO");
        }

    }
}
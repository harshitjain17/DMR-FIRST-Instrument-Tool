using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Repositories;
using Instool.RestAPI.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator;

namespace Instool.RestAPI.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/api-keys")]
    [HasPrivilege(PrivilegeEnum.ApiKey)]
    public class ApiKeyController : ControllerBase
    {
        private readonly IApiKeyRepository _repo;

        public ApiKeyController(IApiKeyRepository service)
        {
            _repo = service;
        }

        [HttpGet]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<ApiKeyDTO>>> List([FromQuery] bool includeExpired)
        {
            var elements = await _repo.List(includeExpired);
            var dtos = elements.Select(entity => ApiKeyDTO.FromEntity(entity));
            return Ok(dtos);

        }


        [HttpPost]
        [HasPrivilege(PrivilegeEnum.ApiKey, OperationEnum.Create)]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiKeyDTO>> Create([FromBody] ApiKeyDTO key)
        {
            var data = new Password().LengthRequired(40).Next();
            var id  = await _repo.Create(key.GetEntity(), data);
            var saved = await _repo.GetById(id);
            // We just created it, so it won't be null (or we would have got an exception)
            var dto = ApiKeyDTO.FromEntity(saved!);
            dto.Key = data;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        [HasPrivilege(PrivilegeEnum.ApiKey, OperationEnum.Create)]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiKeyDTO>> Update([FromBody] ApiKeyDTO key, [FromRoute] int id)
        {
            if (await _repo.GetById(id) == null)
            {
                return NotFound();
            }
            if (key.ID != id)
            {
                return BadRequest();
            }
            var entity = key.GetEntity();


            await _repo.Update(
                entity.ApiKeyId, 
                entity.ValidTo, 
                entity.RoleId, 
                entity.AllowInternalApi);
            var reloaded = await _repo.GetById(key.ID);
            var dto = ApiKeyDTO.FromEntity(reloaded!);
            return Ok(dto);

        }

        [HttpDelete("{id}")]
        [HasPrivilege(PrivilegeEnum.ApiKey, OperationEnum.Delete)]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            var key = await _repo.GetById(id);
            if (key == null)
            {
                return NotFound();
            }
            await _repo.Delete(key);
            return NoContent();
        }
    }
}

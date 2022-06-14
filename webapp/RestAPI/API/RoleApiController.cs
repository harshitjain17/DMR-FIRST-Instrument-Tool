using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;
using Instool.DAL.Repositories;
using Instool.Dtos;
using Instool.RestAPI.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.Controllers.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/roles")]
    public class RoleApiController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;

        private readonly IAuthorizationService _authService;

        public RoleApiController(IAuthorizationService authService, IRoleRepository roleRepository)
        {
            _authService = authService;
            _roleRepository = roleRepository;
        }

        [HttpGet("{idOrName}")]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Read)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<RoleDTO>> GetRole(string idOrName) {
            Role? role;
            if (int.TryParse(idOrName, out int id)) {
               role = await _roleRepository.Get(id);
            } else
            {
                role = (await _roleRepository.List(true)).SingleOrDefault(r => r.Name == idOrName);
            }
            if (role == null)
            {
                return NotFound();
            } 
            return Ok(RoleDTO.FromEntity(role, withPrivileges: true));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRoles([FromQuery] bool customizing = false)
        {
            if (customizing)
            {
                if (!User.HasPrivilege(PrivilegeEnum.Role))
                {
                   throw HttpResponseException.Forbidden();
                }

                var roles = await _roleRepository.ListWithUsage();
                var dtos = roles.Select(r => RoleDTO.FromEntity(
                    r.Item1, 
                    withPrivileges: true, 
                    used: r.Item2));
                return Ok(dtos);
            }
            else {
                var roles = await _roleRepository.List();
                var dtos = roles.Select(r => RoleDTO.FromEntity(r));
                return Ok(dtos);
            }
        }

        [HttpPost]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Create)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<RoleDTO>> Create([FromBody] RoleDTO role)
        {
            var entity = role.GetEntity();
            await _roleRepository.Create(entity);
            return Ok(RoleDTO.FromEntity(entity, true));
        }

        [HttpPut("{id}")]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Update)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update([FromBody] RoleDTO role, [FromRoute] int id)
        {
            if (role is null || role.ID != id)
            {
                return BadRequest();
            }

            var existing = await _roleRepository.Get(role.ID);
            if (existing == null)
            {
                return NotFound();
            }

            var entity = role.GetEntity();

            await _roleRepository.Update(entity);
            return Ok(RoleDTO.FromEntity(entity));
        }

        [HttpDelete("{id}")]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Delete)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var role = await _roleRepository.Get(id);
            if (role == null)
            {
                return NotFound();
            }
            await _roleRepository.Delete(role);
            return NoContent();
        }
    }
}

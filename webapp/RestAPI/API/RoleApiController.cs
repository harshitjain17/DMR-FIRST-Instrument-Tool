using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;
using Instool.DAL.Repositories;
using Instool.Dtos;
using Instool.Exceptions;
using Instool.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.API
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
        public async Task<ActionResult<RoleDto>> GetRole(string idOrName)
        {
            var role = await LoadRole(idOrName);
            return Ok(role.ConvertToDto(withPrivileges: true));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles([FromQuery] bool customizing = false)
        {
            if (customizing)
            {
                if (!User.HasPrivilege(PrivilegeEnum.Role))
                {
                    throw HttpResponseException.Forbidden();
                }

                var roles = await _roleRepository.ListWithUsage();
                var dtos = roles.Select(r => r.Item1.ConvertToDto(withPrivileges: true, used: r.Item2));
                return Ok(dtos);
            }
            else
            {
                var roles = await _roleRepository.List();
                var dtos = roles.Select(r => r.ConvertToDto());
                return Ok(dtos);
            }
        }

        [HttpPost]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Create)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<RoleDto>> Create([FromBody] RoleDto role)
        {
            var entity = role.ConvertToEntity();
            await _roleRepository.Create(entity);
            return Ok(entity.ConvertToDto(true));
        }

        [HttpPut("{idOrName}")]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Update)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update([FromBody] RoleDto role, [FromRoute] string idOrName)
        {
            if (role is null) { return BadRequest(); }
            var existing = await LoadRole(idOrName);
            if (role.ID > 0 && role.ID != existing.RoleId ||
               role.Name != existing.Name)
            {
                return BadRequest();
            }

            var entity = role.ConvertToEntity();

            await _roleRepository.Update(entity);
            return Ok(entity.ConvertToDto());
        }

        [HttpDelete("{idOrName}")]
        [HasPrivilege(PrivilegeEnum.Role, OperationEnum.Delete)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete([FromRoute] string idOrName)
        {
            var role = await LoadRole(idOrName);
            await _roleRepository.Delete(role);
            return NoContent();
        }

        private async Task<Role> LoadRole(string idOrName)
        {
            Role? role;
            if (int.TryParse(idOrName, out int id))
            {
                role = await _roleRepository.Get(id);
            }
            else
            {
                role = (await _roleRepository.List(true)).SingleOrDefault(r => r.Name == idOrName);
            }
            return role ?? throw HttpResponseException.NotFound();
        }
    }
}

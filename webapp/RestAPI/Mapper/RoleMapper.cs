using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;
using Instool.Dtos;

namespace Instool.Mapper;
internal static class RoleMapper
{

    public static Role ConvertToEntity(this RoleDto dto) => new()
    {
        RoleId = dto.ID,
        Name = dto.Name ?? throw new ArgumentNullException("Name"),
        Privileges = dto.Privileges.Select(p => p.ConvertToEntity()).ToArray()
    };

    /// <summary>
    ///     Get Dto for a role
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="withPrivileges">If true include also the privileges that come with a role. 
    /// If false only include the role</param>
    /// <param name="used">Mark that role as used or unused, if there are (no) users that have been assigned that role</param>
    /// <returns></returns>
    public static RoleDto ConvertToDto(this Role entity, bool withPrivileges = false, bool used = false)
    {
        List<PrivilegeDto> privilegeDtos = new();
        if (withPrivileges)
        {
            foreach (var privilegeDef in PrivilegeDisplay.GetPrivilegesToDisplay())
            {
                var privilege = entity.Privileges.SingleOrDefault(p => p.Name == privilegeDef.Name);
                privilegeDtos.Add((privilege ?? new RolePrivilege { Name = privilegeDef.Name }).ConvertToDto(privilegeDef));
            }
        }

        return new RoleDto()
        {
            ID = entity.RoleId,
            Name = entity.Name,
            Privileges = privilegeDtos,
            Used = used
        };
    }

    /// <summary>
    ///     Create a Role Dto and only include specific privileges.
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="privilegesToInclude"></param>
    /// <returns></returns>
    public static RoleDto ConvertToDto(this Role entity, IEnumerable<PrivilegeEnum> privilegesToInclude)
    {
        List<PrivilegeDto> privilegeDtos = new();
        var privilegeDefsToInclude = PrivilegeDisplay.GetPrivilegesToDisplay()
                                                     .Where(p => privilegesToInclude.Contains(p.Privilege));

        foreach (var privilegeDef in privilegeDefsToInclude)
        {
            var privilege = entity.Privileges.SingleOrDefault(p => p.Name == privilegeDef.Name);
            privilegeDtos.Add(
                privilege != null ? privilege.ConvertToDto(privilegeDef) : PrivilegeDto.None(privilegeDef)
            );
        }

        return new RoleDto()
        {
            ID = entity.RoleId,
            Name = entity.Name,
            Privileges = privilegeDtos,
        };
    }

    public static RoleDto ConvertToDto(this IPrivilegeCollection privileges, int id, string name)
    {
        List<PrivilegeDto> privilegeDtos = new();

        foreach (var privilege in privileges.Privileges.Where(p => p.Operations.Any()))
        {
            privilegeDtos.Add(privilege.ConvertToDto());
        }

        return new RoleDto()
        {
            ID = id,
            Name = name,
            Privileges = privilegeDtos,
        };
    }

    public static PrivilegeDto ConvertToDto(this RolePrivilege role, PrivilegeDisplay def) => new()
    {
        Name = role.Name,
        Rights =
            (role.Create ? "c" : ".") +
            (role.Read ? "r" : ".") +
            (role.Update ? "u" : ".") +
            (role.Delete ? "d" : ".") +
            (role.Submit ? "s" : "."),
        Desc = def?.Desc,
        SupportedOperations = def?.Operations.Select(op => Operation.GetChar(op)) ?? new List<char>(),
        Group = def?.Group
    };

    public static PrivilegeDto ConvertToDto(this Privilege p) => new()
    {
        Name = p.GetName(),
        Rights = p.Operations.AsString()
    };

    public static RolePrivilege ConvertToEntity(this PrivilegeDto dto) => new()
    {
        Name = dto.Name ?? throw new ArgumentNullException("Name"),
        Create = dto.Rights?.Contains('c') == true,
        Read = dto.Rights?.Contains('r') == true,
        Update = dto.Rights?.Contains('u') == true,
        Delete = dto.Rights?.Contains('d') == true,
        Submit = dto.Rights?.Contains('s') == true,
    };
}

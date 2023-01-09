using Instool.Authorization.Privileges;

namespace Instool.Dtos;
public class RoleDto
{
    public bool Used { get; set; }

    public int ID { get; set; }
    public string? Name { get; set; }

    public List<PrivilegeDto> Privileges { get; set; } = new List<PrivilegeDto>();
    public string GetLabelForErrorMessages() { return "Role"; }

    internal static List<PrivilegeDto> AdminPrivileges()
    {
        return PrivilegeDisplay
                    .GetPrivilegesToDisplay()
                    .Select(p => PrivilegeDto.All(p)).ToList();
    }
}

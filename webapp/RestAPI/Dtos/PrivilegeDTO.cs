using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;

namespace Instool.Dtos;
public class PrivilegeDto
{
    public string? Name { get; set; }
    public string? Rights { get; set; }

    public string? Desc { get; set; }
    public IEnumerable<char> SupportedOperations { get; set; } = new List<char>();
    public string? Group { get; set; }

    public static PrivilegeDto All(PrivilegeDisplay def)
    {
        return new PrivilegeDto
        {
            Name = def.Name,
            Rights = "crudspxl",
            Desc = def.Desc,
            SupportedOperations = def.Operations.Select(op => Operation.GetChar(op)),
            Group = def.Group
        };
    }

    public static PrivilegeDto None(PrivilegeDisplay def)
    {
        return new PrivilegeDto
        {
            Name = def.Name,
            Rights = "",
            Desc = def.Desc,
            SupportedOperations = def.Operations.Select(op => Operation.GetChar(op)),
            Group = def.Group
        };
    }
}
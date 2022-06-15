using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;

namespace Instool.Dtos
{
    public class PrivilegeDTO
    {
        public string? Name { get; set; }
        public string? Rights { get; set; }

        public string? Desc { get; private set; }
        public IEnumerable<char> SupportedOperations { get; private set; } = new List<char>();
        public string? Group { get; private set; }

        public static PrivilegeDTO All(PrivilegeDisplay def) {
            return new PrivilegeDTO
            {
                Name = def.Name,
                Rights = "crudspxl",
                Desc = def.Desc,
                SupportedOperations = def.Operations.Select(op => Operation.GetChar(op)),
                Group = def.Group
            };
        }

        public static PrivilegeDTO None(PrivilegeDisplay def)
        {
            return new PrivilegeDTO
            {
                Name = def.Name,
                Rights = "",
                Desc = def.Desc,
                SupportedOperations = def.Operations.Select(op => Operation.GetChar(op)),
                Group = def.Group
            };
        }

        public static PrivilegeDTO FromEntity(RolePrivilege p, PrivilegeDisplay def)
        {
            return new PrivilegeDTO
            {
                Name = p.Name,
                Rights =
                (p.Create ? "c" : ".") +
                (p.Read ? "r" : ".") +
                (p.Update ? "u" : ".") +
                (p.Delete ? "d" : ".") +
                (p.Submit ? "s" : "."),
                Desc = def?.Desc,
                SupportedOperations = def?.Operations.Select(op => Operation.GetChar(op)) ?? new List<char>(),
                Group = def?.Group
            };
        }

        public static PrivilegeDTO FromAuth(Privilege p)
        {
            return new PrivilegeDTO
            {
                Name = p.GetName(),
                Rights = p.Operations.AsString()
            };
        }

        public RolePrivilege GetEntity()
        {
            return new RolePrivilege
            {
                Name = Name ?? throw new ArgumentNullException("Name"),
                Create = Rights != null && Rights.Contains('c'),
                Read = Rights != null && Rights.Contains('r'),
                Update = Rights != null && Rights.Contains('u'),
                Delete = Rights != null && Rights.Contains('d'),
                Submit = Rights != null && Rights.Contains('s'),
            };
        }
    }
}
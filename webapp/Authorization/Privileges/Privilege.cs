using Instool.DAL.Models.Auth;

namespace Instool.Authorization.Privileges
{
    public sealed class Privilege
    {
        public PrivilegeEnum PrivilegeEnum { get; private set; }

        public List<OperationEnum> Operations { get; private set; }

        public bool IsAuthorized(OperationEnum op)
        {
            return this.Operations.Contains(op);
        }

        public Privilege(PrivilegeEnum privilegeEnum, IEnumerable<OperationEnum> operations)
        {
            Operations = operations.ToList();
            PrivilegeEnum = privilegeEnum;
        }

        public static Privilege? FromDB(DAL.Models.Auth.RolePrivilege dbPrivilege, bool isReadonly = false)
        {
            if (!Enum.TryParse(typeof(PrivilegeEnum), dbPrivilege.Name, false, out object? result))
            {
                return null;
            }
            var privilege = new Privilege((PrivilegeEnum)result!, new List<OperationEnum>());
            
            if (!isReadonly && dbPrivilege.Create) { privilege.Operations.Add(OperationEnum.Create); }
            if (dbPrivilege.Read) { privilege.Operations.Add(OperationEnum.Read); }
            if (!isReadonly && dbPrivilege.Update) { privilege.Operations.Add(OperationEnum.Update); }
            if (!isReadonly && dbPrivilege.Delete) { privilege.Operations.Add(OperationEnum.Delete); }
            if (!isReadonly && dbPrivilege.Submit) { privilege.Operations.Add(OperationEnum.Submit); }

            return privilege;
        }

        public string? GetName()
        {
            return Enum.GetName(typeof(PrivilegeEnum), this.PrivilegeEnum);
        }

        public static Privilege Nothing(PrivilegeEnum permission)
        {
            return new Privilege(permission, new List<OperationEnum>());
        }

        internal static Privilege MergeOperations(Privilege p1, Privilege p2)
        {
            if (p1.PrivilegeEnum != p2.PrivilegeEnum)
            {
                throw new ArgumentException("Can only merge allowed operations for the same permission");
            }
            return new Privilege(p1.PrivilegeEnum, p1.Operations.Union(p2.Operations).ToList());
        }

        public static PrivilegeEnum? ByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }
            if (!Enum.TryParse(typeof(PrivilegeEnum), name, false, out object? result))
            {
                throw new ArgumentOutOfRangeException("name", $"{name} is not a valid privilege");
            }
            return (PrivilegeEnum?)result;
        }

        public override string ToString()
        {
            return $"{GetName()} ({Operations.AsString()})";
        }

    }
}
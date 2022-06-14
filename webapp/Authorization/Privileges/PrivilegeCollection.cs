using Instool.DAL.Models.Auth;

namespace Instool.Authorization.Privileges
{
    public class PrivilegeCollection : IPrivilegeCollection
    {
        public IEnumerable<Privilege> Privileges { get; }

        public PrivilegeCollection(IEnumerable<DAL.Models.Auth.RolePrivilege> dbPrivileges, bool isReadonly = false)
        {
#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.
            Privileges = dbPrivileges
                             .OrderBy(p => p.Name)
                             .Select(p => Privilege.FromDB(p, isReadonly))
                             .Where(p => p != null);
#pragma warning restore CS8619 // Nullability of reference types in value doesn't match target type.
        }

        public PrivilegeCollection(IEnumerable<Privilege> privileges)
        {
            this.Privileges = privileges.OrderBy(p => p.GetName());
        }

        public PrivilegeCollection()
        {
            this.Privileges = new List<Privilege>();
        }

        public Privilege Get(PrivilegeEnum permission)
        {
            var privilege = this.Privileges.SingleOrDefault(p => p.PrivilegeEnum == permission);
            return privilege ?? Privilege.Nothing(permission);
        }
        public bool HasPrivilege(PrivilegeEnum p, OperationEnum op = OperationEnum.Read)
        {
            return Get(p).IsAuthorized(op);
        }

        public IPrivilegeCollection Merge(IPrivilegeCollection other)
        {
            var newPrivileges = new List<Privilege>(this.Privileges);
            foreach (var o in other.Privileges)
            {
                if (!newPrivileges.Any(p => p.PrivilegeEnum == o.PrivilegeEnum))
                {
                    newPrivileges.Add(o);
                }
                else
                {
                    var privilegeToMerge = newPrivileges.Single(p => p.PrivilegeEnum == o.PrivilegeEnum);
                    newPrivileges.Remove(privilegeToMerge);
                    newPrivileges.Add(Privilege.MergeOperations(privilegeToMerge, o));
                }
            }
            return new PrivilegeCollection(newPrivileges);
        }

        internal static PrivilegeCollection All()
        {
            List<Privilege> all = new List<Privilege>();
            foreach (PrivilegeEnum p in Enum.GetValues(typeof(PrivilegeEnum))) {
                all.Add(new Privilege(p, Operation.GetOperations("crudspxl")));
            }
            return new PrivilegeCollection(all);
        }
    } 
}

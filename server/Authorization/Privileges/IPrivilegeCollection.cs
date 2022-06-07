namespace Instool.Authorization.Privileges
{
    public interface IPrivilegeCollection
    {
        IEnumerable<Privilege> Privileges { get; }

        Privilege Get(PrivilegeEnum permission);

        bool HasPrivilege(PrivilegeEnum p, OperationEnum op = OperationEnum.Read);

        IPrivilegeCollection Merge(IPrivilegeCollection other);
    }
}

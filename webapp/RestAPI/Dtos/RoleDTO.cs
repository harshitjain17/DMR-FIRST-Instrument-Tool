using Instool.Authorization.Privileges;
using Instool.DAL.Models.Auth;

namespace Instool.Dtos
{

    public class RoleDTO
    {
        public bool Used { get; private set; }

        public int ID { get; set; }
        public string? Name { get; set; }

        public List<PrivilegeDTO> Privileges { get; set; } = new List<PrivilegeDTO>();

        public Role GetEntity()
        {
            return new Role
            {
                RoleId = this.ID,
                Name = this.Name ?? throw new ArgumentNullException("Name"),
                Privileges = this.Privileges.Select(p => p.GetEntity()).ToArray()
            };
        }

        /// <summary>
        ///     Get DTO for a role
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="withPrivileges">If true include also the privileges that come with a role. 
        /// If false only include the role</param>
        /// <param name="used">Mark that role as used or unused, if there are (no) users that have been assigned that role</param>
        /// <returns></returns>
        public static RoleDTO FromEntity(Role entity, bool withPrivileges = false, bool used = false)
        {
            List<PrivilegeDTO> privilegeDtos = new List<PrivilegeDTO>();
            if (withPrivileges)
            {
                foreach (var privilegeDef in PrivilegeDisplay.GetPrivilegesToDisplay())
                {
                    var privilege = entity.Privileges.SingleOrDefault(p => p.Name == privilegeDef.Name);
                    privilegeDtos.Add(PrivilegeDTO.FromEntity(
                        privilege ?? new RolePrivilege { Name = privilegeDef.Name },
                        privilegeDef
                    ));
                }
            }

            return new RoleDTO()
            {
                ID = entity.RoleId,
                Name = entity.Name,
                Privileges = privilegeDtos,
                Used = used
            };
        }

        /// <summary>
        ///     Create a Role DTO and only include specific privileges.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="privilegesToInclude"></param>
        /// <returns></returns>
        public static RoleDTO FromEntity(Role entity, IEnumerable<PrivilegeEnum> privilegesToInclude)
        {
            List<PrivilegeDTO> privilegeDtos = new List<PrivilegeDTO>();
            var privilegeDefsToInclude = PrivilegeDisplay.GetPrivilegesToDisplay()
                                                         .Where(p => privilegesToInclude.Contains(p.Privilege));

            foreach (var privilegeDef in privilegeDefsToInclude)
            {
                var privilege = entity.Privileges.SingleOrDefault(p => p.Name == privilegeDef.Name);
                privilegeDtos.Add(
                    privilege != null ? PrivilegeDTO.FromEntity(privilege, privilegeDef) : PrivilegeDTO.None(privilegeDef)
                );
            }

            return new RoleDTO()
            {
                ID = entity.RoleId,
                Name = entity.Name,
                Privileges = privilegeDtos,
            };
        }

        public string GetLabelForErrorMessages() { return "Role"; }

        internal static List<PrivilegeDTO> AdminPrivileges()
        {
            return PrivilegeDisplay
                        .GetPrivilegesToDisplay()
                        .Select(p => PrivilegeDTO.All(p)).ToList();
        }

        public static RoleDTO FromPrivileges(IPrivilegeCollection privileges, int id, string name)
        {
            List<PrivilegeDTO> privilegeDtos = new List<PrivilegeDTO>();

            foreach (var privilege in privileges.Privileges.Where(p => p.Operations.Any()))
            {
                privilegeDtos.Add(PrivilegeDTO.FromAuth(privilege));
            }

            return new RoleDTO()
            {
                ID = id,
                Name = name,
                Privileges = privilegeDtos,
            };
        }

    }
}

using System.ComponentModel.DataAnnotations;

namespace Instool.DAL.Models.Auth
{
    public class RolePrivilege
    {
        [Key]
        public int PrivilegeId { get; set; }
        public string Name { get; set; } = null!;

        public int RoleID { get; set; }
        public Role? Role { get; set; }

        public bool Read { get; set; } = false;
        public bool Create { get; set; } = false;
        public bool Update { get; set; } = false;
        public bool Delete { get; set; } = false;
        public bool Submit { get; set; } = false;

        public override string ToString()
        {
            var rights =
                (Create ? "c" : ".") +
                (Read ? "r" : ".") +
                (Update ? "u" : ".") +
                (Delete ? "d" : ".") +
                (Submit ? "s" : ".") ;

            return $"{Name}: {rights}";
        }
    }
}

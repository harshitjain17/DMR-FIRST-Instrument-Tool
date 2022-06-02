using Instool.DAL.Models;
using Instool.Enums;

namespace Instool.Dtos
{
    public class InvestigatorDTO
    {
        public int InvestigatorId { get; set; }
        public string? Eppn { get; set; }
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Role { get; private set; }

        internal static InvestigatorDTO FromEntity(Investigator i, string role)
        {
            return new InvestigatorDTO
            {
                InvestigatorId = i.InvestigatorId,
                Email = i.Email,
                Eppn = i.Eppn,
                FirstName = i.FirstName,
                MiddleName = i.MiddleName,
                LastName = i.LastName,
                Phone = i.Phone,
                Role = InvestigatorRole.GetEnum(role)?.Label
            };
        }
    }
}

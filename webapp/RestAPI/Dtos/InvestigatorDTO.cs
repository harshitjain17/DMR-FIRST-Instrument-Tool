using Instool.DAL.Models;
using Instool.Enums;

namespace Instool.Dtos
{
    public class InvestigatorDTO
    {
        public int? InvestigatorId { get; set; }
        public string? Eppn { get; set; }
        public string? FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string? LastName { get; set; } = null!;
        public string? Email { get; set; } = null!;
        public string? Phone { get; set; } = null!;
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

        internal Investigator GetEntity()
        {
            return new Investigator
            {
                InvestigatorId = InvestigatorId ?? 0,
                Email = Email ?? throw new ArgumentNullException("Email"),
                Eppn = Eppn ?? throw new ArgumentNullException("Eppn"),
                FirstName = FirstName ?? throw new ArgumentNullException("FirstName"),
                MiddleName = MiddleName,
                LastName = LastName ?? throw new ArgumentNullException("LastName"),
                Phone = Phone
            };
        }

        /// <summary>
        /// Check if data is complete and this can be created as an entity.
        /// It could only be an ID, in which case it is fetched from the DB,
        /// and the request fails if does not exist.
        /// </summary>
        /// <returns></returns>
        internal bool AreDataComplete()
        {
            return Email != null && Eppn != null && FirstName != null && LastName != null;
        }
    }
}

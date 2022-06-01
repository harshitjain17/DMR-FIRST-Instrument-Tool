using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class Investigator
    {
        public Investigator()
        {
            InstrumentContacts = new HashSet<InstrumentContact>();
            InvestigatorOnAwards = new HashSet<InvestigatorOnAward>();
        }

        public int InvestigatorId { get; set; }
        public string? Eppn { get; set; }
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public virtual ICollection<InstrumentContact> InstrumentContacts { get; set; }
        public virtual ICollection<InvestigatorOnAward> InvestigatorOnAwards { get; set; }
    }
}

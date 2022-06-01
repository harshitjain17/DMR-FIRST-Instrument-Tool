using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class Award
    {
        public Award()
        {
            InvestigatorOnAwards = new HashSet<InvestigatorOnAward>();
            Instruments = new HashSet<Instrument>();
        }

        public int AwardId { get; set; }
        public string Title { get; set; } = null!;
        public string AwardNumber { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public virtual ICollection<InvestigatorOnAward> InvestigatorOnAwards { get; set; }

        public virtual ICollection<Instrument> Instruments { get; set; }
    }
}

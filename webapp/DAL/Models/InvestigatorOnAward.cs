using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class InvestigatorOnAward
    {
        public int InvestigatorId { get; set; }
        public int AwardId { get; set; }
        public string Role { get; set; } = null!;

        public virtual Award Award { get; set; } = null!;
        public virtual Investigator Investigator { get; set; } = null!;
    }
}

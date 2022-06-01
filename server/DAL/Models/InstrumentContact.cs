using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class InstrumentContact
    {
        public int InvestigatorId { get; set; }
        public int InstrumentId { get; set; }
        public string Role { get; set; } = null!;

        public virtual Instrument Instrument { get; set; } = null!;
        public virtual Investigator Investigator { get; set; } = null!;
    }
}

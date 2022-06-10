using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instool.DAL.Models
{
    public partial class InstrumentContact
    {
        public int InvestigatorId { get; set; }

        [NotMapped]
        public string? Eppn { get; set; }
        public int InstrumentId { get; set; }
        public string Role { get; set; } = null!;

        public virtual Instrument Instrument { get; set; } = null!;
        public virtual Investigator? Investigator { get; set; } = null!;
    }
}

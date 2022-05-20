using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class InstrumentCapability
    {
        public int InstrumentCapabilityId { get; set; }
        public int InstrumentId { get; set; }
        public string Name { get; set; } = null!;

        public virtual Instrument Instrument { get; set; } = null!;
    }
}

using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class Institution
    {
        public int InstitutionId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Instrument> Instruments { get; set; }

        public Institution()
        {
            Instruments = new HashSet<Instrument>();  
        }
    }
}

using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class Publication
    {
        public Publication()
        {
            Instruments = new HashSet<Instrument>();
        }

        public int PublicationId { get; set; }
        public string Doi { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Authors { get; set; } = null!;
        public string Journal { get; set; } = null!;
        public int Year { get; set; }

        public virtual ICollection<Instrument> Instruments { get; set; }
    }
}

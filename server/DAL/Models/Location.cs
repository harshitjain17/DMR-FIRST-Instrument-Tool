using System;
using System.Collections.Generic;

namespace Instool.DAL.Models
{
    public partial class Location
    {
        public Location()
        {
            Instruments = new HashSet<Instrument>();
        }

        public int LocationId { get; set; }
        public string? Building { get; set; }
        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? State { get; set; }
        public string Zip { get; set; } = null!;
        public string Country { get; set; } = null!;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public virtual ICollection<Instrument> Instruments { get; set; }
    }
}

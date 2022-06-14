using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.Dtos
{
    public class LocationDTO
    {
        public int LocationId { get; set; }
        public string? Building { get; set; }
        public string Street { get; set; } = null!;
        public string City { get; set; } = null!;
        public string? State { get; set; }
        public string Zip { get; set; } = null!;
        public string Country { get; set; } = null!;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        internal static LocationDTO? FromEntity(Location l)
        {
            if (l == null) { return null; }
            return new LocationDTO
            {
                LocationId = l.LocationId,
                Building = l.Building,
                Street = l.Street,
                City = l.City,
                State = l.State,
                Zip = l.Zip,
                Country = l.Country,
                Latitude = l.Latitude,
                Longitude = l.Longitude
            };
        }
    }
}

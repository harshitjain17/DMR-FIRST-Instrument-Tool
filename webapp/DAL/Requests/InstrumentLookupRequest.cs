using NLog.LayoutRenderers;

namespace Instool.DAL.Requests
{
    public class InstrumentLookupRequest
    {
        public string? InstrumentType { get; set; }

        public string? AwardNumber { get; set; }

        public string? Manufacturer { get; set; }

        public string? Model { get; set; }

        public string? SerialNumber { get; set; }
        public string? Name { get; set; }

        public string? Institution { get; set; }
        public string? Facility { get; set; }
    }
}

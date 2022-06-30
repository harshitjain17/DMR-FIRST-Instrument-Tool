namespace Instool.DAL.Requests
{
    public class InstrumentSearchRequest
    {
        public SearchByLocationRequest? Location { get; set; }

        public int? InstrumentTypeId { get; set; }

        public string? InstrumentType { get; set; }

        public ICollection<string> Keywords { get; set; } = new List<string>();

        public int? AwardId { get; set; }

        public string? AwardNumber { get; set; }

        public string? Manufacturer { get; set; }

        public bool? IncludeRetired { get; set; }

    }
}

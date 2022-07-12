using Instool.DAL.Models;
using Instool.Dto;
using Instool.Helpers;

namespace Instool.DAL.Results
{

    public class InstrumentSearchResult
    {
        public IEnumerable<InstrumentRow> Data { get; set; }

        public int Draw { get; }

        public int RecordsTotal { get; }

        public int RecordsFiltered { get; }
        
        public InstrumentSearchResult(PaginatedList<InstrumentWithDistance> data, int draw)
        {
            Data = data.Select((row, i) => new InstrumentRow(row.Instrument, (i+1).ToString(), row.Distance));
            RecordsTotal = data.RecordsTotal;
            RecordsFiltered = data.RecordsFiltered;
            Draw = draw;
        }
    }

    public class InstrumentRow
    {
        public int InstrumentId { get; set; }

        public string? Label { get; set; }

        public string? Doi { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string Institution { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public int? Distance { get; set; }
        public string State { get; set; } = string.Empty;

        public string Award { get; set; } = string.Empty;

        public string? Manufacturer { get; set; }

        public InstrumentRow(Instrument i, string? label, int? distance)
        {
            var types = i.InstrumentTypes;
            var mostSpecific = types.Where(t => !types.Any(sub => sub.CategoryId == t.InstrumentTypeId)).ToList();

            InstrumentId = i.InstrumentId;
            Doi = i.Doi;
            Name = i.Name;
            Label = label;
            Status = i.StatusEnum.Label;
            Institution = i.Institution?.Name ?? String.Empty;
            City = i.Location?.City ?? String.Empty;
            State = i.Location?.State ?? String.Empty;
            Manufacturer = i.Manufacturer;
            Distance = distance;
            Latitude = i.Location?.Latitude;
            Longitude = i.Location?.Longitude;
            Award = string.Join(", ", i.Awards.Select(a => a.AwardNumber));
            Type = string.Join(", ", mostSpecific.Select(t => t.Label));
        }

    }
}

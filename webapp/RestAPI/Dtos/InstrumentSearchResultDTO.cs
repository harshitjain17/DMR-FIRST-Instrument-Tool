using Instool.DAL.Models;
using Instool.Dto;
using Instool.Helpers;

namespace Instool.Dtos;

public class InstrumentSearchResult
{
    public IEnumerable<InstrumentRow> Instruments { get; set; }
    public IEnumerable<LocationRow> Locations { get; set; }

    public int Draw { get; }

    public int RecordsTotal { get; }

    public int RecordsFiltered { get; }

    public InstrumentSearchResult(PaginatedList<InstrumentWithDistance> data, int draw)
    {
        Locations = data.GroupBy(l => l.Instrument.LocationId)
                        .Select((x, index) => new LocationRow(x.First().Instrument, index + 1, x.Count())
                        );
        Instruments = data.Select((row, i) =>
            new InstrumentRow(
                row.Instrument,
                i + 1,
                Locations.SingleOrDefault(l => l.DbId == row.Instrument.LocationId),
                row.Distance)
        );
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
    public string TypeLabel { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string Institution { get; set; } = string.Empty;
    public string Facility { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    public string? Location { get; set; }
    public int? Distance { get; set; }
    public string State { get; set; } = string.Empty;

    public string Award { get; set; } = string.Empty;

    public string? Manufacturer { get; set; }

    public string? Model { get; set; }

    public InstrumentRow(Instrument i, int label, LocationRow? location, int? distance)
    {
        var types = i.InstrumentTypes;
        var mostSpecific = types.Where(t => !types.Any(sub => sub.CategoryId == t.InstrumentTypeId)).ToList();

        InstrumentId = i.InstrumentId;
        Doi = i.Doi;
        Name = i.Name;
        Label = label.ToString();
        Status = i.StatusEnum.Label;
        Institution = i.Institution?.Name ?? string.Empty;
        Facility = i.Institution?.Facility ?? string.Empty;
        Location = location != null ? $"{location.Id} - {location.Building ?? location.Institution}" : null;
        City = i.Location?.City ?? string.Empty;
        State = i.Location?.State ?? string.Empty;
        Manufacturer = i.Manufacturer;
        Model = i.ModelNumber;
        Distance = distance;
        Award = string.Join(", ", i.Awards.Select(a => a.AwardNumber));
        Type = string.Join(", ", mostSpecific.Select(t => string.IsNullOrWhiteSpace(t.Abbreviation) ? t.Label : t.Abbreviation));
        TypeLabel = string.Join(", ", mostSpecific.Select(t => t.Label));
    }
}

public class LocationRow
{
    public int Id { get; set; }

    public double Longitude { get; set; }

    public double Latitude { get; set; }
    public int DbId { get; }
    public string? Building { get; }
    public string? Institution { get; }
    public int Count { get; }

    public LocationRow(Instrument i, int index, int count)
    {
        Id = index;
        Longitude = i.Location.Longitude ?? 32.0;
        Latitude = i.Location.Latitude ?? -97.0;
        DbId = i.Location.LocationId;
        Building = i.Location.Building;
        Institution = i.Institution?.Name;
        Count = count;
    }
}

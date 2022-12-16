using Instool.DAL.Models;

namespace Instool.Dtos;

public class InstrumentTypeDto
{
    public int? InstrumentTypeId { get; set; }
    public string Name { get; set; } = null!;

    public string? Abbreviation { get; set; }
    public string? Label { get; set; }
    public string? Uri { get; set; }
    public InstrumentTypeDto? Category { get; set; }

    public ICollection<InstrumentTypeDto>? SubTypes { get; set; } = null;

}

using Instool.DAL.Models;

namespace Instool.Dtos;

public class InstitutionDto
{
    public int? InstitutionId { get; set; }
    public string? Name { get; set; }

    public string? Facility { get; set; }

    public virtual ICollection<InstrumentDto> Instruments { get; set; }

    public InstitutionDto()
    {
        Instruments = new HashSet<InstrumentDto>();
    }

    internal bool IsReference()
    {
        return Name == null;
    }
}

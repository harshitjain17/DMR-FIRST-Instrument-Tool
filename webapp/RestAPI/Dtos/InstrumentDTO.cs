namespace Instool.Dtos;

public class InstrumentDto
{
    public int? InstrumentId { get; set; }
    public string? Doi { get; set; }
    public string? Manufacturer { get; set; }
    public string? ModelNumber { get; set; }
    public DateTime? AcquisitionDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string Status { get; set; } = null!;
    public string? Description { get; set; }

    public string? Capabilities { get; set; }
    public string? RoomNumber { get; set; }
    public string Name { get; set; } = null!;
    public string? SerialNumber { get; set; }

    public LocationDto? Location { get; set; }

    public InstitutionDto? Institution { get; set; }

    public ICollection<AwardDto> Awards { get; set; } = new List<AwardDto>();
    public ICollection<InstrumentTypeDto> InstrumentTypes { get; set; } = new List<InstrumentTypeDto>();

    public ICollection<InvestigatorDto> Contacts { get; set; } = new List<InvestigatorDto>();

    public ICollection<FileDTO> Images { get; set; } = new List<FileDTO>();
    public ICollection<PublicationDTO> Publications { get; set; } = new List<PublicationDTO>();
}

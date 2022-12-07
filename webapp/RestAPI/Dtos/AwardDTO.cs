namespace Instool.Dtos;

public class AwardDto
{
    public int AwardId { get; set; }
    public string? Title { get; set; }
    public string AwardNumber { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ICollection<InvestigatorDto> Investigators { get; set; } =  new HashSet<InvestigatorDto>();
  
}

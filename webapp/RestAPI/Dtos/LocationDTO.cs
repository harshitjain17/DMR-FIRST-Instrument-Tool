namespace Instool.Dtos;
public class LocationDto
{
    public int? LocationId { get; set; }
    public string? Building { get; set; }
    public string? Street { get; set; } = null!;
    public string? City { get; set; } = null!;
    public string? State { get; set; }
    public string? Zip { get; set; } = null!;
    public string? Country { get; set; } = null!;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    internal bool IsReference()
    {
        return City == null || Street == null || State == null;
    }
}

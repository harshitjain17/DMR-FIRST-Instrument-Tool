namespace Instool.Dtos;

public class InstrumentTypeDropdownEntry
{
    public string? Category { get; set; }

    public string? CategoryLabel { get; set; }

    public string? SubCategory { get; set; }
    public string? SubCategoryLabel { get; set; }

    public string Shortname { get; set; } = null!;

    public string Label { get; set; } = null!;

    public string? Abbreviation { get; set; }

    
}

using System.ComponentModel.DataAnnotations;

namespace Instool.Dtos;

public class ApiKeyDto
{
    public int ID { get; set; }

    [Required]
    public string Name { get; set; } = null!;

    public int RoleId { get; set; }

    public RoleDto? Role { get; set; }

    public string? Created { get; set; }


    [Required]
    public string ValidTo { get; set; } = null!;

    public bool AllowInternalApi { get; set; }

    public string? Key { get; set; }

    public string GetLabelForErrorMessages()
    {
        return "ApiKey";
    }
}

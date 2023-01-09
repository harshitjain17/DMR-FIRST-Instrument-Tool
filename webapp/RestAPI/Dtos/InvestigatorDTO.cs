namespace Instool.Dtos;

public class InvestigatorDto
{
    public int? InvestigatorId { get; set; }
    public string? Eppn { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Role { get; set; }

    /// <summary>
    /// Check if data is complete and this can be created as an entity.
    /// It could only be an ID, in which case it is fetched from the DB,
    /// and the request fails if does not exist.
    /// </summary>
    /// <returns></returns>
    internal bool AreDataComplete()
    {
        return Email != null && Eppn != null && FirstName != null && LastName != null;
    }
}

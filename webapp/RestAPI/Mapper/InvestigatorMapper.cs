using Instool.DAL.Models;
using Instool.Dtos;
using Instool.Enums;

namespace Instool.Mapper;

internal static class InvestigatorMapper
{
    public static InvestigatorDto ConvertToDto(this Investigator entity, string role) => new()
    {
        InvestigatorId = entity.InvestigatorId,
        Email = entity.Email,
        Eppn = entity.Eppn,
        FirstName = entity.FirstName,
        MiddleName = entity.MiddleName,
        LastName = entity.LastName,
        Phone = entity.Phone,
        Role = InvestigatorRole.GetEnum(role)?.Label
    };

    public static IEnumerable<InvestigatorDto> ConvertToDtos(this IEnumerable<Investigator> entities, string role)
    {
        return entities.Select(i => i.ConvertToDto(role));
    }

    public static Investigator ConvertToEntity(this InvestigatorDto dto) => new()
    {
        InvestigatorId = dto.InvestigatorId ?? 0,
        Email = dto.Email ?? throw new ArgumentNullException("Email"),
        Eppn = dto.Eppn ?? throw new ArgumentNullException("Eppn"),
        FirstName = dto.FirstName ?? throw new ArgumentNullException("FirstName"),
        MiddleName = dto.MiddleName,
        LastName = dto.LastName ?? throw new ArgumentNullException("LastName"),
        Phone = dto.Phone
    };
}

using Instool.DAL.Models;
using Instool.Dtos;

namespace Instool.Mapper;
internal static class InstrumentTypeMapper
{
    public static InstrumentTypeDto ConvertToDto(this InstrumentType entity, bool includeCategory, bool includeSubTypes) => new()
    {
        InstrumentTypeId = entity.InstrumentTypeId,
        Name = entity.ShortName,
        Label = entity.Label,
        Uri = entity.Uri,
        Abbreviation = entity.Abbreviation,
        Category = !includeCategory || entity.Category == null ? null : entity.Category.ConvertToDto(true, false),
        SubTypes = !includeSubTypes || !entity.InverseCategory.Any() ?
                        null :
                        entity.InverseCategory.Select(t => t.ConvertToDto(false, true)).ToList()
    };

    public static InstrumentType ConvertToEntity(this InstrumentTypeDto dto) => new()
    {
        InstrumentTypeId = dto.InstrumentTypeId ?? 0,
        Abbreviation = dto.Abbreviation,
        ShortName = dto.Name,
        Label = dto.Label ?? dto.Name,
        Uri = dto.Uri,
        CategoryId = dto.Category?.InstrumentTypeId,
    };

    public static InstrumentTypeDto ConvertToDtoWithCategory(this InstrumentType type) =>
        type.ConvertToDto(includeCategory: true, includeSubTypes: false);

    public static InstrumentTypeDto ConvertToDtoWithSubTypes(this InstrumentType type) =>
        type.ConvertToDto(includeCategory: false, includeSubTypes: true); 
}

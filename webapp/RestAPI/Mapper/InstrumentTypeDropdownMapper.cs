using Instool.DAL.Models;
using Instool.DAL.Results;
using Instool.Dtos;

namespace Instool.Mapper
{
    internal static class InstrumentTypeDropdownMapper
    {
        public static InstrumentTypeDropdownEntry ConvertToEntity(
            this InstrumentTypeWithUsage type,
            InstrumentType category,
            int index
        ) => new()
        {
            Shortname = $"{type.InstrumentType.ShortName}#{index}",
            Label = $"{type.InstrumentType.Label} [{type.Count}]",
            Abbreviation = type.InstrumentType.Abbreviation,
            Category = category.ShortName,
            CategoryLabel = category.Label
        };

        public static InstrumentTypeDropdownEntry ConvertToEntity(
            this InstrumentTypeWithUsage type,
            InstrumentType category,
            InstrumentType subcategory,
            Index index
        ) => new()
        {
            Shortname = $"{type.InstrumentType.ShortName}#{index}",
            Label = $"{type.InstrumentType.Label} [{type.Count}]",
            Abbreviation = type.InstrumentType.Abbreviation,
            Category = category.ShortName,
            CategoryLabel = category.Label,
            SubCategory = subcategory.ShortName,
            SubCategoryLabel = subcategory.Label
        };
    }
}

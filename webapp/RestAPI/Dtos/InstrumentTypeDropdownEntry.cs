using Instool.DAL.Models;
using Instool.DAL.Results;

namespace Instool.Dtos
{
    public class InstrumentTypeDropdownEntry
    {
        public string? Category { get; private set; }

        public string? CategoryLabel { get; private set; }

        public string? SubCategory { get; private set; }
        public string? SubCategoryLabel { get; private set; }

        public string Value { get; private set; } = null!;

        public string Label { get; private set; } = null!;

        internal static InstrumentTypeDropdownEntry FromEntity(InstrumentTypeWithUsage type, InstrumentType category, int index)
        {
            return new InstrumentTypeDropdownEntry
            {
                Value = $"{type.InstrumentType.ShortName}#{index}",
                Label = $"{type.InstrumentType.Label} [{type.Count}]",
                Category = category.ShortName,
                CategoryLabel = category.Label
            };
        }

        internal static InstrumentTypeDropdownEntry FromEntity(
            InstrumentTypeWithUsage type,
            InstrumentType category,
            InstrumentType subcategory,
            Index index)
        {
            return new InstrumentTypeDropdownEntry
            {
                Value = $"{type.InstrumentType.ShortName}#{index}",
                Label = $"{type.InstrumentType.Label} [{type.Count}]",
                Category = category.ShortName,
                CategoryLabel = category.Label,
                SubCategory = subcategory.ShortName,
                SubCategoryLabel = subcategory.Label
            };
        }
    }
}

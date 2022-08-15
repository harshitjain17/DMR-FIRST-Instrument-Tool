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

        public string Shortname { get; private set; } = null!;

        public string Label { get; private set; } = null!;

        public string? Abbreviation { get; private set; }

        internal static InstrumentTypeDropdownEntry FromEntity(InstrumentTypeWithUsage type, InstrumentType category, int index)
        {
            return new InstrumentTypeDropdownEntry
            {
                Shortname = $"{type.InstrumentType.ShortName}#{index}",
                Label = $"{type.InstrumentType.Label} [{type.Count}]",
                Abbreviation = type.InstrumentType.Abbreviation,
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
}

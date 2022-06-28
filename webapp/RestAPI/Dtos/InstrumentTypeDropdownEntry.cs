using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class InstrumentTypeDropdownEntry
    {
        public string? Category { get; private set; }

        public string? SubCategory { get; private set; }

        public string Value { get; private set; } = null!;

        public string Label { get; private set; } = null!;

        internal static InstrumentTypeDropdownEntry FromEntity(InstrumentType i, InstrumentType c)
        {
            return new InstrumentTypeDropdownEntry
            {
                Value = i.ShortName,
                Label = i.Label,
                Category = c.ShortName
            };
        }

        internal static InstrumentTypeDropdownEntry FromEntity(InstrumentType i, InstrumentType c, InstrumentType s)
        {
            return new InstrumentTypeDropdownEntry
            {
                Value = i.ShortName,
                Label = i.Label,
                Category = c.ShortName,
                SubCategory = s.ShortName
            };
        }
    }
}

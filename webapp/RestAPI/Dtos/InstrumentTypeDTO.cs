using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class InstrumentTypeDTO
    {
        public int? InstrumentTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Label { get; set; }
        public string? Uri { get; set; }
        public InstrumentTypeDTO? Category { get; set; }

        public ICollection<InstrumentTypeDTO>? SubTypes { get; private set; } = null;

        internal static InstrumentTypeDTO WithCategory(InstrumentType type)
        {
            return FromEntity(type, true, false);
        }

        internal static InstrumentTypeDTO WithSubTypes(InstrumentType type)
        {
            return FromEntity(type, false, true);
        }

        private static InstrumentTypeDTO FromEntity(InstrumentType type, bool includeCategory, bool includeSubTypes)
        {
            return new InstrumentTypeDTO
            {
                InstrumentTypeId = type.InstrumentTypeId,
                Name = type.ShortName,
                Label = type.Label,
                Uri = type.Uri,
                Category = !includeCategory || type.Category == null ? null : FromEntity(type.Category, true, false),
                SubTypes = !includeSubTypes || !type.InverseCategory.Any() ? null : type.InverseCategory.Select(t =>         
                    FromEntity(t, false, true)).ToList()
            };
        }

        internal InstrumentType GetEntity()
        {
            return new InstrumentType
            {
                InstrumentTypeId = InstrumentTypeId ?? 0,
                ShortName = Name,
                Label = Label ?? Name,
                Uri = Uri,
                CategoryId = Category?.InstrumentTypeId,
            };
        }
    }
}

using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class InstrumentTypeDTO
    {
        public int InstrumentTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Label { get; set; }
        public string? Uri { get; set; }
        public InstrumentTypeDTO? Category { get; set; }

        public ICollection<InstrumentTypeDTO>? SubTypes { get; private set; } = null;

        internal static InstrumentTypeDTO FromEntity(InstrumentType a)
        {
            return new InstrumentTypeDTO
            {
                InstrumentTypeId = a.InstrumentTypeId,
                Name = a.ShortName,
                Label = a.Label,
                Uri = a.Uri,
                Category = a.Category == null ? null : FromEntity(a.Category),
                SubTypes = a.InverseCategory.Any() ? a.InverseCategory.Select(t => FromEntity(t)).ToList() : null
            };
        }

        internal InstrumentType GetEntity()
        {
            return new InstrumentType
            {
                InstrumentTypeId = InstrumentTypeId,
                ShortName = Name,
                Label = Label ?? Name,
                Uri = Uri,
                CategoryId = Category?.InstrumentTypeId,
            };
        }
    }
}

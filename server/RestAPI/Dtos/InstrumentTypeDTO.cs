using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class InstrumentTypeDTO
    {
        public int InstrumentTypeId { get; set; }
        public string Name { get; set; } = null!;
        public string? Uri { get; set; }
        public InstrumentTypeDTO? Category { get; set; }

        internal static InstrumentTypeDTO FromEntity(InstrumentType a) {
            return new InstrumentTypeDTO
            {
                InstrumentTypeId = a.InstrumentTypeId,
                Name = a.Name,
                Uri = a.Uri,
                Category = a.Category == null ? null : FromEntity(a.Category)
            };
        }
    }
}

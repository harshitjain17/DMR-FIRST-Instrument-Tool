namespace Instool.DAL.Models
{
    public partial class InstrumentType
    {
        public InstrumentType()
        {
            InverseCategory = new HashSet<InstrumentType>();
            Instruments = new HashSet<Instrument>();
        }

        public int InstrumentTypeId { get; set; }

        public string ShortName { get; set; } = null!;
        public string Label { get; set; } = null!;
        public string? Uri { get; set; }
        public int? CategoryId { get; set; }

        public virtual InstrumentType? Category { get; set; }
        public virtual ICollection<InstrumentType> InverseCategory { get; set; }

        public virtual ICollection<Instrument> Instruments { get; set; }
    }
}

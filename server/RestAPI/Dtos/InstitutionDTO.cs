using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class InstitutionDTO
    {
        public int InstitutionId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<InstrumentDTO> Instruments { get; set; }

        public InstitutionDTO()
        {
            Instruments = new HashSet<InstrumentDTO>();
        }

        internal static InstitutionDTO? FromEntity(Institution inst)
        {
            if (inst == null) { return null; }
            return new InstitutionDTO
            {
               InstitutionId = inst.InstitutionId,
               Name = inst.Name
            };
        }

        internal static InstitutionDTO? FromEntityWithInstruments(Institution inst)
        {
            if (inst == null) { return null; }
            return new InstitutionDTO
            {
                InstitutionId = inst.InstitutionId,
                Name = inst.Name,
                Instruments = inst.Instruments.Select(i => InstrumentDTO.FromEntity(i)).ToList(),
            };
        }
    }
}

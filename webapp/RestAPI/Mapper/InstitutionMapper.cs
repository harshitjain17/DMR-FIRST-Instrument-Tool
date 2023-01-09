using Instool.DAL.Models;
using Instool.Dtos;
namespace Instool.Mapper;

internal static class InstitutionMapper
{
    public static InstitutionDto? ConvertToDto(this Institution inst)
    {
        if (inst == null) { return null; }
        return new InstitutionDto
        {
            InstitutionId = inst.InstitutionId,
            Facility = inst.Facility,
            Name = inst.Name
        };
    }

    public static InstitutionDto? ConvertToDtoWithInstruments(this Institution inst)
    {
        if (inst == null) { return null; }
        return new InstitutionDto
        {
            InstitutionId = inst.InstitutionId,
            Name = inst.Name,
            Facility = inst.Facility,
            Instruments = inst.Instruments.Select(i => i.ConvertToDto()).ToList(),
        };
    }

}

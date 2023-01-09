using Instool.DAL.Models;
using Instool.Dtos;

namespace Instool.Mapper;

internal static class InstrumentMapper
{
    public static InstrumentDto ConvertToDto(this Instrument i) => new()
    {
        AcquisitionDate = i.AcquisitionDate,
        Awards = i.Awards.ConvertToDtos().ToList(),
        CompletionDate = i.CompletionDate,
        Description = i.Description,
        Capabilities = i.Capabilities,
        Doi = i.Doi,
        InstrumentId = i.InstrumentId,
        InstrumentTypes = i.InstrumentTypes.Select(t => t.ConvertToDtoWithCategory()).ToList(),
        Contacts = i.InstrumentContacts.Select(c => c.Investigator!.ConvertToDto(c.Role)).ToList(),
        Manufacturer = i.Manufacturer,
        ModelNumber = i.ModelNumber,
        Name = i.Name,
        RoomNumber = i.RoomNumber,
        Status = i.Status,
        SerialNumber = i.SerialNumber,
        Location = i.Location.ConvertToDto(),
        Institution = i.Institution.ConvertToDto(),
        Images = i.Images.Select(i => new FileDTO
        {
            Url = $"/api/v1/instruments/{i.InstrumentId}/files/{i.FileId}",
            Name = i.Filename
        }).ToList()
    };

    public static Instrument ConvertToEntity(this InstrumentDto dto) => new()
    {
        AcquisitionDate = dto.AcquisitionDate,
        CompletionDate = dto.CompletionDate,
        Description = dto.Description ?? "...",
        Capabilities = dto.Capabilities,
        Doi = dto.Doi,
        InstrumentId = dto.InstrumentId ?? 0,
        //InstrumentTypes = i.InstrumentTypes.Select(t => InstrumentTypeDto.FromEntity(t)).ToList(),
        Manufacturer = dto.Manufacturer,
        ModelNumber = dto.ModelNumber,
        Name = dto.Name,
        RoomNumber = dto.RoomNumber,
        Status = dto.Status,
        SerialNumber = dto.SerialNumber,
        //Location = LocationDto.FromEntity(i.Location),
        //Institution = InstitutionDto.FromEntity(i.Institution)
    };
}

using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;

namespace Instool.Dtos
{

    public class InstrumentDTO
    {
        public int? InstrumentId { get; set; }
        public string? Doi { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? AcquisitionDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string Status { get; set; } = null!;
        public string Description { get; set; } = null!;

        public string? Capabilities { get; set; }
        public string? RoomNumber { get; set; }
        public string Name { get; set; } = null!;
        public string? SerialNumber { get; set; }

        public LocationDTO? Location { get; set; }

        public InstitutionDTO? Institution { get; set; }

        public ICollection<AwardDTO> Awards { get; set; } = new List<AwardDTO>();
        public ICollection<InstrumentTypeDTO> InstrumentTypes { get; set; } = new List<InstrumentTypeDTO>();

        public ICollection<InvestigatorDTO> Contacts { get; set; } = new List<InvestigatorDTO>();

        public ICollection<string> Images { get; set; } = new List<string>();

        internal static InstrumentDTO FromEntity(Instrument i)
        {
            return new InstrumentDTO
            {
                AcquisitionDate = i.AcquisitionDate,
                Awards = i.Awards.Select(a => AwardDTO.FromEntity(a)).ToList(),
                CompletionDate = i.CompletionDate,
                Description = i.Description,
                Capabilities = i.Capabilities,
                Doi = i.Doi,
                InstrumentId = i.InstrumentId,
                InstrumentTypes = i.InstrumentTypes.Select(t => InstrumentTypeDTO.WithCategory(t)).ToList(),
                Contacts = i.InstrumentContacts.Select(c => InvestigatorDTO.FromEntity(c.Investigator!, c.Role)).ToList(),
                Manufacturer = i.Manufacturer,
                ModelNumber = i.ModelNumber,
                Name = i.Name,
                RoomNumber = i.RoomNumber,
                Status = i.Status,
                SerialNumber = i.SerialNumber,
                Location = LocationDTO.FromEntity(i.Location),
                Institution = InstitutionDTO.FromEntity(i.Institution),
                Images = i.Images.Select(i => $"/api/v1/instruments/{i.InstrumentId}/files/{i.FileId}").ToList()
            };
        }

        internal Instrument GetEntity()
        {
            return new Instrument
            {
                AcquisitionDate = AcquisitionDate,
                CompletionDate = CompletionDate,
                Description = Description,
                Capabilities = Capabilities,    
                Doi = Doi,
                InstrumentId = InstrumentId ?? 0,
                //InstrumentTypes = i.InstrumentTypes.Select(t => InstrumentTypeDTO.FromEntity(t)).ToList(),
                Manufacturer = Manufacturer,
                ModelNumber = ModelNumber,
                Name = Name,
                RoomNumber = RoomNumber,
                Status = Status,
                SerialNumber = SerialNumber,
                //Location = LocationDTO.FromEntity(i.Location),
                //Institution = InstitutionDTO.FromEntity(i.Institution)
            };
        }
    }
}

using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;

namespace Instool.Dtos
{

    public class InstrumentDTO
    {
        public int InstrumentId { get; set; }
        public string? Doi { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? AcquisitionDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string Status { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int LocationId { get; set; }
        public string? RoomNumber { get; set; }
        public int InstitutionId { get; set; }
        public int? ReplacedById { get; set; }
        public string? Name { get; set; }
        public string? SerialNumber { get; set; }

        public ICollection<AwardDTO> Awards { get; set; } = new List<AwardDTO>();
        public ICollection<InstrumentTypeDTO> InstrumentTypes { get; set; } = new List<InstrumentTypeDTO>();

        internal static InstrumentDTO FromEntity(Instrument i)
        {
            return new InstrumentDTO
            {
                AcquisitionDate = i.AcquisitionDate,
                Awards = i.Awards.Select(a => AwardDTO.FromEntity(a)).ToList(),
                CompletionDate = i.CompletionDate,
                Description = i.Description,
                Doi = i.Doi,
                InstrumentTypes = i.InstrumentTypes.Select(t => InstrumentTypeDTO.FromEntity(t)).ToList(),
                Manufacturer = i.Manufacturer,
                ModelNumber = i.ModelNumber,
                Name = i.Name,
                RoomNumber = i.RoomNumber,
                Status = i.Status,
                SerialNumber = i.SerialNumber
            };
        }
    }
}

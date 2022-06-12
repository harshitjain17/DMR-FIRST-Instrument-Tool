using Instool.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instool.DAL.Models
{
    public partial class Instrument
    {
        public Instrument()
        {
            InstrumentContacts = new HashSet<InstrumentContact>();
            Replaces = new HashSet<Instrument>();
            Awards = new HashSet<Award>();
            InstrumentTypes = new HashSet<InstrumentType>();
            Publications = new HashSet<Publication>();
        }

        public int InstrumentId { get; set; }
        public string? Doi { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public DateTime? AcquisitionDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        
        [Required]
        public string Status { get; set; } = null!;

        [NotMapped]
        public Status StatusEnum
        {
            get
            {
                return Enums.Status.GetEnum(this.Status)!;
            }

            set
            {
                this.Status = value.ID;
            }
        }
        public string Description { get; set; } = null!;
        public int LocationId { get; set; }
        public string? RoomNumber { get; set; }
        public int InstitutionId { get; set; }
        public int? ReplacedById { get; set; }

        [Required]
        public string Name { get; set; } = null!;

       
        public string? SerialNumber { get; set; }

        public virtual Location Location { get; set; } = null!;
        public virtual Institution Institution { get; set; } = null!;
        public virtual Instrument? ReplacedBy { get; set; }
        public virtual ICollection<InstrumentContact> InstrumentContacts { get; set; }
        public virtual ICollection<Instrument> Replaces { get; set; }

        public virtual ICollection<Award> Awards { get; set; }
        public virtual ICollection<InstrumentType> InstrumentTypes { get; set; }
        public virtual ICollection<Publication> Publications { get; set; }
    }
}

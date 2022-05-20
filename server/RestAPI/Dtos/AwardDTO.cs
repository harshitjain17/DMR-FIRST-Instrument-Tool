using Instool.DAL.Models;

namespace Instool.Dtos
{
    public class AwardDTO
    {
        public int AwardId { get; set; }
        public string Title { get; set; } = null!;
        public string AwardNumber { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        internal static AwardDTO FromEntity(Award a) {
            return new AwardDTO
            {
                AwardId = a.AwardId,
                AwardNumber = a.AwardNumber,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                Title = a.Title
            };
        }
    }
}

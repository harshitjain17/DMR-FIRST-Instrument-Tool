namespace Instool.Dtos
{
    public class PublicationDTO
    {
        public int PublicationId { get; set; }
        public string Doi { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Authors { get; set; } = null!;
        public string Journal { get; set; } = null!;
        public int Year { get; set; }

    }
}

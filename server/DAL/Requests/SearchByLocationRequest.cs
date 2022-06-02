namespace Instool.DAL.Requests
{
    public class SearchByLocationRequest
    {
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int MaxDistance { get; set; }
    }
}
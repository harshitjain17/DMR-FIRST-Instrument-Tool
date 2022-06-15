namespace Instool.DAL.Models.Auth
{
    public class ApiKey
    {
        public int ApiKeyId { get; set; }

        public string Name { get; set; }

        public string Hash { get; set; }

        public int RoleId { get; set; }

        public Role Role { get; set; }

        public DateTime? Created { get; set; }

        public DateTime ValidTo { get; set; }

        public bool AllowInternalApi { get; set; }

        public ApiKey()
        {
            Name = null!;
            Hash = null!;
            Role = null!;
        }



    }
}

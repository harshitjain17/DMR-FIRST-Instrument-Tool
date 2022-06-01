namespace LiST.Tools.Helpers
{
    public class ServerStartupConfig
    {
        public string Pathbase { get; set; }
        public bool EnableShibboleth { get; set; } = false;

        public bool AllowAnonymous { get; set; } = false;

        public bool UseHttps { get; set; } = true;
        public string Host { get; set; } = "localhost";
        public string Port { get; set; }

        public string GetUrl()
        {
            return $"{(UseHttps ? "https" : "http")}://{Host}:{Port}";
        }
    }

}

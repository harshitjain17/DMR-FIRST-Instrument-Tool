using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Instool.Helpers
{
    public sealed class JsonHelper
    {
        private JsonHelper() { }

        private static DefaultContractResolver CamelCase = new CamelCasePropertyNamesContractResolver();
        private static readonly DefaultContractResolver CamelCaseExceptDictionary = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy
            {
                ProcessDictionaryKeys = false,
                OverrideSpecifiedNames = true
            }
        };


        public static string Serialize(object o, bool ignoreNull = false)
        {
            return JsonConvert.SerializeObject(o, GetDefaultSettings(ignoreNull));
        }

        public static JsonSerializerSettings GetDefaultSettings(bool ignoreNull)
        {
            var settings = new JsonSerializerSettings();
            if (ignoreNull)
            {
                settings.NullValueHandling = NullValueHandling.Ignore;
            }
            settings.ContractResolver = CamelCase;
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            return settings;
        }

        public static JsonSerializerSettings GetDictionarySetting()
        {
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = CamelCaseExceptDictionary;
            return settings;
        }

    }
}
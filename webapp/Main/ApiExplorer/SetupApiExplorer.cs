using Microsoft.Extensions.DependencyInjection;
using NSwag;
using NSwag.Generation.Processors.Security;

namespace Instool.ApiExplorer
{
    public static class SetupApiExplorer
    {
        public static IServiceCollection ConfigureApiExplorer(this IServiceCollection services)
        {
            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "VVV";
                options.SubstituteApiVersionInUrl = true;
            });
            // Register the Swagger services
            services.AddOpenApiDocument(doc =>
            {
                doc.DocumentName = "v1";
                doc.ApiGroupNames = new[] { "1" };

                // Document the authentication we're using
                doc.AddSecurity("apikey", new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "X-API-KEY",
                    In = OpenApiSecurityApiKeyLocation.Header
                });

                doc.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("apikey"));

                doc.PostProcess = d =>
                {
                    d.Info.Title = "DMR Instrumentation Tool";
                    d.Info.Version = "v1";
                    d.Info.Description = "";
                    d.Info.Contact = new NSwag.OpenApiContact
                    {
                        Name = "Konrad Hilse",
                        Email = "khilse@psu.edu"
                    };
                };
            });
            return services;
        }
    }
}

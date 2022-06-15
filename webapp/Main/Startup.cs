using Instool.API;
using Instool.Authorization.Setup;
using Instool.DAL;
using Instool.Helpers;
using Instool.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Reflection;

namespace Instool
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            Configuration = configuration;
            ApplicationLogging.LoggerFactory = loggerFactory;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // API Controller live in a dedicated project, but we have to add this here so available controllers get evaluated.
            var assembly = typeof(InstrumentApiController).GetTypeInfo().Assembly;
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(2, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
                options.ReportApiVersions = true;
            });
            services.AddControllersWithViews(
                options =>
                {
                    options.EnableEndpointRouting = true;
                    //                    options.Filters.Add(new HttpResponseExceptionFilter());
                }
            ).AddApplicationPart(assembly)
             .AddNewtonsoftJson(options =>
             {
                 options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                 options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                 options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
             });

            services.ConfigureDataBase(Configuration);
            services.RegisterDALRepositories();
            services.RegisterServices();

            services.ConfigureAuthentication(Configuration);
            services.ConfigureAuthorization();


            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "FrontEnd/build";
            });

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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseHttpsRedirection();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    const int thirtyDaysInSeconds = 60 * 60 * 24 * 30;
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                        "public,max-age=" + thirtyDaysInSeconds;
                }
            });
            app.UseSpaStaticFiles();

            app.UseOpenApi(options =>
            {
                options.PostProcess = (document, httpReq) =>
                {

                    document.Host = httpReq.Headers.Host;
                };
            });
            app.UseSwaggerUi3();
            app.UseRouting();
            app.ConfigureAuthMiddleware(Configuration);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../FrontEnd";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

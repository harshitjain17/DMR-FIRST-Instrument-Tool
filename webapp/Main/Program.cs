using Instool.API;
using Instool.ApiExplorer;
using Instool.Authorization.Setup;
using Instool.DAL;
using Instool.Helpers;
using Instool.RestAPI.Exceptions;
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
using NLog.Web;
using System;
using System.IO;
using System.Reflection;

namespace Instool
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var logger = CreateLogger();
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                var env = builder.Environment.EnvironmentName;

                SetupConfiguration(builder, env);

                SetupLogging(builder);

                SetupServices(builder);

                var app = builder.Build();
                if (!builder.Environment.IsDevelopment())
                {
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

                app.UseOpenApi();
                app.UseSwaggerUi3(config => config.TransformToExternalPath = (internalUiRoute, request) =>
                {
                    if (internalUiRoute.StartsWith("/") == true && internalUiRoute.StartsWith(request.PathBase) == false)
                    {
                        return request.PathBase + internalUiRoute;
                    }
                    else
                    {
                        return internalUiRoute;
                    }
                });
                app.UseRouting();
                if (builder.Environment.IsDevelopment() || builder.Environment.IsStaging())
                {
                    app.UseCors();
                }

                app.ConfigureAuthMiddleware(builder.Configuration);

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller}/{action=Index}/{id?}");
                });

                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "../FrontEnd";

                    if (builder.Environment.IsDevelopment())
                    {
                        spa.UseReactDevelopmentServer(npmScript: "start");
                    }
                });

                app.Run();

            }
            catch (Exception ex)
            {
                //NLog: catch setup errors
                logger.LogError(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                // Ensure to flush and stop internal timers/threads before ap-plication-exit (Avoid segmentation fault on Linux)
                NLog.LogManager.Shutdown();
            }
        }

        private static void SetupLogging(WebApplicationBuilder builder)
        {
            builder.Logging.ClearProviders();
            //builder.Logging.SetMinimumLevel(LogLevel.Trace);
            builder.Logging.AddNLogWeb();
            builder.Host.UseNLog();
        }

        private static void SetupConfiguration(WebApplicationBuilder builder, string env)
        {
            var envAppsettings = GetConfigPath($"appsettings.{env}.json");
            Console.WriteLine($"Starting with environment {env}, loading config {envAppsettings}");
            builder.Configuration.SetBasePath(Directory.GetCurrentDirectory());
            builder.Configuration.AddJsonFile(GetConfigPath($"appsettings.json"), optional: false, reloadOnChange: true);
            builder.Configuration.AddJsonFile(envAppsettings, optional: true, reloadOnChange: true);
            builder.Configuration.AddJsonFile($"{Directory.GetCurrentDirectory()}/build.json", optional: true);
            builder.Configuration.AddJsonFile($"{Directory.GetCurrentDirectory()}/branch.json", optional: true);
            builder.Configuration.AddEnvironmentVariables();
        }

        private static void SetupServices(WebApplicationBuilder builder)
        {
            // API Controller live in a dedicated project, but we have to add this here so available controllers get evaluated.
            var assembly = typeof(InstrumentApiController).GetTypeInfo().Assembly;
            builder.Services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(2, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
                options.ReportApiVersions = true;
            });

            builder.Services.AddControllersWithViews(
                options =>
                {
                    options.EnableEndpointRouting = true;
                    options.Filters.Add<HttpResponseExceptionFilter>();
                }
            ).AddApplicationPart(assembly)
             .AddNewtonsoftJson(options =>
             {
                 options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                 options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                 options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
             });

            builder.Services.ConfigureDataBase(builder.Configuration);
            builder.Services.RegisterDALRepositories();
            builder.Services.RegisterServices();

            builder.Services.ConfigureAuthentication(builder.Configuration);
            builder.Services.ConfigureAuthorization();

            // Temporary, while the server get's accessed by React running locally
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:3000",
                        "https://localhost:3000"
                    ).AllowAnyHeader();
                });
            });

            builder.Services.ConfigureApiExplorer();

            // In production, the React files will be served from this directory
            builder.Services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "FrontEnd/build";
            });


        }

        private static ILogger<Program> CreateLogger()
        {
            NLogBuilder.ConfigureNLog(GetConfigPath("nlog.config"));
            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.ClearProviders();
                builder.AddConsole();
            });
            ApplicationLogging.LoggerFactory = loggerFactory;
            // NLog: setup the logger first to catch all errors
            return loggerFactory.CreateLogger<Program>();
        }

        private static string GetConfigPath(string filename)
        {
            // Default etc folder, works for starting via dotnet start
            var defaultBaseDir = string.Join(Path.DirectorySeparatorChar, Directory.GetCurrentDirectory(), "..", "..");

            return string.Join(Path.DirectorySeparatorChar,
                Environment.GetEnvironmentVariable("INSTOOL_BASE") ?? defaultBaseDir, "etc", filename);
        }

    }
}

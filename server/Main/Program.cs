using Instool.Helpers;
using LiST.Tools.Helpers;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;
using System;
using System.IO;

namespace Instool
{
    public class Program
    {
        private static string GetConfigPath(string filename)
        {
            // Default etc folder, works for starting via dotnet start
            var defaultBaseDir = string.Join(Path.DirectorySeparatorChar, Directory.GetCurrentDirectory(), "..", "..");

            return string.Join(Path.DirectorySeparatorChar,
                Environment.GetEnvironmentVariable("INSTOOL_BASE") ?? defaultBaseDir, "etc", filename);
        }

        public static void Main(string[] args)
        {
            NLogBuilder.ConfigureNLog(GetConfigPath("nlog.config"));
            var loggerFactory = LoggerFactory
            .Create(builder =>
            {
                builder.ClearProviders();
                builder.AddConsole();
            });
            // NLog: setup the logger first to catch all errors
            var logger = loggerFactory.CreateLogger<Program>();
            try
            {
                CreateHostBuilder(loggerFactory, args).Build().Run();
            }
            catch (Exception ex)
            {
                //NLog: catch setup errors
                logger.LogError(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
                NLog.LogManager.Shutdown();
            }
        }

        public static IHostBuilder CreateHostBuilder(ILoggerFactory loggerFactory, string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var env = webBuilder.GetSetting("environment");
                    var configuration = GetConfiguration(env);
                    var url = configuration.GetSection("Main").Get<ServerStartupConfig>().GetUrl();

                    webBuilder.UseUrls(url);
                    webBuilder.ConfigureLogging(ConfigureLogger);
                    webBuilder.UseNLog();
                    webBuilder.UseStartup(context => new Startup(configuration, loggerFactory));

                });
        }


        static IConfiguration GetConfiguration(string env)
        {
            Console.WriteLine("Loading config " + GetConfigPath($"appsettings.{env}.json"));

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile(GetConfigPath($"appsettings.json"), optional: false, reloadOnChange: true)
                .AddJsonFile(GetConfigPath($"appsettings.{env}.json"), optional: true, reloadOnChange: true)
                .AddJsonFile($"{Directory.GetCurrentDirectory()}/build.json", optional: true)
                .AddJsonFile($"{Directory.GetCurrentDirectory()}/branch.json", optional: true)
                .AddEnvironmentVariables();
            return builder.Build();
        }

        static void ConfigureLogger(WebHostBuilderContext ctx, ILoggingBuilder logging)
        {
            logging.ClearProviders();
            logging.SetMinimumLevel(LogLevel.Trace);
            logging.AddNLogWeb();
        }
    }
}

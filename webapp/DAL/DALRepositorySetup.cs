using Instool.DAL.Models;
using Instool.DAL.Repositories;
using Instool.DAL.Helpers;
using Instool.DAL.Helpers.Impl;
using Instool.Helpers;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Instool.DAL.Repositories.Impl;

namespace Instool.DAL
{
    public static class DALRepositorySetup
    {

        public static IServiceCollection ConfigureDataBase(this IServiceCollection services, IConfiguration config)
        {
            var logger = ApplicationLogging.CreateLogger<IConfiguration>();
            var section = config.GetSection("Database");

            var enableSensitiveDataLogging = section.GetValue("EnableSensitiveDataLogging", false);
            if (section.GetConnectionString("Database") != null)
            {

                var dbConfig = section.GetConnectionString("Database").Split(";");
                Console.WriteLine("Using sqlserver " +
                    dbConfig.FirstOrDefault(conf => conf.StartsWith("Server")) + ", " +
                    dbConfig.FirstOrDefault(conf => conf.StartsWith("Database")));
                logger.LogInformation("Using sqlserver " +
                    dbConfig.FirstOrDefault(conf => conf.StartsWith("Server")) + ", " +
                    dbConfig.FirstOrDefault(conf => conf.StartsWith("Database")));

                services.AddDbContext<InstoolContext>(options => options.UseSqlServer(section.GetConnectionString("Database"))
                    .EnableSensitiveDataLogging(enableSensitiveDataLogging)
                    .ConfigureWarnings(w => w.Throw(RelationalEventId.MultipleCollectionIncludeWarning))
                    .ConfigureWarnings(w => w.Ignore(CoreEventId.RowLimitingOperationWithoutOrderByWarning))
                );
            }
            else
            {
                throw new Exception("No database configured");
            }

            return services;
        }

        public static IServiceCollection RegisterDALRepositories(this IServiceCollection services)
        {
            services.AddDataProtection().PersistKeysToDbContext<InstoolContext>();
            services.AddScoped<ITransactionSupport, TransactionSupport>();

            services.AddScoped<IApiKeyRepository, ApiKeyRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IInstrumentRepository, InstrumentRepository>();
            services.AddScoped<IInstrumentTypeRepository, InstrumentTypeRepository>();
            services.AddScoped<IInvestigatorRepository, InvestigatorRepository>();
            services.AddScoped<ILocationRepository, LocationRepository>();
            services.AddScoped<IInstitutionRepository, InstitutionRepository>();
            services.AddScoped<IAwardRepository, AwardRepository>();
            services.AddScoped<IFileRepository, FileRepository>();
            return services;
        }
    }
}

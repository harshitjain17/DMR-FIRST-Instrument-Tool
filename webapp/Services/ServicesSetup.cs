using Instool.Services.Impl;
using Microsoft.Extensions.DependencyInjection;

namespace Instool.Services
{
    public static class ServicesSetup
    {

        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IInstrumentService, InstrumentService>();
            return services;
        }
    }
}

using Microsoft.Extensions.Logging;
using NLog;

namespace Instool.Helpers
{
    /// <summary>
    /// Provide access to Global LoggerFactory, where DI is not usable
    /// </summary>
    public static class ApplicationLogging
    {

        public static ILoggerFactory? LoggerFactory { get; set; }

        public static ILogger<T> CreateLogger<T>() => LoggerFactory == null ? throw new NLogConfigurationException("Logging not set up"): LoggerFactory.CreateLogger<T>();

    }
}
using Instool.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Instool.RestAPI.Exceptions
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
            _logger = ApplicationLogging.CreateLogger<ExceptionMiddleware>();
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (HttpResponseException e)
            {
                    context.Response.StatusCode = e.Status;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Caught unexpected exception");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            }
        }
    }
}
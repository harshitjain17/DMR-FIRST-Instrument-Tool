using Instool.Authentication;
using Instool.Authorization.Handler.Helper;
using Instool.DAL.Models.Auth;
using Instool.DAL.Repositories;
using Instool.Helpers;
using Instool.Authorization.Privileges;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Instool.Authorization.MiddleWare
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ApiKeyMiddleware> _logger;

        private const string APIKEYNAME = "X-API-KEY";
        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
            _logger = ApplicationLogging.CreateLogger<ApiKeyMiddleware>();
        }
        public async Task InvokeAsync(HttpContext context)
        {
            if (
                context.User.Claims.GetUserId() != null ||
                !context.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
            {
                // Do not require API Key. If no key is present, later middleware will require 
                // normal user auth (or fail).
                await _next(context);
                return;
            }

            var apiKey = await Lookup(context, extractedApiKey);
            if (apiKey == null || apiKey.ValidTo < DateTime.Now)
            {
                _logger.LogApiKeyInvalid();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync(apiKey == null ? "ApiKey is not valid" : "ApiKey is expired");
                return;
            }
            if (!apiKey.AllowInternalApi && context.Request.Path.Value?.Contains("/api/v1") == true)
            {
                _logger.LogApiKeyInvalid();
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsync("Not Found");
                return;
            }
            await SetPrivileges(context, apiKey);
            await _next(context);
        }


        private static Task<ApiKey?> Lookup(HttpContext context, string? extractedApiKey)
        {
            if (string.IsNullOrWhiteSpace(extractedApiKey)) {
                return Task.FromResult<ApiKey?>(null);
            }
            var service = context.RequestServices.GetRequiredService<IApiKeyRepository>();
            return service.Lookup(extractedApiKey);

        }

        private static async Task SetPrivileges(HttpContext context, ApiKey key)
        {
            var newClaims = new List<Claim> {
                        new Claim(ClaimsExtensions.DatabaseIdClaimType, "-"),
                        new Claim(ClaimsExtensions.AllRolesClaimType, key.RoleId.ToString()),
                        new Claim(ClaimTypes.Surname, key.Name),
                        new Claim(ClaimsExtensions.ApiKeyId, key.ApiKeyId.ToString())
                    };
            newClaims.SetAuthType(ClaimsExtensions.AuthTypeApiKey);

            var repo = context.RequestServices.GetRequiredService<IRoleRepository>();
            var role = await repo.Get(key.RoleId);
            if (role != null)
            {
                var privileges = new PrivilegeCollection(role.Privileges);
                newClaims.Add(new Claim(ClaimsExtensions.PackedGeneralPrivilegesClaimType, privileges.PackPrivilegesToString()));
            }
            context.User.AddIdentity(new ClaimsIdentity(newClaims));
        }

       
    }
}
using Instool.Authentication;
using Instool.Authorization.PolicyCode;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;

namespace Instool.Authorization.Handler.Helper
{
    internal static class AuthDeniedLoggerExtensions
    {
        public static void LogAuthDenied<T>(this ILogger<T> logger, ClaimsPrincipal user, PrivilegeRequirement requirement, string objectType, string id)
        {
            logger.LogWarning($"Authorization denied: {GetUserName(user)} does not have privilege ({requirement.PrivilegeName}, {requirement.OperationName}) in the context of {objectType} {id}");
        }

        public static void LogAuthDenied<T>(this ILogger<T> logger, ClaimsPrincipal user, OperationAuthorizationRequirement requirement, string objectType, string id)
        {
            logger.LogWarning($"Authorization denied: {GetUserName(user)} does not have sufficient privileges to {requirement.Name} {objectType} {id}");
        }
        public static void LogAuthDenied<T>(this ILogger<T> logger, ClaimsPrincipal user, string operation, string objectType, string id)
        {
            logger.LogWarning($"Authorization denied: {GetUserName(user)} does not have sufficient privileges to {operation} for {objectType} {id}");
        }

        public static void LogInaccessible<T>(this ILogger<T> logger, ClaimsPrincipal user, string objectType, string id)
        {
            logger.LogWarning($"Authorization denied: {GetUserName(user)} does not have sufficient privileges to access {objectType} {id}");
        }

        public static void LogPrivilegesNotAvailable<T>(this ILogger<T> logger, ClaimsPrincipal user, object resource)
        {
            var t = new System.Diagnostics.StackTrace().ToString();
            var lines = t.Split("\n").Where(l => l.Contains("Instool."));
            logger.LogError($"Authorization bug?: Could not find privileges of {GetUserName(user)} for {resource}. Returning unauthorized.\n" + string.Join("\n", lines));
        }

        public static void LogApiKeyInvalid<T>(this ILogger<T> logger)
        {
            var t = new System.Diagnostics.StackTrace().ToString();
            var lines = t.Split("\n").Where(l => l.Contains("Instool."));
            logger.LogError($"Authorization denied: Invalid X-API-KEY provided.\n" + string.Join("\n", lines));
        }

        private static string GetUserName(ClaimsPrincipal user)
        {
            return user.Claims.IsAnonymous() ? "Anonymous" : $"{user.Claims.GetFirstName()} {user.Claims.GetLastName()} ({user.Claims.GetUserId()})";
        }
    }
}

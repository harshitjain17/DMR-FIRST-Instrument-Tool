using System.Data;
using System.Security.Claims;

namespace Instool.Authentication
{
    public static class ClaimsExtensions
    {
        public const string DatabaseIdClaimType = "LiST/claims/DatabaseId";
        public const string AllRolesClaimType = "LiST/claims/AllRoles";
        public const string AuthType = "LiST/claims/AuthType";
        public const string ApiKeyId = "LiST/claims/ApiKeyId";

        public const string PackedGeneralPrivilegesClaimType = "LiST/claims/Permissions";
        public const string LastPermissionsUpdatedClaimType = "LiST/claims/PermissionUpdated";

        internal const string AuthTypeApiKey = "API-KEY";
        internal const string AuthTypeShibboleth = "SHIBBOLETH";
        internal const string AuthTypeAzure = "AZURE";
        internal const string AuthTypeNone = "ANONYMOUS";


        public static string? GetName(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == ClaimTypes.Name)?.Value;
        }

        public static string? GetFirstName(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value;
        }

        public static string? GetLastName(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == ClaimTypes.Surname)?.Value;
        }

        public static string? GetEppn(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == ClaimTypes.Upn)?.Value;
        }

        public static string? GetEmail(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }

        public static string? GetUserId(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == DatabaseIdClaimType)?.Value;
        }

        public static int? GetApiKeyId(this IEnumerable<Claim> claims)
        {
            var id =  claims?.SingleOrDefault(x => x.Type == ApiKeyId)?.Value;
            if (int.TryParse(id, out int apiKeyId))
            {
                return apiKeyId;
            }
            return null;
        }

        public static int? GetSelectedRole(this IEnumerable<Claim> claims)
        {
            var id = claims?.SingleOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
            if (int.TryParse(id, out int roleId))
            {
                return roleId;
            }
            return null;
        }

        /// <summary>
        /// Those are the roles assigned to the currently logged in user. 
        /// It is not changed when SignInAs is used!
        /// </summary>
        /// <param name="claims"></param>
        /// <returns></returns>
        public static IEnumerable<int> GetAllRoles(this IEnumerable<Claim> claims)
        {
            var allRoles = claims?.SingleOrDefault(x => x.Type == AllRolesClaimType)?.Value;
            if (allRoles == null) { return new List<int>(); }
            return allRoles
                        .Split(";")
                        .Select(r => int.TryParse(r, out int i) ? i : -1)
                        .Where(i => i >= 0);
        }

        public static bool IsAnonymous(this IEnumerable<Claim> claims)
        {
            return GetUserId(claims) == null || GetUserId(claims) == "-";
        }

        public static bool IsApiAccess(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == AuthType)?.Value == AuthTypeApiKey;
        }

        public static bool IsAzure(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == AuthType)?.Value == AuthTypeAzure;
        }

        public static bool IsShibboleth(this IEnumerable<Claim> claims)
        {
            return claims?.SingleOrDefault(x => x.Type == AuthType)?.Value == AuthTypeShibboleth;
        }

        public static void SetAuthType(this List<Claim> claims, string authType)
        {
            claims.RemoveAll(c => c.Type == AuthType);
            claims.Add(new Claim(AuthType, authType));
        }
    }
}
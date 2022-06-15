using System;
using Microsoft.AspNetCore.Authorization;

namespace Instool.Authorization.PolicyCode
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
    public class ApiAccessAllowedAttribute : AuthorizeAttribute
    {
        public const string POLICY_PREFIX = "ApiKey:";

        public bool AllowApiAccess {
            get
            {
                if (Policy != null && bool.TryParse(Policy.Substring(POLICY_PREFIX.Length), out var isAllowed))
                {
                    return isAllowed;
                }
                return false;
            }
            set
            {
                Policy = $"{POLICY_PREFIX}{value}";
            }
        }

        public ApiAccessAllowedAttribute(bool allowApiAccess = false) => AllowApiAccess = allowApiAccess;
    }
}
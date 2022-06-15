// Copyright (c) 2019 Jon P Smith, GitHub: JonPSmith, web: http://www.thereformedprogrammer.net/
// Licensed under MIT license. See License.txt in the project root for license information.

using System;
using System.Threading.Tasks;
using Instool.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Instool.Authorization.PolicyCode
{
    //thanks to https://www.jerriepelser.com/blog/creating-dynamic-authorization-policies-aspnet-core/
    //And to GholamReza Rabbal see https://github.com/JonPSmith/PermissionAccessControl/issues/3

    internal class AuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
    {
        private readonly AuthorizationOptions _options;

        public AuthorizationPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
        {
            _options = options.Value;
        }

        public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(ApiAccessAllowedAttribute.POLICY_PREFIX, StringComparison.OrdinalIgnoreCase) &&
                bool.TryParse(policyName.Substring(ApiAccessAllowedAttribute.POLICY_PREFIX.Length), out bool isAllowed))
            {
                return new AuthorizationPolicyBuilder()
                            .AddRequirements(new ApiKeyRequirement(isAllowed))
                            .Build();
            }
            else if (policyName.StartsWith(HasPrivilegeAttribute.POLICY_PREFIX, StringComparison.OrdinalIgnoreCase))
            {
                return new AuthorizationPolicyBuilder()
                               .AddRequirements(new PrivilegeRequirement(policyName.Substring(HasPrivilegeAttribute.POLICY_PREFIX.Length)))
                               .Build();
            }
            return await base.GetPolicyAsync(policyName);
        }
    }
}
// Copyright (c) 2019 Jon P Smith, GitHub: JonPSmith, web: http://www.thereformedprogrammer.net/
// Licensed under MIT license. See License.txt in the project root for license information.

using System;
using Instool.Authorization.Privileges;
using Microsoft.AspNetCore.Authorization;

namespace Instool.Authorization.PolicyCode
{
    public class ApiKeyRequirement : IAuthorizationRequirement
    {
        public ApiKeyRequirement(bool apiAccessAllowed)
        {
            ApiAccessAllowed = apiAccessAllowed;
        }

        public bool ApiAccessAllowed { get; }
    }
}
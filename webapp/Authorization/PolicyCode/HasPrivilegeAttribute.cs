using System;
using Instool.Authorization.Privileges;
using Microsoft.AspNetCore.Authorization;

namespace Instool.Authorization.PolicyCode
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
    public class HasPrivilegeAttribute : AuthorizeAttribute
    {
        public const string POLICY_PREFIX = "Privilege:";

        public HasPrivilegeAttribute(PrivilegeEnum permission) : base($"{POLICY_PREFIX}{permission}")
        { }

        public HasPrivilegeAttribute(PrivilegeEnum permission, OperationEnum operation) : base($"{POLICY_PREFIX}{permission};{operation}")
        { }

    }
}
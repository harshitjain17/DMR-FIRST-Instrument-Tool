// Copyright (c) 2019 Jon P Smith, GitHub: JonPSmith, web: http://www.thereformedprogrammer.net/
// Licensed under MIT license. See License.txt in the project root for license information.

using Instool.Authorization.Privileges;
using Microsoft.AspNetCore.Authorization;

namespace Instool.Authorization.PolicyCode
{
    public class PrivilegeRequirement : IAuthorizationRequirement
    {
        public PrivilegeRequirement(string content)
        {
            if (content == null)
            {
                throw new ArgumentNullException(nameof(content));
            }
            var parts = content.Split(";");
            PrivilegeName = parts[0];
            OperationName = parts.Length > 1 ? parts[1] : "Read";
        }

        public PrivilegeRequirement(PrivilegeEnum permission, OperationEnum operation = OperationEnum.Read)
        {
            PrivilegeName = Enum.GetName(typeof(PrivilegeEnum), permission) ?? throw new ArgumentNullException(nameof(permission)); 
            OperationName = Enum.GetName(typeof(OperationEnum), operation) ?? throw new ArgumentNullException(nameof(operation));   
        }

        public string PrivilegeName { get; }

        public PrivilegeEnum? Privilege { get { return Privileges.Privilege.ByName(PrivilegeName); } }

        public string OperationName { get; }

        public OperationEnum? Operation { get { return Privileges.Operation.ByName(OperationName); } }
    }
}
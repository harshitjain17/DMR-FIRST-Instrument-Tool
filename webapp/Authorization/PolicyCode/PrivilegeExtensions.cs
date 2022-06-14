// Copyright (c) 2019 Jon P Smith, GitHub: JonPSmith, web: http://www.thereformedprogrammer.net/
// Licensed under MIT license. See License.txt in the project root for license information.

using Instool.Authentication;
using Instool.Authorization.Handler.Helper;
using Instool.Authorization.Handler.Impl;
using Instool.Authorization.Privileges;
using Instool.Enums;
using Instool.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Instool.Authorization.PolicyCode
{
    public static class PrivilegeExtensions
    {
        /// <summary>
        /// Check if the user has a global privilege, defined by its user role
        /// </summary>
        /// <param name="user"></param>
        /// <param name="privilege"></param>
        /// <param name="operation"></param>
        /// <returns></returns>
        public static bool HasPrivilege(this ClaimsPrincipal user, PrivilegeEnum privilege, OperationEnum operation = OperationEnum.Read)
        {
            var privileges = GetAllPrivileges(user);
            return privileges?.Get(privilege).IsAuthorized(operation) ?? false;
        }

        /// <summary>
        /// Check if a user has any of the privileges. 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permissions"></param>
        /// <param name="operation"></param>
        /// <returns></returns>
        public static bool HasAnyPrivilege(this ClaimsPrincipal user, IEnumerable<PrivilegeEnum> permissions, OperationEnum operation = OperationEnum.Read)
        {
            var privileges = GetAllPrivileges(user);
            return permissions.Any(p => privileges.HasPrivilege(p, operation));
        }

        /// <summary>
        /// Check if a user has a given privilege in the context of a data object. 
        /// That privilege could be granted by the user role or an collaboration role on the object.
        /// <br></br>
        /// <br></br>
        /// E.g. Data managers can update user projects in general, whereas faculty only get that privilege 
        /// via their ProjectCollaboration association and can therefor only update user projects where they are assigned to.
        /// <br></br>
        /// <br></br>
        /// <b>!! This requires that the privileges of the resource have been loaded beforehand.</b>
        /// <br></br>
        /// Usually IAuthorationHandler.HandleAsync(user, resource, operation) is called beforehand, checking if the resource is accessible at all.
        /// <br></br>
        /// Otherwise, use IAuthorationHandler.HandleAsync(user, resourche, PrivilegeRequirement)
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="resource"></param>
        /// <param name="privilege"></param>
        /// <param name="operation"></param>
        /// <returns></returns>
        public static bool HasPrivilege(this ClaimsPrincipal user, object resource, PrivilegeEnum privilege, OperationEnum operation = OperationEnum.Read)
        {
            var privileges = GetAllPrivileges(user, resource);
            if (privileges != null)
            {
                return privileges.HasPrivilege(privilege, operation);
            }
            else
            {
                ApplicationLogging.CreateLogger<PrivilegeHandler>().LogPrivilegesNotAvailable(user, resource);
                return false;
            }
        }

        /// <summary>
        ///    Returns a collection of all privileges a user has in general.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static IPrivilegeCollection GetAllPrivileges(this ClaimsPrincipal user)
        {
            var permissionClaim =
                user?.Claims.SingleOrDefault(x => x.Type == ClaimsExtensions.PackedGeneralPrivilegesClaimType);
            return permissionClaim?.Value.UnpackPrivilegesFromString() ?? new PrivilegeCollection();
        }


        /// <summary>
        /// Returns a collection of all privileges a user has in general.
        /// <br></br><br></br>
        /// <b>This requires that the privileges of the resource have been loaded beforehand.</b>
        /// <br></br>
        /// Usually IAuthorationHandler.HandleAsync(user, resource, operation) is called beforehand, checking if the resource is accessible at all.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static IPrivilegeCollection GetAllPrivileges(this ClaimsPrincipal user, object resource)
        {
            // TODO: Users will have dedicated privileges for their own instruments
            return GetAllPrivileges(user);
            //var claimType = UserPrivilegeService.GetClaimType(resource);
            //return claimType == null ? null : UnpackPrivileges(user, claimType);
        }
        private static IPrivilegeCollection UnpackPrivileges(this ClaimsPrincipal user, string claimType)
        {
            if (!user.HasClaim(c => c.Type == claimType))
            {
                return new PrivilegeCollection();
            }
            return PrivilegePacker.UnpackPrivilegesFromString(
                    user.Claims.FirstOrDefault(c => c.Type == claimType)?.Value
                );
        }
    }
}
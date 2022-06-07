using Instool.Authorization.Privileges;
using Instool.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Instool.Authorization.PolicyCode
{
    /// <summary>
    ///     Used for [HasPrivilege(PrivilegeEnum.ABC)] annotations.
    /// </summary>
    public class PrivilegeHandler : AuthorizationHandler<PrivilegeRequirement>
    {
        private readonly ILogger<PrivilegeHandler> _logger;

        public PrivilegeHandler()
        {
            _logger = ApplicationLogging.CreateLogger<PrivilegeHandler>();
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PrivilegeRequirement requirement)
        {
            if (requirement.Privilege == null)
            {
                // Weird call, so better not authorize ...
                _logger.LogError($"Call to HasPrivilege without privilege == null, authorization denied.");
                context.Fail();
                return Task.CompletedTask;
            }

            if (context.User.HasPrivilege(requirement.Privilege.Value, requirement.Operation ?? OperationEnum.Read))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
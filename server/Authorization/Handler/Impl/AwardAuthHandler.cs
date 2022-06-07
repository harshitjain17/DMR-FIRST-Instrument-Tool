using Instool.Authorization.Handler.Helper;
using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models;
using Instool.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Instool.Authorization.Handler.Impl
{
    internal class AwardAuthHandler : AuthorizationHandler<OperationAuthorizationRequirement, Award>
    {
        private readonly ILogger<AwardAuthHandler> _logger;

        public AwardAuthHandler()
        {
            _logger = ApplicationLogging.CreateLogger<AwardAuthHandler>(); ;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, Award resource)
        {
            var operation = Operation.GetOperation(requirement);
            if (!context.User.HasPrivilege(PrivilegeEnum.Award, operation))
            {
                _logger.LogAuthDenied(context.User, requirement, "Award", $"{resource.AwardId}");
                context.Fail();
            }
            if (!context.HasFailed)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}

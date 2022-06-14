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
    internal class PublicationAuthHandler : AuthorizationHandler<OperationAuthorizationRequirement, Publication>
    {
        private readonly ILogger<PublicationAuthHandler> _logger;

        public PublicationAuthHandler()
        {
            _logger = ApplicationLogging.CreateLogger<PublicationAuthHandler>(); ;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, Publication resource)
        {
            var operation = Operation.GetOperation(requirement);
            if (!context.User.HasPrivilege(PrivilegeEnum.Publication, operation))
            {
                _logger.LogAuthDenied(context.User, requirement, "Publication", $"{resource.PublicationId}");
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

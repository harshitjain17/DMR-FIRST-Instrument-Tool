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
    internal class InstrumentTypeAuthHandler : AuthorizationHandler<OperationAuthorizationRequirement, InstrumentType>
    {
        private readonly ILogger<InstrumentTypeAuthHandler> _logger;

        public InstrumentTypeAuthHandler()
        {
            _logger = ApplicationLogging.CreateLogger<InstrumentTypeAuthHandler>(); ;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, InstrumentType resource)
        {
            var operation = Operation.GetOperation(requirement);
            if (!context.User.HasPrivilege(PrivilegeEnum.InstrumentType, operation))
            {
                _logger.LogAuthDenied(context.User, requirement, "InstrumentType", $"{resource.InstrumentTypeId}");
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

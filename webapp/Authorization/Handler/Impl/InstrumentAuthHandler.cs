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
    internal class InstrumentAuthHandler : AuthorizationHandler<OperationAuthorizationRequirement, Instrument>
    {
        private readonly ILogger<InstrumentAuthHandler> _logger;

        public InstrumentAuthHandler()
        {
            _logger = ApplicationLogging.CreateLogger<InstrumentAuthHandler>(); ;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, Instrument resource)
        {
            var operation = Operation.GetOperation(requirement);
            if (!context.User.HasPrivilege(PrivilegeEnum.Instrument, operation))
            {
                _logger.LogAuthDenied(context.User, requirement, "Instrument", $"{resource.InstrumentId}");
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

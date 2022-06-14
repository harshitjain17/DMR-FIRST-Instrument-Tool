using Instool.Authentication;
using Instool.DAL.Models.Auth;
using Instool.Authorization.Privileges;
using Instool.DAL.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace Instool.Authorization.MiddleWare
{

    /// <summary>
    ///     If anonymous access is allowed, set claims what anonymous users can see (only published data).
    ///     If not, make sure every access is by an authenticated user.
    ///     
    ///     If a valid ApiKey is present, bypass authorization (some controller/methods will return 403 if ApiKey is used).
    /// </summary>
    class AnonymousAccessMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly bool _allowAnonymous;

        public AnonymousAccessMiddleware(RequestDelegate next, bool allowAnonymous)
        {
            _next = next;
            _allowAnonymous = allowAnonymous;
        }

        public async Task InvokeAsync(HttpContext context)
        {


            if (context.User.Claims.GetUserId() == null)
            {
                if (_allowAnonymous)
                {
                    var newClaims = new List<Claim> {
                        new Claim(ClaimsExtensions.DatabaseIdClaimType, "-"),
                        new Claim(ClaimsExtensions.AllRolesClaimType, Role.RoleCommunity.ToString()),
                        new Claim(ClaimTypes.Surname, "Anonymous")
                    };

                    var repo = context.RequestServices.GetRequiredService<IRoleRepository>();
                    var role = await repo.Get(Role.RoleCommunity);
                    if (role != null)
                    {
                        var privileges = new PrivilegeCollection(role.Privileges);
                        newClaims.Add(new Claim(ClaimsExtensions.PackedGeneralPrivilegesClaimType, privileges.PackPrivilegesToString()));
                        newClaims.SetAuthType(ClaimsExtensions.AuthTypeNone);

                        context.User.AddIdentity(new ClaimsIdentity(newClaims));
                    }
                }
                else if (context.Request.Path != "/Signin")
                {
                    await context.ChallengeAsync();
                }
            }

            await _next(context); //let the rest of the pipeline run
        }

    }
}

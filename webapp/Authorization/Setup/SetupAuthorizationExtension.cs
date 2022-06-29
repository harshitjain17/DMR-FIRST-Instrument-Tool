using Instool.Authorization.Handler.Impl;
using Instool.Authorization.PolicyCode;
using Instool.Authorization.MiddleWare;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Instool.Authorization.Setup
{
    public static class SetupAuthorizationExtension
    {
        public static IServiceCollection ConfigureAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization();

            services.AddSingleton<IAuthorizationHandler, PrivilegeHandler>();

            // Register the handlers
            // => Used by Microsoft.AspNetCore.Authorization.IAuthorizationService,
            //    Controllers use that facade class, which checks if a handler has been registered and delegates
            services.RegisterAuthHandlers();

            // Policies - Groups of requirements
            services.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
            return services;
        }

        private static IServiceCollection RegisterAuthHandlers(this IServiceCollection services)
        {
            services.AddScoped<IAuthorizationHandler, InstrumentAuthHandler>();
            services.AddScoped<IAuthorizationHandler, InstrumentTypeAuthHandler>();
            services.AddScoped<IAuthorizationHandler, AwardAuthHandler>();
            services.AddScoped<IAuthorizationHandler, PublicationAuthHandler>();
            return services;
        }


        public static IServiceCollection ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // We're storing cookies and want them to be encrypted
            services.AddDataProtection();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {

                options.LoginPath = "/Login";
                options.LogoutPath = "/Logout";
            });

            return services;
        }

        /// <summary>
        ///     Add Authentication & Authorization middleware.
        ///     This includes ApiKey authentiation, setting privileges for anonymous access, etc.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static IApplicationBuilder ConfigureAuthMiddleware(this IApplicationBuilder app, IConfiguration configuration)
        {
            app.UseAuthentication();
            // Only ApiKeys are supported for now
            app.UseMiddleware<ApiKeyMiddleware>();
            // Or an anonymous user, if the configuration allows that. An anonymous user allows gets certain default privileges populated into the claims
            app.UseMiddleware<AnonymousAccessMiddleware>(configuration.GetValue<bool>("allowAnonymous", false));

            // The Authorization Middleware then uses the User Claims, Priviliges, Assigned Techniques, etc.
            app.UseAuthorization();
            return app;
        }
    }
}


using Instool.RestAPI.Exceptions;
using Microsoft.AspNetCore.Authorization;

namespace Authorization
{
    public static class AuthHelper
    {
        public static async Task Check(Task<AuthorizationResult> result)
        {
            if (!(await result).Succeeded)
            {
                throw HttpResponseException.Forbidden();
            }
        }
    }
}

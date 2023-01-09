using Instool.Exceptions;
using Microsoft.AspNetCore.Authorization;

namespace Instool
{
    public static class AuthHelper
    {
        /// <summary>
        ///     Throw an 403 Forbidden exception if not authorized
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        public static async Task Check(Task<AuthorizationResult> result)
        {
            if (!(await result).Succeeded)
            {
                throw HttpResponseException.Forbidden();
            }
        }
    }
}

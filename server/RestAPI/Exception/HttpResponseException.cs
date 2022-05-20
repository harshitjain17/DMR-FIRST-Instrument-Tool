using Microsoft.AspNetCore.Http;
using System;

namespace Instool.RestAPI.Exceptions
{
    public class HttpResponseException : Exception
    {
        public HttpResponseException(int status, object value = null)
        {
            Status = status;
            Value = value;
        }

        public int Status { get; set; } = 500;

        public object Value { get; set; }

        public static HttpResponseException Forbidden()
        {
            return new HttpResponseException(StatusCodes.Status403Forbidden);
        }

        public static HttpResponseException NotFound()
        {
            return new HttpResponseException(StatusCodes.Status404NotFound);
        }

        public static HttpResponseException BadRequest()
        {
            return new HttpResponseException(StatusCodes.Status400BadRequest);
        }

    }
}

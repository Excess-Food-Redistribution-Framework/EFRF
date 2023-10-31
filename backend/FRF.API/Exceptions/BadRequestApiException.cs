using System.Net;

namespace FRF.API.Exceptions;

public class BadRequestApiException : ApiException
{
    public BadRequestApiException(string message) : base(message, HttpStatusCode.BadRequest)
    {
    }

    public BadRequestApiException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.BadRequest)
    {
    }
}
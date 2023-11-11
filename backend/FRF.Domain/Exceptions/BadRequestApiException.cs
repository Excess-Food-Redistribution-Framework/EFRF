using System.Net;

namespace FRF.Domain.Exceptions;

public class BadRequestApiException : ApiException
{
    public BadRequestApiException(string message) : base(message, HttpStatusCode.BadRequest)
    {
    }

    public BadRequestApiException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.BadRequest)
    {
    }
}
using System.Net;

namespace FRF.Domain.Exceptions;

public class InternalServerErrorApiException : ApiException
{
    public InternalServerErrorApiException(string message) : base(message, HttpStatusCode.InternalServerError)
    {
    }

    public InternalServerErrorApiException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.InternalServerError)
    {
    }
}
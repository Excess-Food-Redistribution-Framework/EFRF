using System.Net;

namespace FRF.Domain.Exceptions;

public class ApiException : Exception
{
    public int StatusCode => (int)Status;

    public HttpStatusCode Status { get; set; } = HttpStatusCode.InternalServerError;

    public ApiException(string message) : base(message)
    {
    }
    
    public ApiException(string message, Exception innerException) : base(message, innerException)
    {
    }
    
    public ApiException(string message, HttpStatusCode statusCode) : base(message)
    {
        Status = statusCode;
    }

    public ApiException(string message, Exception innerException, HttpStatusCode statusCode) : base(message, innerException)
    {
        Status = statusCode;
    }
}
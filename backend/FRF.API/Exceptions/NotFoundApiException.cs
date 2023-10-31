﻿using System.Net;

namespace FRF.API.Exceptions;

public class NotFoundApiException : ApiException
{
    public NotFoundApiException(string message) : base(message, HttpStatusCode.NotFound)
    {
    }

    public NotFoundApiException(string message, Exception innerException) : base(message, innerException, HttpStatusCode.NotFound)
    {
    }
}
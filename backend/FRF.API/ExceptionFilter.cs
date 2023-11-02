using FRF.API.Dto;
using FRF.API.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FRF.API;

public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var response = new ErrorResponse
        {
            Status = 500,
            Errors = new List<string>() { context.Exception.Message }
        };
        
        if (context.Exception is ApiException apiException)
        {
            response.Status = apiException.StatusCode;
        }

        context.Result = new ObjectResult(response)
        {
            StatusCode = response.Status,
        };
    }
}
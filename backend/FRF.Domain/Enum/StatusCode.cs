using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum StatusCode
    {
        Ok = 200,

        BadRequest = 400, //  – client sent an invalid request, such as lacking required request body or parameter
        Unauthorized = 401, // – client failed to authenticate with the server
        Forbidden = 403, // – client authenticated but does not have permission to access the requested resource
        NotFound = 404, // – the requested resource does not exist
        PreconditionFailed = 412, // – one or more conditions in the request header fields evaluated to false
        
        InternalServerError = 500, // – a generic error occurred on the server
        ServiceUnavailable = 503 // – the requested service is not available
    }
}

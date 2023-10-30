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

        BadRequest = 400,
        NotFound = 404,

        InternalServerError = 500
    }
}

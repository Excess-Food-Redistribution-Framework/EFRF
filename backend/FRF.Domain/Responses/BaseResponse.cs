using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Responses
{
    public class BaseResponse<T>
    {
        public StatusCode StatusCode { get; set; } = StatusCode.Ok;
        public string Message { get; set; } = String.Empty;
        public T? Data { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum FoodRequestState
    {
        [Description("Waiting on donor side")]
        Waiting,
        [Description("Food is on road to the receiver")]
        Deliviring,
        [Description("Succesful received")]
        Received,
        [Description("Somethink went wrong")]
        Unknown
    }
}

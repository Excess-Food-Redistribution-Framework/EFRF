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
        [Description("Requested by Distributor")]
        Requested,
        [Description("Provider prepare products")]
        Preparing,
        [Description("Waiting on Provider side")]
        Waiting,
        [Description("Food is on road to the Distributor")]
        Deliviring,
        [Description("Succesful received")]
        Received,
        [Description("Somethink went wrong")]
        Unknown
    }
}

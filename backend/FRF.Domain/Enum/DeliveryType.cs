using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum DeliveryType
    {
        [Description("Someone can take donate")]
        WaitForTakeDonate,

        [Description("Donor can deliver")]
        DonorCanDeliver,

        [Description("Receiver needs to take it away")]
        ReceiverNeedsToTakeAway,

        [Description("Use 3rd party delivery service")]
        Use3rdPartyDeliveryService
    }
}

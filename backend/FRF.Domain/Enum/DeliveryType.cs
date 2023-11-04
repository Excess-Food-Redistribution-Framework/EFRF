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
        [Description("Provider can deliver")]
        ProviderCanDeliver,

        [Description("Distributor needs to take it away")]
        DistributorNeedsToTakeAway,

        [Description("Use 3rd party delivery service")]
        Use3rdPartyDeliveryService
    }
}

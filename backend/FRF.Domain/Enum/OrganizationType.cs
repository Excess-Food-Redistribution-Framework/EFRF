using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum OrganizationType
    {
        [Description("Provider")]
        Provider,

        [Description("Distributer")]
        Distributer
    }
}

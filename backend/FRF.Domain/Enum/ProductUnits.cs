using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum ProductUnits
    {
        [Description("Grams")]
        Grams,
        [Description("Kilograms")]
        Kikilograms,

        [Description("Milliliters")]
        Milliliters,
        [Description("Liters")]
        Liters,

        [Description("Pieces")]
        Pieces,
    }
}

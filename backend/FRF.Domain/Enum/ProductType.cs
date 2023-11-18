using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Enum
{
    public enum ProductType
    {
        None,

        [Description("Fresh Produce")]
        FreshProduce,

        [Description("Canned Goods")]
        CannedGoods,

        [Description("Dairy Products")]
        DairyProducts,

        [Description("Bakery Items")]
        BakeryItems,

        [Description("Meat and Poultry")]
        MeatAndPoultry,

        [Description("Frozen Foods")]
        FrozenFoods,

        [Description("Non-Perishable")]
        NonPerishable,

        [Description("Other")]
        Other
    }
}

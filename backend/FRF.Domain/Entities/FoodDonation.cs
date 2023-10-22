    using FRF.Domain.Enum;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace FRF.Domain.Entities
    {
        public class FoodDonation
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public StateFoodDonation State { get; set; } = StateFoodDonation.WaitForTakeDonate;
            // Другие поля и свойства, связанные с пожертвованиями
            public List<Product> Products { get; set; } // Список продуктов в этом пожертвовании
        }
    }

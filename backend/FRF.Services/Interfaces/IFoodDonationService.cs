using FRF.Domain.Entities;
using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IFoodDonationService
    {
        Task<IEnumerable<FoodDonation>> GetAllFoodDonations();
        Task<FoodDonation> GetFoodDonationById(Guid id);
        Task<FoodDonation> GetFoodDonationByTitle(string title);
        Task AddFoodDonation(FoodDonation product);
        Task UpdateFoodDonation(FoodDonation product);
        Task DeleteFoodDonation(Guid id);
    }
}

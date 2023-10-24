using FRF.Domain.Entities;
using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IFoodRequestService
    {
        Task<IEnumerable<FoodRequest>> GetAllFoodRequests();
        Task<FoodRequest> GetFoodRequestById(Guid id);
        Task<FoodRequest> GetFoodRequestByTitle(string title);
        Task AddFoodRequest(FoodRequest request);
        Task UpdateFoodRequest(FoodRequest request);
        Task DeleteFoodRequest(Guid id);
    }
}

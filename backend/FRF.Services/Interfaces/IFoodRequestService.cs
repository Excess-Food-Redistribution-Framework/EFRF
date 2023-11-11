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
        Task<IEnumerable<FoodRequest>> GetAllFoodRequestsByOrganization(Guid organizationId);
        Task<IEnumerable<FoodRequest>> GetAllFoodRequestsByUser(string userId);

        Task<FoodRequest> GetFoodRequestById(Guid id);
        Task<FoodRequest> GetFoodRequestByTitle(string title);

        Task<bool> ChangeStateFoodRequest(FoodRequestState state, FoodRequest request, Organization organization);

        Task<bool> CreateFoodRequest(FoodRequest request, Organization provider, Organization distributor);
        Task<bool> UpdateFoodRequest(FoodRequest request, Organization organization);
        Task<bool> DeleteFoodRequests(Guid id, Organization organization);
    }
}

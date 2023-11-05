using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IFoodRequestService
    {
        Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequests();
        Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequestsByOrganization(Guid organizationId);
        Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequestsByUser(string userId);

        Task<BaseResponse<FoodRequest>> GetFoodRequestById(Guid id);
        Task<BaseResponse<FoodRequest>> GetFoodRequestByTitle(string title);

        Task<BaseResponse<bool>> ChangeStateFoodRequest(FoodRequestState state, FoodRequest request, Organization creatorOrganization);

        Task<BaseResponse<bool>> CreateFoodRequest(FoodRequest request, Organization organization);
        Task<BaseResponse<bool>> UpdateFoodRequest(FoodRequest request);
        Task<BaseResponse<bool>> DeleteFoodRequests(Guid id);

        Task<BaseResponse<bool>> AddToInvitedList(FoodRequest request, Organization invitedOrganization);
        Task<BaseResponse<bool>> RemoveFromInvitedList(FoodRequest request, Organization invitedOrganization);

        Task<BaseResponse<bool>> AssignInvited(FoodRequest request, Organization creatorOrganization, Organization invitedOrganization);
        Task<BaseResponse<bool>> UnassignInvited(FoodRequest request, Organization creatorOrganization, Organization invitedOrganization);
    }
}

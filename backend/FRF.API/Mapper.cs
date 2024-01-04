using AutoMapper;
using FRF.API.Dto.Address;
using FRF.API.Dto.Article;
using FRF.API.Dto.FoodRequest;
using FRF.API.Dto.Organization;
using FRF.API.Dto.Product;
using FRF.API.Dto.User;
using FRF.Domain.Entities;

namespace FRF.API;

public class Mapper : Profile
{
    public Mapper()
    {
        // User
        CreateMap<User, UserDto>();
        CreateMap<User, UserWithOrganizationDto>();
        
        CreateMap<CreateUpdateArticleDto, Article>();
        
        CreateMap<CreateTicketDto, Ticket>();

        CreateMap<CreateOrganizationDto, Organization>();
        CreateMap<Organization, OrganizationDto>();

        CreateMap<CreateProductDto, Product>();
        CreateMap<Product, CreateProductDto>();
        CreateMap<Product, ProductDto>();

        CreateMap<FoodRequest, FoodRequestDto>();
        CreateMap<ProductPick, ProductPickDto>();

        CreateMap<AddressDto, Address>();
        CreateMap<Address, AddressDto>();

        CreateMap<LocationDto, Location>();
        CreateMap<Location, LocationDto>();

        CreateMap<CreateCommentDto, Comment>();
        CreateMap<UpdateCommentDto, Comment>();
        CreateMap<Comment, CommentDto>();
    }
}
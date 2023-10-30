using AutoMapper;
using FRF.API.Dto.Article;
using FRF.API.Dto.Organization;
using FRF.API.Dto.User;
using FRF.Domain.Entities;

namespace FRF.API;

public class Mapper : Profile
{
    public Mapper()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUpdateArticleDto, Article>();

        CreateMap<CreateOrganizationDto, Organization>();
        CreateMap<Organization, CreateOrganizationDto>();
        CreateMap<OrganizationDto, Organization>();
        CreateMap<Organization, OrganizationDto>();
    }
}
﻿using AutoMapper;
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
        CreateMap<User, UserDto>();
        CreateMap<User, UserDetailDto>();
        
        CreateMap<CreateUpdateArticleDto, Article>();

        CreateMap<CreateOrganizationDto, Organization>();
        CreateMap<Organization, OrganizationDto>();

        CreateMap<CreateProductDto, Product>();
        CreateMap<Product, CreateProductDto>();
        CreateMap<Product, ProductDto>();
        CreateMap<Product, ProductDtoDetailed>();

        CreateMap<FoodRequest, FoodRequestDto>();
    }
}
using AutoMapper;
using FRF.API.Dto;
using FRF.Domain.Entities;

namespace FRF.API;

public class Mapper : Profile
{
    public Mapper()
    {
        CreateMap<User, UserDto>();
    }
}
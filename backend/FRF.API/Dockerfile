# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["FRF.API/FRF.API.csproj", "FRF.API/"]
COPY ["FRF.DAL/FRF.DAL.csproj", "FRF.DAL/"]
COPY ["FRF.Domain/FRF.Domain.csproj", "FRF.Domain/"]
COPY ["FRF.Services/FRF.Services.csproj", "FRF.Services/"]
RUN dotnet restore "FRF.API/FRF.API.csproj"
COPY . .
WORKDIR "/src/FRF.API"
RUN dotnet build "FRF.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FRF.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FRF.API.dll"]

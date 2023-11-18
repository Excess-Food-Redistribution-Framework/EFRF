namespace FRF.API.Dto.User;

public class LoginResponseDto
{
    public string? Token { get; set; }
    public UserWithOrganizationDto? User { get; set; }
}
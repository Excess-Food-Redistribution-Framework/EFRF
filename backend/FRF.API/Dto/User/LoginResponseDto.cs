namespace FRF.API.Dto.User;

public class LoginResponseDto
{
    public string? Token { get; set; }
    public UserDto? User { get; set; }
}
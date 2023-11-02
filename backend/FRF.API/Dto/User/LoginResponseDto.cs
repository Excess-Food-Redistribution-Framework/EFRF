namespace FRF.API.Dto.User;

public class LoginResponseDto
{
    public string? Token { get; set; }
    public UserDetailDto? User { get; set; }
}
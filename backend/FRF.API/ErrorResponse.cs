namespace FRF.API;

public class ErrorResponse
{
    public int Status { get; set; }
    public bool Success { get; set;  } = false;
    public List<string> Errors { get; set; } = new List<string>();
}
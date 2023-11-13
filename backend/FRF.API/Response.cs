namespace FRF.API;

public class Response<T>
{
    public int Status { get; set; } = 200;
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}
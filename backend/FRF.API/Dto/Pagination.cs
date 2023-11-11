namespace FRF.API.Dto;

public class Pagination<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Count { get; set; }
    public List<T> Data { get; set; } = new List<T>();

}
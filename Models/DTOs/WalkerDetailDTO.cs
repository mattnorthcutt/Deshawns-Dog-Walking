public class WalkerDetailDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<int> CityIds { get; set; } = new();
}

public class UpdateWalkerRequest
{
    public string Name { get; set; }
    public List<int> CityIds { get; set; } = new();
}

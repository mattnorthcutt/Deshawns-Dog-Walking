namespace DeShawnsDogWalking.Models.DTOs;

public class DogDTO
{
  public int Id { get; set; }
  public string Name { get; set; }

  public int CityId { get; set; }
  public string City { get; set; }

  public int? WalkerId { get; set; }
  public string? Walker { get; set; }
}

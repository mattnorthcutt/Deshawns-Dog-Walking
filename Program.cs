using System.ComponentModel.DataAnnotations;
using DeShawnsDogWalking.Models;
using DeShawnsDogWalking.Models.DTOs;
using Microsoft.Extensions.ObjectPool;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

List<City> cities = new List<City>
{
    new City { Id = 1, Name = "Nashville" },
    new City { Id = 2, Name = "Franklin" },
    new City { Id = 3, Name = "Brentwood" }
};

List<Walker> walkers = new List<Walker>
{
    new Walker { Id = 1, Name = "John Price" },
    new Walker { Id = 2, Name = "Agnes Chen" }
};

List<Dog> dogs = new List<Dog>
{
    new Dog { Id = 1, Name = "Bella", CityId = 1, WalkerId = null },
    new Dog { Id = 2, Name = "Max",   CityId = 2, WalkerId = 1 },
    new Dog { Id = 3, Name = "Daisy", CityId = 1, WalkerId = 2 }
};

List<WalkerCity> walkerCities = new List<WalkerCity>
{
    new WalkerCity { WalkerId = 1, CityId = 1 }, 
    new WalkerCity { WalkerId = 1, CityId = 2 }, 
    new WalkerCity { WalkerId = 2, CityId = 1 }, 
    new WalkerCity { WalkerId = 2, CityId = 3 },
};



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/dogs", () =>
{
    return dogs.Select(d => new DogDTO
    {
        Id = d.Id,
        Name = d.Name,
        CityId = d.CityId,
        City = cities.First(c => c.Id == d.CityId).Name,
        WalkerId = d.WalkerId,
        Walker = d.WalkerId is null ? null : walkers.First(w => w.Id == d.WalkerId).Name
    });
});

app.MapGet("/api/dogs/{id}", (int id) =>
{
    Dog dog = dogs.FirstOrDefault(d => d.Id == id);
    if (dog == null) return Results.NotFound();

    City city = cities.FirstOrDefault(c => c.Id == dog.CityId);
    Walker walker = walkers.FirstOrDefault(w => w.Id == dog.WalkerId);

    return Results.Ok(new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        CityId = dog.CityId,
        WalkerId = dog.WalkerId,
        City = city?.Name,
        Walker = walker?.Name
    });
});

app.MapPost("/api/dogs", (Dog newDog) =>
{
    City city = cities.FirstOrDefault(c => c.Id == newDog.CityId);
    if (city == null) return Results.BadRequest("Bad CityId.");

    newDog.Id = dogs.Count > 0 ? dogs.Max(d => d.Id) + 1 : 1;
    dogs.Add(newDog);

    Walker walker = walkers.FirstOrDefault(w => w.Id == newDog.WalkerId);

    return Results.Created($"/api/dogs/{newDog.Id}", new DogDTO
    {
        Id = newDog.Id,
        Name = newDog.Name,
        CityId = newDog.CityId,
        WalkerId = newDog.WalkerId,
        City = city.Name,
        Walker = walker?.Name
    });
});

app.MapGet("/api/cities", () =>
{
    return cities.Select(c => new CityDTO { Id = c.Id, Name = c.Name });
});

app.MapPost("/api/cities", (City city) =>
{
    if (string.IsNullOrWhiteSpace(city?.Name))
    {
        return Results.BadRequest();
    }

    city.Id = cities.Count > 0 ? cities.Max(c => c.Id) + 1 : 1;
    cities.Add(city);

    return Results.Created($"/api/cities/{city.Id}", new CityDTO
    {
        Id = city.Id,
        Name = city.Name,
    });
});

app.MapGet("/api/walkers", (int? cityId) =>
{
    var results = cityId is null ? walkers : walkers.Where(w => walkerCities.Any(wc => wc.CityId == cityId.Value && wc.WalkerId == w.Id));

    return results.Select(w => new WalkerDTO { Id = w.Id, Name = w.Name });
});

app.MapGet("/api/walkers/{id:int}", (int id) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == id);
    if (walker == null) return Results.NotFound();

    var cityIds = walkerCities.Where(wc => wc.WalkerId == id).Select(wc => wc.CityId).ToList();

    return Results.Ok(new WalkerDetailDTO
    {
        Id = walker.Id,
        Name = walker.Name,
        CityIds = cityIds
    });
});

app.MapGet("/api/walkers/{walkerId:int}/available-dogs", (int walkerId) =>
{
    var cityIds = walkerCities.Where(wc => wc.WalkerId == walkerId).Select(wc => wc.CityId).ToHashSet();

    var dogsForWalker = dogs.Where(d => cityIds.Contains(d.CityId) && d.WalkerId != walkerId).Select(d =>
        {
            var city   = cities.FirstOrDefault(c => c.Id == d.CityId);
            var walker = (d.WalkerId == null) ? null : walkers.FirstOrDefault(w => w.Id == d.WalkerId.Value);

            return new DogDTO
            {
                Id = d.Id,
                Name = d.Name,
                City = city?.Name,        
                Walker = walker?.Name           
            };
        }).ToList();

    return Results.Ok(dogsForWalker);
});

app.MapPost("/api/walkers/{walkerId:int}/assign/{dogID:int}", (int walkerId, int dogId) =>
{
    Dog dog = dogs.FirstOrDefault(d => d.Id == dogId);
    if (dog is null) return Results.NotFound();

    var inCity = walkerCities.Any(wc => wc.WalkerId == walkerId && wc.CityId == dog.CityId);

    dog.WalkerId = walkerId;

    DogDTO newDogDTO = new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        City = cities.First(c => c.Id == dog.CityId).Name,
        Walker = walkers.First(w => w.Id == walkerId).Name
    };
    return Results.Ok(newDogDTO);
});

app.MapPut("/api/walkers/{id:int}", (int id, UpdateWalkerRequest body) =>
{
    var walker = walkers.FirstOrDefault(w => w.Id == id);
    if (walker == null) return Results.NotFound();

    if (string.IsNullOrWhiteSpace(body?.Name)) return Results.BadRequest("Name required.");

    walker.Name = body.Name.Trim();

    walkerCities.RemoveAll(wc => wc.WalkerId == id);

    var validCityIds = new HashSet<int>(cities.Select(c => c.Id));
    foreach (var cid in body.CityIds.Distinct())
    {
        if (validCityIds.Contains(cid))
            walkerCities.Add(new WalkerCity { WalkerId = id, CityId = cid });
    }

    return Results.NoContent();
});


app.Run();

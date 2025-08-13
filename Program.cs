using DeShawnsDogWalking.Models;
using DeShawnsDogWalking.Models.DTOs;

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


app.Run();

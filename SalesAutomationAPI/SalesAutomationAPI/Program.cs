using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Repositories;
using SalesAutomationAPI.Services;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Port ayarını başlangıçta ekle - HTTP kullanımını etkinleştir
builder.WebHost.UseUrls("http://localhost:7294");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// CORS Policy - Güncellendi
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.SetIsOriginAllowed(_ => true)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// DbContext Configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository Dependencies
builder.Services.AddScoped<IKategorilerRepository, KategorilerRepository>();
builder.Services.AddScoped<IUrunlerRepository, UrunlerRepository>();
builder.Services.AddScoped<ISatislarRepository, SatislarRepository>();
builder.Services.AddScoped<ISatisDetaylariRepository, SatisDetaylariRepository>();
builder.Services.AddScoped<ICarilerRepository, CarilerRepository>();
builder.Services.AddScoped<ICariHareketlerRepository, CariHareketlerRepository>();
builder.Services.AddScoped<ITedariklerRepository, TedariklerRepository>();

// Service Dependencies
builder.Services.AddScoped<IUrunlerService, UrunlerService>();
builder.Services.AddScoped<ISatisService, SatisService>();
builder.Services.AddScoped<ITedarikService, TedarikService>();

// Swagger/OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors();

app.MapControllers();

// SPA için fallback route
app.MapFallbackToFile("index.html");

app.Run();


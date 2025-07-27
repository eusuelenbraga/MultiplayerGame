using Microsoft.EntityFrameworkCore; // Necessário para UseSqlite e Migrate
using MultiplayerGameApi.Data; 
using MultiplayerGameApi.Models; 
using System.Text.Json.Serialization; 
using System.Text.Json; 

var builder = WebApplication.CreateBuilder(args);

// Configuração dos Serviços (Dependency Injection Container) 

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });


builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<GameRepository>();

// Configura o CORS (Cross-Origin Resource Sharing) para permitir que o frontend acesse a API
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              
              .AllowAnyMethod()
              
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// --- Configuração do Pipeline de Requisições HTTP ---

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); 
    app.UseSwagger(); 
    app.UseSwaggerUI(); 
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting(); 

app.UseCors();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GameDbContext>();
    dbContext.Database.Migrate(); 
}

app.Run();


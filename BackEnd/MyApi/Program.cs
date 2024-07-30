using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Services; // Προσθήκη του σωστού using

var builder = WebApplication.CreateBuilder(args);

// Προσθήκη της υπηρεσίας του DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=database.db"));

// Προσθήκη υπηρεσιών στο container
builder.Services.AddScoped<UserService>(); // Προσθήκη του UserService
builder.Services.AddControllers();

// Προσθήκη CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});

// Ρύθμιση των ακροατών (listeners)
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5297); // HTTP
    options.ListenAnyIP(7176, listenOptions => listenOptions.UseHttps()); // HTTPS
});

var app = builder.Build();

// Ρύθμιση του HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

// Χρήση της CORS policy
app.UseCors("AllowReactApp");

// Χρήση HTTPS redirection
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

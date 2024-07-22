using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Προσθήκη της υπηρεσίας του DbContext
builder.Services.AddDbContext<WordsContext>(options =>
    options.UseSqlite("Data Source=words.db"));

// Προσθήκη υπηρεσιών στο container
builder.Services.AddControllers();

// Προσθήκη CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
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

app.UseAuthorization();

app.MapControllers();

app.Run();

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Services;
using MyApi.Hubs; // Προσθήκη του namespace για το ChatHub

var builder = WebApplication.CreateBuilder(args);

// Προσθήκη της υπηρεσίας του DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=database.db"));

// Προσθήκη υπηρεσιών στο container
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UserRegistrationService>();
builder.Services.AddScoped<UserBioService>();
builder.Services.AddScoped<UserExportService>();
builder.Services.AddScoped<UserNetworkService>();
builder.Services.AddScoped<UserSettingsService>();
builder.Services.AddScoped<UserBasicInfoService>();
builder.Services.AddScoped<MessageService>();
builder.Services.AddScoped<DiscussionService>();
builder.Services.AddScoped<EnumService>();
builder.Services.AddScoped<AdvertisementService>();
builder.Services.AddScoped<AdvertisementVectorService>();


// Προσθήκη του SignalR
builder.Services.AddSignalR();

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

// Καταχώρηση των SignalR hubs
app.MapHub<ChatHub>("/chatHub");

app.MapControllers();

app.Run();

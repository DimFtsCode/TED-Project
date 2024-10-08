using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Services;
using MyApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add the DbContext service
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=database.db"));

// Add services to the container
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
builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<ArticleVectorService>();


// Add SignalR
builder.Services.AddSignalR();

builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});

// Add memory cache
builder.Services.AddMemoryCache();

// Configure listeners
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5297); // HTTP
    options.ListenAnyIP(7176, listenOptions => listenOptions.UseHttps()); // HTTPS
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

// Use the CORS policy
app.UseCors("AllowReactApp");

// Use HTTPS redirection
app.UseHttpsRedirection();

app.UseAuthorization();

// Register the SignalR hubs
app.MapHub<ChatHub>("/chatHub");

app.MapControllers();

app.Run();

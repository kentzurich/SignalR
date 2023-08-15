using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using SignalRDemo.Hubs;
using static System.Net.Mime.MediaTypeNames;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

//var connectionAzureSignalR = "connection from azure signalR";
//builder.Services.AddSignalR().AddAzureSignalR(connectionAzureSignalR);
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapHub<UserHub>("/hubs/userCount");
app.MapHub<DeathlyHallowsHub>("/hubs/deathlyHallows");
app.MapHub<HouseGroupHub>("/hubs/houseGroup");
app.MapHub<NotificationHub>("/hubs/notification");
app.MapHub<BasicChatHub>("/hubs/basicchat");
app.MapHub<ChatHub>("/hubs/chat");
app.MapHub<OrderHub>("/hubs/order");

app.Run();

//test @user.com
//Test_1

//test2@user.com
//Test_1

//test3@user.com
//Test_1
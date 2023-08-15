using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Hubs
{
    public class UserHub : Hub //server side signalr
    {
        public static int totalViews { get; set; } = 0;
        public static int totalUsers{ get; set; } = 0;

        public override Task OnConnectedAsync()
        {
            totalUsers++;
            Clients.All.SendAsync("updateTotalUsers", totalUsers).GetAwaiter().GetResult();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            totalUsers--;
            Clients.All.SendAsync("updateTotalUsers", totalUsers).GetAwaiter().GetResult();
            return base.OnDisconnectedAsync(exception);
        }

        public async Task<string> NewWindowLoaded(string name)
        {
            totalViews++;

            //send  update to all clients that total views have been updated
            await Clients.All.SendAsync("updateTotalViews", totalViews);

            return $"Total Views from {name} - {totalViews}";
        }
    }
}

using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Hubs
{
    public class DeathlyHallowsHub : Hub
    {
        public Dictionary<string, int> GetRaceStatus()
        {
            return StaticDetails.DeathlyHallowRace;
        }
    }
}

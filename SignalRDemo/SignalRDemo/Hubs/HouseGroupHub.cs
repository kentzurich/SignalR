using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Hubs
{
    public class HouseGroupHub : Hub
    {
        public static List<string> GroupsJoined = new List<string>();
		public async Task JoinHouse(string houseName)
        {
            if (!GroupsJoined.Contains($"{Context.ConnectionId}:{houseName}"))
            {
                GroupsJoined.Add($"{Context.ConnectionId}:{houseName}");
                //do something else

                await Clients.Caller.SendAsync("subscriptionStatus", splitString(), houseName.ToLower(), true);
                await Clients.Others.SendAsync("newMemberAddedToHouse", houseName);
                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            if (GroupsJoined.Contains($"{Context.ConnectionId}:{houseName}"))
            {
                GroupsJoined.Remove($"{Context.ConnectionId}:{houseName}");
                //do something else

                await Clients.Caller.SendAsync("subscriptionStatus", splitString(), houseName.ToLower(), false);
                await Clients.Others.SendAsync("newMemberRemovedToHouse", houseName);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task TriggerHouseNotify(string houseName)
        {
            await Clients.Group(houseName).SendAsync("triggerHouseNotification", houseName);
        }

        private string splitString()
        {
            string houseList = "";
            foreach (var str in GroupsJoined)
            {
                if (str.Contains(Context.ConnectionId))
                    houseList += str.Split(':')[1] + " ";
            }

            return houseList;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Data;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SignalRDemo.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
        }

        public override Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(x => x.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(HubConnections.HasUserConnection(userId, Context.ConnectionId))
            {
                var userConnection = HubConnections.Users[userId];
                userConnection.Remove(Context.ConnectionId);

                HubConnections.Users.Remove(userId);
                if (userConnection.Any())
                    HubConnections.Users.Add(userId, userConnection);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(x => x.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", userId, userName);
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(x => x.Id == userId).UserName;

            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(x => x.Id == userId).UserName;

            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userId, userName);
        }

        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(x => x.Id == userId).UserName;

            await Clients.All.SendAsync("ReceivePublicMessage", roomId, message, roomName, userId, userName);
        }

        public async Task SendPrivateMessage(string receiverId, string message, string receiverName)
        {
            var senderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var senderName = _db.Users.FirstOrDefault(x => x.Id == senderId).UserName;

            var users = new string[] { senderId, receiverId };

            await Clients.Users(users).SendAsync("ReceivePrivateMessage", senderId, message, senderName, receiverId, Guid.NewGuid(), receiverName);
        }

        public async Task SendOpenPrivateChat(string receiverId)
        {
            var userName = Context.User.FindFirstValue(ClaimTypes.Name);
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            await Clients.User(receiverId).SendAsync("ReceiveOpenPrivateChat", userId, userName);
        }

        public async Task SendDeletePrivateChat(string chatId)
        {
            await Clients.All.SendAsync("ReceiveDeletePrivateChat", chatId);
        }
    }
}

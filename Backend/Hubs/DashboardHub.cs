using Backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class DashboardHub : Hub
    {
        private readonly DashboardService _dashboardService;

        public DashboardHub(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        public override async Task<Task> OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;

            _dashboardService.AddClient(connectionId);

            await Clients.Caller.SendAsync("OnConnected", connectionId);
            await Clients.All.SendAsync("ReceiveMessage", _dashboardService.GetMessages());

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;

            _dashboardService.RemoveClient(connectionId);

            Clients.All.SendAsync("UpdateUsers", _dashboardService.GetClients());

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SetUsername(string username)
        {
            var connectionId = Context.ConnectionId;

            _dashboardService.UpdateClientUsername(connectionId, username);

            await Clients.All.SendAsync("UpdateUsers", _dashboardService.GetClients());
        }

        public async Task SendMessage(string message)
        {
            var connectionId = Context.ConnectionId;
            var user = _dashboardService.GetClientById(connectionId);

            if (user == null || string.IsNullOrEmpty(user.Username))
                return;

            _dashboardService.AddMessage(new Message { Data = message, Sender = user.Username, SenderId = user.ConnectionId });

            await Clients.All.SendAsync("ReceiveMessage", _dashboardService.GetMessages());
        }
    }
}

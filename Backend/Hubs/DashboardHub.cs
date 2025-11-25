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

        public override Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;

            _dashboardService.AddClient(connectionId);

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

        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}

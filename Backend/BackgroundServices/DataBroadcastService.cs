
using Backend.Hubs;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend.BackgroundServices
{
    public class DataBroadcastService : BackgroundService
    {
        private readonly IHubContext<DashboardHub> _hubContext;
        private List<LineChartModel> _data;

        public DataBroadcastService(IHubContext<DashboardHub> hubContext)
        {
            _hubContext = hubContext;
            _data = new List<LineChartModel>();
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            double value = 50.0;
            var random = new Random();

            while (!cancellationToken.IsCancellationRequested)
            {
                double change = (random.NextDouble() - 0.5) * 2.0;
                value += change;

                if (_data.Count > 200)
                    _data.RemoveAt(0);

                _data.Add(new()
                {
                    Time = DateTime.Now.ToString("HH:mm:ss"),
                    Value = Math.Round(value, 2)
                });

                await _hubContext.Clients.All.SendAsync("ReceiveData", _data, cancellationToken: cancellationToken);

                await Task.Delay(TimeSpan.FromMilliseconds(250), cancellationToken);
            }
        }
    }
}

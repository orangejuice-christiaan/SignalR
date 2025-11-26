namespace Backend.Services
{
    public class DashboardService
    {
        private readonly IList<Message> messages = [];
        private readonly IList<Client> clients = [];

        public void AddMessage(Message message)
        {
            messages.Add(message);
        }

        public IEnumerable<Message> GetMessages() => messages;

        public void AddClient(string connectionId)
        {
            if (clients.Any(c => c.ConnectionId == connectionId))
                return;

            clients.Add(new Client
            {
                ConnectionId = connectionId,
                JoinedAt = DateTime.UtcNow
            });
        }

        public void RemoveClient(string connectionId)
        {
            var client = clients.FirstOrDefault(c => c.ConnectionId == connectionId);
            if (client != null)
            {
                clients.Remove(client);
            }
        }

        public void UpdateClientUsername(string connectionId, string username)
        {
            var client = clients.FirstOrDefault(c => c.ConnectionId == connectionId);
            if (client != null)
            {
                client.Username = username;
            }
        }

        public IEnumerable<Client> GetClients() => clients.OrderBy(x => x.JoinedAt);
        public Client? GetClientById(string connectionId) => clients.FirstOrDefault(c => c.ConnectionId == connectionId);
    }

    public class Message
    {
        public required string Data { get; set; }
        public required string Sender { get; set; }

        public required string SenderId { get; set; }
    }

    public class Client
    {
        public required string ConnectionId { get; set; }
        public string? Username { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}

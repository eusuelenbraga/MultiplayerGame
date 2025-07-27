using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; 
namespace MultiplayerGameApi.Models
{
    public enum MatchStatus
    {
        Open,
        Waiting,
        InProgress,
        Finished
    }

    public class Match
    {
        public Guid Id { get; set; }
        public required string Name { get; set; } 
        public MatchStatus Status { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public ICollection<Player> Players { get; set; } = new List<Player>();

        public Dictionary<Guid, int> Scores { get; set; } = new Dictionary<Guid, int>(); 
        public Match()
        {
            Id = Guid.NewGuid();
            CreationTime = DateTime.UtcNow;
            Status = MatchStatus.Waiting;
        }

        public bool CanJoin()
        {
            return Status == MatchStatus.Waiting && Players.Count < 10;
        }

        public bool IsPlayerInMatch(Guid playerId)
        {
            return Players.Any(p => p.Id == playerId);
        }
    }
}
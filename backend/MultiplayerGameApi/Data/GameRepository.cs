using Microsoft.EntityFrameworkCore;
using MultiplayerGameApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MultiplayerGameApi.Data
{
    public class GameRepository
    {
        private readonly GameDbContext _context;

        public GameRepository(GameDbContext context)
        {
            _context = context;
        }

        // Métodos para Jogadores 

        public async Task<Player> AddPlayerAsync(Player player)
        {
            if (await _context.Players.AnyAsync(p => p.Email == player.Email))
            {
                throw new InvalidOperationException($"Já existe um jogador com o email '{player.Email}'.");
            }

            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            return player;
        }

        public async Task<List<Player>> GetPlayersAsync()
        {
            return await _context.Players.ToListAsync();
        }

        public async Task<Player?> GetPlayerByIdAsync(Guid id)
        {
            return await _context.Players.FindAsync(id);
        }

        public async Task<Player?> GetPlayerByEmailAsync(string email)
        {
            return await _context.Players.FirstOrDefaultAsync(p => p.Email == email);
        }

        public async Task<bool> UpdatePlayerAsync(Player player)
        {
            var existingPlayer = await _context.Players.FindAsync(player.Id);
            if (existingPlayer == null)
            {
                return false;
            }

            if (await _context.Players.AnyAsync(p => p.Email == player.Email && p.Id != player.Id))
            {
                throw new InvalidOperationException($"O email '{player.Email}' já está em uso por outro jogador.");
            }

            existingPlayer.Name = player.Name;
            existingPlayer.Nickname = player.Nickname;
            existingPlayer.Email = player.Email;

            _context.Players.Update(existingPlayer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePlayerAsync(Guid id)
        {
            var playerToDelete = await _context.Players.FindAsync(id);
            if (playerToDelete == null)
            {
                return false;
            }

            _context.Players.Remove(playerToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        // Métodos para Partidas

        public async Task<Match> AddMatchAsync(Match match)
        {
            _context.Matches.Add(match);
            await _context.SaveChangesAsync();
            return match;
        }

        public async Task<List<Match>> GetMatchesAsync()
        {
            return await _context.Matches
                .Include(m => m.Players)
                .ToListAsync();
        }

        public async Task<Match?> GetMatchByIdAsync(Guid id)
        {
            return await _context.Matches
                .Include(m => m.Players)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Match>> GetOpenMatchesAsync()
        {
            return await _context.Matches
                .Where(m => m.Status == MatchStatus.Open)
                .Include(m => m.Players)
                .ToListAsync();
        }

        public async Task<bool> UpdateMatchAsync(Match match)
        {
            var existingMatch = await _context.Matches.FindAsync(match.Id);
            if (existingMatch == null)
            {
                return false;
            }

            existingMatch.Name = match.Name;
            existingMatch.Status = match.Status;
            existingMatch.StartTime = match.StartTime;
            existingMatch.EndTime = match.EndTime;
            existingMatch.Scores = match.Scores;

            _context.Matches.Update(existingMatch);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMatchAsync(Guid id)
        {
            var matchToDelete = await _context.Matches.FindAsync(id);
            if (matchToDelete == null)
            {
                return false;
            }

            _context.Matches.Remove(matchToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAllMatchesAsync()
        {
            _context.Matches.RemoveRange(_context.Matches);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddPlayerToMatchAsync(Guid matchId, Guid playerId)
        {
            var match = await _context.Matches
                .Include(m => m.Players)
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
            {
                return false;
            }

            var player = await _context.Players.FindAsync(playerId);
            if (player == null)
            {
                throw new InvalidOperationException($"Jogador com ID {playerId} não encontrado.");
            }

            if (player.CurrentMatchId != null && player.CurrentMatchId != matchId)
            {
                throw new InvalidOperationException($"O jogador '{player.Name}' já está em outra partida (ID: {player.CurrentMatchId}).");
            }

            if (match.Players.Any(p => p.Id == player.Id))
            {
                throw new InvalidOperationException("Este jogador já está nesta partida.");
            }
            
            if (match.Status != MatchStatus.Open)
            {
                throw new InvalidOperationException("Não é possível entrar em uma partida que não está aberta.");
            }

            if (match.Players.Count >= 4)
            {
                throw new InvalidOperationException("Esta partida já atingiu o número máximo de 4 jogadores.");
            }

            match.Players.Add(player);
            player.CurrentMatchId = match.Id;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemovePlayerFromMatchAsync(Guid matchId, Guid playerId)
        {
            var match = await _context.Matches
                .Include(m => m.Players)
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
            {
                return false;
            }

            var playerToRemove = match.Players.FirstOrDefault(p => p.Id == playerId);
            if (playerToRemove == null)
            {
                throw new InvalidOperationException("Jogador não encontrado nesta partida.");
            }
            
            if (match.Status == MatchStatus.Finished)
            {
                throw new InvalidOperationException("Não é possível sair de uma partida que já foi finalizada.");
            }

            match.Players.Remove(playerToRemove);
            playerToRemove.CurrentMatchId = null;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> StartMatchAsync(Guid matchId)
        {
            var match = await _context.Matches
                .Include(m => m.Players)
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
            {
                return false;
            }

            if (match.Status != MatchStatus.Open)
            {
                throw new InvalidOperationException("A partida não está aberta para ser iniciada.");
            }

            if (match.Players == null || match.Players.Count < 1)
            {
                throw new InvalidOperationException("Não é possível iniciar uma partida sem jogadores.");
            }
            
            match.Status = MatchStatus.InProgress; 
            match.StartTime = DateTime.UtcNow;     
            await _context.SaveChangesAsync();     
            return true;
        }

        public async Task<bool> FinishMatchAsync(Guid matchId, Dictionary<Guid, int> scores)
        {
            var match = await _context.Matches
                .Include(m => m.Players)
                .FirstOrDefaultAsync(m => m.Id == matchId);

            if (match == null)
            {
                return false;
            }

            match.Status = MatchStatus.Finished;
            match.EndTime = DateTime.UtcNow;
            match.Scores = scores ?? new Dictionary<Guid, int>();
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Match>> GetMatchHistoryByPlayerAsync(Guid playerId)
        {
            return await _context.Matches
                .Where(m => m.Players.Any(p => p.Id == playerId) && m.Status == MatchStatus.Finished)
                .Include(m => m.Players)
                .ToListAsync();
        }
    }
}

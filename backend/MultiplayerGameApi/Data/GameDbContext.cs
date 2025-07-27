using Microsoft.EntityFrameworkCore;
using MultiplayerGameApi.Models; 

namespace MultiplayerGameApi.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options)
        {
        }

        // DbSets para suas entidades
        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasOne(p => p.CurrentMatch) 
                .WithMany(m => m.Players)    
                .HasForeignKey(p => p.CurrentMatchId) 
                .IsRequired(false)           
                .OnDelete(DeleteBehavior.SetNull); 
           
            modelBuilder.Entity<Match>()
                .Property(m => m.Scores)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null), // Converte Dictionary para string JSON
                    v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<Guid, int>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new Dictionary<Guid, int>()); // Converte string JSON para Dictionary

            modelBuilder.Entity<Player>()
                .HasIndex(p => p.Email)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}

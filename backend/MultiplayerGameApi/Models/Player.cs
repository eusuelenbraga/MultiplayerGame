using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; 

namespace MultiplayerGameApi.Models
{
    public class Player
    {
        [Key] 
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do jogador é obrigatório.")] 
        public string Name { get; set; } = string.Empty; 

        [Required(ErrorMessage = "O apelido do jogador é obrigatório.")] 
        public string Nickname { get; set; } = string.Empty;

        [Required(ErrorMessage = "O email do jogador é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")] 
        
        public string Email { get; set; } = string.Empty; 

        public Guid? CurrentMatchId { get; set; }

        [JsonIgnore] 
        public Match? CurrentMatch { get; set; } 
    }
}

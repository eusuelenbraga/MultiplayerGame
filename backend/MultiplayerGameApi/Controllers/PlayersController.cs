using Microsoft.AspNetCore.Mvc;
using MultiplayerGameApi.Data;
using MultiplayerGameApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MultiplayerGameApi.Controllers
{
    [Route("api/[controller]")] 
    [ApiController] 
        public class PlayersController : ControllerBase
    {
        private readonly GameRepository _gameRepository;

        public PlayersController(GameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        // GET: api/Players - Retorna uma lista de todos os jogadores.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
        {
            var players = await _gameRepository.GetPlayersAsync();
            return Ok(players);
        }

        // GET: api/Players/{id} - Retorna um jogador específico pelo seu ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(Guid id)
        {
            var player = await _gameRepository.GetPlayerByIdAsync(id);
            if (player == null)
            {
                return NotFound($"Jogador com ID {id} não encontrado.");
            }
            return Ok(player);
        }

        // POST: api/Players - Cria um novo jogador.
        [HttpPost]
        public async Task<ActionResult<Player>> CreatePlayer([FromBody] Player player)
        {
            if (string.IsNullOrWhiteSpace(player.Name))
            {
                return BadRequest("O nome do jogador é obrigatório.");
            }
            if (string.IsNullOrWhiteSpace(player.Nickname))
            {
                return BadRequest("O apelido do jogador é obrigatório.");
            }
            if (string.IsNullOrWhiteSpace(player.Email))
            {
                return BadRequest("O email do jogador é obrigatório.");
            }

            player.Id = Guid.NewGuid();
            player.CurrentMatchId = null; 

            try
            {
                var createdPlayer = await _gameRepository.AddPlayerAsync(player);
                return CreatedAtAction(nameof(GetPlayer), new { id = createdPlayer.Id }, createdPlayer);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Captura outras exceções inesperadas
                return StatusCode(500, $"Erro interno ao criar jogador: {ex.Message}");
            }
        }

        // PUT: api/Players/{id} - Atualiza um jogador existente.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(Guid id, [FromBody] Player player)
        {
            if (id != player.Id)
            {
                return BadRequest("O ID na URL não corresponde ao ID do jogador no corpo da requisição.");
            }

            // Validações básicas de entrada
            if (string.IsNullOrWhiteSpace(player.Name))
            {
                return BadRequest("O nome do jogador é obrigatório.");
            }
            if (string.IsNullOrWhiteSpace(player.Nickname))
            {
                return BadRequest("O apelido do jogador é obrigatório.");
            }
            if (string.IsNullOrWhiteSpace(player.Email))
            {
                return BadRequest("O email do jogador é obrigatório.");
            }

            try
            {
                var updatedSuccessfully = await _gameRepository.UpdatePlayerAsync(player);
                if (updatedSuccessfully)
                {
                    return NoContent(); // 204 No Content para sucesso
                }
                return NotFound($"Jogador com ID {id} não encontrado para atualização.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno ao atualizar jogador: {ex.Message}");
            }
        }

        // DELETE: api/Players/{id} - Deleta um jogador pelo seu ID.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(Guid id)
        {
            var deletedSuccessfully = await _gameRepository.DeletePlayerAsync(id);
            if (deletedSuccessfully)
            {
                return NoContent(); // 204 No Content para sucesso
            }
            return NotFound($"Jogador com ID {id} não encontrado para exclusão.");
        }
    }
}

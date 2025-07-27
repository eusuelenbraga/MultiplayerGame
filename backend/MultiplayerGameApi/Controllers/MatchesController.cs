using Microsoft.AspNetCore.Mvc;
using MultiplayerGameApi.Data;
using MultiplayerGameApi.Models;
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace MultiplayerGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly GameRepository _gameRepository;

        public MatchesController(GameRepository gameRepository)
        {
            _gameRepository = gameRepository;
        }

        // GET: api/Matches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            var matches = await _gameRepository.GetMatchesAsync();
            if (matches == null || !matches.Any()) // 
            {
                return NoContent(); // Retorna 204 No Content se não houver partidas
            }
            return Ok(matches);
        }

        // GET: api/Matches/open
        [HttpGet("open")]
        public async Task<ActionResult<IEnumerable<Match>>> GetOpenMatches()
        {
            var openMatches = await _gameRepository.GetOpenMatchesAsync();
            if (openMatches == null || !openMatches.Any()) 
            {
                return NoContent(); 
            }
            return Ok(openMatches);
        }

        // GET: api/Matches/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Match>> GetMatch(Guid id)
        {
            var match = await _gameRepository.GetMatchByIdAsync(id);
            if (match == null)
            {
                return NotFound();
            }
            return Ok(match);
        }

        // POST: api/Matches
        [HttpPost]
        public async Task<ActionResult<Match>> PostMatch([FromBody] Match match)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Garante que a partida é criada como "Open" por padrão
            match.Status = MatchStatus.Open; 
            var createdMatch = await _gameRepository.AddMatchAsync(match);
            return CreatedAtAction(nameof(GetMatch), new { id = createdMatch.Id }, createdMatch);
        }

        // PUT: api/Matches/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatch(Guid id, [FromBody] Match match)
        {
            if (id != match.Id)
            {
                return BadRequest("ID da partida na URL não corresponde ao ID no corpo da requisição.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _gameRepository.UpdateMatchAsync(match);
            if (!success)
            {
                return NotFound();
            }
            return NoContent(); // Retorna 204 No Content para atualização bem-sucedida
        }

        // DELETE: api/Matches/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(Guid id)
        {
            var success = await _gameRepository.DeleteMatchAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent(); // Retorna 204 No Content para deleção bem-sucedida
        }

        // DELETE: api/Matches/all
        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllMatches()
        {
            var success = await _gameRepository.DeleteAllMatchesAsync();
            if (!success)
            {
                return NotFound("Nenhuma partida encontrada para deletar."); 
            }
            return NoContent(); // Retorna 204 No Content para deleção em massa bem-sucedida
        }


        // POST: api/Matches/{matchId}/join/{playerId}
        [HttpPost("{matchId}/join/{playerId}")]
        public async Task<IActionResult> AddPlayerToMatch(Guid matchId, Guid playerId)
        {
            try
            {
                var success = await _gameRepository.AddPlayerToMatchAsync(matchId, playerId);
                if (!success)
                {
                    return NotFound($"Partida com ID {matchId} não encontrada.");
                }
                return NoContent(); // 204 No Content para sucesso
            }
            catch (InvalidOperationException ex)
            {
                // Captura exceções de regra de negócio do repositório
                return BadRequest(new { message = ex.Message }); // Retorna 400 Bad Request com a mensagem JSON
            }
            catch (Exception ex)
            {
                // Captura outras exceções inesperadas
                return StatusCode(500, new { message = "Ocorreu um erro interno ao adicionar jogador à partida.", details = ex.Message });
            }
        }

        // POST: api/Matches/{matchId}/leave/{playerId}
        [HttpPost("{matchId}/leave/{playerId}")]
        public async Task<IActionResult> RemovePlayerFromMatch(Guid matchId, Guid playerId)
        {
            try
            {
                var success = await _gameRepository.RemovePlayerFromMatchAsync(matchId, playerId);
                if (!success)
                {
                    return NotFound($"Partida com ID {matchId} não encontrada.");
                }
                return NoContent(); // 204 No Content para sucesso
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao remover jogador da partida.", details = ex.Message });
            }
        }

        // POST: api/Matches/{matchId}/start
        [HttpPost("{matchId}/start")]
        public async Task<IActionResult> StartMatch(Guid matchId)
        {
            try
            {
                var success = await _gameRepository.StartMatchAsync(matchId);
                if (!success)
                {
                    return NotFound($"Partida com ID {matchId} não encontrada.");
                }
                return NoContent(); // 204 No Content para sucesso
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao iniciar a partida.", details = ex.Message });
            }
        }

        // POST: api/Matches/{matchId}/finish
        [HttpPost("{matchId}/finish")]
        public async Task<IActionResult> FinishMatch(Guid matchId, [FromBody] Dictionary<Guid, int> scores)
        {
            try
            {
                var success = await _gameRepository.FinishMatchAsync(matchId, scores);
                if (!success)
                {
                    return NotFound($"Partida com ID {matchId} não encontrada.");
                }
                return NoContent(); // 204 No Content para sucesso
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao finalizar a partida.", details = ex.Message });
            }
        }

        // GET: api/Matches/history/player/{playerId}
        [HttpGet("history/player/{playerId}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatchHistoryByPlayer(Guid playerId)
        {
            var matches = await _gameRepository.GetMatchHistoryByPlayerAsync(playerId);
            if (matches == null || !matches.Any())
            {
                return NoContent(); // Retorna 204 No Content se não houver histórico
            }
            return Ok(matches);
        }
    }
}




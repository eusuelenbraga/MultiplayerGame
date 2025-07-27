const API_BASE_URL = 'http://localhost:5127'; 

// Funções para Jogadores

async function createPlayer() {
    const name = document.getElementById('playerName').value;
    const nickname = document.getElementById('playerNickname').value;
    const email = document.getElementById('playerEmail').value;
    const messageElement = document.getElementById('createPlayerMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!name.trim() || !nickname.trim() || !email.trim()) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, preencha todos os campos: Nome, Apelido e Email.';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um formato de email válido (ex: exemplo@dominio.com).';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, nickname, email }) 
        });

        if (response.ok) {
            const player = await response.json(); 
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            messageElement.textContent = `Jogador criado! ID: ${player.id}, Nome: ${player.name}`;

            document.getElementById('playerName').value = '';
            document.getElementById('playerNickname').value = '';
            document.getElementById('playerEmail').value = '';
            listPlayers(); 
        } else {
            let errorMessage = `Erro ao criar jogador: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData); 
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text(); 
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}

async function listPlayers() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = ''; 

    try {
        const response = await fetch(`${API_BASE_URL}/api/Players`); 
        const players = await response.json(); 

        if (players.length === 0) {
            playersList.innerHTML = '<li class="text-gray-500">Nenhum jogador cadastrado.</li>';
            return;
        }

        players.forEach(player => {
            const li = document.createElement('li');
            li.className = 'p-2 rounded mb-2 bg-white shadow-sm border border-gray-200'; 
            li.textContent = `ID: ${player.id}, Nome: ${player.name}, Apelido: ${player.nickname}, Email: ${player.email}, Partida Atual: ${player.currentMatchId || 'N/A'}`;
            playersList.appendChild(li); 
        });
    } catch (error) {
        
        playersList.innerHTML = `<li class="text-red-500">Erro ao listar jogadores: ${error.message}</li>`; 
        console.error('Erro ao listar jogadores:', error);
    }
}

async function getPlayerById() {
    const id = document.getElementById('playerIdToManage').value;
    const messageElement = document.getElementById('managePlayerMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!id) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um ID de jogador.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Players/${id}`); 
        if (response.ok) {
            const player = await response.json();
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            messageElement.textContent = `Jogador encontrado: ID: ${player.id}, Nome: ${player.name}, Apelido: ${player.nickname}, Email: ${player.email}`;

            document.getElementById('updatePlayerName').value = player.name;
            document.getElementById('updatePlayerNickname').value = player.nickname;
            document.getElementById('updatePlayerEmail').value = player.email;

        } else {
            let errorMessage = `Erro ao buscar jogador: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData); 
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}

async function updatePlayer() {
    const id = document.getElementById('playerIdToManage').value;
    const name = document.getElementById('updatePlayerName').value;
    const nickname = document.getElementById('updatePlayerNickname').value;
    const email = document.getElementById('updatePlayerEmail').value;
    const messageElement = document.getElementById('managePlayerMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!id) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um ID de jogador para atualizar.';
        return;
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um formato de email válido (ex: exemplo@dominio.com) para atualização.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Players/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, nickname, email }) 
        });

        if (response.ok) {
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            messageElement.textContent = 'Jogador atualizado com sucesso!';
            listPlayers(); 
        } else {
            let errorMessage = `Erro ao atualizar jogador: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData); 
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}

async function deletePlayer() {
    const id = document.getElementById('playerIdToManage').value;
    const messageElement = document.getElementById('managePlayerMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!id) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um ID de jogador para deletar.';
        return;
    }

    if (!confirm('Tem certeza que deseja deletar este jogador?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Players/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            messageElement.textContent = 'Jogador deletado com sucesso!';
            listPlayers(); 
            document.getElementById('updatePlayerName').value = '';
            document.getElementById('updatePlayerNickname').value = '';
            document.getElementById('updatePlayerEmail').value = '';
            document.getElementById('playerIdToManage').value = '';
        } else {
            let errorMessage = `Erro ao deletar jogador: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData); 
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}


// Funções para Partidas 

async function createMatch() {
    const name = document.getElementById('matchName').value;
    const messageElement = document.getElementById('createMatchMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 
    if (!name.trim()) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um nome para a partida.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            if (response.status === 204) {
                messageElement.className = 'text-green-500 mt-3 text-sm'; 
                messageElement.textContent = `Partida criada com sucesso! (Resposta sem conteúdo)`;
            } else {
                const match = await response.json();
                messageElement.className = 'text-green-500 mt-3 text-sm'; 
                messageElement.textContent = `Partida criada! ID: ${match.id}, Nome: ${match.name}`;
            }
            document.getElementById('matchName').value = ''; 
            listOpenMatches(); 
            listAllMatches();   
        } else {
            let errorMessage = `Erro ao criar partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.title || (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData); 
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro ao criar partida:', error);
    }
}

async function listOpenMatches() {
    const openMatchesList = document.getElementById('openMatchesList');
    openMatchesList.innerHTML = ''; 

    const messageElement = document.getElementById('openMatchesMessage'); 
    if (messageElement) { 
        messageElement.textContent = ''; 
        messageElement.className = 'mt-3 text-sm'; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/open`);
        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            openMatchesList.innerHTML = '<li class="text-gray-500">Nenhuma partida aberta no momento.</li>'; 
            messageElement.textContent = 'Nenhuma partida aberta encontrada.';
            messageElement.className = 'text-blue-500 mt-3 text-sm'; 
            return;
        }

        const matches = await response.json(); 

        if (matches.length === 0) {
            openMatchesList.innerHTML = '<li class="text-gray-500">Nenhuma partida aberta no momento.</li>'; 
            messageElement.textContent = 'Nenhuma partida aberta encontrada.';
            messageElement.className = 'text-blue-500 mt-3 text-sm'; 
            return;
        }

        matches.forEach(match => {
            const listItem = document.createElement('li');
            listItem.className = 'p-2 rounded mb-2 flex justify-between items-center bg-white shadow-sm border border-gray-200';
            listItem.innerHTML = `
                <span>ID: ${match.id} - ${match.name} (Jogadores: ${match.players ? match.players.length : 0})</span>
                <div>
                    <button onclick="joinMatchWithParams('${match.id}', prompt('Seu ID de Jogador:'))" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2">Entrar</button>
                    <button onclick="startMatch('${match.id}')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm">Iniciar</button>
                </div>
            `;
            openMatchesList.appendChild(listItem); 
        });
        messageElement.textContent = `Partidas abertas carregadas: ${matches.length}.`;
        messageElement.className = 'text-green-500 mt-3 text-sm'; 

    } catch (error) {
        openMatchesList.innerHTML = `<li class="text-red-500">Erro ao listar partidas abertas: ${error.message}</li>`; 
        messageElement.textContent = `Erro ao listar partidas abertas: ${error.message}`;
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        console.error('Erro ao listar partidas abertas:', error);
    }
}


async function listAllMatches() {
    const allMatchesList = document.getElementById('allMatchesList');
    allMatchesList.innerHTML = ''; 
    const messageElement = document.getElementById('allMatchesMessage'); 
    if (messageElement) { 
        messageElement.textContent = ''; 
        messageElement.className = 'mt-3 text-sm'; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches`);
        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            allMatchesList.innerHTML = '<li class="text-gray-500">Nenhuma partida cadastrada.</li>'; 
            messageElement.textContent = 'Nenhuma partida cadastrada.';
            messageElement.className = 'text-blue-500 mt-3 text-sm'; 
            return;
        }

        const matches = await response.json(); 

        if (matches.length === 0) {
            allMatchesList.innerHTML = '<li class="text-gray-500">Nenhuma partida cadastrada.</li>'; 
            messageElement.textContent = 'Nenhuma partida cadastrada.';
            messageElement.className = 'text-blue-500 mt-3 text-sm'; 
            return;
        }

        matches.forEach(match => {
            const li = document.createElement('li');
            li.className = 'p-2 rounded mb-2 flex justify-between items-center bg-white shadow-sm border border-gray-200';
            const playerNames = match.players ? match.players.map(p => p.name).join(', ') : 'N/A'; 
            const scores = match.scores ? Object.entries(match.scores).map(([playerId, score]) => {
                const player = match.players ? match.players.find(p => p.id === playerId) : null;
                return `${player ? player.name : 'Unknown'}: ${score}`;
            }).join(', ') : 'N/A';

            // Formatação do status para ser mais legível
            let statusText = '';
            switch (match.status) {
                case 0: statusText = 'Aberta'; break;
                case 1: statusText = 'Em Progresso'; break;
                case 2: statusText = 'Finalizada'; break;
                default: statusText = 'Desconhecido'; break;
            }

            li.textContent = `ID: ${match.id}, Nome: ${match.name}, Jogadores: [${playerNames}], Status: ${statusText}, Início: ${match.startTime ? new Date(match.startTime).toLocaleString() : 'N/A'}, Fim: ${match.endTime ? new Date(match.endTime).toLocaleString() : 'N/A'}, Placar: ${scores}`;
            allMatchesList.appendChild(li); 
        });
        messageElement.textContent = `Todas as partidas carregadas: ${matches.length}.`;
        messageElement.className = 'text-green-500 mt-3 text-sm'; 
    } catch (error) {
        allMatchesList.innerHTML = `<li class="text-red-500">Erro ao listar todas as partidas: ${error.message}</li>`; 
        messageElement.textContent = `Erro ao listar todas as partidas: ${error.message}`;
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        console.error('Erro ao listar todas as partidas:', error);
    }
}

async function joinMatchWithParams(matchId, playerId) {
    const messageElement = document.getElementById('joinLeaveMatchMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!playerId) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'ID do jogador não fornecido.';
        return;
    }
    joinMatch(matchId, playerId); 
}
 
async function joinMatch(matchId, playerId) { 
    const messageElement = document.getElementById('joinLeaveMatchMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!matchId || !playerId) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira o ID da partida e o ID do jogador.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/${matchId}/join/${playerId}`, {
            method: 'POST',
        });

        if (response.ok) {
        
            const updatedMatchResponse = await fetch(`${API_BASE_URL}/api/Matches/${matchId}`);
            if (updatedMatchResponse.ok) {
                const updatedMatch = await updatedMatchResponse.json();
                if (updatedMatch.players && updatedMatch.players.length === 4) {
                    messageElement.textContent = `Jogador entrou na partida com sucesso! Esta partida atingiu o limite de 4 jogadores.`;
                    messageElement.className = 'text-green-500 mt-3 text-sm'; 
                    console.log('Mensagem de limite de 4 jogadores definida:', messageElement.textContent); 
                } else {
                    messageElement.textContent = 'Jogador entrou na partida com sucesso!';
                    messageElement.className = 'text-green-500 mt-3 text-sm'; 
                    console.log('Mensagem de sucesso de entrada definida:', messageElement.textContent); 
                }
            } else {
                messageElement.textContent = 'Jogador entrou na partida com sucesso! (Não foi possível verificar o limite de jogadores)';
                messageElement.className = 'text-yellow-500 mt-3 text-sm'; 
                console.error('Erro ao buscar partida atualizada após entrada:', await updatedMatchResponse.text());
                console.log('Mensagem de fallback definida:', messageElement.textContent); 
            }
            
            listOpenMatches(); 
            listAllMatches();
        } else {
            let errorMessage = `Erro ao entrar na partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                console.log('Dados de erro do backend:', errorData); 
                
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text(); 
                console.error("Resposta de erro não JSON:", errorMessage);
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage; 
            console.log('Mensagem de erro definida:', messageElement.textContent); 
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm';
        messageElement.textContent = 'Erro de rede: ' + error.message;
        console.error('Erro ao entrar na partida:', error);
        console.log('Mensagem de erro de rede definida:', messageElement.textContent); 
    }
}

async function leaveMatch() {
    const matchId = document.getElementById('matchIdToJoinLeave').value;
    const playerId = document.getElementById('playerIdToJoinLeave').value;
    const messageElement = document.getElementById('joinLeaveMatchMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!matchId || !playerId) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira o ID da partida e o ID do jogador.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/${matchId}/leave/${playerId}`, {
            method: 'POST',
        });

        if (response.ok) {
            messageElement.textContent = 'Jogador saiu da partida com sucesso!';
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            listOpenMatches(); 
            listAllMatches();
        } else {
            let errorMessage = `Erro ao sair da partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Erro de rede: ' + error.message;
        console.error('Erro ao sair da partida:', error);
    }
}

async function startMatch(matchId) { 
    const messageElement = document.getElementById('openMatchesMessage'); 
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!matchId) { 
        if (messageElement) {
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = 'ID da partida não fornecido para iniciar.';
        }
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/${matchId}/start`, {
            method: 'POST'
        });

        if (response.ok) {
            if (messageElement) {
                messageElement.className = 'text-green-500 mt-3 text-sm'; 
                messageElement.textContent = `Partida ${matchId} iniciada com sucesso!`; 
            }
            listOpenMatches(); 
            listAllMatches(); 
        } else {
            let errorMessage = `Erro ao iniciar partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            if (messageElement) {
                messageElement.className = 'text-red-500 mt-3 text-sm'; 
                messageElement.textContent = errorMessage;
            }
        }
    } catch (error) {
        if (messageElement) {
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = `Erro de rede ao iniciar partida: ${error.message}`;
        }
        console.error('Erro de rede ao iniciar partida:', error);
    }
}

async function finishMatch() {
    const matchId = document.getElementById('matchIdToFinish').value;
    const scoresInput = document.getElementById('scoresToFinish').value; 
    const messageElement = document.getElementById('finishMatchMessage');
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!matchId) {
        messageElement.className = 'text-red-500 mt-3 text-sm';
        messageElement.textContent = 'Por favor, insira o ID da partida.';
        return;
    }

    let scores = {}; 
    let requestBody = {}; 

    if (scoresInput.trim() !== '') {
        const scorePairs = scoresInput.split(',');

        for (const pair of scorePairs) {
            const parts = pair.split(':');
            if (parts.length !== 2) {
                messageElement.className = 'text-red-500 mt-3 text-sm'; 
                messageElement.textContent = `Formato inválido para o par de placar: "${pair}". Use ID:PONTOS.`;
                return;
            }

            const playerId = parts[0].trim();
            const scoreString = parts[1].trim();

            if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(playerId)) {
                messageElement.className = 'text-red-500 mt-3 text-sm'; 
                messageElement.textContent = `ID do jogador inválido: "${playerId}". Por favor, use um GUID válido.`;
                return;
            }

            const score = parseInt(scoreString, 10);
            if (isNaN(score)) {
                messageElement.className = 'text-red-500 mt-3 text-sm'; 
                messageElement.textContent = `Pontuação inválida para o jogador ${playerId}: "${scoreString}". Use apenas números.`;
                return;
            }
            scores[playerId] = score; 
        }
        requestBody = scores; 
    } else {
        messageElement.textContent = 'Finalizando partida sem placar específico.';
        messageElement.className = 'text-blue-500 mt-3 text-sm'; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/${matchId}/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody) 
        });

        if (response.ok) {
            messageElement.textContent = 'Partida finalizada com sucesso!';
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            listOpenMatches(); 
            listAllMatches();
        } else {
            let errorMessage = `Erro ao finalizar partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Erro de rede: ' + error.message;
        console.error('Erro ao finalizar partida:', error);
    }
}

async function deleteMatch() {
    const matchId = document.getElementById('matchIdToDelete').value; 
    const messageElement = document.getElementById('deleteMatchMessage'); 
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 

    if (!matchId) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira o ID da partida para deletar.';
        return;
    }

    if (!confirm('Tem certeza que deseja deletar esta partida? Esta ação é irreversível.')) {
        return; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/${matchId}`, {
            method: 'DELETE'
        });

        if (response.ok) { 
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            messageElement.textContent = `Partida com ID ${matchId} deletada com sucesso!`;
            listOpenMatches(); 
            listAllMatches();
            document.getElementById('matchIdToDelete').value = ''; 
        } else {
            let errorMessage = `Erro ao deletar partida: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}


async function getMatchHistoryByPlayer() {
    const playerId = document.getElementById('playerIdForHistory').value;
    const historyList = document.getElementById('matchHistoryList');
    historyList.innerHTML = ''; 

    const messageElement = document.getElementById('matchHistoryMessage'); 
    if (!messageElement) { 
        const parentDiv = historyList.parentElement;
        const newMsgElement = document.createElement('p');
        newMsgElement.id = 'matchHistoryMessage';
        newMsgElement.className = 'mt-3 text-sm'; 
        parentDiv.insertBefore(newMsgElement, historyList);
        messageElement = newMsgElement;
    }
    messageElement.textContent = ''; 

    if (!playerId) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = 'Por favor, insira um ID de jogador para buscar o histórico.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/history/player/${playerId}`);
        if (response.ok) {
            const matches = await response.json();
            if (matches.length === 0) {
                historyList.innerHTML = '<li class="text-gray-500">Nenhum histórico de partida finalizada para este jogador.</li>'; 
                messageElement.className = 'text-blue-500 mt-3 text-sm'; 
                return;
            }

            matches.forEach(match => {
                const li = document.createElement('li');
                li.className = 'p-2 rounded mb-2 flex justify-between items-center bg-white shadow-sm border border-gray-200';
                const playerNames = match.players ? match.players.map(p => p.name).join(', ') : 'N/A';
                const scores = match.scores ? Object.entries(match.scores).map(([pId, score]) => {
                    const player = match.players ? match.players.find(p => p.id === pId) : null;
                    return `${player ? player.name : 'Unknown'}: ${score}`;
                }).join(', ') : 'N/A';
                
                let statusText = '';
                switch (match.status) {
                    case 0: statusText = 'Aberta'; break;
                    case 1: statusText = 'Em Progresso'; break;
                    case 2: statusText = 'Finalizada'; break;
                    default: statusText = 'Desconhecido'; break;
                }

                li.textContent = `ID: ${match.id}, Nome: ${match.name}, Jogadores: [${playerNames}], Status: ${statusText}, Início: ${match.startTime ? new Date(match.startTime).toLocaleString() : 'N/A'}, Fim: ${match.endTime ? new Date(match.endTime).toLocaleString() : 'N/A'}, Placar: ${scores}`;
                historyList.appendChild(li);
            });
            messageElement.textContent = `Histórico carregado: ${matches.length} partidas.`;
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
        } else {
            let errorMessage = `Erro ao buscar histórico: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}

async function clearMatchHistory() { 
    const messageElement = document.getElementById('matchHistoryMessage'); 
    messageElement.textContent = ''; 
    messageElement.className = 'mt-3 text-sm'; 
    if (!confirm('ATENÇÃO: Tem certeza que deseja DELETAR TODAS AS PARTIDAS? Esta ação é irreversível e removerá todos os dados do servidor.')) {
        messageElement.textContent = 'Operação de deleção de partidas cancelada.';
        messageElement.className = 'text-blue-500 mt-3 text-sm'; 
        return; 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Matches/all`, {
            method: 'DELETE'
        });

        if (response.ok) { 
            messageElement.textContent = 'Todas as partidas foram deletadas com sucesso!';
            messageElement.className = 'text-green-500 mt-3 text-sm'; 
            
            document.getElementById('matchHistoryList').innerHTML = '';
            document.getElementById('allMatchesList').innerHTML = '';
            document.getElementById('openMatchesList').innerHTML = '';

            const playerIdForHistoryInput = document.getElementById('playerIdForHistory');
            if (playerIdForHistoryInput) {
                playerIdForHistoryInput.value = '';
            }
            listPlayers(); 
            listOpenMatches();
            listAllMatches();

        } else {
            let errorMessage = `Erro ao deletar todas as partidas: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.title) {
                    errorMessage = errorData.title;
                } else if (typeof errorData === 'object') {
                    errorMessage = JSON.stringify(errorData);
                } else {
                    errorMessage = errorData;
                }
            } catch (e) {
                console.error("Erro ao parsear JSON de erro da deleção em massa:", e);
                errorMessage = await response.text();
            }
            messageElement.className = 'text-red-500 mt-3 text-sm'; 
            messageElement.textContent = errorMessage;
        }
    } catch (error) {
        messageElement.className = 'text-red-500 mt-3 text-sm'; 
        messageElement.textContent = `Erro de rede: ${error.message}`;
        console.error('Erro de rede:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    listPlayers();
    listOpenMatches();
    listAllMatches();
});





# Sistema de Gerenciamento de Jogos

![WhatsApp Image 2025-07-27 at 19 16 26](https://github.com/user-attachments/assets/3a639f80-d996-4b40-a831-1dbcf317f791)
![WhatsApp Image 2025-07-27 at 19 17 04](https://github.com/user-attachments/assets/161f0976-b0b1-48cf-8b56-35475aee3dff)
![WhatsApp Image 2025-07-27 at 19 17 34](https://github.com/user-attachments/assets/7b91b454-1c96-428a-9184-a8c24e0cebca)
![WhatsApp Image 2025-07-27 at 19 17 48](https://github.com/user-attachments/assets/8fdd507f-2534-4ddc-8c45-8d68a775456e)

## 🏁 Visão Geral/Introdução ao Projeto:

Projeto de uma API e um frontend simples para gerenciar jogadores e partidas de um jogo multiplayer.
O objetivo deste projeto é fornecer uma base para um sistema de gerenciamento de jogos multiplayer. 
Ele permite:

- Criar e gerenciar jogadores: Adicionar, listar, buscar, atualizar e deletar informações de jogadores.
- Criar e gerenciar partidas: Abrir novas partidas, adicionar/remover jogadores, iniciar, finalizar e visualizar o histórico.

## 🚀 Tecnologias:

O projeto esta dividido em duas partes principais:

Backend (API)
- Linguagem: C#
Framework: ASP.NET Core
Banco de Dados: SQLite (usando Entity Framework Core)
Gerenciamento de Pacotes: NuGet

- Frontend (Interface do Usuário)
Linguagens: HTML, CSS (com Tailwind CSS), JavaScript
Requisições: Fetch API (JavaScript nativo)

## ✔️ Funcionalidades: 

- Gerenciamento de Jogadores
 
•	Criar Jogador: Adiciona um novo jogador com nome, apelido e email.
•	Listar Jogadores: Exibe todos os jogadores cadastrados.
•	Buscar Jogador por ID: Recupera e exibe os detalhes de um jogador específico.
•	Atualizar Jogador: Modifica as informações de um jogador existente.
•	Deletar Jogador: Remove um jogador do sistema.

- Gerenciamento de Partidas
  
•	Criar Partida: Inicia uma nova partida com um nome, definindo seu status como "Aberta".
•	Listar Partidas Abertas: Exibe apenas as partidas que estão disponíveis para jogadores entrarem.
•	Listar Todas as Partidas: Mostra todas as partidas, independentemente do status (Aberta, Em Progresso, Finalizada).
•	Entrar em Partida: Adiciona um jogador a uma partida aberta.
o	Aviso de Limite: Ao adicionar o 4º jogador, a interface informa que a partida atingiu seu limite.
o	Erro de Limite: Se um 5º jogador tentar entrar, o backend retorna um erro.
•	Sair de Partida: Remove um jogador de uma partida.
•	Iniciar Partida: Altera o status de uma partida de "Aberta" para "Em Progresso".
•	Finalizar Partida: Altera o status de uma partida para "Finalizada" e permite registrar pontuações.
•	Histórico de Partidas por Jogador: Exibe todas as partidas finalizadas em que um jogador participou.
•	Deletar Partida: Remove uma partida do sistema.

## 📁 Arquitetura:

O projeto segue uma arquitetura Cliente-Servidor (Client-Server), onde o frontend (cliente) se comunica com o backend (servidor) através de uma API RESTful.

•	Frontend (Cliente): Uma aplicação web estática (HTML, CSS, JavaScript) que fornece a interface do usuário. Ela envia requisições HTTP para o backend para realizar operações e exibe os dados retornados.
•	Backend (API RESTful): Uma aplicação ASP.NET Core que expõe endpoints HTTP para gerenciar os dados do jogo. Ela processa as requisições do frontend, interage com o banco de dados e retorna as respostas.
•	Banco de Dados: Um banco de dados SQLite que armazena todas as informações sobre jogadores e partidas.

Foram aplicados também,  os seguintes padrões de design e princípios arquiteturais:

•	MVC (Model-View-Controller) no Backend: Embora seja uma API RESTful (sem "View" no sentido tradicional), o ASP.NET Core segue o padrão MVC.
 o	Model: Representado pelas classes Player.cs e Match.cs, que definem a estrutura dos dados.
 o	Controller: Representado por PlayersController.cs e MatchesController.cs, que lidam com as requisições HTTP, orquestram as operações e retornam as respostas.
•	Padrão Repositório (Repository Pattern): Implementado através da classe GameRepository.cs. Este padrão abstrai a lógica de acesso a dados do restante da aplicação, tornando o código mais limpo, testável e desacoplado do ORM (Entity Framework Core) e do banco de dados específico.
•	Injeção de Dependência (Dependency Injection - DI): Utilizado extensivamente no ASP.NET Core. O GameRepository e o GameDbContext são injetados nos controladores e no repositório, respectivamente. Isso promove a inversão de controle e facilita a testabilidade e manutenção do código.
•	RESTful API Design: Os endpoints do backend são projetados seguindo os princípios REST, utilizando verbos HTTP (GET, POST, PUT, DELETE) para as operações CRUD e URLs baseadas em recursos.

## 📋 Instruções:

Para rodar este projeto, você precisará ter as seguintes ferramentas instaladas em sua máquina:

Git: Para clonar o repositório do projeto.

.NET SDK: Para compilar e executar o backend ASP.NET Core.

Editor de Código: Um editor como Visual Studio Code, Visual Studio ou JetBrains Rider.

Navegador Web: Google Chrome, Mozilla Firefox, Microsoft Edge, etc.

## 👯 Clone este projeto:

$ git clone https://github.com/eusuelenbraga/MultiplayerGame.git
# Acessar
$ cd MultiplayerGame









# Documentação da API Laravel - Projeto FURIA

## Estrutura da API

### Controllers - `Http/Controllers/Api`

| Controller                    | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| `AuthController`             | Lida com autenticação (login, registro, logout, etc).                     |
| `ChatbotController`          | Integração e respostas do chatbot.                                        |
| `TwitchController`           | Integração com a API da Twitch (streamers, vídeos, etc).                  |
| `TwitterController`          | Integração com a API oficial do Twitter.                                  |
| `UserController`             | Gerenciamento de dados do usuário autenticado.                            |

---

### Models - `Models`

| Model           | Descrição                                                 |
|----------------|-----------------------------------------------------------|
| `Atividades`   | Representa as atividades realizadas ou disponíveis.       |
| `Eventos`      | Representa os eventos disponíveis ou criados.             |
| `Interesses`   | Representa os interesses associados ao usuário.           |
| `Jogadores`    | Informações sobre jogadores da organização FURIA.         |
| `Jogos`        | Representa os jogos que estão vinculados aos eventos.     |
| `User`         | Representa os usuários cadastrados na plataforma.         |

---

## 🔐 Autenticação

A API possui autenticação via **token JWT** (verificar implementação exata em `AuthController`).

### Endpoints comuns esperados:
- `POST /api/auth/login` — Realiza login
- `POST /api/user` — Cria novo usuário
- `POST /api/auth/logout` — Faz logout do usuário autenticado
- `POST /api/twitch-streams` — Pega os streamers que estão ao vivo no momento
- `POST /api/twitter-tweets` — Tweets recentes da FURIA

---

## Observações

- Os controllers estão organizados de forma modular, separando responsabilidades por domínio.
- Existe integração tanto com **Twitch** quanto com **Twitter**, contendo coleta de dados em tempo real
- Esta API não foi subida para um servidor, então é necessario rodar localmente caso queira testar o app da forma mais adequado.

---




Aplicativo desenvolvido como parte do **Desafio FURIA**, voltado para o processo seletivo da vaga de **Assistente em Engenharia de Software**.

O projeto tem como objetivo fortalecer a relação entre fãs e a organização de eSports **FURIA**, oferecendo um app completo com notícias, jogos, integração com redes sociais e funcionalidades personalizadas com base nos interesses dos usuários.

---

## Sobre o Projeto

O app é composto por duas partes:

- **Frontend**: Desenvolvido com **React Native (Expo)**.
- **Backend**: Desenvolvido com **Laravel** (PHP).

### Funcionalidades

- Cadastro de usuário com coleta de dados de interesse
- Acesso a notícias da organização
-  Acompanhamento dos jogos dos times FURIA
-  Integração com a API do Twitter (posts recentes)
-  Integração com a API da Twitch (streamers ao vivo)
-  Chatbot com inteligência artificial
-  Autenticação e controle de sessão

---

##  Imagens do App

![Image](https://github.com/user-attachments/assets/013c890b-d7d8-47df-932d-46972d608915)
![Image](https://github.com/user-attachments/assets/7dea975f-414d-49c5-9496-6c0597378f08)


##  Tecnologias Utilizadas

###  Backend (Laravel)

- PHP 8+
- Laravel 10+
- PostgreSQL
- JSON Web Token
- API RESTful

###  Frontend (React Native + Expo)

- React Native (via Expo)
- Axios
- React Navigation
- Context API

###  Integrações

- API do Twitter (v2)
- API da Twitch
- OllamaAI - modelo gemma3:12b (para IA do chatbot)

---

##  Estrutura do Projeto

```
app-furia/
├── api/ # Backend Laravel
├── app-furia/ # App mobile em React Native
├── README.md
└── documentacao.md # Documentacao principal
```

---

##  Como Rodar o Projeto

###  Pré-requisitos

- Expo CLI
- PHP 8+
- Composer
- PostgreSQL

###  Backend (Laravel)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate

# Configure o banco de dados no .env

php artisan migrate
php artisan serve
```

### Frontend (React Native)

```bash
cd app-furia
npm install
npx expo start
```

### Licença
- Este projeto é de uso exclusivo para fins de avaliação no processo seletivo da FURIA Esports.

### Autor
- Diogo Santos
- Linkedin: https://www.linkedin.com/in/diogo-santos-985645298/

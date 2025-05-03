
# Documentação do Frontend – App FURIA

Este documento descreve a estrutura, funcionamento e detalhes técnicos da aplicação mobile desenvolvida com **React Native (via Expo)** e **TypeScript**.

---

## Estrutura de Pastas

```
app-furia/
├── src/
│   ├── contexts/              # Contextos globais (ex: AuthContext)
│   ├── pages/                 # Telas principais do app
│   │   ├── Chat/
│   │   ├── Chatbot/
│   │   ├── Explore/
│   │   ├── Livegame/
│   │   ├── Loja/
│   │   ├── Menu/
│   │   ├── Perfil/
│   │   ├── Register/
│   │   ├── Signin/
│   │   └── Welcome/
│   ├── routes/                # Configuração das rotas
│   │   ├── app.routes.tsx
│   │   ├── auth.routes.tsx
│   │   └── index.tsx
│   └── services/              # Comunicação com API
│       └── api.ts
├── App.tsx                    # Componente raiz
├── app.json                   # Configurações do Expo
├── tsconfig.json              # Configuração do TypeScript
```

---

## Routes

Utiliza `React Navigation` com rotas separadas para usuários autenticados e não autenticados.

- `auth.routes.tsx`: telas públicas (login, registro, boas-vindas)
- `app.routes.tsx`: telas autenticadas (explorar, perfil, chatbot, loja etc)
- `index.tsx`: controla a renderização condicional com base no estado de autenticação

---

## Autenticação

Gerenciada via `AuthContext`:

- `src/contexts/AuthContext.tsx`
  - Armazena token JWT
  - Dados do usuário
  - Funções `signIn`, `signOut` e `register`
  - Persistência via `AsyncStorage`

---

## Comunicação com o Backend

- `src/services/api.ts`
  - Configuração do Axios
  - Define baseURL da API Laravel
  - Interceptadores para envio automático de token

---

## Tecnologias e Bibliotecas

- **React Native**
- **Expo**
- **TypeScript**
- **React Navigation**
- **Axios**
- **AsyncStorage**

---

## Integrações Externas

- **Twitter API v2** – Feed com últimos tweets da @FURIA
- **Twitch API** – Streamers da organização em tempo real
- **OllamaAI (gemma3:12b)** – IA no chatbot

---

##  Como Rodar

Pré-requisitos:

- Node.js 18+
- Expo CLI

```bash
cd app-furia
npm install
npx expo start
```

---

## 👨‍💻 Desenvolvedor

- **Diogo Santos**
- [LinkedIn](https://www.linkedin.com/in/diogo-santos-985645298/)

---

## 📄 Licença

Uso exclusivo para o Desafio FURIA – Processo Seletivo.

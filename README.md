# ListFlix

Aplicação responsiva para descobrir filmes, consultar detalhes e manter uma lista pessoal de títulos para assistir. A lista usa uma API própria em Fastify com CRUD em memória.

## Integrantes

- João Pedro de Paula Gomes
- Kaio Dias
- Igor Mazorque

## Tecnologias

- React, TypeScript e Vite
- React Router
- Fastify com `@fastify/cors`
- APIs públicas Studio Ghibli e SampleAPIs para descoberta do catálogo
- `localStorage` apenas para a sessão demonstrativa

## Estrutura do projeto

```text
.
├── backend/
│   └── src/
│       ├── data/
│       ├── routes/
│       └── server.ts
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

A pasta `src` concentra a interface React, enquanto `backend` guarda a API Fastify. A pasta `src/config` centraliza as variáveis de ambiente e as constantes de integração.

## Requisitos

- Node.js 20.19+ (ou 22.12+)
- npm

## Instalação e execução

Na raiz do projeto:

```powershell
npm.cmd install
npm.cmd run dev
```

Para iniciar a API e a interface em paralelo:

```powershell
npm.cmd run dev:all
```

Em um terminal separado, também é possível iniciar apenas a API:

```powershell
npm.cmd run dev:api
```

A API fica em `http://localhost:3001`. Também pode ser configurada por `VITE_API_URL`. O CORS permite origens localhost e uma origem adicional definida em `FRONTEND_ORIGIN`. Verifique o servidor em `GET /health`. O recurso `/movies` oferece `GET /movies`, `GET /movies/:id`, `POST /movies`, `PUT /movies/:id` e `DELETE /movies/:id`. As rotas de filmes recebem o e-mail da sessão demonstrativa no cabeçalho `x-user-email`, para manter listas separadas por conta simulada. Isso não é autenticação real. Os dados ficam em memória e são apagados quando o servidor reinicia.

Para compilar e executar o backend isoladamente:

```powershell
npm.cmd run build:api
npm.cmd run start:api
```

## Acesso demonstrativo

Use qualquer e-mail válido e uma senha com pelo menos quatro caracteres. O login é demonstrativo e não autentica usuários.

## Rotas do frontend

- `/login` — entrada demonstrativa
- `/inicio` — destaques e recomendações
- `/catalogo` — busca, filtros e catálogo público
- `/filme/:id` — detalhes do título
- `/minha-lista` — cadastrar, listar, editar e remover filmes pela API própria

O catálogo público requer conexão com a internet. A lista pessoal requer que o servidor Fastify esteja ativo. Ambas as telas apresentam estados de carregamento e erro.

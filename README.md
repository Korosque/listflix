# ListFlix

FrontEnd responsivo para descobrir filmes, consultar detalhes e montar uma lista pessoal de títulos para assistir.

## Integrantes

- João Pedro de Paula Gomes
- Kaio Dias
- Igor Mazorque

## Objetivo

O ListFlix organiza a experiência de escolher um filme: a pessoa entra com um login demonstrativo, explora o catálogo, pesquisa títulos, consulta detalhes e salva os filmes para assistir depois. A lista e a sessão ficam guardadas no navegador.

## Tecnologias

- React, TypeScript e Vite
- React Router para as rotas
- API pública Studio Ghibli para filmes de animação
- API pública SampleAPIs Movies para as demais categorias do catálogo
- MetaHub como alternativa de pôster para filmes identificados pelo IMDb
- `localStorage` para a sessão demonstrativa e a lista pessoal

## Requisitos

- Node.js 20.19 ou superior (ou 22.12 ou superior)
- npm

## Instalação e execução

```bash
npm install
npm run dev
```

Abra no navegador o endereço mostrado pelo Vite (normalmente `http://localhost:5173`). Para gerar a versão de produção, use `npm run build`; para pré-visualizá-la, use `npm run preview`.

## Acesso demonstrativo

Use qualquer e-mail válido e uma senha de pelo menos quatro caracteres. Não existe autenticação real nem backend nesta etapa.

## Rotas

- `/login` — entrada demonstrativa
- `/inicio` — destaques e recomendações
- `/catalogo` — busca, filtros e catálogo carregado pela API
- `/filme/:id` — detalhes do título
- `/minha-lista` — filmes salvos no navegador

O catálogo depende de conexão com a internet. A tela informa quando está carregando e oferece uma nova tentativa se ocorrer erro.

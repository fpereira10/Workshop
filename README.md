# Bounce

Do loop à faixa pronta. App mobile-first para produtores de música eletrônica acompanharem as faixas da ideia ao master, com visão desktop.

## Rodar

Requer Node 20 ou superior.

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave publishable do seu projeto Supabase
npm run dev
```

Abre em http://localhost:5173. Reinicie o servidor sempre que mudar o `.env.local`.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v4 (tokens `--bn-*`) · Supabase (Auth, Postgres, Storage) · Storybook 10.

## Estrutura

- `src/lib` – tipos, energias (gradientes + tom claro/escuro), status, datas, mocks, camada de dados (`repo.ts`, `remoteRepo.ts`) e cliente Supabase
- `src/state` – auth, store (faixas, ideias, navegação por views + folhas), player e gravador
- `src/screens` – Login, Hoje, Faixas, Detalhe da faixa
- `src/sheets` – Captura (memo/nota), Nova/Editar faixa, Mudar status, Energia, Menu, Conta
- `src/components` – UI de vidro, pipeline, semana, waveform, sheet, barras
- `supabase/migrations` – schema do banco
- `docs` – tokens de design (Markdown e JSON para o Figma)

## Breakpoints

- `< 800px` celular: nav de vidro embaixo
- `≥ 800px` tablet: mesma home, mais larga, nav no topo
- `≥ 1100px` desktop: duas colunas (faixa em foco + semana/outras)

## Dados e login (Supabase)

- Login e dados reais no Supabase: Auth por e-mail e senha, tabelas com RLS e áudio dos memos no Storage (bucket privado `memos`).
- Variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em `.env.local` (modelo em `.env.example`, que é o único arquivo `.env` versionado).
- Camada de dados: `src/lib/repo.ts` (interface), `remoteRepo.ts` (Supabase) e `memoryRepo` (Storybook, não persiste).
- O schema está em `supabase/migrations/`, reconstruído do catálogo do banco. Serve para recriar o schema em um projeto novo; não reaplique em um banco que já tenha as tabelas.
- Só a chave **publishable** vai para o navegador, e a segurança vem do RLS. Nunca coloque a `service_role` no app.

## Design system e Storybook

```bash
npm run storybook        # catálogo em http://localhost:6006
npm run tokens           # regera src/styles/tokens.css
npm run build-storybook  # versão estática para publicar
```

- Tokens: `docs/design-tokens.md` (documentação) e `docs/figma-import/*.json` (fonte única, importável no Figma via Tokens Studio).
- `src/styles/tokens.css` é **gerado** dos mesmos JSON: primitivos como `--bn-<nome>`, semânticos como aliases em kebab-case.
- Stories: `src/components/*.stories.tsx`, `src/sheets/Sheets.stories.tsx` e `src/stories/Tokens.stories.tsx`.
- A energia (fundo e tom claro/escuro) troca na barra de ferramentas do Storybook.

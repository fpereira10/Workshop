# Bounce · Design Tokens

Duas coleções, nomes em **kebab-case**.

1. **Primitivos** (`primitive/*`): valores brutos, sem significado de uso. Nunca usados direto em componentes.
2. **Semânticos** (`semantic/*`): aliases que apontam para primitivos e dizem *para que* serve o valor. Componentes só usam estes.

Convenção de nome: `categoria-propriedade-variante-estado`. Exemplo: `color-text-secondary`, `space-card-padding`.

> Fonte dos valores: `bounce/src/index.css`, `src/lib/energies.ts`, `src/lib/status.ts` e as classes dos componentes.
> Pendente: criar as variáveis no Figma (falta o link do arquivo e uma ferramenta de escrita).

---

## 1. Tokens primitivos

### 1.1 Cor

**Neutros**

| Token | Valor |
|---|---|
| `color-white` | `#FFFFFF` |
| `color-black` | `#000000` |
| `color-neutral-950` | `#0D0F10` |
| `color-neutral-900` | `#111111` |

**Sand (areia)**

| Token | Valor |
|---|---|
| `color-sand-50` | `#F4EDE4` |
| `color-sand-100` | `#F7EBD3` |
| `color-sand-200` | `#F5E6CC` |
| `color-sand-300` | `#E8D9C9` |

**Slate (azul-acinzentado)**

| Token | Valor |
|---|---|
| `color-slate-950` | `#1B2330` |
| `color-slate-900` | `#1F2830` |
| `color-slate-700` | `#3B4A5C` |
| `color-slate-600` | `#4A586B` |
| `color-slate-500` | `#6F8799` |
| `color-slate-400` | `#8FA3B3` |
| `color-slate-300` | `#8E9AAF` |
| `color-slate-200` | `#9AA8BF` |
| `color-slate-100` | `#C8CCCA` |

**Indigo**

| Token | Valor |
|---|---|
| `color-indigo-950` | `#1A1630` |
| `color-indigo-900` | `#1E2A4A` |
| `color-indigo-800` | `#2A2850` |

**Violet**

| Token | Valor |
|---|---|
| `color-violet-700` | `#6A4C93` |
| `color-violet-300` | `#B79BE6` |

**Ember (brasa)**

| Token | Valor |
|---|---|
| `color-ember-950` | `#2A0E08` |
| `color-ember-900` | `#3A0D0D` |
| `color-ember-800` | `#4A1610` |
| `color-ember-500` | `#D9542B` |

**Amber (âmbar)**

| Token | Valor |
|---|---|
| `color-amber-950` | `#2B2113` |
| `color-amber-400` | `#F2C46D` |
| `color-amber-500` | `#E8A93C` |
| `color-amber-200` | `#F3DDAE` |

**Mint (menta)**

| Token | Valor |
|---|---|
| `color-mint-700` | `#2F7D4C` |
| `color-mint-200` | `#B8F2C9` |

### 1.2 Opacidade

Usada para vidro, texto secundário e pontos do pipeline. Valor em %.

`opacity-0` 0 · `opacity-10` 10 · `opacity-12` 12 · `opacity-14` 14 · `opacity-16` 16 · `opacity-18` 18 · `opacity-20` 20 · `opacity-22` 22 · `opacity-25` 25 · `opacity-30` 30 · `opacity-35` 35 · `opacity-38` 38 · `opacity-45` 45 · `opacity-50` 50 · `opacity-55` 55 · `opacity-60` 60 · `opacity-65` 65 · `opacity-70` 70 · `opacity-72` 72 · `opacity-75` 75 · `opacity-80` 80 · `opacity-85` 85 · `opacity-90` 90 · `opacity-95` 95 · `opacity-100` 100

### 1.3 Tipografia

**Família**

| Token | Valor |
|---|---|
| `font-family-sans` | `Inter, -apple-system, SF Pro Text, system-ui, sans-serif` |
| `font-family-mono` | `JetBrains Mono, IBM Plex Mono, ui-monospace, monospace` |

**Peso**

| Token | Valor |
|---|---|
| `font-weight-regular` | 400 |
| `font-weight-medium` | 500 |
| `font-weight-semibold` | 600 |

**Tamanho (px)**

| Token | Valor | Token | Valor |
|---|---|---|---|
| `font-size-10` | 10 | `font-size-24` | 24 |
| `font-size-11` | 11 | `font-size-28` | 28 |
| `font-size-12` | 12 | `font-size-32` | 32 |
| `font-size-13` | 13 | `font-size-40` | 40 |
| `font-size-14` | 14 | `font-size-44` | 44 |
| `font-size-15` | 15 | `font-size-46` | 46 |
| `font-size-16` | 16 | `font-size-56` | 56 |
| `font-size-17` | 17 | `font-size-64` | 64 |
| `font-size-18` | 18 | `font-size-72` | 72 |
| `font-size-19` | 19 | `font-size-84` | 84 |
| `font-size-20` | 20 | | |
| `font-size-22` | 22 | | |

**Altura de linha (px)**

`line-height-14` 14 · `line-height-16` 16 · `line-height-20` 20 · `line-height-24` 24 · `line-height-26` 26 · `line-height-30` 30 · `line-height-32` 32 · `line-height-36` 36 · `line-height-40` 40 · `line-height-48` 48

**Altura de linha relativa**

`line-height-ratio-tight` 0.95 · `line-height-ratio-snug` 1.02 · `line-height-ratio-normal` 1.5

**Espaçamento entre letras (em)**

| Token | Valor |
|---|---|
| `letter-spacing-tighter` | -0.03em |
| `letter-spacing-tight` | -0.02em |
| `letter-spacing-snug` | -0.01em |
| `letter-spacing-normal` | 0 |
| `letter-spacing-wide` | 0.08em |
| `letter-spacing-wider` | 0.11em |

### 1.4 Espaçamento (gap, padding, margin)

Base de 4px.

| Token | px | Token | px |
|---|---|---|---|
| `space-0` | 0 | `space-7` | 28 |
| `space-0-5` | 2 | `space-8` | 32 |
| `space-1` | 4 | `space-10` | 40 |
| `space-1-5` | 6 | `space-12` | 48 |
| `space-2` | 8 | `space-14` | 56 |
| `space-2-5` | 10 | `space-16` | 64 |
| `space-3` | 12 | `space-20` | 80 |
| `space-3-5` | 14 | `space-24` | 96 |
| `space-4` | 16 | `space-28` | 112 |
| `space-5` | 20 | `space-32` | 128 |
| `space-6` | 24 | | |

**Espaçamento negativo** (margens que sangram para fora do container)

| Token | px |
|---|---|
| `space-neg-0-5` | -2 |
| `space-neg-1` | -4 |
| `space-neg-2` | -8 |
| `space-neg-3` | -12 |
| `space-neg-4` | -16 |
| `space-neg-6` | -24 |

### 1.5 Dimensões

Tamanhos fixos de controles e ícones (px).

`size-8` 8 · `size-12` 12 · `size-16` 16 · `size-18` 18 · `size-20` 20 · `size-24` 24 · `size-28` 28 · `size-32` 32 · `size-36` 36 · `size-40` 40 · `size-44` 44 · `size-48` 48 · `size-52` 52 · `size-56` 56 · `size-58` 58 · `size-64` 64 · `size-88` 88 · `size-96` 96

**Larguras máximas de conteúdo**

`container-sm` 480 · `container-md` 560 · `container-lg` 1240 · `container-xl` 1360

### 1.6 Raio de borda (px)

`radius-0` 0 · `radius-4` 4 · `radius-8` 8 · `radius-12` 12 · `radius-16` 16 · `radius-20` 20 · `radius-22` 22 · `radius-24` 24 · `radius-28` 28 · `radius-32` 32 · `radius-full` 999

### 1.7 Contorno (stroke)

| Token | px |
|---|---|
| `stroke-width-0` | 0 |
| `stroke-width-1` | 1 |
| `stroke-width-1-5` | 1.5 |
| `stroke-width-2` | 2 |
| `stroke-width-4` | 4 |

### 1.8 Desfoque

| Token | px |
|---|---|
| `blur-24` | 24 |
| `blur-36` | 36 |
| `blur-60` | 60 (manchas de luz do fundo) |

### 1.9 Sombra

| Token | Valor |
|---|---|
| `shadow-sm` | `0 8px 32px rgba(0,0,0,.18)` |
| `shadow-md` | `0 10px 40px rgba(0,0,0,.20)` |

### 1.10 Movimento

**Duração (ms)**

`duration-200` 200 · `duration-220` 220 · `duration-240` 240 · `duration-280` 280 · `duration-340` 340 · `duration-380` 380 · `duration-700` 700 · `duration-1400` 1400

**Curvas**

| Token | Valor |
|---|---|
| `ease-standard` | `ease` |
| `ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `ease-in-fast` | `cubic-bezier(0.4, 0, 1, 1)` |

### 1.11 Camadas (z-index)

`z-0` 0 · `z-10` 10 · `z-20` 20 · `z-30` 30 · `z-40` 40 · `z-50` 50 · `z-behind` -10

### 1.12 Breakpoints (px)

| Token | Valor |
|---|---|
| `breakpoint-md` | 800 |
| `breakpoint-lg` | 1100 |

### 1.13 Ângulo

`angle-energy` 160deg · `angle-scrim` 180deg

---

## 2. Tokens semânticos

Cada linha é um alias: `token-semantico` → `token-primitivo`.

### 2.1 Energias da faixa

Cada energia tem gradiente (de → para), tom e tinta. Cor sempre a 160deg, do primeiro para o segundo.

| Energia | `-from` | `-to` | `-tone` | `-ink` | `-ink-inverse` | `-dot` | `-pipe` | `-scrim` |
|---|---|---|---|---|---|---|---|---|
| calma | `color-slate-400` | `color-sand-300` | light | `color-slate-900` | `color-sand-50` | `color-slate-500` | `color-slate-100` | `color-slate-500` @ 16% |
| melancolica | `color-slate-700` | `color-slate-300` | dark | `color-white` | `color-slate-950` | `color-slate-200` | `color-slate-600` | `color-black` @ 45% |
| hipnotica | `color-indigo-900` | `color-violet-700` | dark | `color-white` | `color-indigo-950` | `color-violet-300` | `color-indigo-800` | `color-black` @ 45% |
| intensa | `color-ember-900` | `color-ember-500` | dark | `color-white` | `color-ember-950` | `color-ember-500` | `color-ember-800` | `color-black` @ 45% |
| solar | `color-amber-400` | `color-sand-200` | light | `color-amber-950` | `color-sand-100` | `color-amber-500` | `color-amber-200` | `color-amber-500` @ 18% |

Nomes finais: `energy-hipnotica-from`, `energy-hipnotica-to`, `energy-hipnotica-ink`, e assim por diante.

### 2.2 Cor: superfície e texto

Os valores mudam por **tom da energia** (modo `dark` ou `light`). Em Figma: uma coleção com dois modos.

| Token semântico | Modo `dark` | Modo `light` |
|---|---|---|
| `color-bg-fallback` | `color-neutral-950` | `color-neutral-950` |
| `color-text-primary` | `energy-*-ink` (branco) | `energy-*-ink` (tinta escura) |
| `color-text-secondary` | `color-text-primary` @ `opacity-72` | `color-text-primary` @ `opacity-72` |
| `color-text-muted` | `color-text-primary` @ `opacity-50` | `color-text-primary` @ `opacity-50` |
| `color-text-inverse` | `energy-*-ink-inverse` | `energy-*-ink-inverse` |
| `color-glass-soft` | `color-white` @ `opacity-10` | `color-white` @ `opacity-30` |
| `color-glass` | `color-white` @ `opacity-14` | `color-white` @ `opacity-38` |
| `color-glass-strong` | `color-white` @ `opacity-22` | `color-white` @ `opacity-55` |
| `color-glass-soft-border` | `color-white` @ `opacity-16` | `color-white` @ `opacity-55` |
| `color-glass-border` | `color-white` @ `opacity-20` | `color-white` @ `opacity-65` |
| `color-glass-strong-border` | `color-white` @ `opacity-18` | `color-white` @ `opacity-75` |
| `color-sheet` | `color-black` @ `opacity-50` (16,14,24) | `color-sand-50` @ `opacity-65` |
| `color-overlay` | `color-black` @ `opacity-38` | `color-amber-950` @ `opacity-22` |
| `color-cta-bg` | `color-sand-50` | `color-text-primary` |
| `color-cta-text` | `color-neutral-900` | `color-sand-50` |
| `color-status-ready` | `color-mint-200` | `color-mint-700` |
| `color-record` | `color-ember-500` | `color-ember-500` |
| `color-focus-ring` | `color-text-primary` | `color-text-primary` |

### 2.3 Status (pipeline)

Pontos brancos em opacidade crescente; Pronta usa o verde.

| Token | Alias |
|---|---|
| `status-ideia-opacity` | `opacity-35` |
| `status-arranjo-opacity` | `opacity-55` |
| `status-mix-opacity` | `opacity-75` |
| `status-master-opacity` | `opacity-95` |
| `status-pronta-color` | `color-status-ready` |
| `pipeline-bar-active` | `color-text-primary` @ `opacity-95` |
| `pipeline-bar-inactive` | `color-text-primary` @ `opacity-25` |
| `pipeline-track-height` | `space-1` |

### 2.4 Tipografia por papel

| Token | Família | Tamanho | Peso | Linha | Letter spacing |
|---|---|---|---|---|---|
| `text-display-track-name` | sans | `font-size-84` (desktop) / `font-size-46` (celular) | semibold | `line-height-ratio-tight` | `letter-spacing-tighter` |
| `text-heading-screen` | sans | `font-size-28` | semibold | `line-height-36` | `letter-spacing-snug` |
| `text-heading-greeting` | sans | `font-size-24` | semibold | `line-height-32` | `letter-spacing-snug` |
| `text-heading-sheet` | sans | `font-size-22` | semibold | auto | `letter-spacing-snug` |
| `text-body-next-step` | sans | `font-size-19` | medium | `line-height-26` | `letter-spacing-normal` |
| `text-body-default` | sans | `font-size-15` | regular | `line-height-24` | `letter-spacing-normal` |
| `text-body-strong` | sans | `font-size-15` | medium | `line-height-24` | `letter-spacing-normal` |
| `text-label` | sans | `font-size-13` | medium | `line-height-20` | `letter-spacing-normal` |
| `text-caption` | sans | `font-size-12` | regular | `line-height-16` | `letter-spacing-normal` |
| `text-button` | sans | `font-size-15` | semibold | auto | `letter-spacing-normal` |
| `text-kicker` | mono | `font-size-11` | medium | `line-height-14` | `letter-spacing-wider`, caixa alta |
| `text-tech-label` | mono | `font-size-12` | semibold | auto | `letter-spacing-wide` |

### 2.5 Espaçamento por papel

| Token | Alias |
|---|---|
| `space-screen-gutter` | `space-6` (24) |
| `space-screen-gutter-desktop` | `space-14` (56) |
| `space-card-padding` | `space-6` (24) |
| `space-card-padding-lg` | `space-7` (28) |
| `space-sheet-padding-x` | `space-6` |
| `space-stack-sm` | `space-2` |
| `space-stack-md` | `space-4` |
| `space-stack-lg` | `space-8` |
| `space-gap-chip` | `space-2` |
| `space-gap-list-item` | `space-3` |
| `space-bleed-screen` | `space-neg-6` (carrosséis que sangram até a borda) |
| `space-bleed-text` | `space-neg-0-5` (alinha o título grande à margem óptica) |

### 2.6 Dimensões por papel

| Token | Alias |
|---|---|
| `size-touch-min` | `size-44` (alvo mínimo de toque) |
| `size-icon-button` | `size-40` |
| `size-icon-button-lg` | `size-52` |
| `size-nav-height` | `size-58` |
| `size-nav-width` | 200 |
| `size-button-large` | `size-58` |
| `size-field-height` | `size-56` |
| `size-chip-height` | `size-40` |
| `size-chip-height-lg` | `size-44` |
| `size-track-thumb` | `size-52` |
| `size-record-button` | `size-88` |
| `size-week-pill-width` | `size-36` |
| `size-week-pill-height` | `size-48` |
| `size-content-mobile` | `container-md` |
| `size-content-desktop` | `container-xl` |

### 2.7 Raio por papel

| Token | Alias |
|---|---|
| `radius-card` | `radius-28` |
| `radius-sheet` | `radius-32` |
| `radius-button` | `radius-full` |
| `radius-chip` | `radius-full` |
| `radius-field` | `radius-20` |
| `radius-idea-row` | `radius-24` |
| `radius-thumb` | `radius-16` |

### 2.8 Contorno por papel

| Token | Alias |
|---|---|
| `stroke-glass` | `stroke-width-1` |
| `stroke-today` | `stroke-width-1-5` |
| `stroke-pipeline-line` | `stroke-width-2` |
| `stroke-focus-ring` | `stroke-width-2` |

### 2.9 Efeitos

| Token | Alias |
|---|---|
| `blur-glass` | `blur-24` |
| `blur-sheet` | `blur-36` (+ saturação 140%) |
| `blur-background-blob` | `blur-60` |
| `shadow-toast` | `shadow-sm` |
| `shadow-record-button` | `shadow-md` |

### 2.10 Movimento por papel

| Token | Alias |
|---|---|
| `motion-background-crossfade` | `duration-700` + `ease-standard` |
| `motion-sheet-in` | `duration-340` + `ease-out-soft` |
| `motion-sheet-out` | `duration-220` + `ease-in-fast` |
| `motion-view-in` | `duration-380` + `ease-out-soft` |
| `motion-toast-in` | `duration-280` + `ease-out-soft` |
| `motion-fade` | `duration-240` + `ease-standard` |
| `motion-record-pulse` | `duration-1400` + `ease-out-soft` |

Respeitar `prefers-reduced-motion`: todas as durações caem para 1ms.

### 2.11 Camadas por papel

| Token | Alias |
|---|---|
| `layer-background` | `z-behind` |
| `layer-header` | `z-20` |
| `layer-bottom-bar` | `z-30` |
| `layer-sheet` | `z-40` |
| `layer-toast` | `z-50` |

### 2.12 Layout responsivo

| Token | Alias | Comportamento |
|---|---|---|
| `layout-mobile` | `< breakpoint-md` | Nav de vidro embaixo, folhas sobem de baixo |
| `layout-tablet` | `breakpoint-md` a `breakpoint-lg` | Mesma home mais larga, nav no topo, folhas viram modal |
| `layout-desktop` | `>= breakpoint-lg` | Duas colunas |

### 2.13 Fundo e scrim

| Token | Valor |
|---|---|
| `background-energy-gradient` | `linear-gradient(angle-energy, energy-*-from, energy-*-to)` |
| `background-scrim` | `linear-gradient(angle-scrim, transparent 40%, energy-*-scrim 100%)` |
| `background-blob-count` | 3 manchas por energia (cores em `energy-*-blobs`) |

---

## 3. Importar no Figma (sem Dev Mode)

Os 4 sets em `docs/figma-import/` (`primitive`, `semantic-base`, `semantic-dark`, `semantic-light`) seguem o formato do plugin gratuito Tokens Studio.

1. No Figma, abra o arquivo e rode o plugin **Tokens Studio for Figma**.
2. Em cada set, abra a visão JSON (`{ }`) e cole o conteúdo do arquivo correspondente.
3. Deixe ativos `primitive`, `semantic-base` e `semantic-dark`.
4. Plugin: **Styles & Variables → Export to Figma → Variables**.

Limites conhecidos:
- Cores com transparência (`rgba({color-white}, 0.14)`) viram valor resolvido no Figma, sem alias.
- `color-text-primary` no modo `light` usa o tom de Solar. Calma usa `color-slate-900`; troque por energia no componente.
- Sombras viram *effect styles*, não variáveis.

## 4. Mapa para o código

Os mesmos 4 JSON geram `src/styles/tokens.css` com `npm run tokens`: cada primitivo vira `--bn-<nome>` e cada semântico vira um alias `var(--bn-<primitivo>)`. O Tailwind v4 lê as variáveis em `src/index.css`.

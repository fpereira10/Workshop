import type { CSSProperties } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import { ENERGIES, ENERGY_ORDER, energyBackground, energyScrim } from '../src/lib/energies';
import { createMockData } from '../src/lib/mocks';
import type { EnergyId } from '../src/lib/types';
import { memoryRepo } from '../src/lib/repo';
import { PlayerProvider } from '../src/state/player';
import { StoreProvider } from '../src/state/store';

/** As stories usam os mocks do app, em memória: nada vai para o Supabase. */
let route = '';
function setRoute(next: string) {
  if (route === next) return;
  route = next;
  try {
    window.history.replaceState(null, '', next);
  } catch {
    /* ignora */
  }
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    options: { storySort: { order: ['Fundamentos', 'Componentes', 'Folhas'] } },
  },
  globalTypes: {
    energy: {
      description: 'Energia da faixa (fundo e tom)',
      defaultValue: 'hipnotica',
      toolbar: {
        title: 'Energia',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: ENERGY_ORDER.map((id) => ({ value: id, title: ENERGIES[id].name })),
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const id = ctx.globals.energy as EnergyId;
      const e = ENERGIES[id];
      setRoute((ctx.parameters.route as string | undefined) ?? '#/');
      const vars = { '--bn-ink': e.ink, '--bn-ink-inverse': e.inverse, '--bn-pipe': e.pipe } as CSSProperties;
      // No canvas o fundo preenche a tela; na documentação, só o tamanho do conteúdo
      const height = ctx.viewMode === 'story' ? window.innerHeight : (ctx.parameters.frameHeight as number | undefined) ?? 0;
      return (
        <div data-tone={e.tone} style={{ ...vars, minHeight: height || undefined }} className="tone-root relative isolate overflow-hidden font-sans text-ink">
          <div aria-hidden className="absolute inset-0 -z-10" style={energyBackground(id)} />
          <div aria-hidden className="absolute inset-0 -z-10" style={energyScrim(id)} />
          <StoreProvider key={ctx.id} repo={memoryRepo()} initial={createMockData()}>
            <PlayerProvider>
              <div className="p-6">
                <Story />
              </div>
            </PlayerProvider>
          </StoreProvider>
        </div>
      );
    },
  ],
};

export default preview;

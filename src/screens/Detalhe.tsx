import { ENERGIES } from '../lib/energies';
import type { Track } from '../lib/types';
import { useStore } from '../state/store';
import { ChevronDown, ChevronLeft, Dots } from '../components/Icons';
import { IdeaRow } from '../components/IdeaRow';
import { NextStepEditable } from '../components/NextStepCard';
import { CaptureButton, EnergyDot, GlassButton, IconButton, Kicker, PipelineDots } from '../components/ui';

function Ideas({ track }: { track: Track }) {
  const { data, openSheet } = useStore();
  const ideas = data.ideas.filter((i) => i.trackId === track.id).sort((a, b) => b.createdAt - a.createdAt);
  return (
    <section>
      <Kicker>Ideias desta faixa · {ideas.length}</Kicker>
      {ideas.length ? (
        <div className="mt-3.5 flex flex-col gap-3">
          {ideas.map((i) => (
            <IdeaRow key={i.id} idea={i} />
          ))}
        </div>
      ) : (
        <button
          onClick={() => openSheet({ type: 'captura', trackId: track.id })}
          className="glass-soft mt-3.5 w-full rounded-[24px] p-5 text-left text-[14px] leading-5 text-ink/75 hover:bg-ink/15"
        >
          Nenhuma ideia ainda. Grave um memo ou escreva uma nota para {track.name}.
        </button>
      )}
    </section>
  );
}

export function Detalhe({ track }: { track: Track }) {
  const { back, openSheet } = useStore();
  const energy = ENERGIES[track.energy];

  return (
    <div className="mx-auto max-w-[560px] px-6 pb-[128px] pt-[calc(env(safe-area-inset-top)+16px)] md:pt-8 lg:max-w-[1360px] lg:px-14 lg:pb-16">
      <div className="flex items-center justify-between">
        <IconButton label="Voltar" onClick={back}>
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton label="Mais opções" onClick={() => openSheet({ type: 'menu', trackId: track.id })}>
          <Dots size={20} />
        </IconButton>
      </div>

      <div className="lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-20">
        <div>
          <header className="mt-[54px] lg:mt-0">
            <h1 className="-ml-0.5 text-[44px] font-semibold leading-[.95] tracking-[-0.03em] text-balance lg:text-[84px]">{track.name}</h1>
            <Kicker strong className="mt-3.5">
              {track.bpm} BPM · {track.key}
            </Kicker>
            <button
              onClick={() => openSheet({ type: 'energia', trackId: track.id })}
              aria-label={`Energia: ${energy.name}. Mudar energia`}
              className="glass mt-4 flex h-[34px] items-center gap-2 rounded-full pl-3 pr-2.5 text-[13px] font-medium transition hover:bg-ink/20"
            >
              <EnergyDot energy={track.energy} className="size-3" />
              {energy.name}
              <ChevronDown size={16} className="text-ink/80" />
            </button>
          </header>

          <PipelineDots status={track.status} onClick={() => openSheet({ type: 'status', trackId: track.id })} className="mt-10 lg:max-w-[600px]" />

          <NextStepEditable track={track} className="mt-7 lg:max-w-[600px]" />

          <div className="mt-8 hidden gap-2 lg:flex">
            <GlassButton onClick={() => openSheet({ type: 'status', trackId: track.id })} className="h-[54px] px-6 text-[14px]">
              Mudar status
            </GlassButton>
            <CaptureButton label="Capturar ideia aqui" trackId={track.id} className="h-[54px]" />
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <Ideas track={track} />
        </div>
      </div>

      {/* Ações fixas no celular/tablet */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-6 pb-[max(env(safe-area-inset-bottom),24px)] lg:hidden">
        <div className="pointer-events-auto mx-auto flex max-w-[560px] gap-2">
          <GlassButton onClick={() => openSheet({ type: 'status', trackId: track.id })} className="h-[54px] w-[146px] shrink-0 text-[14px]">
            Mudar status
          </GlassButton>
          <CaptureButton label="Capturar ideia" trackId={track.id} className="h-[54px] flex-1 px-4" />
        </div>
      </div>
    </div>
  );
}

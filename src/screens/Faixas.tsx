import { useState } from 'react';
import { STATUS_META, STATUS_ORDER } from '../lib/status';
import type { Status, Track } from '../lib/types';
import { COOLING_DAYS, daysAgo, relTrack } from '../lib/time';
import { cx } from '../lib/utils';
import { useStore } from '../state/store';
import { Plus } from '../components/Icons';
import { IdeaRow } from '../components/IdeaRow';
import { EnergyThumb, IconButton, Kicker, StatusDot } from '../components/ui';

type Filter = 'todas' | Status;

export const isCooling = (t: Track) => t.status !== 'pronta' && daysAgo(t.updatedAt) > COOLING_DAYS;

function TrackRow({ track }: { track: Track }) {
  const { navigate } = useStore();
  const cooling = isCooling(track);
  return (
    <button
      onClick={() => navigate({ name: 'faixa', id: track.id })}
      className="glass-soft flex w-full items-center gap-3.5 rounded-[24px] p-3 pr-4 text-left transition hover:bg-ink/15 active:scale-[.99]"
    >
      <EnergyThumb energy={track.energy} className="size-[52px] rounded-[18px] border border-ink/15" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-medium">{track.name}</span>
        <span className="kicker-strong mt-1.5 block truncate">
          {track.bpm} BPM · {track.key}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="flex items-center gap-1.5 text-[13px]">
          <StatusDot status={track.status} />
          {STATUS_META[track.status].label}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-ink/60">
          {cooling && <span className="rounded-full border border-ink/30 px-1.5 py-px font-mono text-[10px] uppercase tracking-[.08em] text-ink/70">esfriando</span>}
          {relTrack(track.updatedAt)}
        </span>
      </span>
    </button>
  );
}

export function Faixas() {
  const { data, openSheet } = useStore();
  const [filter, setFilter] = useState<Filter>('todas');

  const sorted = [...data.tracks].sort((a, b) => b.updatedAt - a.updatedAt);
  const list = filter === 'todas' ? sorted : sorted.filter((t) => t.status === filter);
  const active = data.tracks.filter((t) => t.status !== 'pronta').length;
  const loose = data.ideas.filter((i) => !i.trackId).sort((a, b) => b.createdAt - a.createdAt);

  const filters: { id: Filter; label: string }[] = [{ id: 'todas', label: 'Todas' }, ...STATUS_ORDER.map((s) => ({ id: s, label: STATUS_META[s].label }))];

  return (
    <div className="mx-auto max-w-[560px] px-6 pb-[128px] pt-[calc(env(safe-area-inset-top)+28px)] md:pb-16 md:pt-10 lg:max-w-[1360px] lg:px-14">
      <header className="flex items-end justify-between gap-4">
        <div>
          <Kicker>
            {data.tracks.length} faixas · {active} em andamento
          </Kicker>
          <h1 className="mt-2 text-[28px] font-semibold leading-9 tracking-[-0.01em] lg:text-[40px] lg:leading-[48px]">Faixas</h1>
        </div>
        <IconButton label="Nova faixa" onClick={() => openSheet({ type: 'faixa-form' })} className="size-11 lg:size-[52px]">
          <Plus size={20} />
        </IconButton>
      </header>

      <div role="tablist" aria-label="Filtrar por status" className="no-scrollbar -mx-6 mt-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:px-0">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cx(
              'h-10 shrink-0 rounded-full px-4 text-[14px] transition',
              filter === f.id ? 'bg-ink/90 font-semibold text-ink-inverse' : 'glass-soft font-medium text-ink/80 hover:text-ink',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="mt-5 grid gap-2.5 lg:grid-cols-2 lg:gap-3">
          {list.map((t) => (
            <TrackRow key={t.id} track={t} />
          ))}
        </div>
      ) : (
        <div className="glass-soft mt-5 rounded-card p-6 text-[15px] text-ink/75">
          {data.tracks.length === 0 ? 'Nenhuma faixa ainda. Toque em + para começar.' : `Nenhuma faixa em ${STATUS_META[filter as Status].label} por enquanto.`}
        </div>
      )}

      {loose.length > 0 && (
        <section className="mt-10">
          <Kicker>Ideias soltas · {loose.length}</Kicker>
          <div className="mt-3.5 grid gap-2.5 lg:grid-cols-2 lg:gap-3">
            {loose.map((i) => (
              <IdeaRow key={i.id} idea={i} loose />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

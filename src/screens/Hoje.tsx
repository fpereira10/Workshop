import { ENERGIES } from '../lib/energies';
import { STATUS_META } from '../lib/status';
import type { Track } from '../lib/types';
import { greeting, relTrack, todayKicker } from '../lib/time';
import { cx } from '../lib/utils';
import { useStore } from '../state/store';
import { ChevronRight } from '../components/Icons';
import { NextStepLink } from '../components/NextStepCard';
import { Avatar, CaptureButton, EnergyDot, Kicker, PipelineBars, Week, statusLine } from '../components/ui';

function Greeting({ big }: { big?: boolean }) {
  const { data } = useStore();
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <Kicker>{todayKicker()}</Kicker>
        <h1 className={cx('mt-2 font-semibold tracking-[-0.01em]', big ? 'text-[32px] leading-10' : 'text-[24px] leading-8')}>
          {greeting()}, {data.user.name}
        </h1>
      </div>
      <Avatar className="md:hidden" />
    </header>
  );
}

function Focus({ track, big }: { track: Track; big?: boolean }) {
  const { navigate, data } = useStore();
  const pinned = data.pinnedId === track.id;
  return (
    <section aria-label="Faixa em foco">
      <Kicker>{pinned ? 'Em foco · fixada' : 'Em foco'}</Kicker>
      <button onClick={() => navigate({ name: 'faixa', id: track.id })} className="mt-4 block text-left">
        <h2 className={cx('-ml-0.5 font-semibold leading-[.95] tracking-[-0.03em] text-balance', big ? 'text-[84px]' : 'text-[46px]')}>{track.name}</h2>
      </button>
      <Kicker strong className="mt-3.5">
        {track.bpm} BPM · {track.key} · {ENERGIES[track.energy].name}
      </Kicker>
      <PipelineBars status={track.status} className={cx('mt-5', big && 'max-w-[560px]')} />
      <p className="mt-3 text-[13px] text-ink/70">{statusLine(track.status)}</p>
    </section>
  );
}

function OthersChips({ tracks }: { tracks: Track[] }) {
  const { navigate } = useStore();
  return (
    <section className="mt-8">
      <Kicker>Outras em andamento</Kicker>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate({ name: 'faixa', id: t.id })}
            className="glass-soft flex h-11 items-center gap-2.5 rounded-full pl-3 pr-4 text-[14px] transition hover:bg-ink/15"
          >
            <EnergyDot energy={t.energy} />
            {t.name} · {STATUS_META[t.status].label}
          </button>
        ))}
      </div>
    </section>
  );
}

function OthersList({ tracks }: { tracks: Track[] }) {
  const { navigate } = useStore();
  return (
    <section className="glass rounded-card p-3">
      <Kicker className="px-3 pb-2 pt-3">Outras em andamento</Kicker>
      <ul>
        {tracks.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => navigate({ name: 'faixa', id: t.id })}
              className="group flex w-full items-center gap-3.5 rounded-[20px] px-3 py-3 text-left transition hover:bg-ink/10"
            >
              <EnergyDot energy={t.energy} className="size-[22px]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{t.name}</span>
                <span className="block text-[12px] text-ink/65">
                  {STATUS_META[t.status].label} · {relTrack(t.updatedAt)}
                </span>
              </span>
              <ChevronRight size={18} className="text-ink/60 transition group-hover:translate-x-0.5 group-hover:text-ink" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Empty() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[560px] flex-col px-6 pb-[132px] pt-[calc(env(safe-area-inset-top)+28px)] md:min-h-[calc(100dvh-92px)] md:pb-16 md:pt-8 lg:max-w-[1240px] lg:px-14">
      <Greeting />
      <div className="flex-1" />
      <Kicker>Primeiro passo</Kicker>
      <h2 className="mt-4 max-w-[640px] text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] lg:text-[72px]">Sua primeira ideia começa aqui</h2>
      <p className="mt-4 max-w-[440px] text-[15px] leading-6 text-ink/70">Grave um memo ou escreva uma nota. A faixa nasce depois, no seu tempo.</p>
      <CaptureButton className="mt-8 w-fit" />
    </div>
  );
}

export function Hoje() {
  const { data, focus } = useStore();
  if (!focus) return <Empty />;

  const others = data.tracks
    .filter((t) => t.id !== focus.id && t.status !== 'pronta')
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  return (
    <>
      {/* Celular + tablet: mesma home, mais larga */}
      <div className="mx-auto flex min-h-dvh max-w-[560px] flex-col px-6 pb-[128px] pt-[calc(env(safe-area-inset-top)+28px)] md:min-h-[calc(100dvh-92px)] md:pb-14 md:pt-10 lg:hidden">
        <Greeting />
        <Week className="mt-[26px]" />
        <div className="min-h-10 flex-1" />
        <Focus track={focus} />
        <NextStepLink track={focus} className="mt-6" />
        {others.length > 0 && <OthersChips tracks={others} />}
      </div>

      {/* Desktop largo: foco à esquerda, semana e outras à direita */}
      <div className="mx-auto hidden min-h-[calc(100dvh-92px)] max-w-[1360px] grid-cols-[minmax(0,1fr)_380px] gap-20 px-14 pb-14 pt-12 lg:grid">
        <div className="flex flex-col">
          <Greeting big />
          <div className="min-h-16 flex-1" />
          <Focus track={focus} big />
          <NextStepLink track={focus} big className="mt-8 max-w-[600px] p-7" />
        </div>
        <aside className="flex flex-col justify-end gap-4">
          <section className="glass rounded-card p-6">
            <Kicker className="mb-4">Esta semana</Kicker>
            <Week />
          </section>
          {others.length > 0 && <OthersList tracks={others} />}
        </aside>
      </div>
    </>
  );
}

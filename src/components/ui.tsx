import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ENERGIES, energyGradient } from '../lib/energies';
import { STATUS_META, STATUS_ORDER, statusIndex } from '../lib/status';
import type { EnergyId, Status } from '../lib/types';
import { cx } from '../lib/utils';
import { isoDay, weekDays } from '../lib/time';
import { useStore } from '../state/store';

/* ── Botões ───────────────────────────────────────────────────────────────────── */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** CTA off-white (ou tinta escura nas energias claras) */
export function CtaButton({ className, children, ...p }: BtnProps) {
  return (
    <button
      {...p}
      className={cx(
        'inline-flex items-center justify-center gap-2.5 rounded-full bg-cta font-semibold text-cta-ink transition',
        'hover:brightness-105 active:scale-[.98] disabled:opacity-40 disabled:active:scale-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GlassButton({ className, children, ...p }: BtnProps) {
  return (
    <button
      {...p}
      className={cx(
        'glass inline-flex items-center justify-center gap-2 rounded-full font-medium transition',
        'hover:bg-ink/20 active:scale-[.98] disabled:opacity-40',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({ className, children, label, ...p }: BtnProps & { label: string }) {
  return (
    <button
      {...p}
      aria-label={label}
      title={label}
      className={cx('glass grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-ink/20 active:scale-95', className)}
    >
      {children}
    </button>
  );
}

/** Ponto vermelho de gravação + "Capturar" */
export function CaptureButton({ className, label = 'Capturar', trackId }: { className?: string; label?: string; trackId?: string }) {
  const { openSheet } = useStore();
  return (
    <CtaButton onClick={() => openSheet({ type: 'captura', trackId })} className={cx('h-[58px] px-6 text-[15px]', className)}>
      <span className="size-3 rounded-full bg-rec" />
      {label}
    </CtaButton>
  );
}

export function Avatar({ className }: { className?: string }) {
  const { data, openSheet } = useStore();
  return (
    <button
      onClick={() => openSheet({ type: 'conta' })}
      aria-label="Conta"
      className={cx('glass grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-semibold transition hover:bg-ink/20', className)}
    >
      {data.user.name.charAt(0)}
    </button>
  );
}

/** Nav de vidro com 2 itens: Hoje · Faixas */
export function NavPill({ className }: { className?: string }) {
  const { view, navigate } = useStore();
  const items = [
    { id: 'hoje' as const, label: 'Hoje' },
    { id: 'faixas' as const, label: 'Faixas' },
  ];
  return (
    <nav aria-label="Principal" className={cx('glass grid h-[58px] w-[200px] shrink-0 grid-cols-[96px_1fr] rounded-full p-1.5', className)}>
      {items.map((it) => {
        const active = view.name === it.id;
        return (
          <button
            key={it.id}
            onClick={() => navigate({ name: it.id })}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'rounded-full text-[14px] transition',
              active ? 'bg-ink/90 font-semibold text-ink-inverse' : 'font-medium text-ink/80 hover:text-ink',
            )}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Etiquetas ───────────────────────────────────────────────────────────────────── */

export function EnergyDot({ energy, className }: { energy: EnergyId; className?: string }) {
  return <span className={cx('inline-block size-[18px] shrink-0 rounded-full', className)} style={{ background: ENERGIES[energy].dot }} />;
}

export function EnergyThumb({ energy, className }: { energy: EnergyId; className?: string }) {
  return <span aria-hidden className={cx('block shrink-0', className)} style={{ backgroundImage: energyGradient(energy) }} />;
}

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  const op = STATUS_META[status].opacity;
  return (
    <span
      className={cx('inline-block size-2 shrink-0 rounded-full', className)}
      style={{ background: status === 'pronta' ? 'var(--bn-ready)' : `color-mix(in srgb, var(--bn-ink) ${op}%, transparent)` }}
    />
  );
}

export function Kicker({ children, className, strong }: { children: ReactNode; className?: string; strong?: boolean }) {
  return <div className={cx(strong ? 'kicker-strong' : 'kicker', className)}>{children}</div>;
}

/* ── Pipeline ──────────────────────────────────────────────────────────────────── */

/** 5 barras finas (home) */
export function PipelineBars({ status, className }: { status: Status; className?: string }) {
  const idx = statusIndex(status);
  return (
    <div className={cx('flex gap-2', className)} aria-hidden>
      {STATUS_ORDER.map((s, i) => (
        <div
          key={s}
          className={cx('h-1 flex-1 rounded-full transition-colors duration-500', i <= idx ? (status === 'pronta' ? 'bg-ready' : 'bg-ink/95') : 'bg-ink/25')}
        />
      ))}
    </div>
  );
}

export function statusLine(status: Status) {
  return `${STATUS_META[status].label} · etapa ${statusIndex(status) + 1} de 5`;
}

/** 5 pontos com rótulos (detalhe); toque abre Mudar status */
export function PipelineDots({ status, onClick, className }: { status: Status; onClick: () => void; className?: string }) {
  const idx = statusIndex(status);
  return (
    <button onClick={onClick} className={cx('block w-full rounded-2xl text-left', className)} aria-label={`Status: ${STATUS_META[status].label}. Mudar status`}>
      <div className="relative h-[22px]">
        <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-ink/20" />
        <div
          className="absolute left-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-ink/95 transition-[width] duration-500"
          style={{ width: `calc((100% - 32px) * ${idx / 4})` }}
        />
        <div className="relative flex h-full justify-between">
          {STATUS_ORDER.map((s, i) => (
            <div key={s} className="grid w-8 place-items-center">
              {i < idx ? (
                <span className="size-3.5 rounded-full bg-ink" />
              ) : i === idx ? (
                <span className="grid size-[22px] place-items-center rounded-full bg-ink/25">
                  <span className={cx('size-3.5 rounded-full', s === 'pronta' ? 'bg-ready' : 'bg-ink')} />
                </span>
              ) : (
                <span className="size-3 rounded-full border-[1.5px] border-ink/45" style={{ background: 'var(--bn-pipe)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        {STATUS_ORDER.map((s, i) => (
          <span
            key={s}
            className={cx(
              'flex w-8 justify-center whitespace-nowrap text-[12px]',
              i === idx ? 'font-semibold text-ink' : i < idx ? 'text-ink/70' : 'text-ink/55',
            )}
          >
            {STATUS_META[s].label}
          </span>
        ))}
      </div>
    </button>
  );
}

/* ── Semana ───────────────────────────────────────────────────────────────────── */

const LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function Week({ className }: { className?: string }) {
  const { data } = useStore();
  const days = weekDays();
  const today = isoDay(Date.now());
  const count = days.filter((d) => data.sessions.includes(isoDay(d))).length;
  return (
    <div className={className}>
      <ol className="flex justify-between" aria-label="Sequência da semana">
        {days.map((d, i) => {
          const iso = isoDay(d);
          const done = data.sessions.includes(iso);
          const isToday = iso === today;
          return (
            <li
              key={iso}
              aria-label={`${NAMES[i]}${isToday ? ' (hoje)' : ''}: ${done ? 'com sessão' : 'sem sessão'}`}
              className={cx(
                'grid h-12 w-9 place-items-center rounded-[18px] font-mono text-[12px] font-semibold transition-colors duration-500',
                done ? 'bg-ink/90 text-ink-inverse' : isToday ? 'border-[1.5px] border-ink/70 text-ink' : 'glass-soft text-ink/55',
                done && isToday && 'outline-[1.5px] outline-offset-2 outline-ink/70 outline',
              )}
            >
              {LETTERS[i]}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[13px] text-ink/70">
        {count === 0 ? 'Nenhuma sessão esta semana ainda. Sem pressa.' : count === 1 ? '1 dia produzindo esta semana' : `${count} dias produzindo esta semana`}
      </p>
    </div>
  );
}

/* ── Waveform ─────────────────────────────────────────────────────────────────── */

export function Waveform({ peaks, progress = 0, bars = 11, height = 30, className }: { peaks?: number[]; progress?: number; bars?: number; height?: number; className?: string }) {
  const src = peaks?.length ? peaks : Array(bars).fill(0.4);
  const xs = src.length === bars ? src : Array.from({ length: bars }, (_, i) => src[Math.floor((i / bars) * src.length)]);
  return (
    <div aria-hidden className={cx('flex items-center gap-1', className)} style={{ height }}>
      {xs.map((p, i) => (
        <span
          key={i}
          className={cx('w-[3px] rounded-full transition-colors', i / bars < progress ? 'bg-ink' : 'bg-ink/70')}
          style={{ height: Math.max(6, p * height) }}
        />
      ))}
    </div>
  );
}

/* ── Formulários ─────────────────────────────────────────────────────────────── */

export const fieldClass =
  'glass-soft w-full rounded-[20px] px-5 outline-none transition focus:border-ink/50 focus:bg-ink/15';

export function Segmented<T extends string>({ value, options, onChange, className }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cx('glass-soft grid h-12 rounded-full p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx('rounded-full text-[14px] transition', value === o.id ? 'bg-ink/90 font-semibold text-ink-inverse' : 'font-medium text-ink/75 hover:text-ink')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

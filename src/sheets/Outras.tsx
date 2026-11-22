import { useState } from 'react';
import { ENERGIES, ENERGY_ORDER, energyGradient } from '../lib/energies';
import { STATUS_META, STATUS_ORDER } from '../lib/status';
import type { Status } from '../lib/types';
import { cx } from '../lib/utils';
import { useStore } from '../state/store';
import { Check, Drop, Pencil, Pin, Trash } from '../components/Icons';
import { CtaButton, GlassButton, Kicker, StatusDot, fieldClass } from '../components/ui';

/* ── Mudar status + novo próximo passo ─────────────────────────────────────────────────────── */

export function StatusSheet({ trackId }: { trackId: string }) {
  const { data, updateTrack, closeSheet, showToast } = useStore();
  const track = data.tracks.find((t) => t.id === trackId);
  const [status, setStatus] = useState<Status>(track?.status ?? 'ideia');
  const [next, setNext] = useState(track?.nextStep ?? '');
  if (!track) return null;

  const save = () => {
    const nextStep = next.trim();
    if (status === track.status && nextStep === track.nextStep) return closeSheet();
    updateTrack(track.id, { status, nextStep });
    showToast(status !== track.status ? (status === 'pronta' ? 'Faixa pronta. Hora do bounce.' : 'Status atualizado') : 'Próximo passo atualizado');
    closeSheet();
  };

  return (
    <div>
      <div role="radiogroup" aria-label="Status" className="flex flex-col gap-1.5">
        {STATUS_ORDER.map((s) => {
          const active = s === status;
          return (
            <button
              key={s}
              role="radio"
              aria-checked={active}
              onClick={() => setStatus(s)}
              className={cx('flex h-[58px] items-center gap-3.5 rounded-[20px] px-4 text-left transition', active ? 'glass-strong' : 'border border-transparent hover:bg-ink/10')}
            >
              <StatusDot status={s} className="size-2.5" />
              <span className="flex-1">
                <span className="block text-[15px] font-medium">{STATUS_META[s].label}</span>
                <span className="block text-[12px] text-ink/60">{STATUS_META[s].desc}</span>
              </span>
              {active && <Check size={18} />}
            </button>
          );
        })}
      </div>
      <Kicker className="mb-2.5 mt-6">Próximo passo</Kicker>
      <textarea
        value={next}
        maxLength={280}
        onChange={(e) => setNext(e.target.value)}
        rows={2}
        placeholder={status === 'pronta' ? 'Opcional' : 'O que vem agora?'}
        className={cx(fieldClass, 'block resize-none py-4 text-[16px] leading-6')}
        aria-label="Próximo passo"
      />
      <CtaButton onClick={save} className="mt-6 h-14 w-full text-[15px]">
        Salvar
      </CtaButton>
    </div>
  );
}

/* ── Escolher energia ─────────────────────────────────────────────────────────────────── */

export function EnergiaSheet({ trackId }: { trackId: string }) {
  const { data, updateTrack, closeSheet, showToast } = useStore();
  const track = data.tracks.find((t) => t.id === trackId);
  const [initial] = useState(track?.energy);
  if (!track) return null;
  return (
    <div>
      <div className="flex flex-col gap-2">
        {ENERGY_ORDER.map((id) => {
          const e = ENERGIES[id];
          const active = track.energy === id;
          return (
            <button
              key={id}
              onClick={() => updateTrack(track.id, { energy: id })}
              aria-pressed={active}
              className={cx('flex h-[68px] items-center justify-between rounded-[22px] border px-5 text-left transition', active ? 'border-ink ring-1 ring-ink' : 'border-ink/15 hover:border-ink/40')}
              style={{ backgroundImage: energyGradient(id), color: e.ink }}
            >
              <span>
                <span className="block text-[16px] font-semibold">{e.name}</span>
                <span className="block text-[12px] opacity-75">{e.feel}</span>
              </span>
              {active && (
                <span className="grid size-7 place-items-center rounded-full" style={{ background: e.ink, color: e.inverse }}>
                  <Check size={15} strokeWidth={2.4} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <CtaButton
        onClick={() => {
          if (track.energy !== initial) showToast('Energia atualizada');
          closeSheet();
        }}
        className="mt-6 h-14 w-full text-[15px]"
      >
        Pronto
      </CtaButton>
    </div>
  );
}

/* ── Menu da faixa (⋯) ─────────────────────────────────────────────────────────────── */

export function MenuSheet({ trackId }: { trackId: string }) {
  const { data, openSheet, pin, deleteTrack, closeSheet, back, showToast } = useStore();
  const track = data.tracks.find((t) => t.id === trackId);
  const [confirm, setConfirm] = useState(false);
  if (!track) return null;
  const pinned = data.pinnedId === track.id;

  const rows = [
    { icon: <Pencil size={18} />, label: 'Editar faixa', onClick: () => openSheet({ type: 'faixa-form', editId: track.id }) },
    { icon: <Drop size={18} />, label: 'Mudar energia', onClick: () => openSheet({ type: 'energia', trackId: track.id }) },
    {
      icon: <Pin size={18} />,
      label: pinned ? 'Tirar o foco da home' : 'Fixar na home',
      onClick: () => {
        pin(pinned ? null : track.id);
        showToast(pinned ? 'A home volta a mostrar a última editada' : `${track.name} fixada na home`);
        closeSheet();
      },
    },
  ];

  if (confirm) {
    return (
      <div>
        <p className="text-[16px] font-medium">Apagar {track.name}?</p>
        <p className="mt-2 text-[14px] leading-5 text-ink/70">As ideias ligadas a ela continuam guardadas, como ideias soltas.</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <GlassButton onClick={() => setConfirm(false)} className="h-14 text-[15px]">
            Cancelar
          </GlassButton>
          <CtaButton
            onClick={() => {
              closeSheet();
              back();
              deleteTrack(track.id);
              showToast('Faixa apagada');
            }}
            className="h-14 text-[15px]"
          >
            Apagar
          </CtaButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {rows.map((r) => (
        <button key={r.label} onClick={r.onClick} className="flex h-14 items-center gap-3.5 rounded-[20px] px-4 text-left text-[15px] font-medium transition hover:bg-ink/10">
          <span className="grid size-9 place-items-center rounded-full bg-ink/12">{r.icon}</span>
          {r.label}
        </button>
      ))}
      <button onClick={() => setConfirm(true)} className="flex h-14 items-center gap-3.5 rounded-[20px] px-4 text-left text-[15px] font-medium text-ink/80 transition hover:bg-ink/10">
        <span className="grid size-9 place-items-center rounded-full bg-ink/12">
          <Trash size={18} />
        </span>
        Apagar faixa
      </button>
    </div>
  );
}

/* ── Conta ───────────────────────────────────────────────────────────────────── */

export function ContaSheet({ onSignOut }: { onSignOut: () => void }) {
  const { data } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="glass grid size-16 place-items-center rounded-full text-[24px] font-semibold">{data.user.name.charAt(0)}</span>
        <div>
          <p className="text-[18px] font-semibold">{data.user.name}</p>
          <p className="text-[14px] text-ink/70">{data.user.email}</p>
        </div>
      </div>
      {confirm ? (
        <div className="mt-7">
          <p className="text-[16px] font-medium">Deseja sair?</p>
          <p className="mt-1.5 text-[14px] text-ink/70">Suas faixas e ideias continuam guardadas na sua conta.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <GlassButton onClick={() => setConfirm(false)} className="h-14 text-[15px]">
              Cancelar
            </GlassButton>
            <CtaButton onClick={onSignOut} className="h-14 text-[15px]">
              Sair
            </CtaButton>
          </div>
        </div>
      ) : (
        <GlassButton onClick={() => setConfirm(true)} className="mt-7 h-14 w-full text-[15px]">
          Sair
        </GlassButton>
      )}
    </div>
  );
}

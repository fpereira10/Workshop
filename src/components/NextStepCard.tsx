import { useEffect, useRef, useState } from 'react';
import type { Track } from '../lib/types';
import { cx } from '../lib/utils';
import { useStore } from '../state/store';
import { ChevronRight } from './Icons';
import { Kicker } from './ui';

function emptyText(t: Track) {
  return t.status === 'pronta' ? 'Faixa pronta. Hora do bounce.' : 'Qual é o próximo passo?';
}

/** Home: card de vidro que leva ao detalhe */
export function NextStepLink({ track, className, big }: { track: Track; className?: string; big?: boolean }) {
  const { navigate } = useStore();
  return (
    <button
      onClick={() => navigate({ name: 'faixa', id: track.id })}
      className={cx('glass group flex w-full items-center gap-4 rounded-card p-6 text-left transition hover:bg-ink/[.18]', className)}
    >
      <div className="min-w-0 flex-1">
        <Kicker>Próximo passo</Kicker>
        <p className={cx('mt-3 font-medium text-pretty', big ? 'text-[22px] leading-[30px]' : 'text-[19px] leading-[26px]', !track.nextStep && 'text-ink/60')}>
          {track.nextStep || emptyText(track)}
        </p>
      </div>
      <span className="grid size-9 shrink-0 place-items-center self-end rounded-full bg-ink/15 transition group-hover:translate-x-0.5">
        <ChevronRight size={18} />
      </span>
    </button>
  );
}

/** Detalhe: card editável no lugar */
export function NextStepEditable({ track, className }: { track: Track; className?: string }) {
  const { updateTrack, showToast } = useStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(track.nextStep);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setValue(track.nextStep), [track.nextStep]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
    }
  }, [editing]);

  const save = () => {
    const v = value.trim();
    setEditing(false);
    if (v !== track.nextStep) {
      updateTrack(track.id, { nextStep: v });
      showToast('Próximo passo atualizado');
    }
  };
  const cancel = () => {
    setValue(track.nextStep);
    setEditing(false);
  };

  return (
    <div className={cx('glass rounded-card p-6', className)}>
      <div className="flex items-center justify-between">
        <Kicker>Próximo passo</Kicker>
        {editing ? (
          <div className="flex gap-4 text-[13px]">
            <button onClick={cancel} className="text-ink/70 hover:text-ink">Cancelar</button>
            <button onClick={save} className="font-semibold">Salvar</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="-m-2 p-2 text-[13px] text-ink/70 hover:text-ink">
            Editar
          </button>
        )}
      </div>
      {editing ? (
        <textarea
          ref={ref}
          value={value}
          maxLength={280}
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              save();
            }
            if (e.key === 'Escape') cancel();
          }}
          placeholder="Ex.: exportar o drop e ouvir no carro"
          className="mt-3 block w-full resize-none bg-transparent text-[18px] font-medium leading-6 outline-none"
          aria-label="Próximo passo"
        />
      ) : (
        <button onClick={() => setEditing(true)} className={cx('mt-3 block w-full text-left text-[18px] font-medium leading-6 text-pretty', !track.nextStep && 'text-ink/60')}>
          {track.nextStep || emptyText(track)}
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Idea } from '../lib/types';
import { fmtDuration, relIdea } from '../lib/time';
import { cx } from '../lib/utils';
import { usePlayer } from '../state/player';
import { useStore } from '../state/store';
import { NoteLines, Pause, Play, Trash } from './Icons';
import { EnergyDot, Waveform } from './ui';

export function ideaMeta(idea: Idea, withTrack?: string | null) {
  const parts = [idea.kind === 'memo' ? 'Memo' : 'Nota'];
  if (idea.kind === 'memo') parts.push(fmtDuration(idea.durationSec ?? 0));
  if (withTrack !== undefined) parts.push(withTrack ?? 'sem faixa');
  parts.push(relIdea(idea.createdAt));
  return parts.join(' · ');
}

/** Linha de ideia: memo (play + waveform) ou nota. Toque no texto expande. */
export function IdeaRow({ idea, loose }: { idea: Idea; loose?: boolean }) {
  const { data, deleteIdea, updateIdea, showToast } = useStore();
  const { playingId, progress, toggle, stop } = usePlayer();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const playing = playingId === idea.id;
  const linkable = data.tracks.filter((t) => t.status !== 'pronta');

  return (
    <div className="glass-soft rounded-[24px] transition-colors">
      <div className="flex min-h-[72px] items-center gap-3.5 px-4 py-3">
        {idea.kind === 'memo' ? (
          <button
            onClick={() => toggle(idea)}
            aria-label={playing ? `Pausar ${idea.title}` : `Ouvir ${idea.title}`}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ink/90 text-ink-inverse transition active:scale-95"
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
          </button>
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink/15">
            <NoteLines size={18} />
          </span>
        )}
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="min-w-0 flex-1 text-left">
          <div className={cx('text-[15px] font-medium', !open && 'truncate')}>{idea.title}</div>
          <div className="mt-0.5 truncate text-[12px] text-ink/65">{ideaMeta(idea, loose ? null : undefined)}</div>
        </button>
        {idea.kind === 'memo' && <Waveform peaks={idea.peaks} progress={playing ? progress : 0} className="shrink-0" />}
      </div>

      {open && (
        <div className="anim-fade-in px-4 pb-4">
          {idea.kind === 'nota' && idea.text !== idea.title && <p className="mb-3 whitespace-pre-wrap text-[14px] leading-5 text-ink/85">{idea.text}</p>}
          {loose && linkable.length > 0 && (
            <>
              <div className="kicker mb-2">Ligar a uma faixa</div>
              <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
                {linkable.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      updateIdea(idea.id, { trackId: t.id });
                      showToast(`Ideia guardada em ${t.name}`);
                    }}
                    className="glass flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] hover:bg-ink/20"
                  >
                    <EnergyDot energy={t.energy} className="size-3" />
                    {t.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {confirm ? (
            <div className="flex items-center gap-3 text-[13px]">
              <span className="text-ink/75">Apagar esta ideia?</span>
              <button onClick={() => setConfirm(false)} className="text-ink/70 hover:text-ink">Cancelar</button>
              <button
                onClick={() => {
                  if (playing) stop();
                  deleteIdea(idea.id);
                  showToast('Ideia apagada');
                }}
                className="font-semibold"
              >
                Apagar
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} className="flex items-center gap-1.5 text-[13px] text-ink/70 hover:text-ink">
              <Trash size={16} /> Apagar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

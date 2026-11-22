import { useEffect, useMemo, useRef, useState } from 'react';
import type { Idea } from '../lib/types';
import { fmtDuration, hhmm } from '../lib/time';
import { cx, resample, uid } from '../lib/utils';
import { useStore } from '../state/store';
import { useRecorder } from '../state/useRecorder';
import { MicOff, Pause, Play, Plus } from '../components/Icons';
import { CtaButton, EnergyDot, Kicker, Segmented, Waveform, fieldClass } from '../components/ui';

type Link = 'none' | 'nova' | string;

function LiveWave({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div aria-hidden className="flex h-14 w-full items-center justify-center gap-[3px]">
      {levels.map((l, i) => (
        <span
          key={i}
          className={cx('w-[3px] rounded-full transition-[height] duration-75', active ? 'bg-ink/85' : 'bg-ink/25')}
          style={{ height: Math.max(4, (active ? l : 0.06) * 56) }}
        />
      ))}
    </div>
  );
}

function Preview({ url, peaks, duration }: { url: string; peaks: number[]; duration: number }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <div className="glass-soft flex w-full items-center gap-3.5 rounded-[24px] px-4 py-3">
      <audio
        ref={ref}
        src={url}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : duration || 1))}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
      />
      <button
        onClick={() => {
          const a = ref.current!;
          if (playing) {
            a.pause();
            setPlaying(false);
          } else {
            void a.play();
            setPlaying(true);
          }
        }}
        aria-label={playing ? 'Pausar' : 'Ouvir'}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-ink/90 text-ink-inverse"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
      </button>
      <Waveform peaks={peaks} bars={24} progress={progress} className="min-w-0 flex-1 justify-between" />
      <span className="font-mono text-[12px] text-ink/70">{fmtDuration(duration)}</span>
    </div>
  );
}

export function CapturaSheet({ trackId }: { trackId?: string | null }) {
  const { data, focus, addIdea, openSheet, closeSheet, showToast } = useStore();
  const rec = useRecorder();
  const [tab, setTab] = useState<'memo' | 'nota'>('memo');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState<Link>(trackId ?? focus?.id ?? 'none');
  const [saving, setSaving] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const previewUrl = useMemo(() => (rec.blob ? URL.createObjectURL(rec.blob) : null), [rec.blob]);
  useEffect(() => () => void (previewUrl && URL.revokeObjectURL(previewUrl)), [previewUrl]);
  useEffect(() => {
    if (tab === 'nota') noteRef.current?.focus();
  }, [tab]);

  const peaks = useMemo(() => (rec.state === 'gravado' ? rec.getPeaks(24) : []), [rec.state, rec.getPeaks]);
  const tracks = [...data.tracks].filter((t) => t.status !== 'pronta' || t.id === trackId).sort((a, b) => b.updatedAt - a.updatedAt);
  const canSave = !saving && (tab === 'memo' ? rec.state === 'gravado' && !!rec.blob : text.trim().length > 0);

  function save() {
    if (!canSave) return;
    setSaving(true);
    const id = uid();
    const now = Date.now();
    const target = link === 'none' || link === 'nova' ? null : link;
    let idea: Idea;
    let audio: Blob | undefined;
    if (tab === 'memo') {
      audio = rec.blob!;
      idea = {
        id,
        kind: 'memo',
        title: title.trim() || `Ideia das ${hhmm(now)}`,
        text: '',
        trackId: target,
        createdAt: now,
        durationSec: Math.max(1, Math.round(rec.elapsed)),
        peaks: resample(peaks, 11),
      };
    } else {
      const t = text.trim();
      idea = { id, kind: 'nota', title: t.split('\n')[0].slice(0, 90), text: t, trackId: target, createdAt: now };
    }
    // o app mostra a ideia na hora; o áudio sobe para o Storage em segundo plano
    addIdea(idea, audio);
    if (link === 'nova') {
      openSheet({ type: 'faixa-form', ideaId: id });
      return;
    }
    const tr = data.tracks.find((t) => t.id === target);
    showToast(tr ? `Ideia guardada em ${tr.name}` : 'Ideia guardada');
    closeSheet();
  }

  const recording = rec.state === 'gravando';

  return (
    <div>
      <Segmented
        value={tab}
        onChange={(v) => {
          if (recording) rec.stop();
          setTab(v);
        }}
        options={[
          { id: 'memo', label: 'Memo' },
          { id: 'nota', label: 'Nota' },
        ]}
      />

      {tab === 'memo' ? (
        <div className="mt-6 flex flex-col items-center">
          {rec.state === 'negado' || rec.state === 'indisponivel' ? (
            <div className="glass-soft w-full rounded-[24px] p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink/15">
                  <MicOff size={20} />
                </span>
                <p className="text-[15px] font-medium">{rec.state === 'negado' ? 'Sem acesso ao microfone' : 'Este navegador não grava áudio'}</p>
              </div>
              <p className="mt-3 text-[14px] leading-5 text-ink/75">
                {rec.state === 'negado'
                  ? 'Libere o microfone nas permissões do navegador e tente de novo. Ou escreva a ideia como nota.'
                  : 'Escreva a ideia como nota, ela fica guardada do mesmo jeito.'}
              </p>
              <div className="mt-4 flex gap-4 text-[14px]">
                {rec.state === 'negado' && (
                  <button onClick={rec.start} className="font-semibold">
                    Tentar de novo
                  </button>
                )}
                <button onClick={() => setTab('nota')} className="text-ink/75 hover:text-ink">
                  Escrever nota
                </button>
              </div>
            </div>
          ) : rec.state === 'gravado' && previewUrl ? (
            <>
              <Preview url={previewUrl} peaks={peaks} duration={rec.elapsed} />
              <div className="mt-3 flex w-full items-center gap-3">
                <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Dê um nome (opcional)" className={cx(fieldClass, 'h-12 flex-1 text-[15px]')} />
                <button onClick={rec.reset} className="shrink-0 px-2 text-[14px] text-ink/75 hover:text-ink">
                  Regravar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[13px] tracking-[.08em] text-ink/75" aria-live="polite">
                {recording ? fmtDuration(rec.elapsed) : rec.state === 'pedindo' ? 'PEDINDO O MICROFONE…' : 'TOQUE PARA GRAVAR'}
              </div>
              <LiveWave levels={rec.levels} active={recording} />
              <div className="relative mt-3 grid size-[96px] place-items-center">
                {recording && <span className="anim-pulse absolute inset-0 rounded-full bg-rec/40" />}
                <button
                  onClick={recording ? rec.stop : rec.start}
                  disabled={rec.state === 'pedindo'}
                  aria-label={recording ? 'Parar gravação' : 'Gravar memo'}
                  className="relative grid size-[88px] place-items-center rounded-full bg-cta shadow-[0_10px_40px_rgba(0,0,0,.2)] transition active:scale-95 disabled:opacity-60"
                >
                  <span className={cx('bg-rec transition-all duration-200', recording ? 'size-7 rounded-[8px]' : 'size-8 rounded-full')} />
                </button>
              </div>
              <p className="mt-3 text-[13px] text-ink/60">{recording ? 'Toque para parar' : 'Cantarole, fale, bata o ritmo'}</p>
            </>
          )}
        </div>
      ) : (
        <textarea
          ref={noteRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Ex.: usar o vocal chop da Neblina no breakdown"
          className={cx(fieldClass, 'mt-5 block resize-none py-4 text-[16px] leading-6')}
          aria-label="Nota"
        />
      )}

      <Kicker className="mb-3 mt-7">Ligar a uma faixa</Kicker>
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
        {tracks.map((t) => (
          <Chip key={t.id} active={link === t.id} onClick={() => setLink(t.id)}>
            <EnergyDot energy={t.energy} className="size-3" />
            {t.name}
          </Chip>
        ))}
        <Chip active={link === 'none'} onClick={() => setLink('none')}>
          Sem faixa
        </Chip>
      </div>
      <button
        onClick={() => setLink('nova')}
        aria-pressed={link === 'nova'}
        className={cx(
          'mt-2 flex h-11 w-full items-center gap-2.5 rounded-full px-4 text-[14px] transition',
          link === 'nova' ? 'bg-ink/90 font-semibold text-ink-inverse' : 'glass-soft text-ink/85 hover:text-ink',
        )}
      >
        <Plus size={16} />
        Nova faixa a partir desta ideia
      </button>

      <CtaButton onClick={save} disabled={!canSave} className="mt-6 h-14 w-full text-[15px]">
        {link === 'nova' ? 'Guardar e criar faixa' : 'Guardar ideia'}
      </CtaButton>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] transition',
        active ? 'bg-ink/90 font-semibold text-ink-inverse' : 'glass-soft text-ink/85 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

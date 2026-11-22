import { useEffect, useRef, useState } from 'react';
import { ENERGIES, ENERGY_ORDER, energyGradient } from '../lib/energies';
import { MODES, NOTES, splitKey } from '../lib/status';
import type { EnergyId } from '../lib/types';
import { cx } from '../lib/utils';
import { useStore } from '../state/store';
import { Check, ChevronDown, Minus, Plus } from '../components/Icons';
import { CtaButton, Kicker, Segmented, fieldClass } from '../components/ui';

/** Nova faixa / Editar faixa: nome, BPM, tom, energia */
export function FaixaFormSheet({ editId, ideaId }: { editId?: string; ideaId?: string }) {
  const { data, createTrack, updateTrack, updateIdea, closeSheet, navigate, showToast, setPreviewEnergy } = useStore();
  const editing = data.tracks.find((t) => t.id === editId);
  const initialKey = splitKey(editing?.key ?? 'Lá menor');

  const [name, setName] = useState(editing?.name ?? '');
  const [bpm, setBpm] = useState(String(editing?.bpm ?? 122));
  const [note, setNote] = useState(initialKey.note);
  const [mode, setMode] = useState<'maior' | 'menor'>(initialKey.mode);
  const [energy, setEnergy] = useState<EnergyId>(editing?.energy ?? 'hipnotica');
  const nameRef = useRef<HTMLInputElement>(null);

  // O fundo do app já mostra a energia escolhida
  useEffect(() => setPreviewEnergy(energy), [energy, setPreviewEnergy]);
  useEffect(() => () => setPreviewEnergy(null), [setPreviewEnergy]);
  useEffect(() => {
    if (!editing) nameRef.current?.focus();
  }, [editing]);

  const bpmNum = Math.round(Number(bpm));
  const valid = name.trim().length > 0 && bpmNum >= 40 && bpmNum <= 220;
  const stepBpm = (d: number) => setBpm(String(Math.min(220, Math.max(40, (bpmNum || 120) + d))));

  function submit() {
    if (!valid) return;
    const fields = { name: name.trim(), bpm: bpmNum, key: `${note} ${mode}`, energy };
    if (editing) {
      updateTrack(editing.id, fields);
      showToast('Faixa atualizada');
      closeSheet();
      return;
    }
    const t = createTrack(fields);
    if (ideaId) {
      updateIdea(ideaId, { trackId: t.id });
      showToast(`Ideia guardada em ${t.name}`);
    } else showToast('Faixa criada');
    closeSheet();
    navigate({ name: 'faixa', id: t.id });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="block">
        <Kicker className="mb-2.5">Nome</Kicker>
        <input ref={nameRef} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Maré Baixa" className={cx(fieldClass, 'h-14 text-[20px] font-medium')} />
      </label>

      <div className="mt-5 grid grid-cols-[1fr_1.25fr] gap-3">
        <div>
          <Kicker className="mb-2.5">BPM</Kicker>
          <div className="glass-soft flex h-14 items-center rounded-[20px] px-1.5">
            <button type="button" onClick={() => stepBpm(-1)} aria-label="Diminuir BPM" className="grid size-11 place-items-center rounded-full hover:bg-ink/10">
              <Minus size={16} />
            </button>
            <input
              value={bpm}
              inputMode="numeric"
              onChange={(e) => setBpm(e.target.value.replace(/\D/g, '').slice(0, 3))}
              aria-label="BPM"
              className="w-full min-w-0 bg-transparent text-center font-mono text-[17px] font-semibold outline-none"
            />
            <button type="button" onClick={() => stepBpm(1)} aria-label="Aumentar BPM" className="grid size-11 place-items-center rounded-full hover:bg-ink/10">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div>
          <Kicker className="mb-2.5">Tom</Kicker>
          <div className="relative">
            <select value={note} onChange={(e) => setNote(e.target.value)} aria-label="Nota" className={cx(fieldClass, 'h-14 appearance-none pr-10 text-[16px] font-medium')}>
              {NOTES.map((n) => (
                <option key={n} value={n} className="text-black">
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/70" />
          </div>
        </div>
      </div>
      <Segmented value={mode} onChange={setMode} options={MODES.map((m) => ({ id: m, label: m[0].toUpperCase() + m.slice(1) }))} className="mt-3" />

      <Kicker className="mb-3 mt-6">Energia</Kicker>
      <div className="grid grid-cols-5 gap-2">
        {ENERGY_ORDER.map((id) => {
          const e = ENERGIES[id];
          const active = energy === id;
          return (
            <button type="button" key={id} onClick={() => setEnergy(id)} aria-pressed={active} className="flex flex-col items-center gap-2">
              <span
                className={cx('grid size-14 place-items-center rounded-full border transition', active ? 'scale-105 border-ink ring-2 ring-ink/80 ring-offset-0' : 'border-ink/20')}
                style={{ backgroundImage: energyGradient(id), color: e.ink }}
              >
                {active && <Check size={18} strokeWidth={2.2} />}
              </span>
              <span className={cx('text-[11px]', active ? 'font-semibold' : 'text-ink/70')}>{e.name}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[13px] text-ink/60">{ENERGIES[energy].feel}</p>

      <CtaButton type="submit" disabled={!valid} className="mt-6 h-14 w-full text-[15px]">
        {editing ? 'Salvar' : 'Criar faixa'}
      </CtaButton>
    </form>
  );
}

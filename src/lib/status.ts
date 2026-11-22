import type { Status } from './types';

export const STATUS_ORDER: Status[] = ['ideia', 'arranjo', 'mix', 'master', 'pronta'];

export const STATUS_META: Record<Status, { label: string; desc: string; opacity: number }> = {
  ideia: { label: 'Ideia', desc: 'Um loop, um esboço', opacity: 35 },
  arranjo: { label: 'Arranjo', desc: 'A estrutura da faixa', opacity: 55 },
  mix: { label: 'Mix', desc: 'Equilíbrio e espaço', opacity: 75 },
  master: { label: 'Master', desc: 'O polimento final', opacity: 95 },
  pronta: { label: 'Pronta', desc: 'Hora do bounce', opacity: 100 },
};

export function statusIndex(s: Status) {
  return STATUS_ORDER.indexOf(s);
}

export const NOTES = ['Dó', 'Dó♯', 'Ré', 'Mi♭', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Lá♭', 'Lá', 'Si♭', 'Si'];
export const MODES = ['maior', 'menor'] as const;

export function splitKey(key: string): { note: string; mode: 'maior' | 'menor' } {
  const [note, mode] = key.split(' ');
  return {
    note: NOTES.includes(note) ? note : 'Lá',
    mode: mode === 'maior' ? 'maior' : 'menor',
  };
}

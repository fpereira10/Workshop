export type Status = 'ideia' | 'arranjo' | 'mix' | 'master' | 'pronta';
export type EnergyId = 'calma' | 'melancolica' | 'hipnotica' | 'intensa' | 'solar';

export interface Track {
  id: string;
  name: string;
  bpm: number;
  /** Ex.: "Lá menor" */
  key: string;
  energy: EnergyId;
  status: Status;
  nextStep: string;
  createdAt: number;
  updatedAt: number;
}

export interface Idea {
  id: string;
  kind: 'memo' | 'nota';
  title: string;
  text: string;
  trackId: string | null;
  createdAt: number;
  /** Memo: duração em segundos */
  durationSec?: number;
  /** Memo: caminho do áudio no Storage (<user_id>/<ideia>.<ext>) */
  audioPath?: string | null;
  /** Memo: alturas normalizadas (0–1) para a waveform */
  peaks?: number[];
}

export interface AppData {
  version: 1;
  user: { name: string; email: string };
  tracks: Track[];
  ideas: Idea[];
  /** Dias com sessão, em YYYY-MM-DD */
  sessions: string[];
  pinnedId: string | null;
}

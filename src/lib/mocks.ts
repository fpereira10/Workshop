import type { AppData, Idea, Track } from './types';
import { isoDay, weekDays } from './time';

/** Data relativa a hoje, para os mocks sempre parecerem recentes */
function at(daysBack: number, h: number, m: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

const norm = (xs: number[]) => xs.map((x) => x / 30);

export function createMockData(): AppData {
  const tracks: Track[] = [
    {
      id: 'mare-baixa',
      name: 'Maré Baixa',
      bpm: 122,
      key: 'Lá menor',
      energy: 'hipnotica',
      status: 'arranjo',
      nextStep: 'Terminar o breakdown e testar o pad no drop',
      createdAt: at(40, 22, 0),
      updatedAt: at(1, 23, 10),
    },
    {
      id: 'concreto',
      name: 'Concreto',
      bpm: 128,
      key: 'Fá menor',
      energy: 'intensa',
      status: 'mix',
      nextStep: 'Baixar o kick 1 dB e ouvir no carro',
      createdAt: at(60, 21, 0),
      updatedAt: at(3, 21, 40),
    },
    {
      id: 'domingo-6h',
      name: 'Domingo 6h',
      bpm: 110,
      key: 'Ré maior',
      energy: 'solar',
      status: 'master',
      nextStep: 'Exportar o master e comparar com a referência',
      createdAt: at(80, 9, 0),
      updatedAt: at(6, 10, 15),
    },
    {
      id: 'neblina',
      name: 'Neblina',
      bpm: 118,
      key: 'Mi menor',
      energy: 'melancolica',
      status: 'ideia',
      nextStep: 'Achar o groove da bateria',
      createdAt: at(30, 23, 0),
      updatedAt: at(16, 22, 5),
    },
    {
      id: 'sal',
      name: 'Sal',
      bpm: 124,
      key: 'Sol menor',
      energy: 'calma',
      status: 'pronta',
      nextStep: '',
      createdAt: at(120, 20, 0),
      updatedAt: at(14, 19, 30),
    },
  ];

  const ideas: Idea[] = [
    {
      id: 'idea-pad',
      kind: 'memo',
      title: 'Melodia do pad',
      text: '',
      trackId: 'mare-baixa',
      createdAt: at(1, 23, 10),
      durationSec: 42,
      peaks: norm([10, 22, 16, 30, 18, 12, 24, 14, 8, 18, 10]),
    },
    {
      id: 'idea-chop',
      kind: 'nota',
      title: 'Usar o vocal chop da Neblina no breakdown',
      text: 'Usar o vocal chop da Neblina no breakdown',
      trackId: 'mare-baixa',
      createdAt: at(2, 18, 20),
    },
    {
      id: 'idea-baixo',
      kind: 'memo',
      title: 'Ideia do baixo',
      text: '',
      trackId: 'mare-baixa',
      createdAt: at(5, 8, 5),
      durationSec: 18,
      peaks: norm([10, 22, 14, 26, 16, 10, 18, 8, 12, 20, 9]),
    },
    {
      id: 'idea-solta',
      kind: 'memo',
      title: 'Groove no trânsito',
      text: '',
      trackId: null,
      createdAt: at(4, 8, 40),
      durationSec: 75,
      peaks: norm([8, 14, 20, 12, 26, 18, 10, 22, 16, 12, 8]),
    },
  ];

  // Sessões na segunda, terça e quarta desta semana
  const today = isoDay(Date.now());
  const sessions = weekDays()
    .slice(1, 4)
    .map(isoDay)
    .filter((d) => d <= today);

  return {
    version: 1,
    user: { name: 'Fernando', email: 'fernando@bounce.app' },
    tracks,
    ideas,
    sessions,
    pinnedId: null,
  };
}

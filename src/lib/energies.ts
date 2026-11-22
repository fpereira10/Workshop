import type { CSSProperties } from 'react';
import type { EnergyId } from './types';

export interface Energy {
  id: EnergyId;
  name: string;
  feel: string;
  from: string;
  to: string;
  /** dark = tinta branca; light = tinta escura (Solar, Calma) */
  tone: 'dark' | 'light';
  ink: string;
  inverse: string;
  /** Cor do ponto da energia em chips */
  dot: string;
  /** Preenchimento dos pontos futuros do pipeline */
  pipe: string;
  /** Três manchas de luz desfocadas, como nas referências */
  blobs: [string, string, string];
  scrim: string;
}

export const ENERGY_ORDER: EnergyId[] = ['calma', 'melancolica', 'hipnotica', 'intensa', 'solar'];

export const ENERGIES: Record<EnergyId, Energy> = {
  calma: {
    id: 'calma',
    name: 'Calma',
    feel: 'amanhecer, mar parado',
    from: '#8FA3B3',
    to: '#E8D9C9',
    tone: 'light',
    ink: '#1F2830',
    inverse: '#F4EDE4',
    dot: '#6F8799',
    pipe: '#C8CCCA',
    blobs: ['rgba(255,236,214,.6)', 'rgba(110,138,162,.45)', 'rgba(255,255,255,.35)'],
    scrim: 'rgba(60,80,100,.16)',
  },
  melancolica: {
    id: 'melancolica',
    name: 'Melancólica',
    feel: 'chuva, fim de tarde',
    from: '#3B4A5C',
    to: '#8E9AAF',
    tone: 'dark',
    ink: '#FFFFFF',
    inverse: '#1B2330',
    dot: '#9AA8BF',
    pipe: '#4A586B',
    blobs: ['rgba(150,170,200,.45)', 'rgba(30,40,58,.55)', 'rgba(205,214,232,.22)'],
    scrim: 'rgba(0,0,0,.45)',
  },
  hipnotica: {
    id: 'hipnotica',
    name: 'Hipnótica',
    feel: 'noite, repetição, névoa',
    from: '#1E2A4A',
    to: '#6A4C93',
    tone: 'dark',
    ink: '#FFFFFF',
    inverse: '#1A1630',
    dot: '#B79BE6',
    pipe: '#2A2850',
    blobs: ['rgba(155,123,208,.55)', 'rgba(62,90,154,.5)', 'rgba(201,168,240,.25)'],
    scrim: 'rgba(0,0,0,.45)',
  },
  intensa: {
    id: 'intensa',
    name: 'Intensa',
    feel: 'pista, calor, fogo',
    from: '#3A0D0D',
    to: '#D9542B',
    tone: 'dark',
    ink: '#FFFFFF',
    inverse: '#2A0E08',
    dot: '#D9542B',
    pipe: '#4A1610',
    blobs: ['rgba(255,122,61,.5)', 'rgba(122,30,18,.55)', 'rgba(255,178,122,.22)'],
    scrim: 'rgba(0,0,0,.45)',
  },
  solar: {
    id: 'solar',
    name: 'Solar',
    feel: 'domingo de manhã, luz',
    from: '#F2C46D',
    to: '#F5E6CC',
    tone: 'light',
    ink: '#2B2113',
    inverse: '#F7EBD3',
    dot: '#E8A93C',
    pipe: '#F3DDAE',
    blobs: ['rgba(255,217,138,.7)', 'rgba(247,178,106,.45)', 'rgba(255,246,226,.6)'],
    scrim: 'rgba(201,138,58,.18)',
  },
};

/** Gradiente simples a 160deg (miniaturas, swatches) */
export function energyGradient(id: EnergyId): string {
  const e = ENERGIES[id];
  return `linear-gradient(160deg, ${e.from}, ${e.to})`;
}

/** Fundo em tela cheia: gradiente 160deg + manchas de luz */
export function energyBackground(id: EnergyId): CSSProperties {
  const e = ENERGIES[id];
  const [a, b, c] = e.blobs;
  return {
    backgroundImage: [
      `radial-gradient(circle 38vmax at 82% 29%, ${a}, transparent 70%)`,
      `radial-gradient(circle 42vmax at 10% 73%, ${b}, transparent 70%)`,
      `radial-gradient(circle 30vmax at 54% 51%, ${c}, transparent 70%)`,
      `linear-gradient(160deg, ${e.from}, ${e.to})`,
    ].join(','),
  };
}

export function energyScrim(id: EnergyId): CSSProperties {
  const e = ENERGIES[id];
  return { backgroundImage: `linear-gradient(180deg, transparent 40%, ${e.scrim} 100%)` };
}

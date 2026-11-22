import type { Meta, StoryObj } from '@storybook/react-vite';
import { createMockData } from '../lib/mocks';
import { IdeaRow } from './IdeaRow';
import { NextStepEditable, NextStepLink } from './NextStepCard';

const data = createMockData();
const track = data.tracks[0];
const [memo, note, , loose] = data.ideas;

const meta: Meta = {
  title: 'Componentes/Cards',
  parameters: { docs: { description: { component: 'Card de próximo passo (na Hoje leva ao detalhe; no Detalhe edita no lugar) e linhas de ideia (memo com play e waveform, nota).' } } },
};
export default meta;
type Story = StoryObj;

export const ProximoPassoHoje: Story = { render: () => <div className="max-w-[342px]"><NextStepLink track={track} /></div> };
export const ProximoPassoEditavel: Story = { render: () => <div className="max-w-[342px]"><NextStepEditable track={track} /></div> };
export const IdeiaMemo: Story = { render: () => <div className="max-w-[342px]"><IdeaRow idea={memo} /></div> };
export const IdeiaNota: Story = { render: () => <div className="max-w-[342px]"><IdeaRow idea={note} /></div> };
export const IdeiaSolta: Story = { render: () => <div className="max-w-[342px]"><IdeaRow idea={loose} loose /></div> };

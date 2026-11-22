import type { Meta, StoryObj } from '@storybook/react-vite';
import { Waveform } from './ui';

const peaks = [0.33, 0.73, 0.53, 1, 0.6, 0.4, 0.8, 0.47, 0.27, 0.6, 0.33];

const meta: Meta<typeof Waveform> = {
  title: 'Componentes/Waveform',
  component: Waveform,
  args: { peaks, progress: 0, bars: 11, height: 30 },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } } },
  parameters: { docs: { description: { component: 'Barras de um memo. O progresso pinta as barras já tocadas.' } } },
};
export default meta;
type Story = StoryObj<typeof Waveform>;

export const Parada: Story = {};
export const Tocando: Story = { args: { progress: 0.5 } };
export const NaGravacao: Story = { args: { bars: 24, height: 56, peaks: Array.from({ length: 24 }, (_, i) => 0.2 + 0.8 * Math.abs(Math.sin(i / 2.3))) } };

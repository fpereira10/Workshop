import type { Meta, StoryObj } from '@storybook/react-vite';
import { ENERGY_ORDER } from '../lib/energies';
import { EnergyDot, EnergyThumb, Kicker } from './ui';

const meta: Meta = {
  title: 'Componentes/Etiquetas',
  parameters: { docs: { description: { component: 'Kicker em mono (caixa alta, +0.11em) e as marcas de energia: ponto e miniatura.' } } },
};
export default meta;
type Story = StoryObj;

export const KickerMono: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Kicker>Hoje · Sáb 21 Nov</Kicker>
      <Kicker>Próximo passo</Kicker>
      <Kicker strong>122 BPM · Lá menor · Hipnótica</Kicker>
    </div>
  ),
};
export const PontosDeEnergia: Story = {
  render: () => <div className="flex gap-3">{ENERGY_ORDER.map((e) => <EnergyDot key={e} energy={e} className="size-6" />)}</div>,
};
export const MiniaturasDeEnergia: Story = {
  render: () => <div className="flex gap-3">{ENERGY_ORDER.map((e) => <EnergyThumb key={e} energy={e} className="size-[52px] rounded-[18px] border border-ink/15" />)}</div>,
};

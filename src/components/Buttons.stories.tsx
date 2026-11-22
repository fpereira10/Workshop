import type { Meta, StoryObj } from '@storybook/react-vite';
import { Close, Plus } from './Icons';
import { CaptureButton, CtaButton, GlassButton, IconButton } from './ui';

const meta: Meta = {
  title: 'Componentes/Botões',
  parameters: { docs: { description: { component: 'CTA off-white (tinta escura nas energias claras), botão de vidro e botão de ícone. Alvo de toque mínimo de 44px.' } } },
};
export default meta;
type Story = StoryObj;

export const Cta: Story = { render: () => <CtaButton className="h-14 px-8 text-[15px]">Guardar ideia</CtaButton> };
export const CtaDesligado: Story = { render: () => <CtaButton disabled className="h-14 px-8 text-[15px]">Guardar ideia</CtaButton> };
export const Vidro: Story = { render: () => <GlassButton className="h-14 px-8 text-[15px]">Mudar status</GlassButton> };
export const Icone: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconButton label="Nova faixa"><Plus size={20} /></IconButton>
      <IconButton label="Fechar"><Close size={18} /></IconButton>
    </div>
  ),
};
export const Capturar: Story = { render: () => <CaptureButton /> };

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segmented, fieldClass } from './ui';

const meta: Meta = {
  title: 'Componentes/Formulário',
  parameters: { docs: { description: { component: 'Campo de vidro (raio 20, altura 56) e controle segmentado (Memo · Nota).' } } },
};
export default meta;
type Story = StoryObj;

export const Campo: Story = {
  render: () => (
    <label className="block max-w-[342px]">
      <span className="kicker mb-2 block">Nome</span>
      <input placeholder="Ex.: Maré Baixa" className={`${fieldClass} h-14 text-[20px] font-medium`} />
    </label>
  ),
};
export const Segmentado: Story = {
  render: () => {
    const [v, setV] = useState<'memo' | 'nota'>('memo');
    return <div className="max-w-[342px]"><Segmented value={v} onChange={setV} options={[{ id: 'memo', label: 'Memo' }, { id: 'nota', label: 'Nota' }]} /></div>;
  },
};

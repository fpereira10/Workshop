import type { Meta, StoryObj } from '@storybook/react-vite';
import { STATUS_ORDER } from '../lib/status';
import type { Status } from '../lib/types';
import { PipelineBars, PipelineDots, StatusDot, statusLine } from './ui';

const meta: Meta<{ status: Status }> = {
  title: 'Componentes/Pipeline de status',
  argTypes: { status: { control: 'select', options: STATUS_ORDER } },
  args: { status: 'arranjo' },
  parameters: { docs: { description: { component: 'Ideia → Arranjo → Mix → Master → Pronta. Barras finas na Hoje, pontos com rótulos no Detalhe. Pronta usa o verde.' } } },
};
export default meta;
type Story = StoryObj<{ status: Status }>;

export const Barras: Story = {
  render: ({ status }) => (
    <div className="max-w-[342px]">
      <PipelineBars status={status} />
      <p className="mt-3 text-[13px] text-ink/70">{statusLine(status)}</p>
    </div>
  ),
};
export const Pontos: Story = { render: ({ status }) => <div className="max-w-[342px]"><PipelineDots status={status} onClick={() => {}} /></div> };
export const PontosDeStatus: Story = {
  render: () => (
    <ul className="flex flex-col gap-2 text-[14px]">
      {STATUS_ORDER.map((s) => (
        <li key={s} className="flex items-center gap-2 capitalize"><StatusDot status={s} />{s}</li>
      ))}
    </ul>
  ),
};

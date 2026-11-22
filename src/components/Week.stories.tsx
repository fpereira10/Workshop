import type { Meta, StoryObj } from '@storybook/react-vite';
import { Week } from './ui';

const meta: Meta = {
  title: 'Componentes/Semana',
  parameters: { docs: { description: { component: 'Sequência da semana em pílulas (D S T Q Q S S). Dias com sessão ficam preenchidos; hoje tem contorno.' } } },
};
export default meta;

export const SequenciaDaSemana: StoryObj = { render: () => <div className="max-w-[342px]"><Week /></div> };

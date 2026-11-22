import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, NavPill } from './ui';

const meta: Meta = {
  title: 'Componentes/Navegação',
  parameters: { docs: { description: { component: 'Nav de vidro com 2 itens (Hoje · Faixas) e o avatar que abre a conta.' } } },
};
export default meta;
type Story = StoryObj;

export const NavHoje: Story = { parameters: { route: '#/' }, render: () => <NavPill /> };
export const NavFaixas: Story = { parameters: { route: '#/faixas' }, render: () => <NavPill /> };
export const AvatarConta: Story = { render: () => <Avatar className="size-[52px]" /> };

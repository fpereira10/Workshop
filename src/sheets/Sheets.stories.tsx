import { useEffect, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from '../components/Sheet';
import { Toast } from '../components/Chrome';
import { useStore } from '../state/store';
import { CapturaSheet } from './Captura';
import { FaixaFormSheet } from './FaixaForm';
import { ContaSheet, EnergiaSheet, MenuSheet, StatusSheet } from './Outras';

const frame = (title: string, children: ReactNode) => (
  <Sheet title={title} closing={false} onClose={() => {}}>{children}</Sheet>
);

const meta: Meta = {
  title: 'Folhas/Sheets',
  parameters: {
    frameHeight: 760,
    docs: { story: { inline: false, iframeHeight: 760 }, description: { component: 'Folhas por cima da tela: sobem de baixo no celular e viram janela centralizada a partir de 800px. Raio de 32px no topo.' } },
  },
};
export default meta;
type Story = StoryObj;

export const CapturarIdeia: Story = { render: () => frame('Capturar ideia', <CapturaSheet trackId="mare-baixa" />) };
export const NovaFaixa: Story = { render: () => frame('Nova faixa', <FaixaFormSheet />) };
export const MudarStatus: Story = { render: () => frame('Mudar status', <StatusSheet trackId="mare-baixa" />) };
export const EnergiaDaFaixa: Story = { render: () => frame('Energia da faixa', <EnergiaSheet trackId="mare-baixa" />) };
export const MenuDaFaixa: Story = { render: () => frame('Maré Baixa', <MenuSheet trackId="mare-baixa" />) };
export const Conta: Story = { render: () => frame('Conta', <ContaSheet onSignOut={() => {}} />) };

function ToastDemo() {
  const { showToast } = useStore();
  useEffect(() => showToast('Ideia guardada em Maré Baixa'), [showToast]);
  return <Toast />;
}
export const AvisoToast: Story = {
  name: 'Aviso (toast)',
  parameters: { frameHeight: 200, docs: { story: { inline: false, iframeHeight: 200 } } },
  render: () => <ToastDemo />,
};

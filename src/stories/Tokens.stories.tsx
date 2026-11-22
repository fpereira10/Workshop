import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import primitive from '../../docs/figma-import/primitive.json';
import { ENERGIES, ENERGY_ORDER, energyGradient } from '../lib/energies';

type Tok = { type: string; value: string };
const tokens = primitive as unknown as Record<string, Tok>;
const byPrefix = (prefix: string) => Object.entries(tokens).filter(([n]) => n.startsWith(prefix));

const meta: Meta = {
  title: 'Fundamentos/Tokens',
  parameters: { docs: { description: { component: 'Gerado do mesmo JSON que alimenta o Figma (`docs/figma-import`). Primitivos em `--bn-<nome>`; semânticos são aliases em kebab-case.' } } },
};
export default meta;
type Story = StoryObj;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="glass mb-6 rounded-card p-6">
    <div className="kicker mb-4">{title}</div>
    {children}
  </section>
);

const HUES = ['neutral', 'sand', 'slate', 'indigo', 'violet', 'ember', 'amber', 'mint'];

export const Cores: Story = {
  render: () => (
    <Section title="Cores primitivas">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(132px,1fr))]">
        {[...byPrefix('color-white'), ...byPrefix('color-black'), ...HUES.flatMap((h) => byPrefix(`color-${h}-`))].map(([n, t]) => (
          <div key={n} className="glass-soft overflow-hidden rounded-[20px]">
            <div className="h-14" style={{ background: t.value }} />
            <div className="p-3">
              <div className="truncate text-[12px] font-medium">{n}</div>
              <div className="font-mono text-[11px] text-ink/65">{t.value}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Energias: Story = {
  render: () => (
    <Section title="Energias da faixa · gradiente a 160°">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {ENERGY_ORDER.map((id) => (
          <div key={id} className="overflow-hidden rounded-[20px] border border-ink/15">
            <div className="h-28" style={{ backgroundImage: energyGradient(id) }} />
            <div className="glass-soft p-3">
              <div className="text-[14px] font-medium">{ENERGIES[id].name}</div>
              <div className="font-mono text-[11px] text-ink/65">{ENERGIES[id].from} → {ENERGIES[id].to}</div>
              <div className="mt-1 text-[12px] text-ink/65">{ENERGIES[id].feel}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Tipografia: Story = {
  render: () => (
    <Section title="Tipografia">
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div><div className="kicker mb-1">font-family-sans</div><div className="text-[28px] font-semibold tracking-[-0.01em]">Inter · Maré Baixa</div></div>
        <div><div className="kicker mb-1">font-family-mono</div><div className="font-mono text-[18px]">122 BPM · LÁ MENOR</div></div>
      </div>
      {byPrefix('font-size-').map(([n, t]) => (
        <div key={n} className="flex items-baseline gap-4 border-t border-ink/10 py-2">
          <span className="w-28 shrink-0 font-mono text-[11px] text-ink/65">{n}</span>
          <span style={{ fontSize: Math.min(Number(t.value), 56) }} className="truncate font-medium leading-tight">Do loop à faixa pronta</span>
        </div>
      ))}
    </Section>
  ),
};

export const Espacamento: Story = {
  render: () => (
    <Section title="Espaçamento · base de 4px">
      {byPrefix('space-').filter(([n]) => !n.includes('neg')).map(([n, t]) => (
        <div key={n} className="flex items-center gap-4 py-1">
          <span className="w-24 shrink-0 font-mono text-[11px] text-ink/65">{n}</span>
          <span className="h-3 rounded-full bg-ink/80" style={{ width: Number(t.value) }} />
          <span className="font-mono text-[11px] text-ink/65">{t.value}px</span>
        </div>
      ))}
    </Section>
  ),
};

export const RaiosEEfeitos: Story = {
  render: () => (
    <>
      <Section title="Raio de borda">
        <div className="flex flex-wrap gap-4">
          {byPrefix('radius-').map(([n, t]) => (
            <div key={n} className="text-center">
              <div className="glass size-20" style={{ borderRadius: Math.min(Number(t.value), 40) }} />
              <div className="mt-2 font-mono text-[11px] text-ink/65">{n}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Vidro">
        <div className="grid gap-3 md:grid-cols-3">
          {(['glass-soft', 'glass', 'glass-strong'] as const).map((c) => (
            <div key={c} className={`${c} rounded-card p-6 text-[14px]`}>{c}</div>
          ))}
        </div>
      </Section>
    </>
  ),
};

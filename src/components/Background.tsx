import { ENERGY_ORDER, energyBackground, energyScrim } from '../lib/energies';
import type { EnergyId } from '../lib/types';

/** Fundo em tela cheia da energia, com crossfade entre energias */
export function Background({ active }: { active: EnergyId }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ENERGY_ORDER.map((id) => (
        <div
          key={id}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: id === active ? 1 : 0 }}
        >
          <div className="absolute inset-0" style={energyBackground(id)} />
          <div className="absolute inset-0" style={energyScrim(id)} />
        </div>
      ))}
    </div>
  );
}

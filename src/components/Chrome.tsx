import { useStore } from '../state/store';
import { Check } from './Icons';
import { Avatar, CaptureButton, NavPill } from './ui';

/** Desktop (≥800px): a mesma nav de vidro, no topo */
export function TopBar() {
  const { navigate } = useStore();
  return (
    <header className="relative z-20 mx-auto hidden max-w-[1360px] items-center justify-between px-10 pt-7 md:flex lg:px-14">
      <div className="flex items-center gap-7">
        <button onClick={() => navigate({ name: 'hoje' })} className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em]">
          <span className="grid size-7 place-items-center rounded-full bg-ink/90">
            <span className="size-2.5 rounded-full bg-rec" />
          </span>
          bounce
        </button>
        <NavPill />
      </div>
      <div className="flex items-center gap-3">
        <CaptureButton className="h-[52px] px-6" />
        <Avatar className="size-[52px]" />
      </div>
    </header>
  );
}

/** Celular: nav de 2 itens + Capturar sempre visível */
export function BottomBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-6 pb-[max(env(safe-area-inset-bottom),24px)] md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-[560px] gap-2">
        <NavPill />
        <CaptureButton className="flex-1 px-4" />
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className="anim-toast-in glass-strong fixed left-1/2 top-[calc(env(safe-area-inset-top)+16px)] z-50 flex h-11 max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-full pl-3 pr-5 text-[14px] font-medium shadow-[0_8px_32px_rgba(0,0,0,.18)] md:top-7"
    >
      <span className="grid size-6 place-items-center rounded-full bg-ink/90 text-ink-inverse">
        <Check size={14} strokeWidth={2.4} />
      </span>
      <span className="truncate">{toast.msg}</span>
    </div>
  );
}

import { useEffect, type ReactNode } from 'react';
import { cx } from '../lib/utils';
import { Close } from './Icons';

/** Folha: sobe por baixo no celular, vira modal centralizado no desktop */
export function Sheet({ title, closing, onClose, children, className }: { title: string; closing: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center md:p-6">
      <div onClick={onClose} className={cx('absolute inset-0', closing ? 'anim-fade-out' : 'anim-fade-in')} style={{ background: 'var(--bn-overlay)' }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'sheet-surface relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-sheet border-b-0 md:max-h-[86dvh] md:w-[480px] md:rounded-sheet md:border-b',
          closing ? 'anim-sheet-out' : 'anim-sheet-in',
          className,
        )}
      >
        <div className="mx-auto mt-2.5 h-[5px] w-9 shrink-0 rounded-full bg-ink/30 md:hidden" />
        <div className="flex shrink-0 items-center justify-between px-6 pb-2 pt-4 md:pt-6">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="glass grid size-9 place-items-center rounded-full hover:bg-ink/20">
            <Close size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 md:pb-7">{children}</div>
      </div>
    </div>
  );
}

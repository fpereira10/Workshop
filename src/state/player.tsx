import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Idea } from '../lib/types';
import { useStore } from './store';

interface Player {
  playingId: string | null;
  progress: number;
  toggle: (idea: Idea) => void;
  stop: () => void;
}

const Ctx = createContext<Player | null>(null);

/** Um único player para os memos salvos */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const { showToast, loadAudio } = useStore();
  const audio = useRef<HTMLAudioElement | null>(null);
  const url = useRef<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const stop = useCallback(() => {
    audio.current?.pause();
    setPlayingId(null);
    setProgress(0);
  }, []);

  useEffect(() => () => {
    audio.current?.pause();
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);

  const toggle = useCallback(
    async (idea: Idea) => {
      if (playingId === idea.id) return stop();
      stop();
      if (!idea.audioPath) {
        showToast('Memo de exemplo, sem áudio gravado');
        return;
      }
      const blob = await loadAudio(idea).catch(() => undefined);
      if (!blob) {
        showToast('Não encontrei o áudio deste memo');
        return;
      }
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      const a = audio.current ?? (audio.current = new Audio());
      a.src = url.current;
      a.ontimeupdate = () => {
        const d = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : idea.durationSec || 1;
        setProgress(Math.min(1, a.currentTime / d));
      };
      a.onended = () => {
        setPlayingId(null);
        setProgress(0);
      };
      setPlayingId(idea.id);
      try {
        await a.play();
      } catch {
        setPlayingId(null);
        showToast('Não foi possível tocar o memo');
      }
    },
    [playingId, stop, showToast, loadAudio],
  );

  return <Ctx.Provider value={{ playingId, progress, toggle, stop }}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const p = useContext(Ctx);
  if (!p) throw new Error('usePlayer fora do PlayerProvider');
  return p;
}

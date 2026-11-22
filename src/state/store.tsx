import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppData, EnergyId, Idea, Track } from '../lib/types';
import { audioPathFor, EMPTY_DATA, type Repo } from '../lib/repo';
import { isoDay } from '../lib/time';
import { uid } from '../lib/utils';

/* ── Reducer: estado local otimista; o banco é a fonte de verdade ────── */

type Action =
  | { type: 'replace'; data: AppData }
  | { type: 'track/create'; track: Track }
  | { type: 'track/update'; id: string; patch: Partial<Track> }
  | { type: 'track/delete'; id: string }
  | { type: 'idea/add'; idea: Idea }
  | { type: 'idea/update'; id: string; patch: Partial<Idea> }
  | { type: 'idea/delete'; id: string }
  | { type: 'pin'; id: string | null };

/** Qualquer registro conta como dia produzido na semana */
function withSession(d: AppData): AppData {
  const day = isoDay(Date.now());
  return d.sessions.includes(day) ? d : { ...d, sessions: [...d.sessions, day] };
}

function touch(tracks: Track[], id: string | null | undefined) {
  if (!id) return tracks;
  const now = Date.now();
  return tracks.map((t) => (t.id === id ? { ...t, updatedAt: now } : t));
}

function reducer(d: AppData, a: Action): AppData {
  switch (a.type) {
    case 'replace':
      return a.data;
    case 'track/create':
      return withSession({ ...d, tracks: [a.track, ...d.tracks] });
    case 'track/update':
      return withSession({
        ...d,
        tracks: d.tracks.map((t) => (t.id === a.id ? { ...t, ...a.patch, updatedAt: Date.now() } : t)),
      });
    case 'track/delete':
      return {
        ...d,
        tracks: d.tracks.filter((t) => t.id !== a.id),
        ideas: d.ideas.map((i) => (i.trackId === a.id ? { ...i, trackId: null } : i)),
        pinnedId: d.pinnedId === a.id ? null : d.pinnedId,
      };
    case 'idea/add':
      return withSession({ ...d, tracks: touch(d.tracks, a.idea.trackId), ideas: [a.idea, ...d.ideas] });
    case 'idea/update':
      return {
        ...d,
        tracks: 'trackId' in a.patch ? touch(d.tracks, a.patch.trackId) : d.tracks,
        ideas: d.ideas.map((i) => (i.id === a.id ? { ...i, ...a.patch } : i)),
      };
    case 'idea/delete':
      return { ...d, ideas: d.ideas.filter((i) => i.id !== a.id) };
    case 'pin':
      return { ...d, pinnedId: a.id };
  }
}

/* ── Navegação: views em tela cheia + folhas por cima ────────────────── */

export type View = { name: 'hoje' } | { name: 'faixas' } | { name: 'faixa'; id: string };

export type Sheet =
  | { type: 'captura'; trackId?: string | null }
  | { type: 'faixa-form'; editId?: string; ideaId?: string }
  | { type: 'status'; trackId: string }
  | { type: 'energia'; trackId: string }
  | { type: 'menu'; trackId: string }
  | { type: 'conta' };

function viewFromHash(): View {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h === 'faixas') return { name: 'faixas' };
  if (h.startsWith('faixa/')) return { name: 'faixa', id: decodeURIComponent(h.slice(6)) };
  return { name: 'hoje' };
}

function hashFor(v: View) {
  if (v.name === 'hoje') return '#/';
  if (v.name === 'faixas') return '#/faixas';
  return `#/faixa/${encodeURIComponent(v.id)}`;
}

const sameView = (a: View, b: View) => a.name === b.name && (a.name !== 'faixa' || (b.name === 'faixa' && a.id === b.id));

/* ── Context ─────────────────────────────────────────────────────────────────── */

export type NewTrack = Pick<Track, 'name' | 'bpm' | 'key' | 'energy'> & Partial<Pick<Track, 'status' | 'nextStep'>>;

interface Store {
  data: AppData;
  focus: Track | null;
  view: View;
  navigate: (v: View, opts?: { replace?: boolean }) => void;
  back: () => void;
  sheet: Sheet | null;
  openSheet: (s: Sheet) => void;
  closeSheet: () => void;
  toast: { id: number; msg: string } | null;
  showToast: (msg: string) => void;
  previewEnergy: EnergyId | null;
  setPreviewEnergy: (e: EnergyId | null) => void;
  createTrack: (t: NewTrack) => Track;
  updateTrack: (id: string, patch: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  /** Para memos: passe o áudio gravado; o app sobe para o Storage. */
  addIdea: (i: Idea, audio?: Blob) => void;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  loadAudio: (idea: Idea) => Promise<Blob | undefined>;
  pin: (id: string | null) => void;
}

const Ctx = createContext<Store | null>(null);

interface ProviderProps {
  repo: Repo;
  /** Estado inicial já pronto (Storybook). Sem ele, carrega do repositório. */
  initial?: AppData;
  children: ReactNode;
}

export function StoreProvider({ repo, initial, children }: ProviderProps) {
  const [data, dispatch] = useReducer(reducer, initial ?? EMPTY_DATA);
  const [ready, setReady] = useState(Boolean(initial));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<View>(viewFromHash);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);
  const [previewEnergy, setPreviewEnergy] = useState<EnergyId | null>(null);
  const depth = useRef(0);
  const toastTimer = useRef<number | undefined>(undefined);
  const dataRef = useRef(data);
  dataRef.current = data;
  const viewRef = useRef(view);
  viewRef.current = view;
  /** Fila: as gravações no banco saem na mesma ordem em que o usuário agiu. */
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  /** Áudios gravados nesta sessão tocam na hora, sem esperar o download. */
  const blobs = useRef(new Map<string, Blob>());

  const showToast = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), msg });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const refresh = useCallback(async () => {
    try {
      dispatch({ type: 'replace', data: await repo.load() });
      setLoadError(null);
      setReady(true);
    } catch (e) {
      console.error(e);
      setLoadError(e instanceof Error ? e.message : 'Erro desconhecido');
    }
  }, [repo]);

  useEffect(() => {
    if (!initial) void refresh();
    // só no primeiro carregamento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Roda uma gravação no banco. Se falhar, avisa e volta ao estado real. */
  const run = useCallback(
    (op: () => Promise<unknown>) => {
      queue.current = queue.current
        .then(op)
        .catch((e) => {
          console.error(e);
          showToast('Não foi possível salvar. Atualizando…');
          return refresh();
        });
    },
    [refresh, showToast],
  );

  /** Registra o dia de hoje como dia produzido, uma vez só. */
  const markSession = useCallback(() => {
    const day = isoDay(Date.now());
    if (!dataRef.current.sessions.includes(day)) run(() => repo.addSession(day));
  }, [repo, run]);

  useEffect(() => {
    const onPop = () => {
      depth.current = Math.max(0, depth.current - 1);
      setView(viewFromHash());
      setSheet(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((v: View, opts?: { replace?: boolean }) => {
    if (sameView(viewRef.current, v)) return;
    if (opts?.replace) window.history.replaceState(null, '', hashFor(v));
    else {
      window.history.pushState(null, '', hashFor(v));
      depth.current += 1;
    }
    window.scrollTo({ top: 0 });
    setView(v);
  }, []);

  const back = useCallback(() => {
    if (depth.current > 0) window.history.back();
    else navigate({ name: 'hoje' }, { replace: true });
  }, [navigate]);

  const focus = useMemo(() => {
    const pinned = data.tracks.find((t) => t.id === data.pinnedId);
    if (pinned) return pinned;
    const byRecent = [...data.tracks].sort((a, b) => b.updatedAt - a.updatedAt);
    return byRecent.find((t) => t.status !== 'pronta') ?? byRecent[0] ?? null;
  }, [data.tracks, data.pinnedId]);

  const value = useMemo<Store>(
    () => ({
      data,
      focus,
      view,
      navigate,
      back,
      sheet,
      openSheet: setSheet,
      closeSheet: () => setSheet(null),
      toast,
      showToast,
      previewEnergy,
      setPreviewEnergy,
      createTrack: (t) => {
        const now = Date.now();
        const track: Track = { id: uid(), status: 'ideia', nextStep: '', createdAt: now, updatedAt: now, ...t };
        markSession();
        dispatch({ type: 'track/create', track });
        run(() => repo.createTrack(track));
        return track;
      },
      updateTrack: (id, patch) => {
        markSession();
        dispatch({ type: 'track/update', id, patch });
        run(() => repo.updateTrack(id, patch));
      },
      deleteTrack: (id) => {
        dispatch({ type: 'track/delete', id });
        run(() => repo.deleteTrack(id));
      },
      addIdea: (idea, audio) => {
        const full: Idea = audio ? { ...idea, audioPath: audioPathFor(repo.userId, idea.id, audio) } : idea;
        if (audio) blobs.current.set(full.id, audio);
        markSession();
        dispatch({ type: 'idea/add', idea: full });
        run(() => repo.addIdea(full, audio));
      },
      updateIdea: (id, patch) => {
        dispatch({ type: 'idea/update', id, patch });
        run(() => repo.updateIdea(id, patch));
      },
      deleteIdea: (id) => {
        const idea = dataRef.current.ideas.find((i) => i.id === id);
        dispatch({ type: 'idea/delete', id });
        blobs.current.delete(id);
        if (idea) run(() => repo.deleteIdea(idea));
      },
      loadAudio: async (idea) => blobs.current.get(idea.id) ?? repo.audio(idea),
      pin: (id) => {
        dispatch({ type: 'pin', id });
        run(() => repo.setFocus(id));
      },
    }),
    [data, focus, view, navigate, back, sheet, toast, showToast, previewEnergy, repo, run, markSession],
  );

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center bg-neutral-950 px-6 text-center font-sans text-white/80">
        {loadError ? (
          <div className="max-w-[360px]">
            <p className="text-[17px] font-medium text-white">Não consegui carregar suas faixas</p>
            <p className="mt-2 text-[14px] leading-5 text-white/60">{loadError}</p>
            <button onClick={() => void refresh()} className="mt-5 h-12 rounded-full bg-[#F4EDE4] px-6 text-[15px] font-semibold text-neutral-900">
              Tentar de novo
            </button>
          </div>
        ) : (
          <p className="font-mono text-[12px] uppercase tracking-[.11em] text-white/60">Carregando…</p>
        )}
      </div>
    );
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fora do StoreProvider');
  return s;
}

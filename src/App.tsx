import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ENERGIES } from './lib/energies';
import type { EnergyId } from './lib/types';
import { remoteRepo } from './lib/remoteRepo';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './state/auth';
import { StoreProvider, useStore, type Sheet as SheetState } from './state/store';
import { PlayerProvider } from './state/player';
import { Background } from './components/Background';
import { BottomBar, Toast, TopBar } from './components/Chrome';
import { Sheet } from './components/Sheet';
import { Hoje } from './screens/Hoje';
import { Faixas } from './screens/Faixas';
import { Detalhe } from './screens/Detalhe';
import { Login } from './screens/Login';
import { CapturaSheet } from './sheets/Captura';
import { FaixaFormSheet } from './sheets/FaixaForm';
import { ContaSheet, EnergiaSheet, MenuSheet, StatusSheet } from './sheets/Outras';

const TITLES: Record<SheetState['type'], string> = {
  captura: 'Capturar ideia',
  'faixa-form': 'Nova faixa',
  status: 'Mudar status',
  energia: 'Energia da faixa',
  menu: 'Faixa',
  conta: 'Conta',
};

function SheetHost() {
  const { sheet, closeSheet, data } = useStore();
  const { signOut } = useAuth();
  const [shown, setShown] = useState<SheetState | null>(sheet);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sheet) {
      setShown(sheet);
      setClosing(false);
      return;
    }
    if (!shown) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setShown(null);
      setClosing(false);
    }, 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const onClose = useCallback(() => closeSheet(), [closeSheet]);
  if (!shown) return null;

  let title = TITLES[shown.type];
  if (shown.type === 'faixa-form' && shown.editId) title = 'Editar faixa';
  if (shown.type === 'menu') title = data.tracks.find((t) => t.id === shown.trackId)?.name ?? title;

  const key = shown.type + ('trackId' in shown ? shown.trackId : '') + ('editId' in shown ? shown.editId : '') + ('ideaId' in shown ? shown.ideaId : '');

  return (
    <Sheet key={shown.type} title={title} closing={closing} onClose={onClose}>
      <div key={key}>
        {shown.type === 'captura' && <CapturaSheet trackId={shown.trackId} />}
        {shown.type === 'faixa-form' && <FaixaFormSheet editId={shown.editId} ideaId={shown.ideaId} />}
        {shown.type === 'status' && <StatusSheet trackId={shown.trackId} />}
        {shown.type === 'energia' && <EnergiaSheet trackId={shown.trackId} />}
        {shown.type === 'menu' && <MenuSheet trackId={shown.trackId} />}
        {shown.type === 'conta' && <ContaSheet onSignOut={() => void signOut()} />}
      </div>
    </Sheet>
  );
}

function toneVars(id: EnergyId): CSSProperties {
  const e = ENERGIES[id];
  return { '--bn-ink': e.ink, '--bn-ink-inverse': e.inverse, '--bn-pipe': e.pipe } as CSSProperties;
}

function Shell() {
  const { data, view, focus, previewEnergy, navigate } = useStore();
  const track = view.name === 'faixa' ? data.tracks.find((t) => t.id === view.id) : undefined;

  // Faixa apagada ou link inválido: volta para a Hoje
  useEffect(() => {
    if (view.name === 'faixa' && !track) navigate({ name: 'hoje' }, { replace: true });
  }, [view, track, navigate]);

  const energyId: EnergyId = previewEnergy ?? track?.energy ?? focus?.energy ?? 'hipnotica';
  const tone = ENERGIES[energyId].tone;
  const viewKey = view.name === 'faixa' ? `faixa-${view.id}` : view.name;

  return (
    <div data-tone={tone} style={toneVars(energyId)} className="tone-root relative isolate min-h-dvh font-sans text-ink">
      <meta name="theme-color" content={ENERGIES[energyId].from} />
      <Background active={energyId} />
      <TopBar />
      <main key={viewKey} className="anim-view-in">
        {view.name === 'hoje' && <Hoje />}
        {view.name === 'faixas' && <Faixas />}
        {view.name === 'faixa' && track && <Detalhe track={track} />}
      </main>
      {view.name !== 'faixa' && <BottomBar />}
      <SheetHost />
      <Toast />
    </div>
  );
}

function Splash({ children }: { children?: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-neutral-950 px-6 text-center font-sans text-white/80">
      {children ?? <p className="font-mono text-[12px] uppercase tracking-[.11em] text-white/60">Carregando…</p>}
    </div>
  );
}

/** Sem sessão: login. Com sessão: o app, com os dados da conta. */
function Gate() {
  const { session, loading } = useAuth();
  const user = session?.user;
  const repo = useMemo(
    () =>
      user
        ? remoteRepo(supabase, {
            id: user.id,
            email: user.email ?? '',
            fallbackName: String(user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Produtor'),
          })
        : null,
    // a sessão se renova sozinha; o repositório só muda quando muda a pessoa
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id],
  );

  if (loading) return <Splash />;
  if (!user || !repo) return <Login />;
  return (
    <StoreProvider key={user.id} repo={repo}>
      <PlayerProvider>
        <Shell />
      </PlayerProvider>
    </StoreProvider>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <Splash>
        <div className="max-w-[420px]">
          <p className="text-[17px] font-medium text-white">Falta configurar o Supabase</p>
          <p className="mt-2 text-[14px] leading-5 text-white/60">
            Crie o arquivo <code className="font-mono">.env.local</code> com <code className="font-mono">VITE_SUPABASE_URL</code> e{' '}
            <code className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> (veja o <code className="font-mono">.env.example</code>) e reinicie o servidor.
          </p>
        </div>
      </Splash>
    );
  }
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

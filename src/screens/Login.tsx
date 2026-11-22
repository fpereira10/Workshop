import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { ENERGIES } from '../lib/energies';
import type { EnergyId } from '../lib/types';
import { cx } from '../lib/utils';
import { useAuth } from '../state/auth';
import { Background } from '../components/Background';
import { CtaButton, Kicker, fieldClass } from '../components/ui';

/** Energias que passam devagar no fundo do login */
const CYCLE: EnergyId[] = ['hipnotica', 'melancolica', 'intensa'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'entrar' | 'criar'>('entrar');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [energyIdx, setEnergyIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setEnergyIdx((i) => (i + 1) % CYCLE.length), 7000);
    return () => window.clearInterval(t);
  }, []);

  const energy = ENERGIES[CYCLE[energyIdx]];
  const creating = mode === 'criar';

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    const next: typeof errors = {};
    if (creating && !name.trim()) next.name = 'Como devemos te chamar?';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Confira o e-mail.';
    if (password.length < 6) next.password = 'A senha precisa ter pelo menos 6 caracteres.';
    setErrors(next);
    setServerError(null);
    setInfo(null);
    if (Object.keys(next).length) return;

    setLoading(true);
    const mail = email.trim().toLowerCase();
    if (creating) {
      const res = await signUp(name.trim().slice(0, 60), mail, password);
      if (res.error) setServerError(res.error);
      else if (res.needsConfirm) {
        setInfo('Enviamos um link de confirmação para ' + mail + '. Confirme e depois entre.');
        setMode('entrar');
      }
      // sem needsConfirm: a sessão já abriu e o app troca de tela sozinho
    } else {
      const err = await signIn(mail, password);
      if (err) setServerError(err);
    }
    setLoading(false);
  }

  const switchMode = () => {
    setMode(creating ? 'entrar' : 'criar');
    setErrors({});
    setServerError(null);
    setInfo(null);
  };

  return (
    <div
      data-tone="dark"
      style={{ '--bn-ink': energy.ink, '--bn-ink-inverse': energy.inverse } as CSSProperties}
      className="tone-root relative isolate min-h-dvh font-sans text-ink"
    >
      <Background active={CYCLE[energyIdx]} />

      <main className="anim-view-in mx-auto flex min-h-dvh max-w-[1240px] flex-col px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-[calc(env(safe-area-inset-top)+28px)] lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end lg:gap-20 lg:px-14 lg:py-14">
        {/* Marca + assinatura */}
        <section className="flex flex-1 flex-col lg:h-full lg:justify-between lg:py-4">
          <div className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em]">
            <span className="grid size-7 place-items-center rounded-full bg-ink/90">
              <span className="size-2.5 rounded-full bg-rec" />
            </span>
            bounce
          </div>
          <div className="flex-1" />
          <div className="mb-8 lg:mb-0">
            <Kicker>{creating ? 'Primeira sessão' : 'Bem-vindo de volta'}</Kicker>
            <h1 className="mt-4 text-[44px] font-semibold leading-[.98] tracking-[-0.03em] text-balance md:text-[56px] lg:text-[84px]">
              Do loop à faixa pronta.
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-6 text-ink/70 lg:text-[17px] lg:leading-7">
              Um lugar calmo para suas faixas, suas ideias e o próximo passo de cada uma.
            </p>
            <Kicker strong className="mt-6 hidden lg:block">
              {energy.name} · {energy.feel}
            </Kicker>
          </div>
        </section>

        {/* Formulário */}
        <form onSubmit={submit} noValidate className="glass w-full rounded-card p-5 md:mx-auto md:max-w-[440px] md:p-7 lg:mx-0 lg:mb-4">
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">{creating ? 'Criar conta' : 'Entrar'}</h2>

          <div className="mt-5 flex flex-col gap-3">
            {creating && (
              <Field label="Nome" error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Seu nome"
                  className={cx(fieldClass, 'h-14 text-[16px]', errors.name && 'border-ink/70')}
                />
              </Field>
            )}
            <Field label="E-mail" error={errors.email}>
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="voce@exemplo.com"
                className={cx(fieldClass, 'h-14 text-[16px]', errors.email && 'border-ink/70')}
              />
            </Field>
            <Field label="Senha" error={errors.password}>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={creating ? 'new-password' : 'current-password'}
                  placeholder={creating ? 'Pelo menos 6 caracteres' : 'Sua senha'}
                  className={cx(fieldClass, 'h-14 pr-20 text-[16px]', errors.password && 'border-ink/70')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full px-3 text-[13px] text-ink/70 hover:text-ink"
                  aria-label={showPass ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPass ? 'Esconder' : 'Mostrar'}
                </button>
              </div>
            </Field>
          </div>

          {serverError && (
            <p role="alert" className="mt-4 text-[14px] leading-5 text-ink/90">
              {serverError}
            </p>
          )}
          {info && (
            <p role="status" className="mt-4 text-[14px] leading-5 text-ink/90">
              {info}
            </p>
          )}

          <CtaButton type="submit" disabled={loading} className="mt-6 h-14 w-full text-[15px]">
            {loading ? (creating ? 'Criando…' : 'Entrando…') : creating ? 'Criar conta' : 'Entrar'}
          </CtaButton>

          <p className="mt-5 text-center text-[14px] text-ink/70">
            {creating ? 'Já tem conta? ' : 'Ainda não tem conta? '}
            <button type="button" onClick={switchMode} className="font-semibold text-ink underline-offset-4 hover:underline">
              {creating ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="kicker mb-2 block">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-[13px] text-ink/85">
          {error}
        </span>
      )}
    </label>
  );
}

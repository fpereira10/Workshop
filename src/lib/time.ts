const DAY = 86_400_000;
const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const pad = (n: number) => String(n).padStart(2, '0');

export function startOfDay(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysAgo(t: number, now = Date.now()) {
  return Math.round((startOfDay(now) - startOfDay(t)) / DAY);
}

export function isoDay(t: number) {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function hhmm(t: number) {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function relDays(d: number) {
  if (d <= 0) return 'hoje';
  if (d === 1) return 'ontem';
  if (d >= 14 && d % 7 === 0) return `há ${d / 7} semanas`;
  return `há ${d} dias`;
}

/** "ontem, 23:10", "há 2 dias", "agora" */
export function relIdea(t: number) {
  const d = daysAgo(t);
  if (d <= 0) {
    const mins = (Date.now() - t) / 60_000;
    return mins < 2 ? 'agora' : `hoje, ${hhmm(t)}`;
  }
  if (d === 1) return `ontem, ${hhmm(t)}`;
  return relDays(d);
}

export function relTrack(t: number) {
  return relDays(daysAgo(t));
}

export function fmtDuration(sec: number) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

/** "HOJE · SÁB 21 NOV" */
export function todayKicker(now = Date.now()) {
  const d = new Date(now);
  return `Hoje · ${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function greeting(now = Date.now()) {
  const h = new Date(now).getHours();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Domingo → sábado da semana atual */
export function weekDays(now = Date.now()) {
  const start = new Date(startOfDay(now));
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.getTime();
  });
}

export const COOLING_DAYS = 14;

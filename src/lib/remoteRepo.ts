import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { EMPTY_DATA, type Repo } from './repo';
import { isoDay } from './time';
import type { AppData, Idea, Track } from './types';

type Db = SupabaseClient<Database>;
type TrackRow = Database['public']['Tables']['tracks']['Row'];
type IdeaRow = Database['public']['Tables']['ideas']['Row'];

const BUCKET = 'memos';
const PEAKS_KEY = 'bounce:peaks:';

/** O banco não guarda a forma de onda: ela fica só neste aparelho. */
const readPeaks = (id: string): number[] | undefined => {
  try {
    const raw = localStorage.getItem(PEAKS_KEY + id);
    return raw ? (JSON.parse(raw) as number[]) : undefined;
  } catch {
    return undefined;
  }
};
const savePeaks = (id: string, peaks?: number[]) => {
  try {
    if (peaks?.length) localStorage.setItem(PEAKS_KEY + id, JSON.stringify(peaks));
  } catch {
    /* sem storage: a waveform fica genérica */
  }
};

const toTrack = (r: TrackRow): Track => ({
  id: r.id,
  name: r.name,
  bpm: r.bpm,
  key: r.musical_key ?? '',
  energy: r.energy,
  status: r.status,
  nextStep: r.next_step ?? '',
  createdAt: new Date(r.created_at).getTime(),
  // "há X dias" e "esfriando" seguem a última atividade, que os triggers mantêm
  updatedAt: new Date(r.last_activity_at).getTime(),
});

const toIdea = (r: IdeaRow): Idea => ({
  id: r.id,
  kind: r.type,
  title: r.title,
  text: r.body ?? '',
  trackId: r.track_id,
  createdAt: new Date(r.created_at).getTime(),
  durationSec: r.duration_sec ?? undefined,
  audioPath: r.audio_path,
  peaks: r.type === 'memo' ? readPeaks(r.id) : undefined,
});

function trackColumns(p: Partial<Track>): Database['public']['Tables']['tracks']['Update'] {
  const out: Database['public']['Tables']['tracks']['Update'] = {};
  if (p.name !== undefined) out.name = p.name;
  if (p.bpm !== undefined) out.bpm = p.bpm;
  if (p.key !== undefined) out.musical_key = p.key || null;
  if (p.energy !== undefined) out.energy = p.energy;
  if (p.status !== undefined) out.status = p.status;
  if (p.nextStep !== undefined) out.next_step = p.nextStep || null;
  return out;
}

const fail = (e: { message: string } | null) => {
  if (e) throw new Error(e.message);
};

export function remoteRepo(db: Db, user: { id: string; email: string; fallbackName: string }): Repo {
  return {
    userId: user.id,

    async load(): Promise<AppData> {
      const since = isoDay(Date.now() - 14 * 86_400_000);
      const [profile, tracks, ideas, sessions] = await Promise.all([
        db.from('profiles').select('display_name, focus_track_id').eq('id', user.id).maybeSingle(),
        db.from('tracks').select('*').order('last_activity_at', { ascending: false }),
        db.from('ideas').select('*').order('created_at', { ascending: false }),
        db.from('sessions').select('day').gte('day', since),
      ]);
      fail(profile.error);
      fail(tracks.error);
      fail(ideas.error);
      fail(sessions.error);
      return {
        ...EMPTY_DATA,
        user: { name: profile.data?.display_name ?? user.fallbackName, email: user.email },
        tracks: (tracks.data ?? []).map(toTrack),
        ideas: (ideas.data ?? []).map(toIdea),
        sessions: (sessions.data ?? []).map((s) => s.day),
        pinnedId: profile.data?.focus_track_id ?? null,
      };
    },

    async createTrack(t) {
      const { error } = await db.from('tracks').insert({
        id: t.id,
        user_id: user.id,
        ...trackColumns(t),
        name: t.name,
        bpm: t.bpm,
      });
      fail(error);
    },

    async updateTrack(id, patch) {
      const cols = trackColumns(patch);
      if (!Object.keys(cols).length) return;
      const { error } = await db.from('tracks').update(cols).eq('id', id);
      fail(error);
    },

    async deleteTrack(id) {
      const { error } = await db.from('tracks').delete().eq('id', id);
      fail(error);
    },

    async addIdea(idea, audio) {
      if (audio && idea.audioPath) {
        const { error } = await db.storage.from(BUCKET).upload(idea.audioPath, audio, {
          contentType: audio.type.split(';')[0] || 'audio/webm',
          upsert: false,
        });
        fail(error);
      }
      const { error } = await db.from('ideas').insert({
        id: idea.id,
        user_id: user.id,
        track_id: idea.trackId,
        type: idea.kind,
        title: idea.title,
        body: idea.kind === 'nota' ? idea.text : null,
        duration_sec: idea.kind === 'memo' ? Math.max(1, idea.durationSec ?? 1) : null,
        audio_path: idea.audioPath ?? null,
        created_at: new Date(idea.createdAt).toISOString(),
      });
      if (error) {
        // não deixa áudio órfão no Storage
        if (audio && idea.audioPath) await db.storage.from(BUCKET).remove([idea.audioPath]);
        fail(error);
      }
      savePeaks(idea.id, idea.peaks);
    },

    async updateIdea(id, patch) {
      const cols: Database['public']['Tables']['ideas']['Update'] = {};
      if (patch.trackId !== undefined) cols.track_id = patch.trackId;
      if (patch.title !== undefined) cols.title = patch.title;
      if (!Object.keys(cols).length) return;
      const { error } = await db.from('ideas').update(cols).eq('id', id);
      fail(error);
    },

    async deleteIdea(idea) {
      const { error } = await db.from('ideas').delete().eq('id', idea.id);
      fail(error);
      if (idea.audioPath) await db.storage.from(BUCKET).remove([idea.audioPath]);
      try {
        localStorage.removeItem(PEAKS_KEY + idea.id);
      } catch {
        /* ignora */
      }
    },

    async addSession(day) {
      // um dia por pessoa (unique user_id + day): repetir é ignorado
      const { error } = await db
        .from('sessions')
        .upsert({ user_id: user.id, day, source: 'auto' }, { onConflict: 'user_id,day', ignoreDuplicates: true });
      fail(error);
    },

    async setFocus(trackId) {
      const { error } = await db.from('profiles').update({ focus_track_id: trackId }).eq('id', user.id);
      fail(error);
    },

    async audio(idea) {
      if (!idea.audioPath) return undefined;
      const { data, error } = await db.storage.from(BUCKET).download(idea.audioPath);
      fail(error);
      return data ?? undefined;
    },
  };
}

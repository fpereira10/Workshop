import type { AppData, Idea, Track } from './types';

/** Tudo que o app persiste. Há duas implementações: remota (Supabase) e em memória (Storybook). */
export interface Repo {
  userId: string;
  load(): Promise<AppData>;
  createTrack(t: Track): Promise<void>;
  updateTrack(id: string, patch: Partial<Track>): Promise<void>;
  deleteTrack(id: string): Promise<void>;
  /** Se houver áudio, sobe para idea.audioPath antes de gravar a linha. */
  addIdea(idea: Idea, audio?: Blob): Promise<void>;
  updateIdea(id: string, patch: Partial<Idea>): Promise<void>;
  deleteIdea(idea: Idea): Promise<void>;
  addSession(day: string): Promise<void>;
  setFocus(trackId: string | null): Promise<void>;
  audio(idea: Idea): Promise<Blob | undefined>;
}

export const EMPTY_DATA: AppData = {
  version: 1,
  user: { name: '', email: '' },
  tracks: [],
  ideas: [],
  sessions: [],
  pinnedId: null,
};

/** Caminho no Storage: <user_id>/<ideia>.<ext>. O banco exige o prefixo do usuário. */
export function audioPathFor(userId: string, ideaId: string, blob: Blob) {
  const mime = blob.type.split(';')[0];
  const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'webm';
  return `${userId}/${ideaId}.${ext}`;
}

/** Não persiste nada: usado no Storybook. */
export function memoryRepo(): Repo {
  const none = async () => undefined;
  return {
    userId: 'storybook',
    load: async () => EMPTY_DATA,
    createTrack: none,
    updateTrack: none,
    deleteTrack: none,
    addIdea: none,
    updateIdea: none,
    deleteIdea: none,
    addSession: none,
    setFocus: none,
    audio: async () => undefined,
  };
}

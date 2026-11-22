import { useCallback, useEffect, useRef, useState } from 'react';
import { resample } from '../lib/utils';

export type MicState = 'idle' | 'pedindo' | 'negado' | 'indisponivel' | 'gravando' | 'gravado';

const BARS = 32;

/** Gravação com MediaRecorder + waveform ao vivo via AnalyserNode */
export function useRecorder() {
  const [state, setState] = useState<MicState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0));
  const [blob, setBlob] = useState<Blob | null>(null);

  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const raf = useRef(0);
  const peaks = useRef<number[]>([]);

  const teardown = useCallback(() => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void ctx.current?.close().catch(() => undefined);
    ctx.current = null;
  }, []);

  useEffect(
    () => () => {
      if (recorder.current && recorder.current.state !== 'inactive') {
        recorder.current.onstop = null;
        recorder.current.stop();
      }
      teardown();
    },
    [teardown],
  );

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState('indisponivel');
      return;
    }
    setState('pedindo');
    let s: MediaStream;
    try {
      s = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState('negado');
      return;
    }
    stream.current = s;
    const chunks: Blob[] = [];
    const rec = new MediaRecorder(s);
    recorder.current = rec;
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      setBlob(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      setState('gravado');
      teardown();
    };

    const ac = new AudioContext();
    ctx.current = ac;
    const analyser = ac.createAnalyser();
    analyser.fftSize = 1024;
    ac.createMediaStreamSource(s).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);

    peaks.current = [];
    setBlob(null);
    rec.start();
    setState('gravando');
    const t0 = performance.now();
    let lastPeak = 0;

    const loop = (now: number) => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const level = Math.min(1, Math.sqrt(sum / buf.length) * 5);
      setLevels((l) => [...l.slice(1), level]);
      if (now - lastPeak > 100) {
        peaks.current.push(level);
        lastPeak = now;
      }
      setElapsed((now - t0) / 1000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, [teardown]);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (recorder.current && recorder.current.state !== 'inactive') recorder.current.stop();
  }, []);

  const reset = useCallback(() => {
    setBlob(null);
    setElapsed(0);
    setLevels(Array(BARS).fill(0));
    setState('idle');
  }, []);

  const getPeaks = useCallback((n: number) => resample(peaks.current, n), []);

  return { state, elapsed, levels, blob, start, stop, reset, getPeaks };
}

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';
import type { Voice } from 'expo-speech';
import { loadJSON, saveJSON, StorageKeys } from '../storage/store';

export const RATE_OPTIONS = [
  { label: 'Chậm', value: 0.7 },
  { label: 'Bình thường', value: 1 },
  { label: 'Nhanh', value: 1.3 },
] as const;

export const PITCH_OPTIONS = [
  { label: 'Thấp', value: 0.8 },
  { label: 'Bình thường', value: 1 },
  { label: 'Cao', value: 1.2 },
] as const;

export const VOLUME_OPTIONS = [
  { label: 'Nhỏ', value: 0.5 },
  { label: 'Bình thường', value: 0.85 },
  { label: 'Lớn', value: 1 },
] as const;

type SpeechConfigState = {
  rate: number;
  pitch: number;
  volume: number;
  voices: Voice[];
  selectedVoiceId: string | null;
  /** true sau khi đã truy vấn danh sách giọng của máy — dùng để hiện cảnh báo thiếu giọng Hàn. */
  voicesLoaded: boolean;
};

/** Phần cấu hình được lưu vào AsyncStorage (không gồm danh sách voices của máy). */
type PersistedSpeechConfig = {
  rate: number;
  pitch: number;
  volume: number;
  selectedVoiceId: string | null;
};

type SpeechConfigContextValue = SpeechConfigState & {
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setSelectedVoiceId: (id: string | null) => void;
  /** Nạp lại cấu hình từ storage — dùng sau khi khôi phục backup. */
  reloadFromStorage: () => Promise<void>;
  getSpeechOptions: (callbacks?: {
    onDone?: () => void;
    onStopped?: () => void;
    onError?: () => void;
  }) => {
    language: string;
    rate: number;
    pitch: number;
    volume: number;
    voice?: string;
    onDone?: () => void;
    onStopped?: () => void;
    onError?: () => void;
  };
};

const defaultState: SpeechConfigState = {
  rate: 1,
  pitch: 1,
  volume: 0.85,
  voices: [],
  selectedVoiceId: null,
  voicesLoaded: false,
};

const SpeechConfigContext = createContext<SpeechConfigContextValue | null>(null);

export function SpeechConfigProvider({ children }: { children: React.ReactNode }) {
  const [rate, setRate] = useState(defaultState.rate);
  const [pitch, setPitch] = useState(defaultState.pitch);
  const [volume, setVolume] = useState(defaultState.volume);
  const [voices, setVoices] = useState<Voice[]>(defaultState.voices);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(defaultState.selectedVoiceId);
  // Chỉ lưu sau khi đã nạp xong từ storage để không ghi đè giá trị đã lưu.
  const didLoad = useRef(false);

  const applyPersisted = useCallback((saved: Partial<PersistedSpeechConfig>) => {
    if (typeof saved.rate === 'number') setRate(saved.rate);
    if (typeof saved.pitch === 'number') setPitch(saved.pitch);
    if (typeof saved.volume === 'number') setVolume(saved.volume);
    if (saved.selectedVoiceId !== undefined) setSelectedVoiceId(saved.selectedVoiceId);
  }, []);

  useEffect(() => {
    let active = true;
    loadJSON<Partial<PersistedSpeechConfig>>(StorageKeys.speech, {}).then((saved) => {
      if (!active) return;
      applyPersisted(saved);
      didLoad.current = true;
    });
    return () => {
      active = false;
    };
  }, [applyPersisted]);

  useEffect(() => {
    if (!didLoad.current) return;
    void saveJSON<PersistedSpeechConfig>(StorageKeys.speech, {
      rate,
      pitch,
      volume,
      selectedVoiceId,
    });
  }, [rate, pitch, volume, selectedVoiceId]);

  const reloadFromStorage = useCallback(async () => {
    const saved = await loadJSON<Partial<PersistedSpeechConfig>>(StorageKeys.speech, {});
    applyPersisted(saved);
  }, [applyPersisted]);

  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((list) => {
        const koVoices = list.filter((v) => v.language.startsWith('ko'));
        setVoices(koVoices);
        setSelectedVoiceId((prev) => {
          if (prev !== null) return prev;
          if (koVoices.length === 0) return null;
          const yuna = koVoices.find((v) => v.name.toLowerCase().includes('yuna'));
          return (yuna ?? koVoices[0]).identifier;
        });
        setVoicesLoaded(true);
      })
      .catch(() => setVoicesLoaded(true));
  }, []);

  const getSpeechOptions = useCallback(
    (callbacks?: { onDone?: () => void; onStopped?: () => void; onError?: () => void }) => ({
      language: 'ko-KR',
      rate,
      pitch,
      volume,
      ...(selectedVoiceId && { voice: selectedVoiceId }),
      ...callbacks,
    }),
    [rate, pitch, volume, selectedVoiceId]
  );

  const value: SpeechConfigContextValue = {
    rate,
    pitch,
    volume,
    voices,
    selectedVoiceId,
    voicesLoaded,
    setRate,
    setPitch,
    setVolume,
    setSelectedVoiceId,
    reloadFromStorage,
    getSpeechOptions,
  };

  return (
    <SpeechConfigContext.Provider value={value}>
      {children}
    </SpeechConfigContext.Provider>
  );
}

export function useSpeechConfig(): SpeechConfigContextValue {
  const ctx = useContext(SpeechConfigContext);
  if (!ctx) throw new Error('useSpeechConfig must be used within SpeechConfigProvider');
  return ctx;
}

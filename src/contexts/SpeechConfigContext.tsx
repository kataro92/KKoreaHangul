import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import type { Voice } from 'expo-speech';

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
};

type SpeechConfigContextValue = SpeechConfigState & {
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setSelectedVoiceId: (id: string | null) => void;
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
};

const SpeechConfigContext = createContext<SpeechConfigContextValue | null>(null);

export function SpeechConfigProvider({ children }: { children: React.ReactNode }) {
  const [rate, setRate] = useState(defaultState.rate);
  const [pitch, setPitch] = useState(defaultState.pitch);
  const [volume, setVolume] = useState(defaultState.volume);
  const [voices, setVoices] = useState<Voice[]>(defaultState.voices);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(defaultState.selectedVoiceId);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((list) => {
        const koVoices = list.filter((v) => v.language.startsWith('ko'));
        setVoices(koVoices);
        setSelectedVoiceId((prev) => (prev === null && koVoices.length > 0 ? koVoices[0].identifier : prev));
      })
      .catch(() => {});
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
    setRate,
    setPitch,
    setVolume,
    setSelectedVoiceId,
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

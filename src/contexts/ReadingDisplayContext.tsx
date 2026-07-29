import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { PhoneticSystem } from '../data/phonetics';
import { loadJSON, saveJSON, StorageKeys } from '../storage/store';

/** Cách hiển thị kết quả phân tích trên màn Đọc. */
export type ReadingDisplayMode = 'breakdown' | 'poker';

export type { PhoneticSystem };

type Persisted = {
  mode?: ReadingDisplayMode;
  phoneticSystem?: PhoneticSystem;
};

type ReadingDisplayContextValue = {
  mode: ReadingDisplayMode;
  setMode: (mode: ReadingDisplayMode) => void;
  phoneticSystem: PhoneticSystem;
  setPhoneticSystem: (system: PhoneticSystem) => void;
  reloadFromStorage: () => Promise<void>;
};

const ReadingDisplayContext = createContext<ReadingDisplayContextValue | null>(null);

function isValidMode(v: unknown): v is ReadingDisplayMode {
  return v === 'breakdown' || v === 'poker';
}

function isValidPhonetic(v: unknown): v is PhoneticSystem {
  return v === 'default' || v === 'romanization' || v === 'ipa';
}

export function ReadingDisplayProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ReadingDisplayMode>('breakdown');
  const [phoneticSystem, setPhoneticSystemState] = useState<PhoneticSystem>('default');
  const didLoad = useRef(false);

  const applyPersisted = useCallback((saved: Persisted) => {
    if (isValidMode(saved.mode)) setModeState(saved.mode);
    if (isValidPhonetic(saved.phoneticSystem)) setPhoneticSystemState(saved.phoneticSystem);
  }, []);

  useEffect(() => {
    let active = true;
    loadJSON<Persisted>(StorageKeys.readingDisplay, {}).then((saved) => {
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
    void saveJSON<Persisted>(StorageKeys.readingDisplay, { mode, phoneticSystem });
  }, [mode, phoneticSystem]);

  const setMode = useCallback((next: ReadingDisplayMode) => {
    setModeState(next);
  }, []);

  const setPhoneticSystem = useCallback((next: PhoneticSystem) => {
    setPhoneticSystemState(next);
  }, []);

  const reloadFromStorage = useCallback(async () => {
    const saved = await loadJSON<Persisted>(StorageKeys.readingDisplay, {});
    setModeState(isValidMode(saved.mode) ? saved.mode : 'breakdown');
    setPhoneticSystemState(isValidPhonetic(saved.phoneticSystem) ? saved.phoneticSystem : 'default');
  }, []);

  return (
    <ReadingDisplayContext.Provider
      value={{ mode, setMode, phoneticSystem, setPhoneticSystem, reloadFromStorage }}
    >
      {children}
    </ReadingDisplayContext.Provider>
  );
}

export function useReadingDisplay(): ReadingDisplayContextValue {
  const ctx = useContext(ReadingDisplayContext);
  if (!ctx) throw new Error('useReadingDisplay must be used within ReadingDisplayProvider');
  return ctx;
}

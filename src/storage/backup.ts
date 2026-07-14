/**
 * Sao lưu & khôi phục dữ liệu người dùng qua file JSON.
 * Không cần server: xuất file rồi chia sẻ qua share sheet (Google Drive,
 * iCloud/Files, email…); khôi phục bằng cách chọn lại file qua document picker.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { STORE_VERSION, StorageKeys } from './store';

/** Phiên bản định dạng file backup — tăng khi đổi cấu trúc file. */
const BACKUP_FORMAT = 1;

/** Nhận diện file backup của app này. */
const APP_ID = 'kkorea-hangul';

const KNOWN_KEYS: string[] = Object.values(StorageKeys);

type BackupFile = {
  app: string;
  format: number;
  storeVersion: number;
  exportedAt: string;
  /** Giá trị đã parse của từng key AsyncStorage (giữ nguyên envelope). */
  data: Record<string, unknown>;
};

export type ExportResult = 'shared' | 'empty' | 'unavailable' | 'error';

export type ImportResult =
  | { status: 'restored'; keys: number }
  | { status: 'cancelled' }
  | { status: 'invalid' }
  | { status: 'error' };

/** Gom toàn bộ key của app thành file JSON rồi mở share sheet. */
export async function exportBackup(): Promise<ExportResult> {
  try {
    const pairs = await AsyncStorage.multiGet(KNOWN_KEYS);
    const data: Record<string, unknown> = {};
    for (const [key, raw] of pairs) {
      if (raw == null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        // Bỏ qua giá trị hỏng thay vì làm hỏng cả file backup.
      }
    }
    if (Object.keys(data).length === 0) return 'empty';

    const backup: BackupFile = {
      app: APP_ID,
      format: BACKUP_FORMAT,
      storeVersion: STORE_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };

    if (!(await Sharing.isAvailableAsync())) return 'unavailable';

    const name = `kkorea-hangul-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File(Paths.cache, name);
    file.write(JSON.stringify(backup, null, 2));
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      UTI: 'public.json',
      dialogTitle: name,
    });
    return 'shared';
  } catch {
    return 'error';
  }
}

/** Mở document picker, đọc file backup và ghi đè các key đã biết. */
export async function importBackup(): Promise<ImportResult> {
  let picked: DocumentPicker.DocumentPickerResult;
  try {
    picked = await DocumentPicker.getDocumentAsync({
      // Một số file manager Android gắn nhãn .json là octet-stream/text.
      type: ['application/json', 'application/octet-stream', 'text/plain'],
      copyToCacheDirectory: true,
      multiple: false,
    });
  } catch {
    return { status: 'error' };
  }
  if (picked.canceled || !picked.assets?.[0]?.uri) return { status: 'cancelled' };

  let parsed: unknown;
  try {
    const text = await new File(picked.assets[0].uri).text();
    parsed = JSON.parse(text);
  } catch {
    return { status: 'invalid' };
  }

  if (
    parsed == null ||
    typeof parsed !== 'object' ||
    (parsed as BackupFile).app !== APP_ID ||
    typeof (parsed as BackupFile).data !== 'object' ||
    (parsed as BackupFile).data == null
  ) {
    return { status: 'invalid' };
  }

  const data = (parsed as BackupFile).data;
  const entries: [string, string][] = [];
  for (const key of KNOWN_KEYS) {
    if (key in data && data[key] !== undefined) {
      entries.push([key, JSON.stringify(data[key])]);
    }
  }
  if (entries.length === 0) return { status: 'invalid' };

  try {
    await AsyncStorage.multiSet(entries);
  } catch {
    return { status: 'error' };
  }
  return { status: 'restored', keys: entries.length };
}

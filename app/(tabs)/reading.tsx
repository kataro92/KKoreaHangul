import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { DecomposedResult } from '../../src/components/DecomposedResult';
import { colors } from '../../src/constants/colors';
import {
  useSpeechConfig,
  RATE_OPTIONS,
  PITCH_OPTIONS,
  VOLUME_OPTIONS,
} from '../../src/contexts/SpeechConfigContext';
import { decomposeString } from '../../src/utils/decompose';

export default function ReadingScreen() {
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const {
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
  } = useSpeechConfig();

  const decomposed = decomposeString(input);

  const handleSpeak = useCallback(() => {
    const textToSpeak = input.trim();
    if (!textToSpeak) return;
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(textToSpeak, {
      ...getSpeechOptions({
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      }),
    });
  }, [input, speaking, getSpeechOptions]);

  const canSpeak = input.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.inputSection}>
        <Text style={styles.label}>Nhập chữ tiếng Hàn</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ví dụ: 한국어, 안녕하세요"
          placeholderTextColor="#999"
          multiline
        />
        <Pressable
          style={[
            styles.speakButton,
            !canSpeak && styles.speakButtonDisabled,
            speaking && styles.speakButtonActive,
          ]}
          onPress={handleSpeak}
          disabled={!canSpeak}
        >
          {speaking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.speakButtonText}>Phát âm</Text>
          )}
        </Pressable>

        <Text style={styles.configTitle}>Cấu hình giọng đọc</Text>

        <Text style={styles.configLabel}>Tốc độ</Text>
        <View style={styles.optionRow}>
          {RATE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, rate === opt.value && styles.optionBtnActive]}
              onPress={() => setRate(opt.value)}
            >
              <Text style={[styles.optionBtnText, rate === opt.value && styles.optionBtnTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.configLabel}>Cao độ</Text>
        <View style={styles.optionRow}>
          {PITCH_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, pitch === opt.value && styles.optionBtnActive]}
              onPress={() => setPitch(opt.value)}
            >
              <Text style={[styles.optionBtnText, pitch === opt.value && styles.optionBtnTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.configLabel}>Âm lượng</Text>
        <View style={styles.optionRow}>
          {VOLUME_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, volume === opt.value && styles.optionBtnActive]}
              onPress={() => setVolume(opt.value)}
            >
              <Text style={[styles.optionBtnText, volume === opt.value && styles.optionBtnTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {voices.length > 1 && (
          <>
            <Text style={styles.configLabel}>Giọng đọc (tiếng Hàn)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.voiceScroll}
              contentContainerStyle={styles.voiceScrollContent}
            >
              {voices.map((v) => (
                <Pressable
                  key={v.identifier}
                  style={[
                    styles.voiceChip,
                    selectedVoiceId === v.identifier && styles.voiceChipActive,
                  ]}
                  onPress={() => setSelectedVoiceId(v.identifier)}
                >
                  <Text
                    style={[
                      styles.voiceChipText,
                      selectedVoiceId === v.identifier && styles.voiceChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {v.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </View>
      <ScrollView
        style={styles.results}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {decomposed.length === 0 ? (
          <Text style={styles.hint}>
            {input.trim().length === 0
              ? 'Nhập chữ Hàn vào ô trên để xem phân tách và cách đọc.'
              : 'Chỉ phân tách được các âm tiết Hangul (가–힣). Ký tự khác sẽ bị bỏ qua.'}
          </Text>
        ) : (
          decomposed.map((item, index) => (
            <DecomposedResult key={`${item.syllable}-${index}`} data={item} />
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputSection: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: colors.text,
    minHeight: 52,
    textAlignVertical: 'top',
  },
  speakButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  speakButtonDisabled: {
    backgroundColor: '#aaa',
    opacity: 0.8,
  },
  speakButtonActive: {
    opacity: 0.9,
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#4A90D920',
  },
  optionBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionBtnTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  voiceScroll: {
    maxHeight: 44,
    marginBottom: 12,
  },
  voiceScrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  voiceChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  voiceChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#4A90D920',
  },
  voiceChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    maxWidth: 120,
  },
  voiceChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
});

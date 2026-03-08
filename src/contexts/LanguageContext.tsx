import React, { createContext, useCallback, useContext, useState } from 'react';

export type Locale = 'en' | 'vi' | 'zh' | 'hi' | 'es' | 'fr' | 'ja';

type TranslationMap = {
  // Tab & app
  tabAlphabet: string;
  tabReading: string;
  tabVocabulary: string;
  settingsTitle: string;
  backToMain: string;
  // Speech
  speechTitle: string;
  rateLabel: string;
  pitchLabel: string;
  volumeLabel: string;
  voiceLabel: string;
  rateSlow: string;
  rateNormal: string;
  rateFast: string;
  pitchLow: string;
  pitchHigh: string;
  volumeSmall: string;
  volumeLarge: string;
  // Language
  languageTitle: string;
  langEnglish: string;
  langVietnamese: string;
  langChinese: string;
  langHindi: string;
  langSpanish: string;
  langFrench: string;
  langJapanese: string;
  // About
  aboutTitle: string;
  aboutDescription: string;
  aboutAuthor: string;
  // Reading
  readingInputLabel: string;
  readingPlaceholder: string;
  speakButton: string;
  readingHintEmpty: string;
  readingHintNoHangul: string;
  // Vocabulary
  vocabLevelTitle: string;
  vocabNewWord: string;
  vocabReadingTitle: string;
  nextWordButton: string;
  vocabEmptyHint: string;
  vocabNoSyllableHint: string;
  vocabLevel1: string;
  vocabLevel2: string;
  posNoun: string;
  posVerb: string;
  posAdj: string;
  posAdv: string;
  posConj: string;
  posPron: string;
  posPhrase: string;
  posParticle: string;
  // Alphabet
  alphabetTitle: string;
  alphabetSubtitle: string;
  alphabetBasicConsonants: string;
  alphabetDoubleConsonants: string;
  alphabetBasicVowels: string;
  alphabetCompoundVowels: string;
  alphabetModeDefault: string;
  alphabetModeBySound: string;
  alphabetBatchim: string;
  alphabetBatchimBySound: string;
  alphabetReadPrefix: string;
  // DecomposedResult
  decompInitial: string;
  decompMedial: string;
  decompFinal: string;
  decompRead: string;
};

const translations: Record<Locale, TranslationMap> = {
  en: {
    tabAlphabet: 'Alphabet',
    tabReading: 'Reading',
    tabVocabulary: 'Vocabulary',
    settingsTitle: 'Settings',
    backToMain: 'Main',
    speechTitle: 'Speech settings',
    rateLabel: 'Speed',
    pitchLabel: 'Pitch',
    volumeLabel: 'Volume',
    voiceLabel: 'Voice (Korean)',
    rateSlow: 'Slow',
    rateNormal: 'Normal',
    rateFast: 'Fast',
    pitchLow: 'Low',
    pitchHigh: 'High',
    volumeSmall: 'Low',
    volumeLarge: 'High',
    languageTitle: 'Language',
    langEnglish: 'English',
    langVietnamese: 'Vietnamese',
    langChinese: 'Chinese',
    langHindi: 'Hindi',
    langSpanish: 'Spanish',
    langFrench: 'French',
    langJapanese: 'Japanese',
    aboutTitle: 'About',
    aboutDescription:
      'KKorea Hangul is a Korean (Hangul) learning app. It helps you learn the alphabet with Vietnamese romanization, practice reading with syllable breakdown, and study TOPIK vocabulary with text-to-speech. Speech settings apply to both Reading and Vocabulary.',
    aboutAuthor: 'Author: Phạm Huy Đức',
    readingInputLabel: 'Enter Korean text',
    readingPlaceholder: 'E.g.: 한국어, 안녕하세요',
    speakButton: 'Speak',
    readingHintEmpty: 'Enter Korean text above to see syllable breakdown and pronunciation.',
    readingHintNoHangul: 'Only Hangul syllables (가–힣) can be decomposed. Other characters are skipped.',
    vocabLevelTitle: 'Level',
    vocabNewWord: 'New word',
    vocabReadingTitle: 'Pronunciation',
    nextWordButton: 'Next word',
    vocabEmptyHint: 'No vocabulary for this level. Add data to vocabulary.json.',
    vocabNoSyllableHint: 'This word has no Hangul syllables to decompose.',
    vocabLevel1: 'TOPIK I (Beginner)',
    vocabLevel2: 'TOPIK II (Intermediate)',
    posNoun: 'Noun',
    posVerb: 'Verb',
    posAdj: 'Adjective',
    posAdv: 'Adverb',
    posConj: 'Conjunction',
    posPron: 'Pronoun',
    posPhrase: 'Phrase',
    posParticle: 'Particle',
    alphabetTitle: 'Hangul alphabet',
    alphabetSubtitle: 'Korean letters with Vietnamese romanization',
    alphabetBasicConsonants: 'Basic consonants (자음)',
    alphabetDoubleConsonants: 'Double consonants (쌍자음)',
    alphabetBasicVowels: 'Basic vowels (모음)',
    alphabetCompoundVowels: 'Compound vowels (복합 모음)',
    alphabetModeDefault: 'Default',
    alphabetModeBySound: 'Group by sound',
    alphabetBatchim: 'Final consonants - Batchim (받침)',
    alphabetBatchimBySound: 'Final consonants - Batchim (받침) — by pronunciation',
    alphabetReadPrefix: 'Read: ',
    decompInitial: 'Initial consonant',
    decompMedial: 'Vowel',
    decompFinal: 'Final consonant',
    decompRead: 'Read: ',
  },
  vi: {
    tabAlphabet: 'Chữ cái',
    tabReading: 'Đọc',
    tabVocabulary: 'Từ vựng',
    settingsTitle: 'Cài đặt',
    backToMain: 'Màn hình chính',
    speechTitle: 'Cấu hình giọng đọc',
    rateLabel: 'Tốc độ',
    pitchLabel: 'Cao độ',
    volumeLabel: 'Âm lượng',
    voiceLabel: 'Giọng đọc (tiếng Hàn)',
    rateSlow: 'Chậm',
    rateNormal: 'Bình thường',
    rateFast: 'Nhanh',
    pitchLow: 'Thấp',
    pitchHigh: 'Cao',
    volumeSmall: 'Nhỏ',
    volumeLarge: 'Lớn',
    languageTitle: 'Ngôn ngữ',
    langEnglish: 'English',
    langVietnamese: 'Tiếng Việt',
    langChinese: 'Tiếng Trung Quốc',
    langHindi: 'Tiếng Hindi',
    langSpanish: 'Tiếng Tây Ban Nha',
    langFrench: 'Tiếng Pháp',
    langJapanese: 'Tiếng Nhật',
    aboutTitle: 'Giới thiệu',
    aboutDescription:
      'KKorea Hangul là ứng dụng học tiếng Hàn (chữ Hangul). Bạn có thể học bảng chữ cái kèm phiên âm tiếng Việt, luyện đọc với phân tách âm tiết, và học từ vựng TOPIK với phát âm. Cấu hình giọng đọc áp dụng cho cả màn Đọc và Từ vựng.',
    aboutAuthor: 'Author: Phạm Huy Đức',
  },
  vi: {
    tabAlphabet: 'Chữ cái',
    tabReading: 'Đọc',
    tabVocabulary: 'Từ vựng',
    settingsTitle: 'Cài đặt',
    backToMain: 'Màn hình chính',
    speechTitle: 'Cấu hình giọng đọc',
    rateLabel: 'Tốc độ',
    pitchLabel: 'Cao độ',
    volumeLabel: 'Âm lượng',
    voiceLabel: 'Giọng đọc (tiếng Hàn)',
    rateSlow: 'Chậm',
    rateNormal: 'Bình thường',
    rateFast: 'Nhanh',
    pitchLow: 'Thấp',
    pitchHigh: 'Cao',
    volumeSmall: 'Nhỏ',
    volumeLarge: 'Lớn',
    languageTitle: 'Ngôn ngữ',
    langEnglish: 'English',
    langVietnamese: 'Tiếng Việt',
    langChinese: 'Tiếng Trung Quốc',
    langHindi: 'Tiếng Hindi',
    langSpanish: 'Tiếng Tây Ban Nha',
    langFrench: 'Tiếng Pháp',
    langJapanese: 'Tiếng Nhật',
    aboutTitle: 'Giới thiệu',
    aboutDescription:
      'KKorea Hangul là ứng dụng học tiếng Hàn (chữ Hangul). Bạn có thể học bảng chữ cái kèm phiên âm tiếng Việt, luyện đọc với phân tách âm tiết, và học từ vựng TOPIK với phát âm. Cấu hình giọng đọc áp dụng cho cả màn Đọc và Từ vựng.',
    aboutAuthor: 'Tác giả: Phạm Huy Đức',
    readingInputLabel: 'Nhập chữ tiếng Hàn',
    readingPlaceholder: 'Ví dụ: 한국어, 안녕하세요',
    speakButton: 'Phát âm',
    readingHintEmpty: 'Nhập chữ Hàn vào ô trên để xem phân tách và cách đọc.',
    readingHintNoHangul: 'Chỉ phân tách được các âm tiết Hangul (가–힣). Ký tự khác sẽ bị bỏ qua.',
    vocabLevelTitle: 'Trình độ',
    vocabNewWord: 'Từ mới',
    vocabReadingTitle: 'Cách đọc',
    nextWordButton: 'Từ tiếp theo',
    vocabEmptyHint: 'Chưa có từ vựng cho trình độ này. Hãy thêm dữ liệu vào vocabulary.json.',
    vocabNoSyllableHint: 'Từ này không chứa âm tiết Hangul để phân tách.',
    vocabLevel1: 'TOPIK I (Sơ cấp)',
    vocabLevel2: 'TOPIK II (Trung cấp)',
    posNoun: 'Danh từ',
    posVerb: 'Động từ',
    posAdj: 'Tính từ',
    posAdv: 'Trạng từ',
    posConj: 'Liên từ',
    posPron: 'Đại từ',
    posPhrase: 'Cụm từ',
    posParticle: 'Trợ từ',
    alphabetTitle: 'Bảng chữ cái Hangul',
    alphabetSubtitle: 'Chữ Hàn và cách phát âm tiếng Việt',
    alphabetBasicConsonants: 'Phụ âm cơ bản (자음)',
    alphabetDoubleConsonants: 'Phụ âm kép (쌍자음)',
    alphabetBasicVowels: 'Nguyên âm cơ bản (모음)',
    alphabetCompoundVowels: 'Nguyên âm kép (복합 모음)',
    alphabetModeDefault: 'Mặc định',
    alphabetModeBySound: 'Nhóm theo âm',
    alphabetBatchim: 'Phụ âm cuối - Batchim (받침)',
    alphabetBatchimBySound: 'Phụ âm cuối - Batchim (받침) — nhóm theo cách đọc',
    alphabetReadPrefix: 'Đọc: ',
    decompInitial: 'Phụ âm đầu',
    decompMedial: 'Nguyên âm',
    decompFinal: 'Phụ âm cuối',
    decompRead: 'Đọc: ',
  },
  zh: {
    tabAlphabet: '字母',
    tabReading: '阅读',
    tabVocabulary: '词汇',
    settingsTitle: '设置',
    backToMain: '主屏幕',
    speechTitle: '语音设置',
    rateLabel: '语速',
    pitchLabel: '音调',
    volumeLabel: '音量',
    voiceLabel: '韩语语音',
    rateSlow: '慢',
    rateNormal: '正常',
    rateFast: '快',
    pitchLow: '低',
    pitchHigh: '高',
    volumeSmall: '小',
    volumeLarge: '大',
    languageTitle: '语言',
    langEnglish: '英语',
    langVietnamese: '越南语',
    langChinese: '中文',
    langHindi: '印地语',
    langSpanish: '西班牙语',
    langFrench: '法语',
    langJapanese: '日语',
    aboutTitle: '关于',
    aboutDescription:
      'KKorea Hangul 是一款韩语（韩文）学习应用，帮助您学习字母表（含越南语罗马音）、练习音节拆读、以及通过语音学习 TOPIK 词汇。语音设置同时适用于阅读和词汇页面。',
    aboutAuthor: '作者：Phạm Huy Đức',
    readingInputLabel: '输入韩文',
    readingPlaceholder: '例如：한국어, 안녕하세요',
    speakButton: '朗读',
    readingHintEmpty: '在上方输入韩文以查看音节拆分与发音。',
    readingHintNoHangul: '仅能拆分韩文音节(가–힣)，其他字符将跳过。',
    vocabLevelTitle: '等级',
    vocabNewWord: '生词',
    vocabReadingTitle: '发音',
    nextWordButton: '下一个词',
    vocabEmptyHint: '该等级暂无词汇，请向 vocabulary.json 添加数据。',
    vocabNoSyllableHint: '该词无韩文音节可拆分。',
    vocabLevel1: 'TOPIK I（初级）',
    vocabLevel2: 'TOPIK II（中级）',
    posNoun: '名词',
    posVerb: '动词',
    posAdj: '形容词',
    posAdv: '副词',
    posConj: '连词',
    posPron: '代词',
    posPhrase: '短语',
    posParticle: '助词',
    alphabetTitle: '韩文字母表',
    alphabetSubtitle: '韩文及越南语罗马音',
    alphabetBasicConsonants: '基本辅音 (자음)',
    alphabetDoubleConsonants: '双辅音 (쌍자음)',
    alphabetBasicVowels: '基本元音 (모음)',
    alphabetCompoundVowels: '复合元音 (복합 모음)',
    alphabetModeDefault: '默认',
    alphabetModeBySound: '按发音分组',
    alphabetBatchim: '韵尾 - Batchim (받침)',
    alphabetBatchimBySound: '韵尾 - Batchim (받침) — 按发音',
    alphabetReadPrefix: '读：',
    decompInitial: '初声',
    decompMedial: '中声',
    decompFinal: '终声',
    decompRead: '读：',
  },
  hi: {
    tabAlphabet: 'वर्णमाला',
    tabReading: 'पढ़ना',
    tabVocabulary: 'शब्दावली',
    settingsTitle: 'सेटिंग्स',
    backToMain: 'मुख्य स्क्रीन',
    speechTitle: 'भाषण सेटिंग्स',
    rateLabel: 'गति',
    pitchLabel: 'पिच',
    volumeLabel: 'वॉल्यूम',
    voiceLabel: 'कोरियाई आवाज़',
    rateSlow: 'धीमा',
    rateNormal: 'सामान्य',
    rateFast: 'तेज़',
    pitchLow: 'कम',
    pitchHigh: 'उच्च',
    volumeSmall: 'कम',
    volumeLarge: 'जोर',
    languageTitle: 'भाषा',
    langEnglish: 'अंग्रेज़ी',
    langVietnamese: 'वियतनामी',
    langChinese: 'चीनी',
    langHindi: 'हिंदी',
    langSpanish: 'स्पेनिश',
    langFrench: 'फ्रेंच',
    langJapanese: 'जापानी',
    aboutTitle: 'के बारे में',
    aboutDescription:
      'KKorea Hangul कोरियाई (हंगुल) सीखने का ऐप है। इसमें वर्णमाला, पढ़ने का अभ्यास और TOPIK शब्दावली टेक्स्ट-टू-स्पीच के साथ है। भाषण सेटिंग्स रीडिंग और शब्दावली दोनों पर लागू होती हैं।',
    aboutAuthor: 'लेखक: Phạm Huy Đức',
    readingInputLabel: 'कोरियाई टाइप करें',
    readingPlaceholder: 'जैसे: 한국어, 안녕하세요',
    speakButton: 'बोलें',
    readingHintEmpty: 'सिलेबल विभाजन देखने के लिए ऊपर कोरियाई टाइप करें।',
    readingHintNoHangul: 'केवल हंगुल (가–힣) विभाजित हो सकते हैं।',
    vocabLevelTitle: 'स्तर',
    vocabNewWord: 'नया शब्द',
    vocabReadingTitle: 'उच्चारण',
    nextWordButton: 'अगला शब्द',
    vocabEmptyHint: 'इस स्तर के लिए शब्दावली नहीं है।',
    vocabNoSyllableHint: 'इस शब्द में हंगुल सिलेबल नहीं है।',
    vocabLevel1: 'TOPIK I (शुरुआती)',
    vocabLevel2: 'TOPIK II (मध्यवर्ती)',
    posNoun: 'संज्ञा',
    posVerb: 'क्रिया',
    posAdj: 'विशेषण',
    posAdv: 'क्रिया विशेषण',
    posConj: 'संयोजक',
    posPron: 'सर्वनाम',
    posPhrase: 'वाक्यांश',
    posParticle: 'प्रत्यय',
    alphabetTitle: 'हंगुल वर्णमाला',
    alphabetSubtitle: 'कोरियाई अक्षर और उच्चारण',
    alphabetBasicConsonants: 'मूल व्यंजन (자음)',
    alphabetDoubleConsonants: 'दोहरे व्यंजन (쌍자음)',
    alphabetBasicVowels: 'मूल स्वर (모음)',
    alphabetCompoundVowels: 'संयुक्त स्वर (복합 모음)',
    alphabetModeDefault: 'डिफ़ॉल्ट',
    alphabetModeBySound: 'ध्वनि के अनुसार',
    alphabetBatchim: 'अंत व्यंजन - Batchim (받침)',
    alphabetBatchimBySound: 'Batchim (받침) — उच्चारण के अनुसार',
    alphabetReadPrefix: 'पढ़ें: ',
    decompInitial: 'प्रारंभिक व्यंजन',
    decompMedial: 'स्वर',
    decompFinal: 'अंत व्यंजन',
    decompRead: 'पढ़ें: ',
  },
  es: {
    tabAlphabet: 'Alfabeto',
    tabReading: 'Lectura',
    tabVocabulary: 'Vocabulario',
    settingsTitle: 'Ajustes',
    backToMain: 'Pantalla principal',
    speechTitle: 'Configuración de voz',
    rateLabel: 'Velocidad',
    pitchLabel: 'Tono',
    volumeLabel: 'Volumen',
    voiceLabel: 'Voz (coreano)',
    rateSlow: 'Lento',
    rateNormal: 'Normal',
    rateFast: 'Rápido',
    pitchLow: 'Bajo',
    pitchHigh: 'Alto',
    volumeSmall: 'Bajo',
    volumeLarge: 'Alto',
    languageTitle: 'Idioma',
    langEnglish: 'Inglés',
    langVietnamese: 'Vietnamita',
    langChinese: 'Chino',
    langHindi: 'Hindi',
    langSpanish: 'Español',
    langFrench: 'Francés',
    langJapanese: 'Japonés',
    aboutTitle: 'Acerca de',
    aboutDescription:
      'KKorea Hangul es una app para aprender coreano (hangul): alfabeto con romanización, práctica de lectura con desglose silábico y vocabulario TOPIK con texto a voz. La configuración de voz aplica a Lectura y Vocabulario.',
    aboutAuthor: 'Autor: Phạm Huy Đức',
    readingInputLabel: 'Escribe texto en coreano',
    readingPlaceholder: 'Ej.: 한국어, 안녕하세요',
    speakButton: 'Pronunciar',
    readingHintEmpty: 'Escribe coreano arriba para ver desglose y pronunciación.',
    readingHintNoHangul: 'Solo se desglosan sílabas Hangul (가–힣).',
    vocabLevelTitle: 'Nivel',
    vocabNewWord: 'Palabra nueva',
    vocabReadingTitle: 'Pronunciación',
    nextWordButton: 'Siguiente palabra',
    vocabEmptyHint: 'No hay vocabulario para este nivel.',
    vocabNoSyllableHint: 'Esta palabra no tiene sílabas Hangul.',
    vocabLevel1: 'TOPIK I (Principiante)',
    vocabLevel2: 'TOPIK II (Intermedio)',
    posNoun: 'Sustantivo',
    posVerb: 'Verbo',
    posAdj: 'Adjetivo',
    posAdv: 'Adverbio',
    posConj: 'Conjunción',
    posPron: 'Pronombre',
    posPhrase: 'Frase',
    posParticle: 'Partícula',
    alphabetTitle: 'Alfabeto hangul',
    alphabetSubtitle: 'Letras coreanas con romanización',
    alphabetBasicConsonants: 'Consonantes básicas (자음)',
    alphabetDoubleConsonants: 'Consonantes dobles (쌍자음)',
    alphabetBasicVowels: 'Vocales básicas (모음)',
    alphabetCompoundVowels: 'Vocales compuestas (복합 모음)',
    alphabetModeDefault: 'Por defecto',
    alphabetModeBySound: 'Por sonido',
    alphabetBatchim: 'Consonantes finales - Batchim (받침)',
    alphabetBatchimBySound: 'Batchim (받침) — por pronunciación',
    alphabetReadPrefix: 'Leer: ',
    decompInitial: 'Consonante inicial',
    decompMedial: 'Vocal',
    decompFinal: 'Consonante final',
    decompRead: 'Leer: ',
  },
  fr: {
    tabAlphabet: 'Alphabet',
    tabReading: 'Lecture',
    tabVocabulary: 'Vocabulaire',
    settingsTitle: 'Paramètres',
    backToMain: 'Écran principal',
    speechTitle: 'Paramètres vocaux',
    rateLabel: 'Vitesse',
    pitchLabel: 'Hauteur',
    volumeLabel: 'Volume',
    voiceLabel: 'Voix (coréen)',
    rateSlow: 'Lent',
    rateNormal: 'Normal',
    rateFast: 'Rapide',
    pitchLow: 'Bas',
    pitchHigh: 'Haut',
    volumeSmall: 'Faible',
    volumeLarge: 'Fort',
    languageTitle: 'Langue',
    langEnglish: 'Anglais',
    langVietnamese: 'Vietnamien',
    langChinese: 'Chinois',
    langHindi: 'Hindi',
    langSpanish: 'Espagnol',
    langFrench: 'Français',
    langJapanese: 'Japonais',
    aboutTitle: 'À propos',
    aboutDescription:
      'KKorea Hangul est une application pour apprendre le coréen (hangul) : alphabet, lecture avec décomposition des syllabes et vocabulaire TOPIK avec synthèse vocale. Les paramètres vocaux s\'appliquent à Lecture et Vocabulaire.',
    aboutAuthor: 'Auteur : Phạm Huy Đức',
    readingInputLabel: 'Entrez du coréen',
    readingPlaceholder: 'Ex. : 한국어, 안녕하세요',
    speakButton: 'Lire',
    readingHintEmpty: 'Entrez du coréen ci-dessus pour la décomposition et la prononciation.',
    readingHintNoHangul: 'Seules les syllabes Hangul (가–힣) sont décomposées.',
    vocabLevelTitle: 'Niveau',
    vocabNewWord: 'Nouveau mot',
    vocabReadingTitle: 'Prononciation',
    nextWordButton: 'Mot suivant',
    vocabEmptyHint: 'Aucun vocabulaire pour ce niveau.',
    vocabNoSyllableHint: 'Ce mot n\'a pas de syllabe Hangul.',
    vocabLevel1: 'TOPIK I (Débutant)',
    vocabLevel2: 'TOPIK II (Intermédiaire)',
    posNoun: 'Nom',
    posVerb: 'Verbe',
    posAdj: 'Adjectif',
    posAdv: 'Adverbe',
    posConj: 'Conjonction',
    posPron: 'Pronom',
    posPhrase: 'Phrase',
    posParticle: 'Particule',
    alphabetTitle: 'Alphabet hangul',
    alphabetSubtitle: 'Lettres coréennes et romanisation',
    alphabetBasicConsonants: 'Consonnes de base (자음)',
    alphabetDoubleConsonants: 'Consonnes doubles (쌍자음)',
    alphabetBasicVowels: 'Voyelles de base (모음)',
    alphabetCompoundVowels: 'Voyelles composées (복합 모음)',
    alphabetModeDefault: 'Par défaut',
    alphabetModeBySound: 'Par son',
    alphabetBatchim: 'Consonnes finales - Batchim (받침)',
    alphabetBatchimBySound: 'Batchim (받침) — par prononciation',
    alphabetReadPrefix: 'Lire : ',
    decompInitial: 'Consonne initiale',
    decompMedial: 'Voyelle',
    decompFinal: 'Consonne finale',
    decompRead: 'Lire : ',
  },
  ja: {
    tabAlphabet: '文字',
    tabReading: '読み',
    tabVocabulary: '語彙',
    settingsTitle: '設定',
    backToMain: 'メイン画面',
    speechTitle: '音声設定',
    rateLabel: '速度',
    pitchLabel: '音程',
    volumeLabel: '音量',
    voiceLabel: '韓国語の音声',
    rateSlow: '遅い',
    rateNormal: '普通',
    rateFast: '速い',
    pitchLow: '低い',
    pitchHigh: '高い',
    volumeSmall: '小',
    volumeLarge: '大',
    languageTitle: '言語',
    langEnglish: '英語',
    langVietnamese: 'ベトナム語',
    langChinese: '中国語',
    langHindi: 'ヒンディー語',
    langSpanish: 'スペイン語',
    langFrench: 'フランス語',
    langJapanese: '日本語',
    aboutTitle: 'このアプリについて',
    aboutDescription:
      'KKorea Hangulは韓国語（ハングル）学習アプリです。文字一覧、音節分解付きの読み練習、TOPIK語彙の読み上げ機能があります。音声設定は読みと語彙の両方に適用されます。',
    aboutAuthor: '作者：Phạm Huy Đức',
    readingInputLabel: '韓国語を入力',
    readingPlaceholder: '例：한국어、안녕하세요',
    speakButton: '読み上げ',
    readingHintEmpty: '上に入力すると音節ごとの分解と発音が表示されます。',
    readingHintNoHangul: 'ハングル音節(가–힣)のみ分解できます。',
    vocabLevelTitle: 'レベル',
    vocabNewWord: '単語',
    vocabReadingTitle: '読み方',
    nextWordButton: '次の単語',
    vocabEmptyHint: 'このレベルの単語はありません。',
    vocabNoSyllableHint: 'この単語にハングル音節はありません。',
    vocabLevel1: 'TOPIK I（初級）',
    vocabLevel2: 'TOPIK II（中級）',
    posNoun: '名詞',
    posVerb: '動詞',
    posAdj: '形容詞',
    posAdv: '副詞',
    posConj: '接続詞',
    posPron: '代名詞',
    posPhrase: '句',
    posParticle: '助詞',
    alphabetTitle: 'ハングル文字',
    alphabetSubtitle: '韓国語と発音',
    alphabetBasicConsonants: '基本子音 (자음)',
    alphabetDoubleConsonants: '双子音 (쌍자음)',
    alphabetBasicVowels: '基本母音 (모음)',
    alphabetCompoundVowels: '複合母音 (복합 모음)',
    alphabetModeDefault: '標準',
    alphabetModeBySound: '発音でグループ',
    alphabetBatchim: '終声 - Batchim (받침)',
    alphabetBatchimBySound: 'Batchim (받침) — 発音別',
    alphabetReadPrefix: '読む：',
    decompInitial: '初声',
    decompMedial: '中声',
    decompFinal: '終声',
    decompRead: '読む：',
  },
};

const RATE_LABEL_KEYS: Record<number, keyof TranslationMap> = {
  0.7: 'rateSlow',
  1: 'rateNormal',
  1.3: 'rateFast',
};

const PITCH_LABEL_KEYS: Record<number, keyof TranslationMap> = {
  0.8: 'pitchLow',
  1: 'rateNormal',
  1.2: 'pitchHigh',
};

const VOLUME_LABEL_KEYS: Record<number, keyof TranslationMap> = {
  0.5: 'volumeSmall',
  0.85: 'rateNormal',
  1: 'volumeLarge',
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationMap) => string;
  getRateLabel: (value: number) => string;
  getPitchLabel: (value: number) => string;
  getVolumeLabel: (value: number) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Each language name in its native form (always displayed as-is, independent of app locale). */
export const LOCALE_NATIVE_LABELS: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  ja: '日本語',
};

/** Flag emoji for each language. */
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳',
  zh: '🇨🇳',
  hi: '🇮🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  ja: '🇯🇵',
};

const LOCALES: { value: Locale }[] = [
  { value: 'en' },
  { value: 'vi' },
  { value: 'zh' },
  { value: 'hi' },
  { value: 'es' },
  { value: 'fr' },
  { value: 'ja' },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('vi');

  const t = useCallback(
    (key: keyof TranslationMap) => translations[locale][key] ?? key,
    [locale]
  );

  const getRateLabel = useCallback(
    (value: number) => t(RATE_LABEL_KEYS[value as keyof typeof RATE_LABEL_KEYS] ?? 'rateNormal'),
    [t]
  );
  const getPitchLabel = useCallback(
    (value: number) => t(PITCH_LABEL_KEYS[value as keyof typeof PITCH_LABEL_KEYS] ?? 'rateNormal'),
    [t]
  );
  const getVolumeLabel = useCallback(
    (value: number) => t(VOLUME_LABEL_KEYS[value as keyof typeof VOLUME_LABEL_KEYS] ?? 'rateNormal'),
    [t]
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    getRateLabel,
    getPitchLabel,
    getVolumeLabel,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export { LOCALES, translations };
export type { TranslationMap };

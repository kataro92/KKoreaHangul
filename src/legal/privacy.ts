import type { Locale } from '../localization/locale';
import policy from './privacy-policy.json';
import { translateEnglish } from '../localization/learningContent';

export function getPrivacyPolicy(locale: Locale): typeof policy.en {
  if (locale === 'vi') return policy.vi;
  if (locale === 'en') return policy.en;
  return {
    ...policy.en,
    title: translateEnglish(policy.en.title, locale),
    sections: policy.en.sections.map((section) => ({
      title: translateEnglish(section.title, locale),
      paragraphs: section.paragraphs.map((paragraph) => translateEnglish(paragraph, locale)),
    })),
  };
}

export const PRIVACY_LABELS: Record<Locale, string> = {
  en: 'Privacy policy',
  vi: 'Chính sách quyền riêng tư',
  ja: 'プライバシーポリシー',
  zh: '隐私政策',
  hi: 'गोपनीयता नीति',
  es: 'Política de privacidad',
  fr: 'Politique de confidentialité',
};

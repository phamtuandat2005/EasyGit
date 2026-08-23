import { describe, expect, it } from 'vitest';
import { TRANSLATIONS } from './translations';
import { UI_KEYS, UI_TRANSLATIONS } from './ui-translations';

describe('translation dictionaries', () => {
  it('contains the same base keys in every supported language', () => {
    const languages = Object.keys(TRANSLATIONS);
    const keys = Object.keys(TRANSLATIONS.English).sort();

    expect(languages).toEqual(['English', 'Vietnamese', 'Japanese', 'Korean', 'Chinese']);
    for (const language of languages) {
      expect(Object.keys(TRANSLATIONS[language as keyof typeof TRANSLATIONS]).sort()).toEqual(keys);
    }
  });

  it('contains every shared UI key in every supported language', () => {
    for (const dictionary of Object.values(UI_TRANSLATIONS)) {
      expect(Object.keys(dictionary).sort()).toEqual([...UI_KEYS].sort());
    }
  });
});
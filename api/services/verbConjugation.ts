import { VerbType, VerbFormType, ConjugationResult, VERB_FORM_LABELS } from '../../shared/types.js';

const GODAN_LAST_MAP: Record<string, { a: string; i: string; u: string; e: string; o: string }> = {
  う: { a: 'わ', i: 'い', u: 'う', e: 'え', o: 'お' },
  つ: { a: 'た', i: 'ち', u: 'つ', e: 'て', o: 'と' },
  る: { a: 'ら', i: 'り', u: 'る', e: 'れ', o: 'ろ' },
  む: { a: 'ま', i: 'み', u: 'む', e: 'め', o: 'も' },
  ぶ: { a: 'ば', i: 'び', u: 'ぶ', e: 'べ', o: 'ぼ' },
  ぬ: { a: 'な', i: 'に', u: 'ぬ', e: 'ね', o: 'の' },
  く: { a: 'か', i: 'き', u: 'く', e: 'け', o: 'こ' },
  ぐ: { a: 'が', i: 'ぎ', u: 'ぐ', e: 'げ', o: 'ご' },
  す: { a: 'さ', i: 'し', u: 'す', e: 'せ', o: 'そ' },
};

function getGodanStem(word: string, row: 'a' | 'i' | 'u' | 'e' | 'o'): string {
  const lastChar = word.slice(-1);
  const map = GODAN_LAST_MAP[lastChar];
  if (!map) return word;
  return word.slice(0, -1) + map[row];
}

function conjugateGodanTeForm(word: string): string {
  if (word === '行く') return '行って';
  
  const lastChar = word.slice(-1);
  const stem = word.slice(0, -1);
  
  switch (lastChar) {
    case 'う':
    case 'つ':
    case 'る':
      return stem + 'って';
    case 'む':
    case 'ぶ':
    case 'ぬ':
      return stem + 'んで';
    case 'く':
      return stem + 'いて';
    case 'ぐ':
      return stem + 'いで';
    case 'す':
      return stem + 'して';
    default:
      return word + 'て';
  }
}

function conjugateGodanPast(word: string): string {
  const teForm = conjugateGodanTeForm(word);
  return teForm.replace(/て$/, 'た').replace(/で$/, 'だ');
}

function conjugateGodan(word: string, form: VerbFormType): string {
  switch (form) {
    case 'masuForm':
      return getGodanStem(word, 'i') + 'ます';
    case 'renyoukei':
      return getGodanStem(word, 'i');
    case 'teForm':
      return conjugateGodanTeForm(word);
    case 'past':
      return conjugateGodanPast(word);
    case 'negative':
      return getGodanStem(word, 'a') + 'ない';
    case 'pastNegative':
      return getGodanStem(word, 'a') + 'なかった';
    case 'potential':
      return getGodanStem(word, 'e') + 'る';
    case 'passive':
      return getGodanStem(word, 'a') + 'れる';
    case 'causative':
      return getGodanStem(word, 'a') + 'せる';
    case 'imperative':
      return getGodanStem(word, 'e');
    case 'volitional':
      return getGodanStem(word, 'o') + 'う';
    default:
      return word;
  }
}

function conjugateIchidan(word: string, form: VerbFormType): string {
  const stem = word.slice(0, -1);
  
  switch (form) {
    case 'masuForm':
      return stem + 'ます';
    case 'renyoukei':
      return stem;
    case 'teForm':
      return stem + 'て';
    case 'past':
      return stem + 'た';
    case 'negative':
      return stem + 'ない';
    case 'pastNegative':
      return stem + 'なかった';
    case 'potential':
      return stem + 'られる';
    case 'passive':
      return stem + 'られる';
    case 'causative':
      return stem + 'させる';
    case 'imperative':
      return stem + 'ろ';
    case 'volitional':
      return stem + 'よう';
    default:
      return word;
  }
}

const KURU_CONJUGATIONS: Record<VerbFormType, string> = {
  masuForm: '来ます',
  renyoukei: '来',
  teForm: '来て',
  past: '来た',
  negative: '来ない',
  pastNegative: '来なかった',
  potential: '来られる',
  passive: '来られる',
  causative: '来させる',
  imperative: '来い',
  volitional: '来よう',
};

const SURU_CONJUGATIONS: Record<VerbFormType, string> = {
  masuForm: 'します',
  renyoukei: 'し',
  teForm: 'して',
  past: 'した',
  negative: 'しない',
  pastNegative: 'しなかった',
  potential: 'できる',
  passive: 'される',
  causative: 'させる',
  imperative: 'しろ',
  volitional: 'しよう',
};

function conjugateIrregular(word: string, form: VerbFormType): string {
  if (word === '来る' || word === 'くる') {
    return KURU_CONJUGATIONS[form];
  }
  
  if (word === 'する') {
    return SURU_CONJUGATIONS[form];
  }
  
  if (word.endsWith('する')) {
    const nounPart = word.slice(0, -2);
    const suruConj = SURU_CONJUGATIONS[form];
    return nounPart + suruConj;
  }
  
  return word;
}

export function conjugateVerb(
  word: string,
  type: VerbType,
  forms: VerbFormType[]
): ConjugationResult[] {
  return forms.map((form) => {
    let value: string;
    
    switch (type) {
      case 'godan':
        value = conjugateGodan(word, form);
        break;
      case 'ichidan':
        value = conjugateIchidan(word, form);
        break;
      case 'irregular':
        value = conjugateIrregular(word, form);
        break;
      default:
        value = word;
    }
    
    return {
      formType: form,
      formLabel: VERB_FORM_LABELS[form],
      value,
    };
  });
}

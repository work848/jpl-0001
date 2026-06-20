import {
  AdjectiveType,
  AdjectiveFormType,
  ConjugationResult,
  ADJECTIVE_FORM_LABELS,
} from '../../shared/types.js';

function conjugateIAdjective(word: string, form: AdjectiveFormType): string {
  const stem = word.slice(0, -1);

  switch (form) {
    case 'past':
      return stem + 'かった';
    case 'baForm':
      return stem + 'ければ';
    case 'nominalization':
      return stem + 'さ';
    default:
      return word;
  }
}

function conjugateNaAdjective(word: string, form: AdjectiveFormType): string {
  let stem: string;
  if (word.endsWith('な')) {
    stem = word.slice(0, -1);
  } else {
    stem = word;
  }

  switch (form) {
    case 'past':
      return stem + 'だった';
    case 'baForm':
      return stem + 'なら';
    case 'nominalization':
      return stem + 'さ';
    default:
      return word;
  }
}

export function conjugateAdjective(
  word: string,
  type: AdjectiveType,
  forms: AdjectiveFormType[]
): ConjugationResult[] {
  return forms.map((form) => {
    let value: string;

    switch (type) {
      case 'i':
        value = conjugateIAdjective(word, form);
        break;
      case 'na':
        value = conjugateNaAdjective(word, form);
        break;
      default:
        value = word;
    }

    return {
      formType: form,
      formLabel: ADJECTIVE_FORM_LABELS[form],
      value,
    };
  });
}

export type VerbType = 'godan' | 'ichidan' | 'irregular';

export type AdjectiveType = 'i' | 'na';

export type VerbFormType =
  | 'past'
  | 'negative'
  | 'pastNegative'
  | 'teForm'
  | 'renyoukei'
  | 'passive'
  | 'causative'
  | 'imperative'
  | 'potential'
  | 'volitional'
  | 'masuForm';

export type AdjectiveFormType = 'past' | 'baForm' | 'nominalization';

export interface Verb {
  id: string;
  word: string;
  type: VerbType;
  typeLabel: string;
  hidden: boolean;
  createdAt: number;
}

export interface Adjective {
  id: string;
  word: string;
  type: AdjectiveType;
  typeLabel: string;
  hidden: boolean;
  createdAt: number;
}

export interface Settings {
  reviewCount: number;
  defaultVerbForms: VerbFormType[];
}

export interface VerbConjugateRequest {
  word: string;
  type: VerbType;
  forms: VerbFormType[];
}

export interface ConjugationResult {
  formType: string;
  formLabel: string;
  value: string;
}

export interface VerbConjugateResponse {
  word: string;
  type: VerbType;
  results: ConjugationResult[];
}

export interface AdjectiveConjugateRequest {
  word: string;
  type: AdjectiveType;
}

export interface AdjectiveConjugateResponse {
  word: string;
  type: AdjectiveType;
  results: ConjugationResult[];
}

export const VERB_FORM_LABELS: Record<VerbFormType, string> = {
  past: '基本型过去式',
  negative: '基本型的否定',
  pastNegative: '基本型的过去否定',
  teForm: '动词て形',
  renyoukei: '动词基本型的连用形',
  passive: '动词的被动形式',
  causative: '动词的使役形式',
  imperative: '动词的命令形',
  potential: '动词的可能性',
  volitional: '动词的意志性',
  masuForm: '动词ます形',
};

export const ADJECTIVE_FORM_LABELS: Record<AdjectiveFormType, string> = {
  past: '形容词的过去式',
  baForm: '形容词ば形',
  nominalization: '形容词的名词化',
};

export const VERB_TYPE_LABELS: Record<VerbType, string> = {
  godan: '一类动词',
  ichidan: '二类动词',
  irregular: '三类动词',
};

export const ADJECTIVE_TYPE_LABELS: Record<AdjectiveType, string> = {
  i: '1类形容词',
  na: '2类形容词',
};

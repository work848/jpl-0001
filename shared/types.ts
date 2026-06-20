export type VerbType = 'godan' | 'ichidan' | 'irregular';

export type AdjectiveType = 'i' | 'na';

export type WordCategory = 'verb' | 'adjective' | 'noun';

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
  pronunciation?: string;
  meaning?: string;
  hidden: boolean;
  createdAt: number;
}

export interface Adjective {
  id: string;
  word: string;
  type: AdjectiveType;
  typeLabel: string;
  pronunciation?: string;
  meaning?: string;
  hidden: boolean;
  createdAt: number;
}

export interface Noun {
  id: string;
  word: string;
  pronunciation?: string;
  meaning?: string;
  hidden: boolean;
  createdAt: number;
}

export type LibraryItem = Verb | Adjective | Noun;

export interface ParsedWordEntry {
  category: WordCategory;
  word: string;
  pronunciation: string;
  meaning: string;
  type?: VerbType | AdjectiveType;
  rawType?: string;
}

export interface BatchImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
  items: LibraryItem[];
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

export const WORD_CATEGORY_LABELS: Record<WordCategory, string> = {
  verb: '动词',
  adjective: '形容词',
  noun: '名词',
};

export const TYPE_LABEL_TO_VERB_TYPE: Record<string, VerbType> = {
  '一类动词': 'godan',
  '五段动词': 'godan',
  '二类动词': 'ichidan',
  '一段动词': 'ichidan',
  '三类动词': 'irregular',
  '不规则动词': 'irregular',
  'サ变カ变动词': 'irregular',
};

export const TYPE_LABEL_TO_ADJECTIVE_TYPE: Record<string, AdjectiveType> = {
  '1类形容词': 'i',
  '一类形容词': 'i',
  'い形容词': 'i',
  'イ形容词': 'i',
  '2类形容词': 'na',
  '二类形容词': 'na',
  'な形容词': 'na',
  'ナ形容词': 'na',
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import {
  Verb,
  Adjective,
  Noun,
  Settings,
  VerbType,
  AdjectiveType,
  LibraryItem,
  ParsedWordEntry,
  BatchImportResult,
  WordCategory,
  VERB_TYPE_LABELS,
  ADJECTIVE_TYPE_LABELS,
  TYPE_LABEL_TO_VERB_TYPE,
  TYPE_LABEL_TO_ADJECTIVE_TYPE,
  WORD_CATEGORY_LABELS,
} from '../../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const VERBS_FILE = path.join(DATA_DIR, 'verbs.json');
const ADJECTIVES_FILE = path.join(DATA_DIR, 'adjectives.json');
const NOUNS_FILE = path.join(DATA_DIR, 'nouns.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function readJsonFile<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [] as unknown as T;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

export function getAllVerbs(): Verb[] {
  return readJsonFile<Verb[]>(VERBS_FILE);
}

export function getVisibleVerbs(): Verb[] {
  return getAllVerbs().filter((v) => !v.hidden);
}

export function addVerb(
  word: string,
  type: VerbType,
  options?: { pronunciation?: string; meaning?: string }
): Verb {
  const verbs = getAllVerbs();

  const existing = verbs.find((v) => v.word === word && v.type === type);
  if (existing) {
    return existing;
  }

  const newVerb: Verb = {
    id: uuidv4(),
    word,
    type,
    typeLabel: VERB_TYPE_LABELS[type],
    pronunciation: options?.pronunciation,
    meaning: options?.meaning,
    hidden: false,
    createdAt: Date.now(),
  };

  verbs.push(newVerb);
  writeJsonFile(VERBS_FILE, verbs);
  return newVerb;
}

export function getOrCreateVerb(
  word: string,
  type: VerbType,
  options?: { pronunciation?: string; meaning?: string }
): { verb: Verb; created: boolean } {
  const verbs = getAllVerbs();
  const existing = verbs.find((v) => v.word === word && v.type === type);
  if (existing) {
    let needsUpdate = false;
    if (options?.pronunciation && !existing.pronunciation) {
      existing.pronunciation = options.pronunciation;
      needsUpdate = true;
    }
    if (options?.meaning && !existing.meaning) {
      existing.meaning = options.meaning;
      needsUpdate = true;
    }
    if (needsUpdate) {
      writeJsonFile(VERBS_FILE, verbs);
    }
    return { verb: existing, created: false };
  }

  return { verb: addVerb(word, type, options), created: true };
}

export function deleteVerb(id: string): boolean {
  const verbs = getAllVerbs();
  const index = verbs.findIndex((v) => v.id === id);
  if (index === -1) return false;
  
  verbs.splice(index, 1);
  writeJsonFile(VERBS_FILE, verbs);
  return true;
}

export function hideVerb(id: string): boolean {
  const verbs = getAllVerbs();
  const verb = verbs.find((v) => v.id === id);
  if (!verb) return false;
  
  verb.hidden = true;
  writeJsonFile(VERBS_FILE, verbs);
  return true;
}

export function getAllAdjectives(): Adjective[] {
  return readJsonFile<Adjective[]>(ADJECTIVES_FILE);
}

export function getVisibleAdjectives(): Adjective[] {
  return getAllAdjectives().filter((a) => !a.hidden);
}

export function addAdjective(
  word: string,
  type: AdjectiveType,
  options?: { pronunciation?: string; meaning?: string }
): Adjective {
  const adjectives = getAllAdjectives();

  const existing = adjectives.find((a) => a.word === word && a.type === type);
  if (existing) {
    return existing;
  }

  const newAdjective: Adjective = {
    id: uuidv4(),
    word,
    type,
    typeLabel: ADJECTIVE_TYPE_LABELS[type],
    pronunciation: options?.pronunciation,
    meaning: options?.meaning,
    hidden: false,
    createdAt: Date.now(),
  };

  adjectives.push(newAdjective);
  writeJsonFile(ADJECTIVES_FILE, adjectives);
  return newAdjective;
}

export function getOrCreateAdjective(
  word: string,
  type: AdjectiveType,
  options?: { pronunciation?: string; meaning?: string }
): { adjective: Adjective; created: boolean } {
  const adjectives = getAllAdjectives();
  const existing = adjectives.find((a) => a.word === word && a.type === type);
  if (existing) {
    let needsUpdate = false;
    if (options?.pronunciation && !existing.pronunciation) {
      existing.pronunciation = options.pronunciation;
      needsUpdate = true;
    }
    if (options?.meaning && !existing.meaning) {
      existing.meaning = options.meaning;
      needsUpdate = true;
    }
    if (needsUpdate) {
      writeJsonFile(ADJECTIVES_FILE, adjectives);
    }
    return { adjective: existing, created: false };
  }

  return { adjective: addAdjective(word, type, options), created: true };
}

export function getAllNouns(): Noun[] {
  try {
    return readJsonFile<Noun[]>(NOUNS_FILE);
  } catch (error) {
    return [];
  }
}

export function getVisibleNouns(): Noun[] {
  return getAllNouns().filter((n) => !n.hidden);
}

export function addNoun(
  word: string,
  options?: { pronunciation?: string; meaning?: string }
): Noun {
  const nouns = getAllNouns();

  const existing = nouns.find((n) => n.word === word);
  if (existing) {
    return existing;
  }

  const newNoun: Noun = {
    id: uuidv4(),
    word,
    pronunciation: options?.pronunciation,
    meaning: options?.meaning,
    hidden: false,
    createdAt: Date.now(),
  };

  nouns.push(newNoun);
  writeJsonFile(NOUNS_FILE, nouns);
  return newNoun;
}

export function getOrCreateNoun(
  word: string,
  options?: { pronunciation?: string; meaning?: string }
): { noun: Noun; created: boolean } {
  const nouns = getAllNouns();
  const existing = nouns.find((n) => n.word === word);
  if (existing) {
    let needsUpdate = false;
    if (options?.pronunciation && !existing.pronunciation) {
      existing.pronunciation = options.pronunciation;
      needsUpdate = true;
    }
    if (options?.meaning && !existing.meaning) {
      existing.meaning = options.meaning;
      needsUpdate = true;
    }
    if (needsUpdate) {
      writeJsonFile(NOUNS_FILE, nouns);
    }
    return { noun: existing, created: false };
  }

  return { noun: addNoun(word, options), created: true };
}

export function hideNoun(id: string): boolean {
  const nouns = getAllNouns();
  const noun = nouns.find((n) => n.id === id);
  if (!noun) return false;

  noun.hidden = true;
  writeJsonFile(NOUNS_FILE, nouns);
  return true;
}

export function deleteAdjective(id: string): boolean {
  const adjectives = getAllAdjectives();
  const index = adjectives.findIndex((a) => a.id === id);
  if (index === -1) return false;
  
  adjectives.splice(index, 1);
  writeJsonFile(ADJECTIVES_FILE, adjectives);
  return true;
}

export function hideAdjective(id: string): boolean {
  const adjectives = getAllAdjectives();
  const adjective = adjectives.find((a) => a.id === id);
  if (!adjective) return false;
  
  adjective.hidden = true;
  writeJsonFile(ADJECTIVES_FILE, adjectives);
  return true;
}

export function getSettings(): Settings {
  try {
    return readJsonFile<Settings>(SETTINGS_FILE);
  } catch (error) {
    const defaultSettings: Settings = {
      reviewCount: 10,
      defaultVerbForms: ['past', 'negative'],
    };
    writeJsonFile(SETTINGS_FILE, defaultSettings);
    return defaultSettings;
  }
}

export function updateSettings(settings: Partial<Settings>): Settings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

export function parseTypeLabel(label: string): {
  category: WordCategory;
  type?: VerbType | AdjectiveType;
} | null {
  const trimmed = label.trim();

  if (TYPE_LABEL_TO_VERB_TYPE[trimmed]) {
    return { category: 'verb', type: TYPE_LABEL_TO_VERB_TYPE[trimmed] };
  }

  if (TYPE_LABEL_TO_ADJECTIVE_TYPE[trimmed]) {
    return { category: 'adjective', type: TYPE_LABEL_TO_ADJECTIVE_TYPE[trimmed] };
  }

  return null;
}

export function parseWordEntry(block: string): ParsedWordEntry | null {
  const lines = block
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return null;

  let pronunciation = '';
  let wordWithType = '';
  let meaning = '';

  if (lines.length === 2) {
    wordWithType = lines[0];
    meaning = lines[1];
  } else if (lines.length >= 3) {
    pronunciation = lines[0];
    wordWithType = lines[1];
    meaning = lines.slice(2).join(' ');
  }

  const parts = wordWithType.split(/\s+/).filter((p) => p.length > 0);
  if (parts.length === 0) return null;

  const word = parts[0];
  let typeLabel: string | undefined;
  let category: WordCategory = 'noun';
  let resolvedType: VerbType | AdjectiveType | undefined;

  if (parts.length >= 2) {
    typeLabel = parts.slice(1).join(' ');
    const parsed = parseTypeLabel(typeLabel);
    if (parsed) {
      category = parsed.category;
      resolvedType = parsed.type;
    } else {
      category = 'noun';
    }
  }

  return {
    category,
    word,
    pronunciation,
    meaning,
    type: resolvedType,
    rawType: typeLabel,
  };
}

export function parseBatchText(text: string): ParsedWordEntry[] {
  const blocks = text
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const entries: ParsedWordEntry[] = [];
  for (const block of blocks) {
    const parsed = parseWordEntry(block);
    if (parsed) {
      entries.push(parsed);
    }
  }

  return entries;
}

export function batchImportWords(text: string): BatchImportResult {
  const entries = parseBatchText(text);
  const result: BatchImportResult = {
    total: entries.length,
    imported: 0,
    skipped: 0,
    errors: [],
    items: [],
  };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    try {
      let created = false;
      let item: LibraryItem;

      if (entry.category === 'verb' && entry.type) {
        const res = getOrCreateVerb(entry.word, entry.type as VerbType, {
          pronunciation: entry.pronunciation,
          meaning: entry.meaning,
        });
        created = res.created;
        item = res.verb;
      } else if (entry.category === 'adjective' && entry.type) {
        const res = getOrCreateAdjective(entry.word, entry.type as AdjectiveType, {
          pronunciation: entry.pronunciation,
          meaning: entry.meaning,
        });
        created = res.created;
        item = res.adjective;
      } else {
        const res = getOrCreateNoun(entry.word, {
          pronunciation: entry.pronunciation,
          meaning: entry.meaning,
        });
        created = res.created;
        item = res.noun;
      }

      if (created) {
        result.imported++;
      } else {
        result.skipped++;
      }
      result.items.push(item);
    } catch (err: any) {
      result.errors.push(`第 ${i + 1} 条 "${entry.word}" 导入失败: ${err.message}`);
    }
  }

  return result;
}

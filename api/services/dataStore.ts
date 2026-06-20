import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Verb, Adjective, Settings, VerbType, AdjectiveType, VERB_TYPE_LABELS, ADJECTIVE_TYPE_LABELS } from '../../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const VERBS_FILE = path.join(DATA_DIR, 'verbs.json');
const ADJECTIVES_FILE = path.join(DATA_DIR, 'adjectives.json');
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

export function addVerb(word: string, type: VerbType): Verb {
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
    hidden: false,
    createdAt: Date.now(),
  };

  verbs.push(newVerb);
  writeJsonFile(VERBS_FILE, verbs);
  return newVerb;
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

export function addAdjective(word: string, type: AdjectiveType): Adjective {
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
    hidden: false,
    createdAt: Date.now(),
  };

  adjectives.push(newAdjective);
  writeJsonFile(ADJECTIVES_FILE, adjectives);
  return newAdjective;
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

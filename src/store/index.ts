import { create } from 'zustand';
import {
  Verb,
  Adjective,
  Settings,
  VerbFormType,
  ConjugationResult,
} from '../../shared/types';
import { verbApi, adjectiveApi, settingsApi } from '../services/api';

interface AppState {
  verbs: Verb[];
  adjectives: Adjective[];
  settings: Settings | null;
  verbResults: ConjugationResult[];
  adjectiveResults: ConjugationResult[];
  loading: boolean;
  error: string | null;
  currentVerbWord: string;
  currentVerbType: string;
  currentAdjWord: string;
  currentAdjType: string;
  loadVerbs: () => Promise<void>;
  loadAdjectives: () => Promise<void>;
  loadSettings: () => Promise<void>;
  conjugateVerb: (word: string, type: string, forms: VerbFormType[]) => Promise<void>;
  conjugateAdjective: (word: string, type: string) => Promise<void>;
  addVerbToLibrary: (word: string, type: string) => Promise<Verb | undefined>;
  addAdjectiveToLibrary: (word: string, type: string) => Promise<Adjective | undefined>;
  hideVerb: (id: string) => Promise<void>;
  hideAdjective: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  setCurrentVerbWord: (word: string) => void;
  setCurrentVerbType: (type: string) => void;
  setCurrentAdjWord: (word: string) => void;
  setCurrentAdjType: (type: string) => void;
  clearVerbResults: () => void;
  clearAdjectiveResults: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  verbs: [],
  adjectives: [],
  settings: null,
  verbResults: [],
  adjectiveResults: [],
  loading: false,
  error: null,
  currentVerbWord: '',
  currentVerbType: 'godan',
  currentAdjWord: '',
  currentAdjType: 'i',

  loadVerbs: async () => {
    try {
      const res = await verbApi.list();
      if (res.data.success && res.data.data) {
        set({ verbs: res.data.data });
      }
    } catch (err) {
      set({ error: '加载动词列表失败' });
    }
  },

  loadAdjectives: async () => {
    try {
      const res = await adjectiveApi.list();
      if (res.data.success && res.data.data) {
        set({ adjectives: res.data.data });
      }
    } catch (err) {
      set({ error: '加载形容词列表失败' });
    }
  },

  loadSettings: async () => {
    try {
      const res = await settingsApi.get();
      if (res.data.success && res.data.data) {
        set({ settings: res.data.data });
      }
    } catch (err) {
      set({ error: '加载设置失败' });
    }
  },

  conjugateVerb: async (word: string, type: string, forms: VerbFormType[]) => {
    set({ loading: true, error: null });
    try {
      const res = await verbApi.conjugate({ word, type: type as any, forms });
      if (res.data.success && res.data.data) {
        set({ verbResults: res.data.data.results });
      } else {
        set({ error: res.data.error || '变形失败' });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.error || '变形失败' });
    } finally {
      set({ loading: false });
    }
  },

  conjugateAdjective: async (word: string, type: string) => {
    set({ loading: true, error: null });
    try {
      const res = await adjectiveApi.conjugate({ word, type: type as any });
      if (res.data.success && res.data.data) {
        set({ adjectiveResults: res.data.data.results });
      } else {
        set({ error: res.data.error || '变形失败' });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.error || '变形失败' });
    } finally {
      set({ loading: false });
    }
  },

  addVerbToLibrary: async (word: string, type: string) => {
    try {
      const res = await verbApi.create(word, type);
      if (res.data.success && res.data.data) {
        const newVerb = res.data.data;
        set((state) => ({ verbs: [...state.verbs, newVerb] }));
        return newVerb;
      }
    } catch (err) {
      set({ error: '添加到词库失败' });
    }
    return undefined;
  },

  addAdjectiveToLibrary: async (word: string, type: string) => {
    try {
      const res = await adjectiveApi.create(word, type);
      if (res.data.success && res.data.data) {
        const newAdj = res.data.data;
        set((state) => ({ adjectives: [...state.adjectives, newAdj] }));
        return newAdj;
      }
    } catch (err) {
      set({ error: '添加到词库失败' });
    }
    return undefined;
  },

  hideVerb: async (id: string) => {
    try {
      await verbApi.hide(id);
      set((state) => ({
        verbs: state.verbs.map((v) =>
          v.id === id ? { ...v, hidden: true } : v
        ),
      }));
    } catch (err) {
      set({ error: '操作失败' });
    }
  },

  hideAdjective: async (id: string) => {
    try {
      await adjectiveApi.hide(id);
      set((state) => ({
        adjectives: state.adjectives.map((a) =>
          a.id === id ? { ...a, hidden: true } : a
        ),
      }));
    } catch (err) {
      set({ error: '操作失败' });
    }
  },

  updateSettings: async (settings: Partial<Settings>) => {
    try {
      const res = await settingsApi.update(settings);
      if (res.data.success && res.data.data) {
        set({ settings: res.data.data });
      }
    } catch (err) {
      set({ error: '更新设置失败' });
    }
  },

  setCurrentVerbWord: (word: string) => set({ currentVerbWord: word }),
  setCurrentVerbType: (type: string) => set({ currentVerbType: type }),
  setCurrentAdjWord: (word: string) => set({ currentAdjWord: word }),
  setCurrentAdjType: (type: string) => set({ currentAdjType: type }),
  clearVerbResults: () => set({ verbResults: [] }),
  clearAdjectiveResults: () => set({ adjectiveResults: [] }),
}));

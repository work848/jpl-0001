import axios from 'axios';
import {
  Verb,
  Adjective,
  Settings,
  VerbConjugateRequest,
  VerbConjugateResponse,
  AdjectiveConjugateRequest,
  AdjectiveConjugateResponse,
} from '../../shared/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const verbApi = {
  conjugate: (data: VerbConjugateRequest) =>
    api.post<ApiResponse<VerbConjugateResponse>>('/verb/conjugate', data),

  list: () => api.get<ApiResponse<Verb[]>>('/verb'),

  create: (word: string, type: string) =>
    api.post<ApiResponse<Verb>>('/verb', { word, type }),

  remove: (id: string) => api.delete<ApiResponse<void>>(`/verb/${id}`),

  hide: (id: string) => api.patch<ApiResponse<void>>(`/verb/${id}/hide`),
};

export const adjectiveApi = {
  conjugate: (data: AdjectiveConjugateRequest) =>
    api.post<ApiResponse<AdjectiveConjugateResponse>>('/adjective/conjugate', data),

  list: () => api.get<ApiResponse<Adjective[]>>('/adjective'),

  create: (word: string, type: string) =>
    api.post<ApiResponse<Adjective>>('/adjective', { word, type }),

  remove: (id: string) => api.delete<ApiResponse<void>>(`/adjective/${id}`),

  hide: (id: string) => api.patch<ApiResponse<void>>(`/adjective/${id}/hide`),
};

export const settingsApi = {
  get: () => api.get<ApiResponse<Settings>>('/settings'),

  update: (data: Partial<Settings>) =>
    api.put<ApiResponse<Settings>>('/settings', data),
};

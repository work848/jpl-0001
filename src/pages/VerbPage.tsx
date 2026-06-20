import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';
import {
  VerbFormType,
  VERB_FORM_LABELS,
  VERB_TYPE_LABELS,
} from '../../shared/types';
import MultiSelect from '../components/MultiSelect';
import ResultCard from '../components/ResultCard';
import ErrorMessage from '../components/ErrorMessage';

const VERB_OPTIONS = Object.entries(VERB_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const FORM_OPTIONS = Object.entries(VERB_FORM_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function VerbPage() {
  const {
    currentVerbWord,
    currentVerbType,
    verbResults,
    loading,
    error,
    settings,
    setCurrentVerbWord,
    setCurrentVerbType,
    conjugateVerb,
    addVerbToLibrary,
    loadSettings,
    clearVerbResults,
  } = useAppStore();

  const [selectedForms, setSelectedForms] = useState<VerbFormType[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings?.defaultVerbForms && selectedForms.length === 0) {
      setSelectedForms(settings.defaultVerbForms as VerbFormType[]);
    }
  }, [settings, selectedForms.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVerbWord.trim()) return;
    if (selectedForms.length === 0) return;
    conjugateVerb(currentVerbWord.trim(), currentVerbType, selectedForms);
    setSaved(false);
  };

  const handleSaveToLibrary = async () => {
    if (!currentVerbWord.trim()) return;
    const result = await addVerbToLibrary(currentVerbWord.trim(), currentVerbType);
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">动词变形查询</h2>
        <p className="text-slate-500">输入日语动词原型，选择类别和变形类型，快速查询各种变形</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => useAppStore.setState({ error: null })} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              动词原型
            </label>
            <input
              type="text"
              value={currentVerbWord}
              onChange={(e) => setCurrentVerbWord(e.target.value)}
              placeholder="例如：食べる、飲む、する"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              动词类别
            </label>
            <select
              value={currentVerbType}
              onChange={(e) => setCurrentVerbType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-lg bg-white"
            >
              {VERB_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            选择变形类型（可多选）
          </label>
          <MultiSelect
            options={FORM_OPTIONS}
            selected={selectedForms}
            onChange={(vals) => setSelectedForms(vals as VerbFormType[])}
            placeholder="请选择要显示的变形类型"
          />
          <p className="mt-2 text-xs text-slate-400">
            默认选中「基本型过去式」和「基本型的否定」，可在设置中修改
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !currentVerbWord.trim() || selectedForms.length === 0}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 px-6 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                查询中...
              </>
            ) : (
              <>
                <Search size={20} />
                查询变形
              </>
            )}
          </button>
          {verbResults.length > 0 && (
            <button
              type="button"
              onClick={handleSaveToLibrary}
              disabled={saved}
              className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-rose-50 text-rose-600 border-2 border-rose-200 hover:bg-rose-100 disabled:opacity-50"
            >
              {saved ? (
                <>
                  <CheckCircle size={20} className="text-green-500" />
                  已保存
                </>
              ) : (
                <>
                  <Plus size={20} />
                  加入词库
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {verbResults.length > 0 && (
        <div className="animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-700">
              变形结果 - <span className="text-2xl text-rose-500">{currentVerbWord}</span>
            </h3>
            <button
              onClick={() => {
                clearVerbResults();
                setCurrentVerbWord('');
              }}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              清除结果
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verbResults.map((result) => (
              <ResultCard
                key={result.formType}
                label={result.formLabel}
                value={result.value}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

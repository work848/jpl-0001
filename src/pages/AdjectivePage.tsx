import { useState } from 'react';
import { Search, Plus, Loader2, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { ADJECTIVE_TYPE_LABELS } from '../../shared/types';
import ResultCard from '../components/ResultCard';
import ErrorMessage from '../components/ErrorMessage';

const ADJECTIVE_OPTIONS = Object.entries(ADJECTIVE_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export default function AdjectivePage() {
  const {
    currentAdjWord,
    currentAdjType,
    adjectiveResults,
    loading,
    error,
    setCurrentAdjWord,
    setCurrentAdjType,
    conjugateAdjective,
    addAdjectiveToLibrary,
    clearAdjectiveResults,
  } = useAppStore();

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdjWord.trim()) return;
    conjugateAdjective(currentAdjWord.trim(), currentAdjType);
    setSaved(false);
  };

  const handleSaveToLibrary = async () => {
    if (!currentAdjWord.trim()) return;
    const result = await addAdjectiveToLibrary(
      currentAdjWord.trim(),
      currentAdjType
    );
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          形容词变形查询
        </h2>
        <p className="text-slate-500">
          输入日语形容词原型，选择类别，快速查询过去式、ば形和名词化
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => useAppStore.setState({ error: null })}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              形容词原型
            </label>
            <input
              type="text"
              value={currentAdjWord}
              onChange={(e) => setCurrentAdjWord(e.target.value)}
              placeholder="例如：高い、賑やか、きれい"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              形容词类别
            </label>
            <select
              value={currentAdjType}
              onChange={(e) => setCurrentAdjType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-lg bg-white"
            >
              {ADJECTIVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            自动输出以下变形：
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
              形容词的过去式
            </span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
              形容词ば形
            </span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
              形容词的名词化
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !currentAdjWord.trim()}
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
          {adjectiveResults.length > 0 && (
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

      {adjectiveResults.length > 0 && (
        <div className="animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-700">
              变形结果 -{' '}
              <span className="text-2xl text-rose-500">{currentAdjWord}</span>
            </h3>
            <button
              onClick={() => {
                clearAdjectiveResults();
                setCurrentAdjWord('');
              }}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              清除结果
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {adjectiveResults.map((result) => (
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

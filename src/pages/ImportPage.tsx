import { useState } from 'react';
import { Upload, Check, AlertCircle, Info, X, FileText } from 'lucide-react';
import { useAppStore } from '../store';
import ErrorMessage from '../components/ErrorMessage';
import {
  WORD_CATEGORY_LABELS,
  LibraryItem,
  WordCategory,
} from '../../shared/types';

const SAMPLE_TEXT = `たべる
食べる 二类动词
吃

たかい
高い 1类形容词
高的

ねこ
猫
猫

わたし
私
我`;

function getItemCategory(item: LibraryItem): WordCategory {
  if ('type' in item) {
    if (['godan', 'ichidan', 'irregular'].includes(item.type)) {
      return 'verb';
    }
    if (['i', 'na'].includes(item.type)) {
      return 'adjective';
    }
  }
  return 'noun';
}

export default function ImportPage() {
  const {
    batchImport,
    lastImportResult,
    loading,
    error,
    clearImportResult,
  } = useAppStore();

  const [text, setText] = useState('');

  const handleImport = async () => {
    if (!text.trim()) return;
    await batchImport(text);
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    clearImportResult();
  };

  const handleClear = () => {
    setText('');
    clearImportResult();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">批量导入单词</h2>
        <p className="text-slate-500">按格式导入单词到词库，自动去重</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => useAppStore.setState({ error: null })}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl mb-6">
          <Info className="text-slate-500 mt-0.5 flex-shrink-0" size={20} />
          <div className="text-sm text-slate-600">
            <p className="font-medium mb-1 text-slate-700">导入格式说明：</p>
            <p>每个单词之间用空行分隔，每个单词按以下格式：</p>
            <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs">
              <p className="text-slate-500">发音（可选）</p>
              <p>
                日语单词{' '}
                <span className="text-slate-500">
                  类型（动词/形容词需要，名词不需要）
                </span>
              </p>
              <p className="text-slate-500">中文释义</p>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              动词类型：一类动词、二类动词、三类动词 | 形容词类型：1类形容词、2类形容词
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            导入内容
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此粘贴或输入单词，多个单词之间用空行分隔..."
            className="w-full h-72 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors font-mono text-sm resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!text.trim() || loading}
            className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 text-white py-3 px-6 rounded-xl font-medium hover:from-rose-500 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            {loading ? '导入中...' : '开始导入'}
          </button>
          <button
            onClick={handleLoadSample}
            className="px-6 py-3 rounded-xl font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2"
          >
            <FileText size={18} />
            示例
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 rounded-xl font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2"
          >
            <X size={18} />
            清空
          </button>
        </div>
      </div>

      {lastImportResult && (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">导入结果</h3>
            <button
              onClick={clearImportResult}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">总计</p>
              <p className="text-3xl font-bold text-slate-700">
                {lastImportResult.total}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Check className="text-green-600" size={16} />
                <p className="text-sm text-green-600">新增</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {lastImportResult.imported}
              </p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="text-amber-600" size={16} />
                <p className="text-sm text-amber-600">跳过</p>
              </div>
              <p className="text-3xl font-bold text-amber-600">
                {lastImportResult.skipped}
              </p>
            </div>
          </div>

          {lastImportResult.errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <p className="text-sm font-medium text-red-700 mb-2">错误：</p>
              <ul className="text-sm text-red-600 space-y-1">
                {lastImportResult.errors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {lastImportResult.items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                导入的单词：
              </p>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {lastImportResult.items.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-slate-800">
                        {item.word}
                      </span>
                      {item.pronunciation && (
                        <span className="text-sm text-slate-500">
                          {item.pronunciation}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          getItemCategory(item) === 'verb'
                            ? 'bg-blue-100 text-blue-700'
                            : getItemCategory(item) === 'adjective'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {'typeLabel' in item
                          ? item.typeLabel
                          : WORD_CATEGORY_LABELS[getItemCategory(item)]}
                      </span>
                    </div>
                    {item.meaning && (
                      <span className="text-sm text-slate-600">
                        {item.meaning}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

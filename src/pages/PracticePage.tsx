import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Settings,
  Play,
  RotateCcw,
  BookOpen,
  PenTool,
  FileText,
  X,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../store';
import {
  Verb,
  Adjective,
  Noun,
  WORD_CATEGORY_LABELS,
} from '../../shared/types';
import FlashCard from '../components/FlashCard';
import ErrorMessage from '../components/ErrorMessage';

type PracticeItem = Verb | Adjective | Noun;
type ViewCategory = 'verb' | 'adjective' | 'noun' | null;

function getItemCategory(item: PracticeItem): 'verb' | 'adjective' | 'noun' {
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

export default function PracticePage() {
  const {
    verbs,
    adjectives,
    nouns,
    settings,
    error,
    loadAllLibrary,
    loadSettings,
    hideVerb,
    hideAdjective,
    hideNoun,
    updateSettings,
    toggleVerbHidden,
    toggleAdjectiveHidden,
    toggleNounHidden,
  } = useAppStore();

  const [isPracticing, setIsPracticing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [tempReviewCount, setTempReviewCount] = useState(10);
  const [practiceType, setPracticeType] = useState<
    'all' | 'verb' | 'adjective' | 'noun'
  >('all');
  const [viewCategory, setViewCategory] = useState<ViewCategory>(null);

  useEffect(() => {
    loadAllLibrary();
    loadSettings();
  }, [loadAllLibrary, loadSettings]);

  useEffect(() => {
    if (settings?.reviewCount) {
      setTempReviewCount(settings.reviewCount);
    }
  }, [settings]);

  const visibleVerbs = verbs.filter((v) => !v.hidden);
  const visibleAdjectives = adjectives.filter((a) => !a.hidden);
  const visibleNouns = nouns.filter((n) => !n.hidden);
  const totalAvailable =
    practiceType === 'all'
      ? visibleVerbs.length + visibleAdjectives.length + visibleNouns.length
      : practiceType === 'verb'
      ? visibleVerbs.length
      : practiceType === 'adjective'
      ? visibleAdjectives.length
      : visibleNouns.length;

  const getRandomItems = (): PracticeItem[] => {
    let items: PracticeItem[] = [];

    if (practiceType === 'all' || practiceType === 'verb') {
      items = [...items, ...visibleVerbs];
    }
    if (practiceType === 'all' || practiceType === 'adjective') {
      items = [...items, ...visibleAdjectives];
    }
    if (practiceType === 'all' || practiceType === 'noun') {
      items = [...items, ...visibleNouns];
    }

    const shuffled = items.sort(() => Math.random() - 0.5);
    const count = Math.min(settings?.reviewCount || 10, shuffled.length);
    return shuffled.slice(0, count);
  };

  const startPractice = () => {
    if (totalAvailable === 0) return;
    setPracticeItems(getRandomItems());
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsPracticing(true);
  };

  const handleNext = () => {
    if (currentIndex < practiceItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsPracticing(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleHide = async () => {
    const currentItem = practiceItems[currentIndex];
    if (!currentItem) return;

    const category = getItemCategory(currentItem);

    if (category === 'verb') {
      await hideVerb(currentItem.id);
    } else if (category === 'adjective') {
      await hideAdjective(currentItem.id);
    } else {
      await hideNoun(currentItem.id);
    }

    const updatedItems = practiceItems.filter((_, i) => i !== currentIndex);
    setPracticeItems(updatedItems);

    if (updatedItems.length === 0) {
      setIsPracticing(false);
    } else if (currentIndex >= updatedItems.length) {
      setCurrentIndex(updatedItems.length - 1);
    }
    setIsFlipped(false);
  };

  const handleSaveSettings = async () => {
    await updateSettings({ reviewCount: tempReviewCount });
    setShowSettings(false);
  };

  if (!isPracticing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">词库练习</h2>
          <p className="text-slate-500">通过卡片复习你收集的动词、形容词和名词</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onClose={() => useAppStore.setState({ error: null })}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setViewCategory('verb')}
              className="text-center p-4 rounded-xl cursor-pointer transition-all bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <PenTool className="text-blue-600" size={18} />
                <span className="text-sm text-blue-600 font-medium">动词</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {verbs.length}
              </span>
              <div className="mt-1 text-xs text-blue-500">
                可见 {visibleVerbs.length} / 隐藏 {verbs.length - visibleVerbs.length}
              </div>
            </button>
            <button
              onClick={() => setViewCategory('adjective')}
              className="text-center p-4 rounded-xl cursor-pointer transition-all bg-purple-50 hover:bg-purple-100 ring-1 ring-purple-200"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="text-purple-600" size={18} />
                <span className="text-sm text-purple-600 font-medium">
                  形容词
                </span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {adjectives.length}
              </span>
              <div className="mt-1 text-xs text-purple-500">
                可见 {visibleAdjectives.length} / 隐藏 {adjectives.length - visibleAdjectives.length}
              </div>
            </button>
            <button
              onClick={() => setViewCategory('noun')}
              className="text-center p-4 rounded-xl cursor-pointer transition-all bg-teal-50 hover:bg-teal-100 ring-1 ring-teal-200"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="text-teal-600" size={18} />
                <span className="text-sm text-teal-600 font-medium">名词</span>
              </div>
              <span className="text-2xl font-bold text-teal-600">
                {nouns.length}
              </span>
              <div className="mt-1 text-xs text-teal-500">
                可见 {visibleNouns.length} / 隐藏 {nouns.length - visibleNouns.length}
              </div>
            </button>
            <div className="text-center p-4 bg-rose-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Settings className="text-rose-500" size={18} />
                <span className="text-sm text-rose-500">每次复习</span>
              </div>
              <span className="text-2xl font-bold text-rose-500">
                {settings?.reviewCount || 10}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              练习内容
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '全部' },
                { value: 'verb', label: '仅动词' },
                { value: 'adjective', label: '仅形容词' },
                { value: 'noun', label: '仅名词' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPracticeType(opt.value as 'all' | 'verb' | 'adjective' | 'noun')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    practiceType === opt.value
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startPractice}
              disabled={totalAvailable === 0}
              className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 text-white py-4 px-6 rounded-xl font-medium hover:from-rose-500 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              <Play size={24} />
              开始练习
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-4 rounded-xl font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2"
            >
              <Settings size={20} />
              设置
            </button>
          </div>

          {totalAvailable === 0 && (
            <p className="mt-4 text-center text-slate-500 text-sm">
              词库为空，请先在动词或形容词页面添加单词
            </p>
          )}
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800 mb-4">复习设置</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  每次复习数量
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempReviewCount}
                  onChange={(e) =>
                    setTempReviewCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-lg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 px-6 rounded-xl font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-3 px-6 rounded-xl font-medium bg-slate-700 text-white hover:bg-slate-800 transition-all"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {viewCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-fadeIn">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">
                  {WORD_CATEGORY_LABELS[viewCategory]}词库
                  <span className="ml-3 text-base font-normal text-slate-500">
                    共{' '}
                    {viewCategory === 'verb'
                      ? verbs.length
                      : viewCategory === 'adjective'
                      ? adjectives.length
                      : nouns.length}{' '}
                    个单词
                  </span>
                </h3>
                <button
                  onClick={() => setViewCategory(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {viewCategory === 'verb' && verbs.length > 0 && (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          单词
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          读音
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          释义
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          类型
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          状态
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 text-sm">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {verbs.map((verb) => (
                        <tr
                          key={verb.id}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            verb.hidden ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-lg font-semibold text-slate-800">
                            {verb.word}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {verb.pronunciation || '-'}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {verb.meaning || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                              {verb.typeLabel}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {verb.hidden ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                                <EyeOff size={14} />
                                已隐藏
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                                <Eye size={14} />
                                显示中
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => toggleVerbHidden(verb.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                verb.hidden
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              }`}
                            >
                              {verb.hidden ? '恢复显示' : '隐藏'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {viewCategory === 'adjective' && adjectives.length > 0 && (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          单词
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          读音
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          释义
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          类型
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          状态
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 text-sm">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adjectives.map((adj) => (
                        <tr
                          key={adj.id}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            adj.hidden ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-lg font-semibold text-slate-800">
                            {adj.word}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {adj.pronunciation || '-'}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {adj.meaning || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
                              {adj.typeLabel}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {adj.hidden ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                                <EyeOff size={14} />
                                已隐藏
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                                <Eye size={14} />
                                显示中
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => toggleAdjectiveHidden(adj.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                adj.hidden
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              }`}
                            >
                              {adj.hidden ? '恢复显示' : '隐藏'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {viewCategory === 'noun' && nouns.length > 0 && (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          单词
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          读音
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          释义
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600 text-sm">
                          状态
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 text-sm">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {nouns.map((noun) => (
                        <tr
                          key={noun.id}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            noun.hidden ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-lg font-semibold text-slate-800">
                            {noun.word}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {noun.pronunciation || '-'}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {noun.meaning || '-'}
                          </td>
                          <td className="py-4 px-4">
                            {noun.hidden ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                                <EyeOff size={14} />
                                已隐藏
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                                <Eye size={14} />
                                显示中
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => toggleNounHidden(noun.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                noun.hidden
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              }`}
                            >
                              {noun.hidden ? '恢复显示' : '隐藏'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {((viewCategory === 'verb' && verbs.length === 0) ||
                  (viewCategory === 'adjective' && adjectives.length === 0) ||
                  (viewCategory === 'noun' && nouns.length === 0)) && (
                  <div className="text-center py-16">
                    <FileText
                      size={48}
                      className="mx-auto mb-4 text-slate-300"
                    />
                    <p className="text-slate-500 text-lg">
                      暂无{WORD_CATEGORY_LABELS[viewCategory]}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      请先添加单词到词库
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setViewCategory(null)}
                  className="px-6 py-3 rounded-xl font-medium bg-slate-700 text-white hover:bg-slate-800 transition-all"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentItem = practiceItems[currentIndex];
  const progress = ((currentIndex + 1) / practiceItems.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsPracticing(false)}
          className="text-slate-500 hover:text-slate-700 flex items-center gap-2"
        >
          <RotateCcw size={18} />
          返回
        </button>
        <div className="text-slate-600 font-medium">
          {currentIndex + 1} / {practiceItems.length}
        </div>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-rose-400 to-rose-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentItem && (
        <>
          <FlashCard
            item={currentItem}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleHide}
              className="px-6 py-3 rounded-xl font-medium transition-all bg-orange-50 text-orange-600 border-2 border-orange-200 hover:bg-orange-100 flex items-center gap-2"
            >
              <EyeOff size={20} />
              不再出现
            </button>

            <button
              onClick={handleNext}
              className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-800 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-4">
            提示：点击卡片可以翻转查看答案
          </p>
        </>
      )}
    </div>
  );
}

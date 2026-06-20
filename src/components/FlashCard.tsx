import { RotateCcw } from 'lucide-react';
import { Verb, Adjective, Noun, WORD_CATEGORY_LABELS } from '../../shared/types';

type FlashCardItem = Verb | Adjective | Noun;

interface FlashCardProps {
  item: FlashCardItem;
  isFlipped: boolean;
  onFlip: () => void;
}

function getItemCategory(item: FlashCardItem): 'verb' | 'adjective' | 'noun' {
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

function getItemTypeLabel(item: FlashCardItem): string {
  if ('typeLabel' in item) {
    return item.typeLabel;
  }
  return WORD_CATEGORY_LABELS.noun;
}

export default function FlashCard({ item, isFlipped, onFlip }: FlashCardProps) {
  const category = getItemCategory(item);
  const typeLabel = getItemTypeLabel(item);
  const isNoun = category === 'noun';

  return (
    <div
      className="relative w-full max-w-lg mx-auto h-96 cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-sm text-rose-300 mb-3">{typeLabel}</span>
          {item.pronunciation && (
            <span className="text-lg text-slate-300 mb-2">
              {item.pronunciation}
            </span>
          )}
          <span className="text-5xl text-white font-bold mb-3">{item.word}</span>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-4">
            <RotateCcw size={16} />
            <span>点击翻转查看答案</span>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="text-sm text-rose-100 mb-3">{typeLabel}</span>
          {item.pronunciation && (
            <span className="text-lg text-rose-100 mb-2">
              {item.pronunciation}
            </span>
          )}
          <span className="text-5xl text-white font-bold mb-4">{item.word}</span>
          {item.meaning && (
            <div className="bg-white/20 rounded-xl px-6 py-3 mb-4">
              <span className="text-2xl text-white font-medium">
                {item.meaning}
              </span>
            </div>
          )}
          {!isNoun && (
            <div className="text-center mt-2">
              <p className="text-rose-100 text-sm mb-1">
                {category === 'verb' ? '动词变形包括：' : '形容词变形包括：'}
              </p>
              <p className="text-white text-sm">
                {category === 'verb'
                  ? 'ます形、て形、ない形、た形、可能形、被动形、使役形等'
                  : '过去式、ば形、名词化'}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-rose-100 text-sm mt-4">
            <RotateCcw size={16} />
            <span>点击翻转返回</span>
          </div>
        </div>
      </div>
    </div>
  );
}

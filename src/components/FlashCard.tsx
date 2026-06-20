import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Verb, Adjective } from '../../shared/types';

interface FlashCardProps {
  item: Verb | Adjective;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ item, isFlipped, onFlip }: FlashCardProps) {
  const isVerb = 'type' in item && ['godan', 'ichidan', 'irregular'].includes(item.type);

  return (
    <div className="relative w-full max-w-lg mx-auto h-80 cursor-pointer" onClick={onFlip}>
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
          <span className="text-sm text-rose-300 mb-4">{item.typeLabel}</span>
          <span className="text-5xl text-white font-bold mb-4">{item.word}</span>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
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
          <span className="text-sm text-rose-100 mb-4">{item.typeLabel}</span>
          <span className="text-5xl text-white font-bold mb-6">{item.word}</span>
          <div className="text-center">
            <p className="text-rose-100 text-sm mb-2">
              {isVerb ? '动词变形包括：' : '形容词变形包括：'}
            </p>
            <p className="text-white text-sm">
              {isVerb
                ? 'ます形、て形、ない形、た形、可能形、被动形、使役形等'
                : '过去式、ば形、名词化'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-rose-100 text-sm mt-6">
            <RotateCcw size={16} />
            <span>点击翻转返回</span>
          </div>
        </div>
      </div>
    </div>
  );
}

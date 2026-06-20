import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultCardProps {
  label: string;
  value: string;
}

export default function ResultCard({ label, value }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2">
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="text-2xl font-medium text-slate-800">{value}</span>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
          title="复制"
        >
          {copied ? (
            <Check className="text-green-500" size={18} />
          ) : (
            <Copy className="text-slate-400" size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

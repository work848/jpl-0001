import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = '请选择',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== value));
  };

  const selectedLabels = selected
    .map((s) => options.find((o) => o.value === s)?.label)
    .filter(Boolean);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors text-left flex items-center justify-between gap-2 min-h-[52px]"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-sm"
              >
                {label}
                <span
                  onClick={(e) => handleRemove(e, selected[index])}
                  className="hover:bg-rose-200 rounded p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </span>
              </span>
            ))
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
            >
              <span className="text-slate-700">{option.label}</span>
              {selected.includes(option.value) && (
                <Check className="text-rose-500" size={18} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

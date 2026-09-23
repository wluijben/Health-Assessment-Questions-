import React from 'react';
import { ScaleItem, ScaleOption } from '../types/clinical';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  item: ScaleItem;
  totalQuestions: number;
  selectedValue: number | undefined;
  onSelectOption: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  item,
  totalQuestions,
  selectedValue,
  onSelectOption,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  canProceed,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelectOption(value);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs">
      <fieldset
        role="radiogroup"
        aria-labelledby={`question-${item.id}-legend`}
        className="space-y-6"
      >
        <legend id={`question-${item.id}-legend`} className="w-full">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500 mb-2">
            <span>
              VRAAG <span className="font-semibold text-teal-800 font-sans">{item.itemNumber}</span> VAN {totalQuestions}
            </span>
            <span className="text-slate-400 font-sans">
              Domein: <strong className="text-slate-700 font-medium">{item.domainCategory}</strong>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {item.question}
          </h2>

          {item.subtext && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
              {item.subtext}
            </p>
          )}
        </legend>

        {/* Options list */}
        <div className="space-y-2.5 pt-2" role="presentation">
          {item.options.map((option: ScaleOption) => {
            const isSelected = selectedValue === option.value;
            const inputId = `option-${item.id}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={inputId}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                tabIndex={0}
                className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer min-h-[52px] select-none ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 text-teal-950 ring-1 ring-teal-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 pr-3">
                  {/* Native hidden radio for semantic screen readers */}
                  <input
                    type="radio"
                    id={inputId}
                    name={`item-${item.id}`}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => onSelectOption(option.value)}
                    className="sr-only"
                    aria-describedby={option.subtext ? `${inputId}-desc` : undefined}
                  />

                  {/* Accessible custom radio circle */}
                  <div
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
                      {option.label}
                    </span>
                    {option.subtext && (
                      <span
                        id={`${inputId}-desc`}
                        className="text-xs text-slate-500 font-normal mt-0.5"
                      >
                        {option.subtext}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score value indicator */}
                <div
                  aria-hidden="true"
                  className={`text-xs font-mono px-2 py-0.5 rounded shrink-0 ${
                    isSelected
                      ? 'bg-teal-100 text-teal-800 font-bold'
                      : 'bg-slate-100 text-slate-500 font-medium'
                  }`}
                >
                  +{option.value} pt
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className={`px-4 py-2 text-xs font-semibold rounded-md border transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
          }`}
        >
          Vorige Vraag
        </button>

        <div className="flex items-center gap-2">
          {!canProceed && (
            <span className="text-xs text-amber-600 font-medium hidden sm:inline" role="status">
              Selecteer een antwoord om verder te gaan
            </span>
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className={`px-5 py-2 text-xs font-semibold rounded-md transition-colors shadow-xs ${
              !canProceed
                ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            {isLast ? 'Bekijk Uitslag & Interpretatie →' : 'Volgende Vraag →'}
          </button>
        </div>
      </div>
    </div>
  );
};

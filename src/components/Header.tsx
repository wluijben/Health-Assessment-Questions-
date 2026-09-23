import React from 'react';
import { FileText, BookOpen, RefreshCw, Terminal, Activity } from 'lucide-react';

interface HeaderProps {
  currentScaleId: string;
  onSelectScale: (scaleId: string) => void;
  scales: { id: string; name: string; shortCode: string }[];
  onOpenMethodology: () => void;
  onOpenDeployment: () => void;
  onReset: () => void;
  onPrintReport?: () => void;
  hasCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScaleId,
  onSelectScale,
  scales,
  onOpenMethodology,
  onOpenDeployment,
  onReset,
  onPrintReport,
  hasCompleted,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#top"
              className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
              aria-label="ClinScreen NL Startpagina"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                Ψ
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-slate-900 tracking-tight">ClinScreen <span className="text-teal-700 font-semibold text-xs ml-0.5">NL</span></span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase hidden sm:inline">
                  Burn-out & ME/CVS
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation & Scale Selector */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600" aria-label="Hoofdnavigatie">
            <div className="relative">
              <label htmlFor="scale-selector" className="sr-only">
                Kies Vragenlijst
              </label>
              <select
                id="scale-selector"
                value={currentScaleId}
                onChange={(e) => onSelectScale(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-900 text-xs font-semibold rounded-md px-3 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors cursor-pointer"
              >
                {scales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shortCode}: {s.name.split('(')[0]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenMethodology}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 text-xs text-slate-600"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Wetenschappelijke Bronnen</span>
            </button>

            <button
              onClick={onOpenDeployment}
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 text-xs text-slate-600"
            >
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>CI/CD & Hosting</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            {hasCompleted && onPrintReport && (
              <button
                onClick={onPrintReport}
                className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Print klinisch intakeverslag voor huisarts of bedrijfsarts"
              >
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden sm:inline">Artsenverslag Printen / PDF</span>
                <span className="sm:hidden">Printen</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Vragenlijst opnieuw starten"
              aria-label="Vragenlijst opnieuw starten"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Opnieuw</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 gap-2 overflow-x-auto">
          <select
            value={currentScaleId}
            onChange={(e) => onSelectScale(e.target.value)}
            className="bg-slate-100 text-slate-900 text-xs font-semibold rounded px-2 py-1 border border-slate-300 w-full"
            aria-label="Kies klinische vragenlijst op mobiel"
          >
            {scales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortCode}: {s.name.split('(')[0]}
              </option>
            ))}
          </select>
          <button
            onClick={onOpenMethodology}
            className="px-2 py-1 whitespace-nowrap text-teal-700 hover:underline font-medium"
          >
            Bronnen
          </button>
          <button
            onClick={onOpenDeployment}
            className="px-2 py-1 whitespace-nowrap text-slate-600 hover:underline"
          >
            CI/CD
          </button>
        </div>
      </div>
    </header>
  );
};

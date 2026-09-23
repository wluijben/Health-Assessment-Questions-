import React, { useState, useMemo } from 'react';
import { CLINICAL_SCALES } from './data/clinicalScales';
import { ClinicalScale, UserResponses, AssessmentResult } from './types/clinical';
import { Header } from './components/Header';
import { ScientificFoundationBanner } from './components/ScientificFoundationBanner';
import { QuestionCard } from './components/QuestionCard';
import { ClinicalResultsView } from './components/ClinicalResultsView';
import { PrintableReport } from './components/PrintableReport';
import { MethodologyModal } from './components/MethodologyModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { MandatoryDisclaimer } from './components/MandatoryDisclaimer';

export default function App() {
  const [selectedScaleId, setSelectedScaleId] = useState<string>('burnout-ubos');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<UserResponses>({});
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState<boolean>(false);

  // Actieve klinische schaal
  const currentScale: ClinicalScale = useMemo(() => {
    return CLINICAL_SCALES.find((s) => s.id === selectedScaleId) || CLINICAL_SCALES[0];
  }, [selectedScaleId]);

  // Wisselen van vragenlijst
  const handleSelectScale = (scaleId: string) => {
    setSelectedScaleId(scaleId);
    setCurrentQuestionIndex(0);
    setResponses({});
    setHasCompleted(false);
  };

  const handleReset = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
    setHasCompleted(false);
  };

  // Antwoordselectie
  const handleSelectOption = (value: number) => {
    const currentItem = currentScale.items[currentQuestionIndex];
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: value,
    }));
  };

  // Navigatie
  const handleNext = () => {
    if (currentQuestionIndex < currentScale.items.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setHasCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Huidige vraag
  const currentItem = currentScale.items[currentQuestionIndex];
  const isCurrentAnswered = currentItem && responses[currentItem.id] !== undefined;

  // Voortgangsberekening
  const answeredCount = Object.keys(responses).length;
  const progressPercent = Math.round((answeredCount / currentScale.items.length) * 100);

  // Klinische demonstratie presets
  const handleLoadPreset = (scenario: 'minimal' | 'moderate' | 'severe') => {
    const newResponses: UserResponses = {};
    currentScale.items.forEach((item) => {
      if (scenario === 'minimal') {
        newResponses[item.id] = item.options[0]?.value ?? 0;
      } else if (scenario === 'moderate') {
        const midIdx = Math.floor(item.options.length / 2);
        newResponses[item.id] = item.options[midIdx]?.value ?? 1;
      } else {
        const maxIdx = item.options.length - 1;
        newResponses[item.id] = item.options[maxIdx]?.value ?? 3;
      }
    });
    setResponses(newResponses);
    setHasCompleted(true);
  };

  // Berekening van het klinische resultaat
  const result: AssessmentResult | null = useMemo(() => {
    if (!hasCompleted && answeredCount < currentScale.items.length) {
      return null;
    }

    let total = 0;
    currentScale.items.forEach((item) => {
      const val = responses[item.id];
      if (val !== undefined) {
        total += val;
      }
    });

    // Bepaal de ernstklasse / bracket
    const matchedBracket =
      currentScale.brackets.find(
        (b) => total >= b.minScore && total <= b.maxScore
      ) || currentScale.brackets[currentScale.brackets.length - 1];

    // Subdomein uitsplitsing
    const categoryMap: { [cat: string]: { score: number; maxScore: number } } = {};
    currentScale.items.forEach((item) => {
      if (!categoryMap[item.domainCategory]) {
        categoryMap[item.domainCategory] = { score: 0, maxScore: 0 };
      }
      const itemScore = responses[item.id] || 0;
      const itemMax = Math.max(...item.options.map((o) => o.value));
      categoryMap[item.domainCategory].score += itemScore;
      categoryMap[item.domainCategory].maxScore += itemMax;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      score: stats.score,
      maxScore: stats.maxScore,
      percentage: stats.maxScore > 0 ? Math.round((stats.score / stats.maxScore) * 100) : 0,
    }));

    return {
      scaleId: currentScale.id,
      scaleName: currentScale.name,
      totalScore: total,
      maxScore: currentScale.maxPossibleScore,
      percentage: Math.round((total / currentScale.maxPossibleScore) * 100),
      bracket: matchedBracket,
      responses,
      completedAt: new Date().toISOString(),
      categoryBreakdown,
    };
  }, [hasCompleted, answeredCount, currentScale, responses]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Ga direct naar de hoofdinhoud
      </a>

      {/* Header */}
      <Header
        currentScaleId={selectedScaleId}
        onSelectScale={handleSelectScale}
        scales={CLINICAL_SCALES.map((s) => ({
          id: s.id,
          name: s.name,
          shortCode: s.shortCode,
        }))}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenDeployment={() => setIsDeploymentOpen(true)}
        onReset={handleReset}
        onPrintReport={hasCompleted ? () => setIsPrintModalOpen(true) : undefined}
        hasCompleted={hasCompleted}
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Schaal Kaders & Literatuurbanner */}
        <ScientificFoundationBanner
          scale={currentScale}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
        />

        {/* Weergave: Ingevulde test vs Resultaten */}
        {!hasCompleted ? (
          <section aria-labelledby="questionnaire-progress-heading" className="space-y-4">
            {/* Voortgangsbalk & Snelle Testscenario's */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2
                    id="questionnaire-progress-heading"
                    className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold"
                  >
                    Voortgang Vragenlijst
                  </h2>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs text-slate-700 font-medium">
                    {answeredCount} van de {currentScale.items.length} beantwoord ({progressPercent}%)
                  </span>
                </div>

                {/* Voorbeeldscenario's voor snelle demonstratie */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 hidden md:inline text-[11px] font-mono">
                    Voorbeeldprofielen:
                  </span>
                  <button
                    onClick={() => handleLoadPreset('minimal')}
                    className="px-2 py-1 text-[11px] font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                    title="Laad laag risico / gezonde herstelwaarden"
                  >
                    Laag Risico
                  </button>
                  <button
                    onClick={() => handleLoadPreset('moderate')}
                    className="px-2 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
                    title="Laad matig / klinisch drempelwaarde profiel"
                  >
                    Matig / Drempel
                  </button>
                  <button
                    onClick={() => handleLoadPreset('severe')}
                    className="px-2 py-1 text-[11px] font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                    title="Laad ernstige ziektelast / decompensatie profiel"
                  >
                    Ernstig
                  </button>
                </div>
              </div>

              {/* Visuele Voortgangsbalk */}
              <div
                className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Voortgang vragenlijst: ${progressPercent} procent`}
              >
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Vragenknoppen balk */}
              <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto pb-1">
                {currentScale.items.map((item, idx) => {
                  const isAnswered = responses[item.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`flex-1 min-w-[36px] py-1.5 px-1 rounded text-xs font-mono font-medium transition-all text-center border ${
                        isCurrent
                          ? 'border-teal-700 bg-teal-700 text-white font-bold ring-2 ring-teal-700/30'
                          : isAnswered
                          ? 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                      aria-label={`Ga naar Vraag ${idx + 1}: ${item.domainCategory}${isAnswered ? ' (Beantwoord)' : ''}`}
                    >
                      <span className="sm:hidden">{idx + 1}</span>
                      <span className="hidden sm:inline">V{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vraagkaart */}
            {currentItem && (
              <QuestionCard
                item={currentItem}
                totalQuestions={currentScale.items.length}
                selectedValue={responses[currentItem.id]}
                onSelectOption={handleSelectOption}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === currentScale.items.length - 1}
                canProceed={isCurrentAnswered}
              />
            )}
          </section>
        ) : (
          result && (
            <ClinicalResultsView
              result={result}
              scale={currentScale}
              onRetest={handleReset}
              onPrint={() => setIsPrintModalOpen(true)}
              onSelectScale={handleSelectScale}
            />
          )
        )}

        {/* Medische Disclaimer */}
        <MandatoryDisclaimer />
      </main>

      {/* Afdrukbaar Klinisch Inzageverslag */}
      {isPrintModalOpen && result && (
        <PrintableReport
          result={result}
          scale={currentScale}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Wetenschappelijke Methodologie Modal */}
      {isMethodologyOpen && (
        <MethodologyModal onClose={() => setIsMethodologyOpen(false)} />
      )}

      {/* Deployment & CI/CD Guide Modal */}
      {isDeploymentOpen && (
        <DeploymentGuideModal onClose={() => setIsDeploymentOpen(false)} />
      )}
    </div>
  );
}

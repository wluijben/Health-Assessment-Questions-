import React, { useState } from 'react';
import { AssessmentResult, ClinicalScale } from '../types/clinical';
import { ScoreGauge } from './ScoreGauge';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Download,
  FileText,
  HeartHandshake,
  HelpCircle,
  Info,
  PhoneCall,
  Printer,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';

interface ClinicalResultsViewProps {
  result: AssessmentResult;
  scale: ClinicalScale;
  onRetest: () => void;
  onPrint: () => void;
  onSelectScale: (scaleId: string) => void;
}

export const ClinicalResultsView: React.FC<ClinicalResultsViewProps> = ({
  result,
  scale,
  onRetest,
  onPrint,
  onSelectScale,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { bracket, totalScore, maxScore, categoryBreakdown } = result;

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `clinscreen_${scale.shortCode.toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Acute Nood / Ondersteuningsstrook bij Ernstige Uitputting & Distress */}
      {bracket.level === 'severe' && (
        <section
          aria-label="Directe Ondersteuning en Hulplijnen"
          className="bg-rose-50 border-2 border-rose-300 rounded-xl p-5 sm:p-6 text-rose-950 flex flex-col md:flex-row items-start gap-4 shadow-xs"
        >
          <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-800">
                Zorgelijke Ziektelast & Uitputting Gedetecteerd
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-rose-950">
              U staat er niet alleen voor — Zoek tijdig professionele ondersteuning
            </h3>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              Uw antwoorden reflecteren ernstige fysiologische of emotionele uitputting. Neem contact op met uw huisarts of bedrijfsarts. Mocht u zich mentaal klem voelen zitten of behoefte hebben aan een vertrouwelijk luisterend oor:
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="tel:0880767000"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-colors"
                title="De Luisterlijn (24/7 dag en nacht bereikbaar)"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Bel De Luisterlijn (088 0767 000)</span>
              </a>
              <a
                href="https://www.113.nl"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-900 bg-white border border-rose-300 hover:bg-rose-100/50 rounded-md transition-colors"
              >
                <span>113 Zelfmoordpreventie (0800-0113 / chat)</span>
              </a>
              <a
                href="https://www.thuisarts.nl"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs font-medium text-rose-800 hover:underline inline-flex items-center gap-1"
              >
                <span>Thuisarts.nl (Informatie van huisartsen) →</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Hoofdkaart Klinische Score & Gauge */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          {/* Gauge Kolom */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
              Gestandaardiseerde Score
            </span>
            <ScoreGauge
              score={totalScore}
              maxScore={maxScore}
              brackets={scale.brackets}
              currentBracket={bracket}
            />
          </div>

          {/* Details & Interpretatie */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-teal-800 font-semibold tracking-wider">
                Klinische Ernstcategorie
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Bereik: {bracket.minScore}–{bracket.maxScore} van {maxScore} ptn
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {bracket.title}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {bracket.summary}
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-1">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>Pathofysiologische & Klinische Betekenis</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bracket.clinicalSignificance}
              </p>
            </div>

            {/* Aanbevolen Klinische Triage */}
            <div className="flex items-start gap-3 p-3.5 bg-teal-50/60 border border-teal-200 rounded-lg text-teal-950">
              <CheckCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-semibold text-teal-900">Aanbevolen Actie & Triage: </strong>
                {bracket.recommendedClinicalAction}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Richtlijnen & Subdomeinen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vervolgstappen */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <Info className="w-4 h-4 text-teal-700" />
            <span>Op Richtlijnen Gebaseerd Hersteladvies</span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Wetenschappelijk Ondersteunde Vervolgstappen
          </h3>

          <p className="text-xs text-slate-600">
            Aanbevelingen geformuleerd conform de NHG-Standaarden, het Gezondheidsraad Advies ME/CVS (2018) en internationale richtlijnen:
          </p>

          <ul className="space-y-2.5 pt-1">
            {bracket.literatureNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subdomein Analyse */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <HeartHandshake className="w-4 h-4 text-teal-700" />
            <span>Kwantitatieve Subdomein Analyse</span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Symptoomlast per Klinische Dimensie
          </h3>

          <p className="text-xs text-slate-600">
            Toont welke fysiologische en gedragsmatige factoren het zwaarst bijdragen aan uw totale uitkomst:
          </p>

          <div className="space-y-3.5 pt-1">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800">{cat.category}</span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {cat.score} / {cat.maxScore} ptn ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.percentage >= 66
                        ? 'bg-rose-500'
                        : cat.percentage >= 33
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Subdimensies zijn opgebouwd conform de factorstructuur van de oorspronkelijke psychometrische schalen.
          </div>
        </div>
      </div>

      {/* Actiebalk */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Klinisch Intakeverslag Printen / PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{downloadSuccess ? 'Gedownload!' : 'Exporteer JSON'}</span>
          </button>
        </div>

        <button
          onClick={onRetest}
          className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Vragenlijst Opnieuw Invullen</span>
        </button>
      </div>

      {/* Differentiële & Aanverwante Instrumenten */}
      <div className="pt-4 border-t border-slate-200/80">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Vergelijkende & Aanverwante Klinische Schalen
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scale.id !== 'burnout-ubos' && (
            <button
              onClick={() => onSelectScale('burnout-ubos')}
              className="text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900 block">
                UBOS-7: Burn-out & Overspannenheid
              </span>
              <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                Utrechtse Burnout Schaal en NHG-Standaard M10 adaptatie voor werkgerelateerde uitputting.
              </span>
            </button>
          )}

          {scale.id !== 'chronische-vermoeidheid-me-cvs' && (
            <button
              onClick={() => onSelectScale('chronische-vermoeidheid-me-cvs')}
              className="text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900 block">
                CVS-CIS-7: Chronisch Vermoeidheidssyndroom (ME/CVS)
              </span>
              <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                Checklist Individuele Spankracht (CIS-20) & Gezondheidsraad criteria met PEM-screening.
              </span>
            </button>
          )}

          {scale.id !== 'differentieel-burnout-vs-cvs' && (
            <button
              onClick={() => onSelectScale('differentieel-burnout-vs-cvs')}
              className="text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-900 block">
                B-CVS-Diff: Differentiële Index Burn-out vs ME/CVS
              </span>
              <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                Onderscheidt psychogene overspannenheid van neuro-immunologische ME/CVS met PEM.
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

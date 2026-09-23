import React, { useState } from 'react';
import { ClinicalScale } from '../types/clinical';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';

interface ScientificFoundationBannerProps {
  scale: ClinicalScale;
  onOpenMethodology: () => void;
}

export const ScientificFoundationBanner: React.FC<ScientificFoundationBannerProps> = ({
  scale,
  onOpenMethodology,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-labelledby="scientific-foundation-heading"
      className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Gevalideerd Klinisch Meetinstrument</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500 lowercase">wetenschappelijk geadapteerd</span>
          </div>

          <h1
            id="scientific-foundation-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
          >
            {scale.name}
          </h1>

          <p className="text-sm text-slate-700 leading-relaxed">
            {scale.adaptationDescription}
          </p>

          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 pt-1">
            <span className="font-medium text-slate-700">Interne Betrouwbaarheid: {scale.psychometricSpecs.cronbachAlpha}</span>
            <span aria-hidden="true">·</span>
            <span>Retest-stabiliteit: {scale.psychometricSpecs.testRetestReliability}</span>
            <span aria-hidden="true">·</span>
            <span>Tijdsvenster: <strong className="text-slate-800">{scale.recallWindow}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Aantal Items: <strong className="text-slate-800">{scale.items.length} vragen</strong></span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center md:flex-col md:items-end gap-2 shrink-0 pt-2 md:pt-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            aria-expanded={isExpanded}
            aria-controls="citation-drawer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>{isExpanded ? 'Verberg Literatuur' : 'Bekijk Bronnen & Specificaties'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Citations and Psychometrics Drawer */}
      {isExpanded && (
        <div
          id="citation-drawer"
          className="mt-5 pt-5 border-t border-slate-200/80 space-y-4 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/60">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Psychometrische Validatie & Diagnostiek
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 font-mono">
                {scale.psychometricSpecs.sensitivity && (
                  <li>
                    <span className="text-slate-500">Diagnostische Sensitiviteit:</span>{' '}
                    <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.sensitivity}</span>
                  </li>
                )}
                {scale.psychometricSpecs.specificity && (
                  <li>
                    <span className="text-slate-500">Diagnostische Specificiteit:</span>{' '}
                    <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.specificity}</span>
                  </li>
                )}
                <li>
                  <span className="text-slate-500">Klinisch Afkappunt:</span>{' '}
                  <span className="text-slate-900">{scale.psychometricSpecs.clinicalCutoffNote}</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/60">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Klinische Doelgroep & Toepassing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ontworpen voor het kwantificeren van ziektelast binnen <strong className="text-slate-900">{scale.targetDomain}</strong> ter ondersteuning van zelfmonitoring en consulten bij de huisarts of bedrijfsarts.
              </p>
              <div className="mt-2 text-xs">
                <button
                  onClick={onOpenMethodology}
                  className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  Lees de volledige wetenschappelijke methodologie <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Primaire Wetenschappelijke Bronnen
            </h4>
            <div className="space-y-2">
              {scale.citations.map((cite, index) => (
                <div
                  key={index}
                  className="text-xs bg-white border border-slate-200 rounded p-2.5 text-slate-700"
                >
                  <p className="font-semibold text-slate-900">
                    {cite.authors} ({cite.year}). &ldquo;{cite.title}.&rdquo;{' '}
                    <span className="italic font-normal">{cite.journal}</span>
                    {cite.volumeAndPages && `, ${cite.volumeAndPages}`}.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-1 font-mono text-[11px]">
                    {cite.doiOrPmid && <span>{cite.doiOrPmid}</span>}
                    {cite.validationStats && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{cite.validationStats}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

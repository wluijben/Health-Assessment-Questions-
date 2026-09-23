import React from 'react';
import { CLINICAL_SCALES } from '../data/clinicalScales';
import { BookOpen, ShieldCheck, X } from 'lucide-react';

interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Wetenschappelijke Fundering & Psychometrische Methodologie
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Peer-reviewed schalen, NHG-richtlijnen, Gezondheidsraad ME/CVS en diagnostische validatie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-200/70 transition-colors"
            aria-label="Sluit toelichting"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Overview Statement */}
          <section className="bg-teal-50/70 border border-teal-200 rounded-lg p-4 text-xs text-teal-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-teal-900 font-mono">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Evidence-Based Screening Architectuur</span>
            </div>
            <p>
              ClinScreen NL hanteert gestandaardiseerde meetinstrumenten die zijn afgeleid van de Nederlandse gedragswetenschappelijke en klinische epidemiologie. In plaats van ongestandaardiseerde online quizzen, baseren onze vragenlijsten zich op gevalideerde constructen: de <strong>Utrechtse Burnout Schaal (UBOS)</strong>, de <strong>NHG-Standaard Overspannenheid en Burn-out</strong>, en de <strong>Checklist Individuele Spankracht (CIS-20)</strong> van het Radboudumc Kenniscentrum Chronische Vermoeidheid (NKCV), gecombineerd met de <strong>Gezondheidsraad criteria voor ME/CVS</strong>.
            </p>
          </section>

          {/* Individual Scales Details */}
          {CLINICAL_SCALES.map((scale) => (
            <section key={scale.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-base text-slate-900">
                  {scale.name}
                </h3>
                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {scale.shortCode}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                {scale.adaptationDescription}
              </p>

              {/* Validation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded font-mono">
                <div>
                  <span className="text-slate-500">Interne Betrouwbaarheid:</span>{' '}
                  <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.cronbachAlpha}</span>
                </div>
                <div>
                  <span className="text-slate-500">Test-Hertest Stabiliteit:</span>{' '}
                  <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.testRetestReliability}</span>
                </div>
                {scale.psychometricSpecs.sensitivity && (
                  <div>
                    <span className="text-slate-500">Sensitiviteit:</span>{' '}
                    <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.sensitivity}</span>
                  </div>
                )}
                {scale.psychometricSpecs.specificity && (
                  <div>
                    <span className="text-slate-500">Specificiteit:</span>{' '}
                    <span className="text-slate-900 font-semibold">{scale.psychometricSpecs.specificity}</span>
                  </div>
                )}
              </div>

              {/* Citations */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Referenties & Primaire Literatuur
                </div>
                {scale.citations.map((cite, i) => (
                  <div key={i} className="text-xs bg-white border border-slate-200/80 rounded p-2 text-slate-600">
                    <p className="font-semibold text-slate-900">
                      {cite.authors} ({cite.year}). &ldquo;{cite.title}.&rdquo; <em>{cite.journal}</em>
                      {cite.volumeAndPages && `, ${cite.volumeAndPages}`}.
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {cite.doiOrPmid} {cite.validationStats && `· ${cite.validationStats}`}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Differentiële Pathofysiologie: Burn-out vs ME/CVS */}
          <section className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">
              Klinisch Differentiële Rationale: Psychogene Stress versus Neuro-immunologische ME/CVS
            </h4>
            <p>
              In de huisartsenpraktijk en bedrijfsgezondheidszorg ontstaat geregeld diagnostische verwarring tussen een ernstige burn-out en het Chronisch Vermoeidheidssyndroom (ME/CVS). Hoewel beide beelden gepaard gaan met diepe uitputting en concentratieproblemen, verschillen de onderliggende ziektemechanismen wezenlijk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Burn-out / Overspannenheid (NHG M10):</strong> Veroorzaakt door aanhoudende psychosociale overbelasting met chronische activering van de HPA-as (hypofyse-bijnieras) en sympathische uitputting. Herstel treedt doorgaans op na stressreductie, herstel van autonomie en geleidelijke activering (bijv. wandelen en opbouw van dagstructuur).
              </li>
              <li>
                <strong>ME/CVS (Gezondheidsraad 2018 / IOM 2015):</strong> Een complexe chronische multisysteemziekte met stoornissen in het immuunsysteem, het autonome zenuwstelsel en het cellulaire energiemetabolisme. Het onmiskenbare kenmerk is <strong>Post-Exertionele Malaise (PEM)</strong>: een verergering van de symptomen na minimale fysieke of cognitieve belasting. Bij ME/CVS leidt geforceerde opbouw van inspanning juist tot verergering en ziektetoename (&quot;push and crash&quot;).
              </li>
            </ul>
            <p>
              Daarom adviseert de Gezondheidsraad om bij aanwezigheid van PEM zware activeringstherapieën (zoals Graded Exercise Therapy) te vermijden en de energie zorgvuldig te doseren volgens het <em>Pacing</em>-principe.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Sluit Wetenschappelijke Verantwoording
          </button>
        </div>
      </div>
    </div>
  );
};

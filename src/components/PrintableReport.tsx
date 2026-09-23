import React from 'react';
import { AssessmentResult, ClinicalScale } from '../types/clinical';
import { Printer, X } from 'lucide-react';

interface PrintableReportProps {
  result: AssessmentResult;
  scale: ClinicalScale;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  result,
  scale,
  onClose,
}) => {
  const { bracket, totalScore, maxScore, responses, completedAt } = result;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300">
        {/* Modal Top Bar (Verborgen tijdens printen) */}
        <div className="no-print flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">
              Klinisch Intakeverslag voor Arts of Behandelaar
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              (A4 / Dossier Formaat)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Document Printen / Opslaan als PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/70 transition-colors"
              aria-label="Sluit verslag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
                KLINISCHE PSYCHOMETRISCHE ZELFRAPPORTAGE · INTAKE DOSSIER
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                {scale.name}
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {scale.adaptationDescription}
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-slate-600 shrink-0">
              <div>Datum: <strong>{new Date(completedAt).toLocaleDateString('nl-NL')}</strong></div>
              <div>Tijd: <strong>{new Date(completedAt).toLocaleTimeString('nl-NL')}</strong></div>
              <div className="text-[11px] text-slate-400">Dossierref: {result.scaleId.toUpperCase()}-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          {/* Scoreoverzicht */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 print:bg-transparent print:border-slate-400 print-break-inside-avoid">
            <div className="sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
              <div className="text-xs font-mono uppercase text-slate-500">Gevalideerde Totaalscore</div>
              <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
                {totalScore} <span className="text-sm font-normal text-slate-500">/ {maxScore} ptn</span>
              </div>
              <div className="text-xs text-slate-600 mt-1 font-mono">
                Relatieve last: {Math.round((totalScore / maxScore) * 100)}% van schaalmaximum
              </div>
            </div>

            <div className="sm:col-span-2 sm:pl-2 space-y-1">
              <div className="text-xs font-mono uppercase text-slate-500">Klinische Ernstcategorie</div>
              <div className="text-base font-bold text-slate-900">
                {bracket.title}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {bracket.clinicalSignificance}
              </p>
            </div>
          </div>

          {/* Vragenmatrix */}
          <div className="space-y-2 print-break-inside-avoid">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Item-Respons Matrix ({scale.recallWindow})
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2 px-3 w-10 text-center font-mono">#</th>
                    <th className="py-2 px-3">Symptoomdomein & Gestandaardiseerde Itemtekst</th>
                    <th className="py-2 px-3 w-48">Gekozen Antwoord</th>
                    <th className="py-2 px-3 w-16 text-right font-mono">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal">
                  {scale.items.map((item) => {
                    const score = responses[item.id] ?? 0;
                    const selectedOpt = item.options.find((o) => o.value === score);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-center font-mono text-slate-500">
                          {item.itemNumber}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-medium text-slate-900">{item.question}</span>
                          <span className="block text-[11px] text-slate-500 font-mono">{item.domainCategory}</span>
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {selectedOpt ? selectedOpt.label : 'Niet beantwoord'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          +{score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Klinische Richtlijnen voor Huisarts & Bedrijfsarts */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 print-break-inside-avoid">
            <div className="text-xs font-mono uppercase text-teal-900 font-bold tracking-wider">
              Handreiking voor Huisarts, Bedrijfsarts & Behandelend Specialist
            </div>
            <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
              <p>
                <strong>Aanbevolen Klinische Evaluatie: </strong>
                {bracket.recommendedClinicalAction}
              </p>
              <p>
                <strong>Differentiële Uitsluiting & Somatische Diagnostiek: </strong>
                Overweeg laboratoriumonderzoek ter uitsluiting van anemie/ijzergebrek (ferritine), schildklierafwijkingen (TSH), vitamine D en B12 deficiëntie, diabetes mellitus (HbA1c), chronische infecties of auto-immuunziekten.
              </p>
              <p>
                <strong>Geadviseerde Richtlijnkaders: </strong>
                NHG-Standaard M10 (Overspannenheid en burn-out), Gezondheidsraad Advies ME/CVS (2018), en NICE NG206. Let bij ME/CVS op contra-indicatie voor forcerende opbouw (Graded Exercise Therapy) bij aanwezigheid van Post-Exertionele Malaise (PEM).
              </p>
            </div>
          </div>

          {/* Wetenschappelijke Bronvermelding */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3 space-y-1 print-break-inside-avoid">
            <div className="font-semibold text-slate-700">Wetenschappelijke Referenties:</div>
            {scale.citations.map((c, i) => (
              <div key={i}>
                • {c.authors} ({c.year}). &ldquo;{c.title}.&rdquo; <em>{c.journal}</em>. {c.doiOrPmid}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-100 rounded border border-slate-300 text-[10px] text-slate-600 leading-normal print-break-inside-avoid">
            <strong>WETTELIJKE DISCLAIMER: </strong>
            Dit overzicht is een gestandaardiseerde psychometrische zelfrapportage ten behoeve van voorlichting, consultvoorbereiding en arts-patiëntcommunicatie. Het vervangt geen medisch onderzoek of formele medische diagnose. Alleen een bevoegd arts kan na anamnese, lichamelijk onderzoek en uitsluitingsdiagnostiek een diagnose stellen.
          </div>
        </div>
      </div>
    </div>
  );
};

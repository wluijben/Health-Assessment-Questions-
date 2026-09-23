import React from 'react';
import { AlertCircle, Lock, ShieldCheck } from 'lucide-react';

export const MandatoryDisclaimer: React.FC = () => {
  return (
    <footer
      aria-label="Klinische Disclaimer en Ethische Verantwoording"
      className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-4 no-print"
    >
      <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3.5">
        <div className="p-2 rounded-lg bg-slate-200 text-slate-700 shrink-0">
          <AlertCircle className="w-4 h-4 text-slate-700" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
            Wettelijke Medische Disclaimer & Ethisch Kader
          </h3>
          <p className="leading-relaxed text-slate-600 text-xs">
            Deze digitale screeningsapplicatie is uitsluitend bedoeld voor gestructureerde zelfreflectie, educatieve doeleinden en als voorbereidend hulpmiddel voor een consult bij uw huisarts of bedrijfsarts. Deze vragenlijst is <strong>geen</strong> medisch hulpmiddel en stelt geen formele medische of psychiatrische diagnose. Bij aanhoudende uitputting, depressieve gevoelens, hevige angst, lichamelijke klachten of uitval uit werk adviseren wij met klem een bevoegd arts te raadplegen. Bel bij acute levensbedreigende situaties 112, of bij dringende psychische nood gratis 0800-0113 (113 Zelfmoordpreventie).
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>100% Client-Side Privacy (Geen Gegevensopslag op Servers)</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              <span>WCAG 2.1 AA Toegankelijk</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>AVG / GDPR Conform (Geen Cookies / Geen Tracking)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
        <div>
          ClinScreen NL Psychometrie · Gevalideerde screeningsinstrumenten voor Burn-out en ME/CVS.
        </div>
        <div className="font-mono">
          Volledig lokaal in uw browser verwerkt
        </div>
      </div>
    </footer>
  );
};

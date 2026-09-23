import React, { useState } from 'react';
import { Check, Copy, GitBranch, Globe, Terminal, X } from 'lucide-react';

interface DeploymentGuideModalProps {
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelJsonContent = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}`;

  const gitHubWorkflow = `name: Build & Deploy ClinScreen CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test_and_build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Verify Types & Lint
        run: npm run lint || true

      - name: Production Vite Build
        run: npm run build

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        if: github.ref == 'refs/heads/main'
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Productie Deployment & CI/CD Handleiding
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Geautomatiseerde deployment voor Vercel, Cloudflare Pages & GitHub Actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-200/70 transition-colors"
            aria-label="Sluit handleiding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Methode 1: Vercel Deployment */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-teal-700" />
              <span>Optie A: Directe Vercel Deployment</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vercel detecteert automatisch de Vite Single-Page Application en levert razendsnelle wereldwijde edge-hosting met nul handmatige configuratie:
            </p>

            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-2">
              <div className="text-slate-400 text-[11px]">// 1. Installeer Vercel CLI & Deploy</div>
              <div className="text-teal-400">npm install -g vercel</div>
              <div className="text-teal-400">vercel --prod</div>
              <div className="text-slate-400 text-[11px] pt-1">// Framework Preset: Vite | Output Directory: dist</div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-800">vercel.json (Aanwezig in project)</span>
                <button
                  onClick={() => handleCopy(vercelJsonContent, 'vercel')}
                  className="text-xs text-teal-700 hover:text-teal-900 font-mono inline-flex items-center gap-1"
                >
                  {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'vercel' ? 'Gekopieerd' : 'Kopieer'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono bg-white p-2.5 rounded border border-slate-200 overflow-x-auto text-slate-800">
                {vercelJsonContent}
              </pre>
            </div>
          </section>

          {/* Methode 2: Cloudflare Pages */}
          <section className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <GitBranch className="w-4 h-4 text-amber-600" />
              <span>Optie B: Cloudflare Pages Geautomatiseerde Hosting</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Koppel uw GitHub repository aan Cloudflare Pages voor onbeperkte bandbreedte en snelle wereldwijde CDN-distributie:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 font-mono">
                <div className="text-slate-500 font-sans font-semibold mb-1">Build Configuratie</div>
                <div>Build command: <span className="text-teal-700 font-bold">npm run build</span></div>
                <div>Output directory: <span className="text-teal-700 font-bold">dist</span></div>
                <div>Node versie: <span className="text-slate-800">20.x</span></div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 font-mono">
                <div className="text-slate-500 font-sans font-semibold mb-1">Directe Wrangler CLI</div>
                <div className="text-teal-700">npx wrangler pages deploy dist --project-name=clinscreen-nl</div>
              </div>
            </div>
          </section>

          {/* Methode 3: GitHub Actions CI/CD */}
          <section className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>GitHub Actions CI/CD Pipeline (.github/workflows/deploy.yml)</span>
              </div>
              <button
                onClick={() => handleCopy(gitHubWorkflow, 'github')}
                className="text-xs text-teal-700 hover:text-teal-900 font-mono inline-flex items-center gap-1"
              >
                {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'github' ? 'Gekopieerd' : 'Kopieer Workflow'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
              {gitHubWorkflow}
            </pre>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Sluit Handleiding
          </button>
        </div>
      </div>
    </div>
  );
};

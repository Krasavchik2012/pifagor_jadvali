import React from 'react';
import { TriangleSandbox } from './components/TriangleSandbox';
import { ProofExplorer } from './components/ProofExplorer';
import { CalculatorAndTriples } from './components/CalculatorAndTriples';
import { RealWorldApplications } from './components/RealWorldApplications';
import { BsbQuizSection } from './components/BsbQuizSection';

export default function App() {
  const scrollToQuiz = () => {
    const el = document.getElementById('bsb-test');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones, gap-8, single-line controls */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#teorema"
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Pifagor Laboratoriyasi
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Asosiy bo‘limlar"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#teorema"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Teorema
            </a>
            <a
              href="#isbot"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Isbotlar
            </a>
            <a
              href="#kalkulyator"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Kalkulyator
            </a>
            <a
              href="#amaliyot"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Amaliyot
            </a>
            <a
              href="#bsb-test"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              BSB Testi
            </a>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={scrollToQuiz}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Testni boshlash
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <TriangleSandbox />
        <ProofExplorer />
        <CalculatorAndTriples />
        <RealWorldApplications />
        <BsbQuizSection />
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Geometriya BSB loyihasi · Pifagor teoremasi (a² + b² = c²)
          </div>
          <div className="flex items-center gap-5">
            <a href="#teorema" className="hover:text-slate-800 whitespace-nowrap">
              Simulyator
            </a>
            <a href="#isbot" className="hover:text-slate-800 whitespace-nowrap">
              Isbotlar
            </a>
            <a href="#kalkulyator" className="hover:text-slate-800 whitespace-nowrap">
              Kalkulyator
            </a>
            <a href="#bsb-test" className="hover:text-slate-800 whitespace-nowrap">
              Nazorat testi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

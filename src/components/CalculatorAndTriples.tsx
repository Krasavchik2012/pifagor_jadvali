import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

type CalcMode = 'hypotenuse' | 'leg' | 'classify';

const TRIPLES = [
  { a: 3, b: 4, c: 5, note: 'Misr uchburchagi' },
  { a: 5, b: 12, c: 13, note: 'Asosiy uchlik' },
  { a: 6, b: 8, c: 10, note: '3-4-5 ning 2 karralisi' },
  { a: 7, b: 24, c: 25, note: 'Olimpiada uchligi' },
  { a: 8, b: 15, c: 17, note: 'Asosiy uchlik' },
  { a: 9, b: 40, c: 41, note: 'Asosiy uchlik' },
];

export const CalculatorAndTriples: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('hypotenuse');
  const [valA, setValA] = useState<string>('6');
  const [valB, setValB] = useState<string>('8');
  const [valC, setValC] = useState<string>('10');

  const numA = parseFloat(valA);
  const numB = parseFloat(valB);
  const numC = parseFloat(valC);

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, '');

  let errorMsg = '';
  let resultHeadline = '';
  let steps: string[] = [];
  let previewA = 3;
  let previewB = 4;

  if (mode === 'hypotenuse') {
    if (!(numA > 0) || !(numB > 0)) {
      errorMsg = 'Katet uzunliklari 0 dan katta musbat son bo‘lishi shart.';
    } else {
      const cSq = numA * numA + numB * numB;
      const cVal = Math.sqrt(cSq);
      resultHeadline = `c = ${fmt(cVal)} sm`;
      steps = [
        `c² = a² + b²`,
        `c² = ${fmt(numA)}² + ${fmt(numB)}² = ${fmt(numA * numA)} + ${fmt(numB * numB)} = ${fmt(cSq)}`,
        `c = √${fmt(cSq)} ≈ ${fmt(cVal)} sm`,
      ];
      previewA = numA;
      previewB = numB;
    }
  } else if (mode === 'leg') {
    if (!(numB > 0) || !(numC > 0)) {
      errorMsg = 'Katet va gipotenuza uzunliklari musbat son bo‘lishi shart.';
    } else if (numC <= numB) {
      errorMsg = 'Gipotenuza (c) har doim katetdan (b) katta bo‘lishi kerak!';
    } else {
      const aSq = numC * numC - numB * numB;
      const aVal = Math.sqrt(aSq);
      resultHeadline = `a = ${fmt(aVal)} sm`;
      steps = [
        `a² = c² - b²`,
        `a² = ${fmt(numC)}² - ${fmt(numB)}² = ${fmt(numC * numC)} - ${fmt(numB * numB)} = ${fmt(aSq)}`,
        `a = √${fmt(aSq)} ≈ ${fmt(aVal)} sm`,
      ];
      previewA = aVal;
      previewB = numB;
    }
  } else {
    // Classify triangle using converse Pythagorean theorem
    if (!(numA > 0) || !(numB > 0) || !(numC > 0)) {
      errorMsg = 'Barcha uchta tomon uzunligi musbat son bo‘lishi kerak.';
    } else {
      const sorted = [numA, numB, numC].sort((x, y) => x - y);
      const [s1, s2, s3] = sorted;
      if (s1 + s2 <= s3) {
        errorMsg = `Uchburchak tengsizligi bajarilmadi: ${fmt(s1)} + ${fmt(s2)} ≤ ${fmt(s3)}. Bunday uchburchak mavjud emas!`;
      } else {
        const sumSq = s1 * s1 + s2 * s2;
        const maxSq = s3 * s3;
        const diff = Math.abs(sumSq - maxSq);
        if (diff < 1e-6) {
          resultHeadline = 'To‘g‘ri burchakli uchburchak (90°)';
          steps = [
            `Eng katta tomon: c = ${fmt(s3)}`,
            `${fmt(s1)}² + ${fmt(s2)}² = ${fmt(sumSq)}`,
            `${fmt(s3)}² = ${fmt(maxSq)} → a² + b² = c² (Teskari Pifagor teoremasi)`,
          ];
        } else if (maxSq < sumSq) {
          resultHeadline = 'O‘tkir burchakli uchburchak';
          steps = [
            `Eng katta tomon: c = ${fmt(s3)}`,
            `${fmt(s3)}² = ${fmt(maxSq)} < ${fmt(s1)}² + ${fmt(s2)}² = ${fmt(sumSq)}`,
            `c² < a² + b² bo‘lgani uchun barcha burchaklar 90° dan kichik.`,
          ];
        } else {
          resultHeadline = 'O‘tmas burchakli uchburchak';
          steps = [
            `Eng katta tomon: c = ${fmt(s3)}`,
            `${fmt(s3)}² = ${fmt(maxSq)} > ${fmt(s1)}² + ${fmt(s2)}² = ${fmt(sumSq)}`,
            `c² > a² + b² bo‘lgani uchun katta tomon qarshisidagi burchak 90° dan katta.`,
          ];
        }
        previewA = s1;
        previewB = s2;
      }
    }
  }

  // Normalize SVG mini preview triangle
  const maxDim = Math.max(previewA, previewB, 1);
  const svgA = (previewA / maxDim) * 110;
  const svgB = (previewB / maxDim) * 140;

  const loadTriple = (t: { a: number; b: number; c: number }) => {
    setValA(String(t.a));
    setValB(String(t.b));
    setValC(String(t.c));
  };

  return (
    <section id="kalkulyator" className="py-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-medium text-slate-500 mb-1.5">
            BSB yechim generatori va teskari teorema
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Pifagor kalkulyatori va uchliklar jadvali
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calculator Card (7 cols) */}
          <div className="lg:col-span-7 border border-slate-200 rounded-xl bg-white p-6 space-y-6">
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setMode('hypotenuse')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'hypotenuse'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gipotenuzani topish (c)
              </button>
              <button
                type="button"
                onClick={() => setMode('leg')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'leg'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Katetni topish (a)
              </button>
              <button
                type="button"
                onClick={() => setMode('classify')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'classify'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teskari teorema (Turi)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mode !== 'leg' && (
                <div>
                  <label htmlFor="calc-a" className="block text-xs font-medium text-slate-700 mb-1.5">
                    a tomon (sm)
                  </label>
                  <input
                    id="calc-a"
                    type="number"
                    min="0.1"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label htmlFor="calc-b" className="block text-xs font-medium text-slate-700 mb-1.5">
                  b tomon (sm)
                </label>
                <input
                  id="calc-b"
                  type="number"
                  min="0.1"
                  step="any"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>

              {mode !== 'hypotenuse' && (
                <div>
                  <label htmlFor="calc-c" className="block text-xs font-medium text-slate-700 mb-1.5">
                    {mode === 'leg' ? 'Gipotenuza c (sm)' : 'c tomon (sm)'}
                  </label>
                  <input
                    id="calc-c"
                    type="number"
                    min="0.1"
                    step="any"
                    value={valC}
                    onChange={(e) => setValC(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {errorMsg ? (
              <div className="flex items-start gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="sm:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span className="font-mono tabular-nums">{resultHeadline}</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {steps.map((line, i) => (
                      <div key={i} className="text-xs sm:text-sm font-mono tabular-nums text-slate-700">
                        {i + 1}. {line}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-4 flex justify-center">
                  <svg viewBox="0 0 180 140" className="w-36 h-28" aria-hidden="true">
                    <polygon
                      points={`25,${120 - svgA} 25,120 ${25 + svgB},120`}
                      fill="#FFFFFF"
                      stroke="#0F172A"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="25,110 35,110 35,120"
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="1.25"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Pythagorean Triples Table (5 cols) */}
          <div className="lg:col-span-5 border border-slate-200 rounded-xl bg-slate-50 p-6">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Pifagor uchliklari
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Qatorni bosib kalkulyatorga yuklang
                </p>
              </div>
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-1" aria-hidden="true" />
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-2.5 px-3 font-mono">a</th>
                    <th className="py-2.5 px-3 font-mono">b</th>
                    <th className="py-2.5 px-3 font-mono">c</th>
                    <th className="py-2.5 px-3">Izoh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {TRIPLES.map((t) => (
                    <tr
                      key={`${t.a}-${t.b}-${t.c}`}
                      onClick={() => loadTriple(t)}
                      className="hover:bg-sky-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-sky-700">
                        {t.a}
                      </td>
                      <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-emerald-700">
                        {t.b}
                      </td>
                      <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-amber-700">
                        {t.c}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

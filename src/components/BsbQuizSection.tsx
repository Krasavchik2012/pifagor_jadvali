import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface Question {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'To‘g‘ri burchakli uchburchakning katetlari 9 sm va 12 sm ga teng. Gipotenuza uzunligini toping.',
    options: ['14 sm', '15 sm', '16 sm', '21 sm'],
    correctIndex: 1,
    explanation: 'c² = 9² + 12² = 81 + 144 = 225. Bundan c = √225 = 15 sm.',
  },
  {
    id: 2,
    prompt: 'To‘g‘ri burchakli uchburchakning gipotenuzasi 17 sm, bir kateti esa 8 sm. Ikkinchi katetni toping.',
    options: ['9 sm', '12 sm', '15 sm', '25 sm'],
    correctIndex: 2,
    explanation: 'b² = c² - a² = 17² - 8² = 289 - 64 = 225. Bundan b = √225 = 15 sm.',
  },
  {
    id: 3,
    prompt: 'Quyidagi tomonlar to‘plamidan qaysi biri to‘g‘ri burchakli uchburchak hosil qiladi?',
    options: ['4, 5, 6', '5, 12, 13', '6, 7, 10', '7, 10, 12'],
    correctIndex: 1,
    explanation: '5² + 12² = 25 + 144 = 169 = 13². Teskari Pifagor teoremasiga ko‘ra bu to‘g‘ri burchakli uchburchak.',
  },
  {
    id: 4,
    prompt: 'To‘g‘ri to‘rtburchakning eni 6 sm, bo‘yi 8 sm. Uning diagonali uzunligini toping.',
    options: ['10 sm', '12 sm', '14 sm', '√48 sm'],
    correctIndex: 0,
    explanation: 'Diagonal to‘g‘ri to‘rtburchakni ikkita to‘g‘ri burchakli uchburchakka bo‘ladi: d = √(6² + 8²) = √100 = 10 sm.',
  },
  {
    id: 5,
    prompt: 'Uzunligi 13 metrli narvon devordan 5 metr nariga qo‘yilgan. Narvon devorga necha metr balandlikda tayanadi?',
    options: ['8 m', '10 m', '11 m', '12 m'],
    correctIndex: 3,
    explanation: 'h = √(13² - 5²) = √(169 - 25) = √144 = 12 metr.',
  },
  {
    id: 6,
    prompt: 'Teng yonli to‘g‘ri burchakli uchburchakning kateti 5 sm ga teng. Gipotenuza uzunligi qancha?',
    options: ['5 sm', '5√2 sm', '10 sm', '25 sm'],
    correctIndex: 1,
    explanation: 'c = √(5² + 5²) = √(25 + 25) = √50 = 5√2 sm.',
  },
];

export const BsbQuizSection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUESTIONS.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const percentage = Math.round((correctCount / QUESTIONS.length) * 100);

  const getMasteryLabel = () => {
    if (answeredCount < QUESTIONS.length) return 'Davom etmoqda';
    if (percentage >= 85) return 'A’lo (Yuqori BSB natijasi)';
    if (percentage >= 65) return 'Yaxshi';
    if (percentage >= 50) return 'Qoniqarli';
    return 'Qayta takrorlash tavsiya etiladi';
  };

  return (
    <section id="bsb-test" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500 mb-1.5">
              O‘z-o‘zini tekshirish va baholash
            </p>
            <h2
              className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              BSB Amaliy Nazorat Testi
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-mono tabular-nums text-slate-700">
              Ishlandi: <strong>{answeredCount} / {QUESTIONS.length}</strong>
              {' · '}
              To‘g‘ri: <strong className="text-emerald-700">{correctCount}</strong>
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Qayta ishlash
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Questions List */}
          <div className="lg:col-span-8 space-y-6">
            {QUESTIONS.map((q, idx) => {
              const chosen = answers[q.id];
              const isAnswered = chosen !== undefined;
              const isCorrect = chosen === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="border border-slate-200 rounded-xl p-5 bg-white space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono tabular-nums text-sm font-bold text-slate-400 pt-0.5">
                      0{idx + 1}.
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {q.prompt}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-7">
                    {q.options.map((opt, optIdx) => {
                      const selected = chosen === optIdx;
                      const isRightOpt = q.correctIndex === optIdx;

                      let btnStyle =
                        'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100';
                      if (isAnswered) {
                        if (isRightOpt) {
                          btnStyle =
                            'bg-emerald-50 text-emerald-900 border-emerald-500 font-semibold';
                        } else if (selected && !isRightOpt) {
                          btnStyle =
                            'bg-red-50 text-red-900 border-red-400';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 border-slate-200';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isAnswered}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`flex items-center justify-between px-4 py-2.5 text-sm text-left rounded-lg border transition-colors ${
                            !isAnswered ? 'cursor-pointer' : 'cursor-default'
                          } ${btnStyle}`}
                        >
                          <span className="font-mono">{opt}</span>
                          {isAnswered && isRightOpt && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                          )}
                          {isAnswered && selected && !isRightOpt && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`ml-0 sm:ml-7 p-3.5 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <strong className="font-semibold">
                        {isCorrect ? 'To‘g‘ri! ' : 'Izoh: '}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* BSB Grading Rubric & Result Panel */}
          <div className="lg:col-span-4 border border-slate-200 rounded-xl bg-slate-50 p-6 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-slate-800 shrink-0" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900">
                BSB Baholash Mezoni
              </h3>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Joriy natija</span>
                <span className="font-mono tabular-nums text-2xl font-bold text-slate-900">
                  {correctCount}/{QUESTIONS.length} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs font-medium text-slate-700 pt-1">
                Holat: <span className="font-semibold text-slate-900">{getMasteryLabel()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                Maktab BSB mezonlari (namuna):
              </div>
              <table className="w-full text-xs border-collapse bg-white border border-slate-200 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-mono tabular-nums font-semibold text-emerald-800">
                      85% – 100%
                    </td>
                    <td className="py-2 px-3 text-slate-700">5 (A’lo) — Teorema va isbot to‘liq</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono tabular-nums font-semibold text-sky-800">
                      65% – 84%
                    </td>
                    <td className="py-2 px-3 text-slate-700">4 (Yaxshi) — Amaliy masalalar to‘g‘ri</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono tabular-nums font-semibold text-amber-800">
                      50% – 64%
                    </td>
                    <td className="py-2 px-3 text-slate-700">3 (Qoniqarli) — Asosiy formula bilimi</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono tabular-nums font-semibold text-red-800">
                      0% – 49%
                    </td>
                    <td className="py-2 px-3 text-slate-700">Qayta mashq qilish zarur</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

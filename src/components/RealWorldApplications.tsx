import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import draftingImg from '../assets/images/pythagoras_architecture_diagram_1794630835930.jpg';

type ScenarioId = 'ladder' | 'screen' | 'rope';

export const RealWorldApplications: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioId>('ladder');
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  // Scenario 1: Ladder against wall
  const [ladderLen, setLadderLen] = useState<number>(5);
  const [wallDist, setWallDist] = useState<number>(3);
  const reachHeight = Math.sqrt(Math.max(0.01, ladderLen * ladderLen - wallDist * wallDist));

  // Scenario 2: Screen diagonal
  const [screenW, setScreenW] = useState<number>(80);
  const [screenH, setScreenH] = useState<number>(45);
  const diagCm = Math.sqrt(screenW * screenW + screenH * screenH);
  const diagInch = diagCm / 2.54;

  // Scenario 3: 3-4-5 rope multiplier
  const [ropeK, setRopeK] = useState<number>(2);

  return (
    <section id="amaliyot" className="py-16 border-b border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Historical / Visual Editorial Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <p className="text-xs font-medium text-slate-500">
              Tarixiy ildizlar va hayotiy tatbiq
            </p>
            <h2
              className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              Qadimgi quruvchilardan zamonaviy muhandislikkacha
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pifagor (mil. avv. VI asr) bu teoremani umumiy ko‘rinishda isbotlagan bo‘lsa-da,
              Qadimgi Misr va Bobil me’morlari 3-4-5 nisbatidagi tugunli arqondan yer uchastkalari
              va ehrom poydevorlarida aniq 90° burchak hosil qilish uchun foydalanganlar.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Bugungi kunda Pifagor teoremasi arxitektura, GPS navigatsiya, ekran o‘lchamlarini
              aniqlash va kompyuter grafikasida masofalarni hisoblashning asosiy qurolidir.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-white">
              {!imgFailed ? (
                <img
                  src={draftingImg}
                  alt="Geometrik chizmalar va chizmachilik asboblari"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full max-h-[340px] object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-8 bg-slate-100 text-slate-600">
                  <Compass className="w-10 h-10 text-slate-500 mb-3" aria-hidden="true" />
                  <div className="text-sm font-medium text-slate-800">
                    Klassik geometriya va chizmachilik
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Real-World Problem Simulator */}
        <div className="border border-slate-200 rounded-xl bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Hayotiy BSB masalalari simulyatori
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Vaziyatni tanlang va o‘lchamlarni o‘zgartirib masalani yeching.
              </p>
            </div>
            <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setScenario('ladder')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scenario === 'ladder'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Devor va narvon
              </button>
              <button
                type="button"
                onClick={() => setScenario('screen')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scenario === 'screen'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Ekran diagonali
              </button>
              <button
                type="button"
                onClick={() => setScenario('rope')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scenario === 'rope'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Qurilish arqoni (3-4-5)
              </button>
            </div>
          </div>

          {scenario === 'ladder' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-center">
                <svg viewBox="0 0 360 250" className="w-full max-w-[360px] h-auto" aria-label="Narvon va devor chizmasi">
                  {/* Ground & Wall */}
                  <line x1={30} y1={215} x2={330} y2={215} stroke="#64748B" strokeWidth="2" />
                  <rect x={45} y={30} width={25} height={185} fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
                  {/* Right angle */}
                  <polyline points="70,203 82,203 82,215" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                  {/* Dynamic Ladder */}
                  {(() => {
                    const maxPx = 175;
                    const pxScale = maxPx / 10;
                    const xB = 70 + wallDist * pxScale;
                    const yA = 215 - reachHeight * pxScale;
                    return (
                      <g>
                        <line x1={70} y1={yA} x2={70} y2={215} stroke="#0284C7" strokeWidth="3" />
                        <line x1={70} y1={215} x2={xB} y2={215} stroke="#059669" strokeWidth="3" />
                        <line x1={70} y1={yA} x2={xB} y2={215} stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
                        <text x={82} y={(yA + 215) / 2} className="font-mono text-xs font-bold fill-sky-800">
                          h = {reachHeight.toFixed(2)} m
                        </text>
                        <text x={(70 + xB) / 2} y={233} textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-800">
                          b = {wallDist} m
                        </text>
                        <text x={(70 + xB) / 2 + 12} y={(yA + 215) / 2 - 8} className="font-mono text-xs font-bold fill-amber-800">
                          c = {ladderLen} m
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Uzunligi <strong className="font-mono">{ladderLen} m</strong> bo‘lgan narvon devor
                  tagidan <strong className="font-mono">{wallDist} m</strong> uzoqlikda qo‘yilgan.
                  Narvonning yuqori uchi devorda qanday balandlikka yetadi?
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <label htmlFor="lad-c">Narvon uzunligi (c)</label>
                      <span className="font-mono tabular-nums">{ladderLen} m</span>
                    </div>
                    <input
                      id="lad-c"
                      type="range"
                      min={3}
                      max={10}
                      step={0.5}
                      value={ladderLen}
                      onChange={(e) => {
                        const nextC = parseFloat(e.target.value);
                        setLadderLen(nextC);
                        if (wallDist >= nextC) setWallDist(Math.max(1, nextC - 0.5));
                      }}
                      className="w-full geo-slider"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <label htmlFor="lad-b">Devordan masofa (b)</label>
                      <span className="font-mono tabular-nums">{wallDist} m</span>
                    </div>
                    <input
                      id="lad-b"
                      type="range"
                      min={1}
                      max={Math.max(1, ladderLen - 0.5)}
                      step={0.5}
                      value={wallDist}
                      onChange={(e) => setWallDist(parseFloat(e.target.value))}
                      className="w-full geo-slider"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-sm tabular-nums">
                  h = √({ladderLen}² - {wallDist}²) = √{(ladderLen * ladderLen - wallDist * wallDist).toFixed(2)} ={' '}
                  <strong className="text-sky-800">{reachHeight.toFixed(2)} metr</strong>
                </div>
              </div>
            </div>
          )}

          {scenario === 'screen' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-center">
                <svg viewBox="0 0 360 240" className="w-full max-w-[360px] h-auto" aria-label="Ekran diagonali chizmasi">
                  {(() => {
                    const rw = (screenW / 120) * 240;
                    const rh = (screenH / 80) * 160;
                    const rx = (360 - rw) / 2;
                    const ry = (240 - rh) / 2;
                    return (
                      <g>
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill="#FFFFFF"
                          stroke="#0F172A"
                          strokeWidth="2.5"
                          rx="4"
                        />
                        <line x1={rx} y1={ry + rh} x2={rx + rw} y2={ry} stroke="#D97706" strokeWidth="2.5" strokeDasharray="6 4" />
                        <text x={180} y={ry + rh + 18} textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-800">
                          Eni: {screenW} sm
                        </text>
                        <text x={rx - 10} y={120} textAnchor="end" className="font-mono text-xs font-bold fill-sky-800">
                          {screenH} sm
                        </text>
                        <text x={180} y={116} textAnchor="middle" className="font-mono text-xs font-bold fill-amber-800 bg-white">
                          d = {diagCm.toFixed(1)} sm ({diagInch.toFixed(1)}")
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Televizor va noutbuk ekranlari (1 dyuym ≈ 2.54 sm) to‘g‘ri to‘rtburchak shaklida
                  bo‘lib, ularning diagonali Pifagor teoremasi bilan hisoblanadi.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <label htmlFor="scr-w">Ekran eni (b)</label>
                      <span className="font-mono tabular-nums">{screenW} sm</span>
                    </div>
                    <input
                      id="scr-w"
                      type="range"
                      min={30}
                      max={120}
                      step={1}
                      value={screenW}
                      onChange={(e) => setScreenW(Number(e.target.value))}
                      className="w-full geo-slider"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <label htmlFor="scr-h">Ekran bo‘yi (a)</label>
                      <span className="font-mono tabular-nums">{screenH} sm</span>
                    </div>
                    <input
                      id="scr-h"
                      type="range"
                      min={20}
                      max={80}
                      step={1}
                      value={screenH}
                      onChange={(e) => setScreenH(Number(e.target.value))}
                      className="w-full geo-slider"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-sm tabular-nums space-y-1">
                  <div>d = √({screenW}² + {screenH}²) = {diagCm.toFixed(1)} sm</div>
                  <div className="text-amber-800 font-semibold">
                    Dyuymda: {diagCm.toFixed(1)} / 2.54 ≈ {diagInch.toFixed(1)} dyuym
                  </div>
                </div>
              </div>
            </div>
          )}

          {scenario === 'rope' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-center">
                <svg viewBox="0 0 360 240" className="w-full max-w-[360px] h-auto" aria-label="3-4-5 qurilish arqoni chizmasi">
                  <polygon
                    points="60,40 60,190 260,190"
                    fill="#FFFFFF"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polyline points="60,174 76,174 76,190" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx={60} cy={40} r="5" fill="#0284C7" />
                  <circle cx={60} cy={190} r="5" fill="#0F172A" />
                  <circle cx={260} cy={190} r="5" fill="#059669" />

                  <text x={48} y={115} textAnchor="end" className="font-mono text-xs font-bold fill-sky-800">
                    3·{ropeK} = {3 * ropeK} m
                  </text>
                  <text x={160} y={210} textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-800">
                    4·{ropeK} = {4 * ropeK} m
                  </text>
                  <text x={175} y={105} className="font-mono text-xs font-bold fill-amber-800">
                    5·{ropeK} = {5 * ropeK} m
                  </text>
                  <text x={85} y={180} className="font-mono text-xs font-semibold fill-slate-700">90°</text>
                </svg>
              </div>
              <div className="lg:col-span-6 space-y-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Quruvchilar transporsiz to‘g‘ri burchak (90°) o‘lchash uchun teskari Pifagor
                  teoremasidan foydalanadilar: tomonlari <span className="font-mono">3k, 4k, 5k</span> bo‘lgan
                  uchburchak burchagi aniq 90° bo‘ladi.
                </p>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="rope-k">Masshtab koeffitsiyenti (k)</label>
                    <span className="font-mono tabular-nums">{ropeK}x</span>
                  </div>
                  <input
                    id="rope-k"
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={ropeK}
                    onChange={(e) => setRopeK(Number(e.target.value))}
                    className="w-full geo-slider"
                  />
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-sm tabular-nums space-y-1">
                  <div>Arqonning umumiy uzunligi: {12 * ropeK} metr</div>
                  <div>
                    Tekshiruv: {3 * ropeK}² + {4 * ropeK}² = {9 * ropeK * ropeK} + {16 * ropeK * ropeK} ={' '}
                    {25 * ropeK * ropeK} = {5 * ropeK}²
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

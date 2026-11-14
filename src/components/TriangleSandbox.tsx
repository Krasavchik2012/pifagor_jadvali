import React, { useRef, useState } from 'react';
import { CheckCircle2, RotateCcw, Eye, Grid3X3 } from 'lucide-react';

interface Preset {
  label: string;
  a: number;
  b: number;
}

const PRESETS: Preset[] = [
  { label: '3 - 4 - 5', a: 3, b: 4 },
  { label: '6 - 8 - 10', a: 6, b: 8 },
  { label: '5 - 12 - 13', a: 5, b: 12 },
  { label: '8 - 15 - 17', a: 8, b: 15 },
];

export const TriangleSandbox: React.FC = () => {
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [showSquares, setShowSquares] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const cSquared = a * a + b * b;
  const c = Math.sqrt(cSquared);
  const isIntegerTriple =
    Number.isInteger(a) &&
    Number.isInteger(b) &&
    Math.abs(c - Math.round(c)) < 1e-9;

  const angleA = (Math.atan2(b, a) * 180) / Math.PI;
  const angleB = 90 - angleA;
  const areaTriangle = (a * b) / 2;

  const width = 560;
  const height = 430;
  const pad = 42;

  const mathW = showSquares ? 2 * a + b : b + 2;
  const mathH = showSquares ? a + 2 * b : a + 2;

  const scale = Math.min((width - pad * 2) / mathW, (height - pad * 2) / mathH);

  const offsetX = showSquares
    ? (width - mathW * scale) / 2 + a * scale
    : (width - b * scale) / 2;
  const offsetY = showSquares
    ? (height - mathH * scale) / 2 + (a + b) * scale
    : (height + a * scale) / 2;

  const toSvg = (x: number, y: number): [number, number] => [
    offsetX + x * scale,
    offsetY - y * scale,
  ];

  const [cx, cy] = toSvg(0, 0);
  const [ax, ay] = toSvg(0, a);
  const [bx, by] = toSvg(b, 0);

  // Outer square on leg a: (0,0), (0,a), (-a,a), (-a,0)
  const sqA = [toSvg(0, 0), toSvg(0, a), toSvg(-a, a), toSvg(-a, 0)]
    .map((p) => p.join(','))
    .join(' ');
  const [sqACenterX, sqACenterY] = toSvg(-a / 2, a / 2);

  // Outer square on leg b: (0,0), (b,0), (b,-b), (0,-b)
  const sqB = [toSvg(0, 0), toSvg(b, 0), toSvg(b, -b), toSvg(0, -b)]
    .map((p) => p.join(','))
    .join(' ');
  const [sqBCenterX, sqBCenterY] = toSvg(b / 2, -b / 2);

  // Outer square on hypotenuse c: A(0,a), B(b,0), B'(a+b, b), A'(a, a+b)
  const sqC = [toSvg(0, a), toSvg(b, 0), toSvg(a + b, b), toSvg(a, a + b)]
    .map((p) => p.join(','))
    .join(' ');
  const [sqCCenterX, sqCCenterY] = toSvg((a + b) / 2, (a + b) / 2);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    const svgY = ((e.clientY - rect.top) / rect.height) * height;

    if (dragging === 'A') {
      const mathY = (offsetY - svgY) / scale;
      const clamped = Math.min(16, Math.max(1, Math.round(mathY * 2) / 2));
      setA(clamped);
    } else if (dragging === 'B') {
      const mathX = (svgX - offsetX) / scale;
      const clamped = Math.min(16, Math.max(1, Math.round(mathX * 2) / 2));
      setB(clamped);
    }
  };

  const stopDragging = () => setDragging(null);

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, '');

  return (
    <section id="teorema" className="pt-10 pb-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-medium text-slate-500 mb-2">
            8-sinf Geometriya · Bob bo‘yicha summativ baholash (BSB)
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Pifagor teoremasi: To‘g‘ri burchakli uchburchak siri
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Har qanday to‘g‘ri burchakli uchburchakda gipotenuzaga qurilgan kvadrat yuzi
            katetlarga qurilgan kvadratlar yuzalari yig‘indisiga teng:{' '}
            <span className="font-mono font-semibold text-slate-900">a² + b² = c²</span>.
            Uchlarni sudrab yoki slayderlar yordamida teoremani jonli tekshiring.
          </p>
        </div>

        {/* Two-Zone Interactive Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left / Main Stage (7/12 ~ 60%) */}
          <div className="lg:col-span-7 flex flex-col border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
              <span className="text-xs font-medium text-slate-600">
                A yoki B uchlarini sudrab o‘lchamni o‘zgartiring
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSquares((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showSquares
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  Kvadratlar
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrid((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showGrid
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" aria-hidden="true" />
                  Katak
                </button>
              </div>
            </div>

            <div className={`relative flex-1 flex items-center justify-center p-3 ${showGrid ? 'drafting-grid' : ''}`}>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto max-h-[430px] select-none touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerLeave={stopDragging}
                aria-label="Pifagor teoremasi interaktiv chizmasi"
              >
                {/* Squares on sides */}
                {showSquares && (
                  <g>
                    {/* a^2 */}
                    <polygon
                      points={sqA}
                      fill="rgba(2, 132, 199, 0.12)"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                    />
                    <text
                      x={sqACenterX}
                      y={sqACenterY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-[13px] font-semibold fill-sky-800"
                    >
                      a² = {fmt(a * a)}
                    </text>

                    {/* b^2 */}
                    <polygon
                      points={sqB}
                      fill="rgba(5, 150, 105, 0.12)"
                      stroke="#059669"
                      strokeWidth="1.5"
                    />
                    <text
                      x={sqBCenterX}
                      y={sqBCenterY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-[13px] font-semibold fill-emerald-800"
                    >
                      b² = {fmt(b * b)}
                    </text>

                    {/* c^2 */}
                    <polygon
                      points={sqC}
                      fill="rgba(217, 119, 6, 0.13)"
                      stroke="#D97706"
                      strokeWidth="1.5"
                    />
                    <text
                      x={sqCCenterX}
                      y={sqCCenterY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-[13px] font-semibold fill-amber-900"
                    >
                      c² = {fmt(cSquared)}
                    </text>
                  </g>
                )}

                {/* Right angle symbol at C */}
                {scale * Math.min(a, b) > 14 && (
                  <polyline
                    points={`${cx},${cy - Math.min(16, scale * 0.4)} ${
                      cx + Math.min(16, scale * 0.4)
                    },${cy - Math.min(16, scale * 0.4)} ${
                      cx + Math.min(16, scale * 0.4)
                    },${cy}`}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="1.5"
                  />
                )}

                {/* Main Right Triangle */}
                <polygon
                  points={`${cx},${cy} ${ax},${ay} ${bx},${by}`}
                  fill="rgba(255, 255, 255, 0.9)"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Colored side highlights */}
                <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />

                {/* Side labels */}
                <text
                  x={cx + 12}
                  y={(cy + ay) / 2}
                  dominantBaseline="middle"
                  className="font-mono text-xs font-semibold fill-sky-700"
                >
                  a={fmt(a)}
                </text>
                <text
                  x={(cx + bx) / 2}
                  y={cy - 10}
                  textAnchor="middle"
                  className="font-mono text-xs font-semibold fill-emerald-700"
                >
                  b={fmt(b)}
                </text>
                <text
                  x={(ax + bx) / 2 - 10}
                  y={(ay + by) / 2 + 14}
                  textAnchor="middle"
                  className="font-mono text-xs font-semibold fill-amber-800"
                >
                  c={fmt(c)}
                </text>

                {/* Vertex C (fixed 90 deg) */}
                <circle cx={cx} cy={cy} r="5" fill="#0F172A" />
                <text x={cx - 12} y={cy + 14} className="font-mono text-xs font-bold fill-slate-900">
                  C
                </text>

                {/* Draggable Vertex A */}
                <g
                  className="cursor-ns-resize"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                    setDragging('A');
                  }}
                >
                  <circle cx={ax} cy={ay} r="14" fill="transparent" />
                  <circle
                    cx={ax}
                    cy={ay}
                    r={dragging === 'A' ? '8' : '6.5'}
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text x={ax + 12} y={ay - 8} className="font-mono text-xs font-bold fill-sky-800">
                    A
                  </text>
                </g>

                {/* Draggable Vertex B */}
                <g
                  className="cursor-ew-resize"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                    setDragging('B');
                  }}
                >
                  <circle cx={bx} cy={by} r="14" fill="transparent" />
                  <circle
                    cx={bx}
                    cy={by}
                    r={dragging === 'B' ? '8' : '6.5'}
                    fill="#059669"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text x={bx + 10} y={by + 14} className="font-mono text-xs font-bold fill-emerald-800">
                    B
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right Control & Concept Deck (5/12 ~ 40%) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-slate-200 rounded-xl bg-white p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Parametrlarni boshqarish
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Katet uzunliklarini o‘zgartiring va yuzalar tengligini kuzating.
                </p>
              </div>

              {/* Slider A */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="slider-a" className="font-medium text-slate-800">
                    1-katet (a)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-sky-700">
                    {fmt(a)} sm
                  </span>
                </div>
                <input
                  id="slider-a"
                  type="range"
                  min={1}
                  max={16}
                  step={0.5}
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value))}
                  className="w-full geo-slider"
                />
              </div>

              {/* Slider B */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="slider-b" className="font-medium text-slate-800">
                    2-katet (b)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-emerald-700">
                    {fmt(b)} sm
                  </span>
                </div>
                <input
                  id="slider-b"
                  type="range"
                  min={1}
                  max={16}
                  step={0.5}
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full geo-slider"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Mashhur Pifagor uchliklari
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setA(3);
                      setB(4);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    Tiklash
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                  {PRESETS.map((preset) => {
                    const active = a === preset.a && b === preset.b;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setA(preset.a);
                          setB(preset.b);
                        }}
                        className={`px-3 py-2 text-xs font-mono font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Formula Breakdown */}
              <div className="pt-5 border-t border-slate-200 space-y-3">
                <div className="text-xs font-medium text-slate-500">
                  Hisoblash natijasi
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono tabular-nums space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">a² + b²</span>
                    <span className="font-semibold text-slate-900">
                      <span className="text-sky-700">{fmt(a * a)}</span>
                      {' + '}
                      <span className="text-emerald-700">{fmt(b * b)}</span>
                      {' = '}
                      <span className="text-amber-700">{fmt(cSquared)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-2 border-t border-slate-200">
                    <span className="text-slate-700 font-medium">Gipotenuza (c)</span>
                    <span className="font-bold text-amber-700">
                      √{fmt(cSquared)} = {fmt(c)} sm
                    </span>
                  </div>
                </div>

                {isIntegerTriple && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>
                      Butun sonli Pifagor uchligi: ({a}, {b}, {Math.round(c)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-5 mt-6 border-t border-slate-200 text-center">
              <div>
                <div className="text-xs text-slate-500">Yuza (S)</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {fmt(areaTriangle)} sm²
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">∠A burchak</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {angleA.toFixed(1)}°
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">∠B burchak</div>
                <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 mt-0.5">
                  {angleB.toFixed(1)}°
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

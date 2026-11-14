import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type ProofTab = 'rearrangement' | 'euclid' | 'algebraic';

export const ProofExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProofTab>('rearrangement');
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pa, setPa] = useState<number>(3);
  const [pb, setPb] = useState<number>(4);
  const [euclidStep, setEuclidStep] = useState<number>(1);
  const [algStep, setAlgStep] = useState<number>(1);

  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      setProgress((prev) => {
        const next = prev + dt * 0.032;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  // Rearrangement Geometry inside (pa + pb) x (pa + pb) square
  const totalSide = pa + pb;
  const svgSize = 360;
  const pad = 30;
  const sc = (svgSize - pad * 2) / totalSide;
  const p = (x: number, y: number) => `${pad + x * sc},${pad + y * sc}`;
  const t = progress / 100;

  // Smooth cubic ease
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Interpolate 4 triangles inside the (a+b) x (a+b) square:
  // At t=0:
  //   Top-left empty square = a x a, Bottom-right empty square = b x b.
  //   Top-right rectangle (b x a) split into T1 & T2.
  //   Bottom-left rectangle (a x b) split into T3 & T4.
  // At t=1:
  //   The 4 triangles sit at the 4 corners, leaving tilted c^2 square in the center.
  //
  // Triangle vertices (x1,y1), (x2,y2), (x3,y3) where right angle is at (x1,y1):
  // Let's trace exact rigid translations!
  // T1 (top-right upper):
  //   t=0: (a,0), (a+b,0), (a+b,a)
  //   t=1: (0,0), (b,0), (0,a) -> wait, rotating changes orientation; pure translation keeps orientation!
  // Let's check pure translations of 4 triangles in a+b square:
  // At t=1 (c^2 in center), the 4 corner triangles have legs (a, b) along the 4 edges:
  //   Top-left corner: right angle at (0,0), legs to (b,0) and (0,a).
  //   Top-right corner: right angle at (a+b,0), legs to (b,0) and (a+b,b).
  //   Bottom-right corner: right angle at (a+b,a+b), legs to (a+b,b) and (a,a+b).
  //   Bottom-left corner: right angle at (0,a+b), legs to (0,a) and (a,a+b).
  // Look! Those 4 triangles have IDENTICAL orientations at t=0 if we form the two rectangles cleanly:
  //   1. Top-right corner triangle: right angle at (a+b,0), vertices [(a+b,0), (b,0), (a+b,b)] -> legs b (horiz), b? Wait: top edge is b (from b to a+b? No, a+b - b = a!).
  //   Let's check carefully:
  //     Top-left: right angle (0,0), horiz leg b -> (b,0), vert leg a -> (0,a).
  //     Top-right: right angle (a+b,0), horiz leg a -> (b,0), vert leg b -> (a+b,b).
  //     Bottom-right: right angle (a+b,a+b), horiz leg b -> (a,a+b), vert leg a -> (a+b,b).
  //     Bottom-left: right angle (0,a+b), horiz leg a -> (a,a+b), vert leg b -> (0,a).
  //   Check center hole at t=1: vertices (b,0), (a+b,b), (a,a+b), (0,a).
  //     Side lengths: sqrt(a^2+b^2) = c for all 4! Right angles at all 4 vertices!
  //   Now check PURE TRANSLATIONS from t=1 to t=0:
  //     Keep Top-right fixed at [(a+b,0), (b,0), (a+b,b)]? Wait: horiz leg is a, vert leg is b.
  //     Translate Top-left [(0,0), (b,0), (0,a)] by (+a, 0)? No, its horiz leg is b, vert leg is a.
  //     Translate Top-left by (+a, +b)? Then right angle goes to (a,b), vertices [(a,b), (a+b,b), (a,a+b)].
  //     Wait: at t=0, we want two rectangles of size (a x b):
  //       Rectangle 1 (top-right): x in [b, a+b], y in [0, b] (size a x b!).
  //         Wait: Top-right triangle ALREADY occupies upper half of x in [b, a+b], y in [0, b]! [(a+b,0), (b,0), (a+b,b)].
  //         Lower half of that same rectangle is [(b,b), (a+b,b), (b,0)] — that's Bottom-right translated by (-b, -a)!
  //         Check Bottom-right [(a+b,a+b), (a,a+b), (a+b,b)] + (-b, -a) = [(a,b), (a-b,b)? Wait: a+b-b = a, a-b... no!
  //         Horiz leg of Bottom-right is b (from a+b to a). Wait: at t=0 Rectangle 1 has width a (from b to a+b) and height b (from 0 to b).
  //         Bottom-right has width b and height a, while Top-right has width a and height b. So Top-right pairs with Bottom-left (horiz a, vert b), and Top-left pairs with Bottom-right (horiz b, vert a)!
  //     Let's verify that!
  //       1. Top-left [(0,0), (b,0), (0,a)] STAYS FIXED at top-left!
  //          Wait: let's pair Top-left [(0,0), (b,0), (0,a)] with Bottom-right [(a+b,a+b), (a,a+b), (a+b,b)].
  //          Translate Bottom-right by (-a, -b):
  //          (a+b-a, a+b-b) = (b, a)!
  //          (a-a, a+b-b) = (0, a)!
  //          (a+b-a, b-b) = (b, 0)!
  //          BOOM! [(b,a), (0,a), (b,0)] perfectly completes the top-left rectangle [0..b] x [0..a]!
  //       2. Now pair Top-right [(a+b,0), (b,0), (a+b,b)] with Bottom-left [(0,a+b), (a,a+b), (0,a)]!
  //          Wait: if Top-left + Bottom-right fill [0..b] x [0..a], what's left in the (a+b)x(a+b) square?
  //          Let's shift Top-right down by (+0, +a) -> x in [b, a+b], y in [a, a+b]!
  //          [(a+b,a), (b,a), (a+b,a+b)]!
  //          And shift Bottom-left right by (+b, 0) -> x in [b, a+b], y in [a, a+b]!
  //          [(b,a+b), (a+b,a+b), (b,a)]!
  //          WAIT A SECOND! Let's check what remains empty in the (a+b) x (a+b) square at t=0:
  //          - [0..b] x [0..a] is filled by T_TL + T_BR!
  //          - [b..a+b] x [a..a+b] is filled by T_TR + T_BL!
  //          Remaining empty regions:
  //          - Top-right: x in [b..a+b], y in [0..a] -> that's an a x a square (area a²)!
  //          - Bottom-left: x in [0..b], y in [a..a+b] -> that's a b x b square (area b²)!
  //   PURE TRANSLATIONS ONLY! Zero rotation distortion, 100% rigid congruence!

  const shift = (
    pts: [number, number][],
    dx: number,
    dy: number
  ): string =>
    pts.map(([x, y]) => p(x + dx * (1 - ease), y + dy * (1 - ease))).join(' ');

  const triTL: [number, number][] = [
    [0, 0],
    [pb, 0],
    [0, pa],
  ];
  const triBR: [number, number][] = [
    [pa + pb, pa + pb],
    [pa, pa + pb],
    [pa + pb, pb],
  ];
  const triTR: [number, number][] = [
    [pa + pb, 0],
    [pb, 0],
    [pa + pb, pb],
  ];
  const triBL: [number, number][] = [
    [0, pa + pb],
    [pa, pa + pb],
    [0, pa],
  ];

  // At ease = 0 (t=0): triTL stays (0,0), triBR shifts (-pa, -pb), triTR shifts (0, pa), triBL shifts (pb, 0)
  const polyTL = shift(triTL, 0, 0);
  const polyBR = shift(triBR, -pa, -pb);
  const polyTR = shift(triTR, 0, pa);
  const polyBL = shift(triBL, pb, 0);

  // Euclid projection math (3-4-5 default or current pa, pb)
  const ec = Math.hypot(pa, pb);
  const pProj = (pa * pa) / ec;
  const qProj = (pb * pb) / ec;

  return (
    <section id="isbot" className="py-16 border-b border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500 mb-1.5">
              Geometrik va algebraik asoslash
            </p>
            <h2
              className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              Nima uchun a² + b² = c² doimo o‘rinli?
            </h2>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setActiveTab('rearrangement')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'rearrangement'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Qayta joylashtirish
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('euclid')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'euclid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Evklid usuli
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('algebraic')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'algebraic'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Algebraik isbot
            </button>
          </div>
        </div>

        {/* Tab 1: Rearrangement Proof */}
        {activeTab === 'rearrangement' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-xl p-6">
            <div className="lg:col-span-6 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-4">
              <svg
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="w-full max-w-[360px] h-auto"
                aria-label="4 ta uchburchakni qayta joylashtirish isboti"
              >
                {/* Outer (a+b)^2 Square */}
                <rect
                  x={pad}
                  y={pad}
                  width={totalSide * sc}
                  height={totalSide * sc}
                  fill="#FFFBEB"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* At t=0: Show a^2 and b^2 areas cleanly */}
                {ease < 0.25 && (
                  <g opacity={1 - ease * 4}>
                    <rect
                      x={pad + pb * sc}
                      y={pad}
                      width={pa * sc}
                      height={pa * sc}
                      fill="rgba(2, 132, 199, 0.14)"
                      stroke="#0284C7"
                      strokeDasharray="4 3"
                    />
                    <text
                      x={pad + (pb + pa / 2) * sc}
                      y={pad + (pa / 2) * sc}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-sm font-bold fill-sky-800"
                    >
                      a² = {pa * pa}
                    </text>

                    <rect
                      x={pad}
                      y={pad + pa * sc}
                      width={pb * sc}
                      height={pb * sc}
                      fill="rgba(5, 150, 105, 0.14)"
                      stroke="#059669"
                      strokeDasharray="4 3"
                    />
                    <text
                      x={pad + (pb / 2) * sc}
                      y={pad + (pa + pb / 2) * sc}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-sm font-bold fill-emerald-800"
                    >
                      b² = {pb * pb}
                    </text>
                  </g>
                )}

                {/* At t=1: Show tilted c^2 label */}
                {ease > 0.75 && (
                  <g opacity={(ease - 0.75) * 4}>
                    <polygon
                      points={`${p(pb, 0)} ${p(pa + pb, pb)} ${p(pa, pa + pb)} ${p(0, pa)}`}
                      fill="rgba(217, 119, 6, 0.18)"
                      stroke="#D97706"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pad + (totalSide / 2) * sc}
                      y={pad + (totalSide / 2) * sc}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono text-base font-bold fill-amber-900"
                    >
                      c² = {pa * pa + pb * pb}
                    </text>
                  </g>
                )}

                {/* 4 Congruent Right Triangles */}
                <polygon points={polyTL} fill="#38BDF8" fillOpacity="0.85" stroke="#0F172A" strokeWidth="1.5" />
                <polygon points={polyBR} fill="#0284C7" fillOpacity="0.85" stroke="#0F172A" strokeWidth="1.5" />
                <polygon points={polyTR} fill="#34D399" fillOpacity="0.85" stroke="#0F172A" strokeWidth="1.5" />
                <polygon points={polyBL} fill="#059669" fillOpacity="0.85" stroke="#0F172A" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  Yuzalar saqlanishi orqali ko‘rgazmali isbot
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Tomoni <span className="font-mono font-medium text-slate-900">(a + b)</span> ga
                  teng kvadrat ichiga 4 ta bir xil to‘g‘ri burchakli uchburchak joylashtirilgan.
                  Uchburchaklarni siljitganimizda kvadratning umumiy yuzi ham, uchburchaklarning
                  yig‘indi yuzi ham o‘zgarmaydi. Demak, bo‘sh qolgan oq-sariq yuzalar ham teng bo‘ladi:
                </p>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-sm tabular-nums space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Boshlang‘ich holat (0%):</span>
                    <span className="font-semibold text-slate-900">
                      Bo‘sh yuza = a² + b² = {pa * pa} + {pb * pb} = {pa * pa + pb * pb}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Yakuniy holat (100%):</span>
                    <span className="font-semibold text-amber-800">
                      Markaziy kvadrat = c² = {pa * pa + pb * pb}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label htmlFor="proof-anim" className="font-medium text-slate-800">
                      Siljitish bosqichi
                    </label>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <input
                    id="proof-anim"
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setProgress(Number(e.target.value));
                    }}
                    className="w-full geo-slider"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        To‘xtatish
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        {progress >= 100 ? 'Qayta ijro etish' : 'Animatsiyani boshlash'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setProgress(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Boshiga (0%)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <label htmlFor="proof-a">a tomon</label>
                      <span className="font-mono tabular-nums font-semibold">{pa}</span>
                    </div>
                    <input
                      id="proof-a"
                      type="range"
                      min={2}
                      max={6}
                      step={1}
                      value={pa}
                      onChange={(e) => setPa(Number(e.target.value))}
                      className="w-full geo-slider"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <label htmlFor="proof-b">b tomon</label>
                      <span className="font-mono tabular-nums font-semibold">{pb}</span>
                    </div>
                    <input
                      id="proof-b"
                      type="range"
                      min={2}
                      max={6}
                      step={1}
                      value={pb}
                      onChange={(e) => setPb(Number(e.target.value))}
                      className="w-full geo-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Euclid Projection Proof */}
        {activeTab === 'euclid' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-xl p-6">
            <div className="lg:col-span-6 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-4">
              <svg viewBox="0 0 420 320" className="w-full max-w-[420px] h-auto" aria-label="Evklid proyeksiyalar usuli">
                {/* Right triangle placed with hypotenuse AB horizontally at y=130 */}
                {/* A=(50,130), B=(370,130) => c = 320. Let p/c = 0.36 => H=(165.2, 130), C=(165.2, 130 - sqrt(115.2*204.8)) = (165.2, 130 - 153.6)? Wait: sqrt(115.2*204.8)=153.6 => y = 130 - 153.6 = -23.6 (clipped!). Let's place AB at y=170 and scale c=240: A=(90,170), B=(330,170), p=86.4 -> H=(176.4,170), h=sqrt(86.4*153.6)=115.2 -> C=(176.4, 54.8)! */}
                {/* Wait let's fit c^2 rectangle cleanly below y=170: y=170 to y=170+140=310 (or scaled height). Actually let's draw exact right triangle A=(90,140), B=(330,140), C=(176.4, 24.8)! Wait: if c=240, c^2 would be 240px tall (140+240=380). Let's make viewBox 420x400! */}
                <g transform="translate(0, 0)">
                  {/* Hypotenuse square split into p*c and q*c */}
                  <rect
                    x={90}
                    y={150}
                    width={86.4}
                    height={140}
                    fill={euclidStep >= 2 ? 'rgba(2, 132, 199, 0.16)' : '#F8FAFC'}
                    stroke="#0284C7"
                    strokeWidth={euclidStep === 2 ? '2' : '1'}
                  />
                  <rect
                    x={176.4}
                    y={150}
                    width={153.6}
                    height={140}
                    fill={euclidStep >= 3 ? 'rgba(5, 150, 105, 0.16)' : '#F8FAFC'}
                    stroke="#059669"
                    strokeWidth={euclidStep === 3 ? '2' : '1'}
                  />

                  {/* Triangle ABC */}
                  <polygon
                    points="90,150 176.4,34.8 330,150"
                    fill="#FFFFFF"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Altitude CH */}
                  <line
                    x1={176.4}
                    y1={34.8}
                    x2={176.4}
                    y2={150}
                    stroke="#0F172A"
                    strokeWidth="1.75"
                    strokeDasharray="5 4"
                  />

                  {/* Right angle at H */}
                  <polyline
                    points="176.4,138 188.4,138 188.4,150"
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="1.25"
                  />

                  {/* Labels */}
                  <text x={80} y={155} textAnchor="end" className="font-mono text-xs font-bold fill-slate-900">A</text>
                  <text x={340} y={155} className="font-mono text-xs font-bold fill-slate-900">B</text>
                  <text x={176.4} y={24} textAnchor="middle" className="font-mono text-xs font-bold fill-slate-900">C (90°)</text>
                  <text x={176.4} y={166} textAnchor="middle" className="font-mono text-xs font-bold fill-slate-700">H</text>

                  <text x={122} y={85} className="font-mono text-xs font-bold fill-sky-700">a</text>
                  <text x={262} y={85} className="font-mono text-xs font-bold fill-emerald-700">b</text>
                  <text x={133} y={142} textAnchor="middle" className="font-mono text-xs font-semibold fill-sky-700">p</text>
                  <text x={253} y={142} textAnchor="middle" className="font-mono text-xs font-semibold fill-emerald-700">q</text>

                  <text x={133} y={225} textAnchor="middle" className="font-mono text-xs font-bold fill-sky-900">
                    a² = c · p
                  </text>
                  <text x={253} y={225} textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-900">
                    b² = c · q
                  </text>
                </g>
              </svg>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  O‘xshash uchburchaklar va proyeksiyalar (Evklid)
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  To‘g‘ri burchak uchidan gipotenuzaga <span className="font-mono font-medium text-slate-900">CH</span> balandlik
                  tushiramiz. Hosil bo‘lgan ikkita kichik uchburchak katta <span className="font-mono">△ABC</span> ga o‘xshash bo‘ladi.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: '1-qadam: Proyeksiyalarga ajratish',
                      body: 'Gipotenuza c ikkita kesmaga bo‘linadi: p (a katetning proyeksiyasi) va q (b katetning proyeksiyasi). Demak, p + q = c.',
                    },
                    {
                      step: 2,
                      title: '2-qadam: Chap katet uchun nisbat',
                      body: `△ACH ~ △ABC bo‘lgani uchun a / c = p / a, bundan a² = c · p. (${pa}² = ${ec.toFixed(2)} · ${pProj.toFixed(2)} = ${pa * pa})`,
                    },
                    {
                      step: 3,
                      title: '3-qadam: Qo‘shish va yakuniy natija',
                      body: `Xuddi shunday b² = c · q. Endi tengliklarni qo‘shamiz: a² + b² = c·p + c·q = c(p + q) = c · c = c².`,
                    },
                  ].map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setEuclidStep(item.step)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        euclidStep === item.step
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-semibold">{item.title}</div>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          euclidStep === item.step ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {item.body}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Algebraic Proof */}
        {activeTab === 'algebraic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-xl p-6">
            <div className="lg:col-span-5 flex flex-col justify-center bg-slate-50 border border-slate-200 rounded-lg p-6">
              <div className="text-xs font-medium text-slate-500 mb-3">
                Katta kvadrat yuzasi (2 xil usulda)
              </div>
              <svg viewBox="0 0 280 280" className="w-full max-w-[260px] mx-auto h-auto" aria-label="Algebraik isbot chizmasi">
                <rect x={20} y={20} width={240} height={240} fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                {/* 4 corner triangles with a=90, b=150 */}
                <polygon points="20,20 170,20 20,110" fill="rgba(2,132,199,0.16)" stroke="#0284C7" strokeWidth="1.5" />
                <polygon points="170,20 260,20 260,170" fill="rgba(5,150,105,0.16)" stroke="#059669" strokeWidth="1.5" />
                <polygon points="260,170 260,260 110,260" fill="rgba(2,132,199,0.16)" stroke="#0284C7" strokeWidth="1.5" />
                <polygon points="110,260 20,260 20,110" fill="rgba(5,150,105,0.16)" stroke="#059669" strokeWidth="1.5" />
                <polygon points="170,20 260,170 110,260 20,110" fill="rgba(217,119,6,0.14)" stroke="#D97706" strokeWidth="2" />
                <text x={140} y={140} textAnchor="middle" dominantBaseline="middle" className="font-mono text-base font-bold fill-amber-900">
                  c²
                </text>
                <text x={95} y={14} textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-700">b</text>
                <text x={215} y={14} textAnchor="middle" className="font-mono text-xs font-semibold fill-slate-700">a</text>
              </svg>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Bosqichma-bosqich algebraik keltirib chiqarish
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  BSB yozma ishida to‘liq ball olish uchun ushbu 4 qatorli isbotni ketma-ket yozish tavsiya etiladi:
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    n: 1,
                    formula: 'S_umumiy = (a + b)²',
                    desc: 'Tomoni (a + b) ga teng katta kvadratning umumiy yuzi.',
                  },
                  {
                    n: 2,
                    formula: 'S_umumiy = c² + 4 · (½ · a · b) = c² + 2ab',
                    desc: 'Ayni shu yuza markaziy c² kvadrat va 4 ta to‘g‘ri burchakli uchburchak yuzalari yig‘indisiga teng.',
                  },
                  {
                    n: 3,
                    formula: 'a² + 2ab + b² = c² + 2ab',
                    desc: 'Ikki ifodani tenglashtiramiz va chap tomondagi qavsni ochamiz.',
                  },
                  {
                    n: 4,
                    formula: 'a² + b² = c²',
                    desc: 'Har ikki tomondan 2ab ni ayirib tashlaymiz — Pifagor teoremasi isbotlandi!',
                  },
                ].map((item) => (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => setAlgStep(item.n)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                      algStep === item.n
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium opacity-75">
                        {item.n}-bosqich
                      </span>
                      <span className="font-mono text-sm sm:text-base font-semibold">
                        {item.formula}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1.5 ${
                        algStep === item.n ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

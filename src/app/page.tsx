"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DATA_2026 = [
  { m: 92.57, r: 1 }, { m: 89.8, r: 5 }, { m: 88.73, r: 6 }, { m: 81.82, r: 31 },
  { m: 80.45, r: 39 }, { m: 77.26, r: 75 }, { m: 75.31, r: 113 }, { m: 74.92, r: 122 },
  { m: 74.66, r: 126 }, { m: 71.13, r: 235 }, { m: 70.78, r: 248 }, { m: 70.42, r: 275 },
  { m: 68.47, r: 360 }, { m: 68.37, r: 366 }, { m: 66.51, r: 466 }, { m: 65.26, r: 544 },
  { m: 64.57, r: 573 }, { m: 63.91, r: 659 }, { m: 62.93, r: 764 }, { m: 62.88, r: 840 },
  { m: 62.15, r: 861 }, { m: 61.3, r: 972 }, { m: 60.65, r: 1061 }, { m: 58.69, r: 1366 },
  { m: 57.8, r: 1573 }, { m: 57.72, r: 1535 }, { m: 56.09, r: 1878 },
  { m: 46.27, r: 5331 }, { m: 39.47, r: 10770 },
];

const DATA_2025 = [
  { m: 100, r: 1 }, { m: 90.75, r: 8 }, { m: 88.06, r: 20 }, { m: 81.56, r: 93 },
  { m: 76.04, r: 241 }, { m: 75.36, r: 273 }, { m: 73.44, r: 342 }, { m: 71.11, r: 460 },
  { m: 69.54, r: 574 }, { m: 67.59, r: 761 }, { m: 67.02, r: 822 }, { m: 66.2, r: 932 },
  { m: 64.99, r: 1086 }, { m: 63.75, r: 1252 }, { m: 60.47, r: 1726 },
  { m: 46.47, r: 5765 }, { m: 40.94, r: 8706 },
];

function interpolateRank(data: { m: number; r: number }[], marks: number): number {
  const sorted = [...data].sort((a, b) => b.m - a.m);
  if (marks >= sorted[0].m) return sorted[0].r;
  if (marks <= sorted[sorted.length - 1].m) return sorted[sorted.length - 1].r;
  for (let i = 0; i < sorted.length - 1; i++) {
    const hi = sorted[i];
    const lo = sorted[i + 1];
    if (marks <= hi.m && marks >= lo.m) {
      const t = (hi.m - marks) / (hi.m - lo.m);
      return Math.round(hi.r + t * (lo.r - hi.r));
    }
  }
  return sorted[sorted.length - 1].r;
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

type HoverInfo = { x: number; y: number; marks: number; r26: number; r25: number } | null;

export default function GateMarksAIR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [marks, setMarks] = useState(62);
  const [hover, setHover] = useState<HoverInfo>(null);

  const rank2026 = interpolateRank(DATA_2026, marks);
  const rank2025 = interpolateRank(DATA_2025, marks);

  const buildChart = useCallback(() => {
    if (!canvasRef.current) return;
    const c1 = isDark ? "#4f98a3" : "#01696f";
    const c2 = isDark ? "#fdab43" : "#964219";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
    const textColor = isDark ? "#797876" : "#7a7974";

    chartRef.current?.destroy();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "2026",
            data: DATA_2026.map((d) => ({ x: d.m, y: d.r })),
            borderColor: c1,
            pointBackgroundColor: c1,
            pointBorderColor: isDark ? "#1c1b19" : "#f9f8f5",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            tension: 0.35,
            fill: false,
          },
          {
            label: "2025",
            data: DATA_2025.map((d) => ({ x: d.m, y: d.r })),
            borderColor: c2,
            pointBackgroundColor: c2,
            pointBorderColor: isDark ? "#1c1b19" : "#f9f8f5",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            tension: 0.35,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        hover: { mode: undefined },
        scales: {
          x: {
            type: "linear",
            min: 35,
            max: 100,
            title: { display: true, text: "Marks", color: textColor },
            ticks: { color: textColor, stepSize: 10 },
            grid: { color: gridColor },
            border: { color: gridColor },
          },
          y: {
            type: "logarithmic",
            reverse: true,
            min: 1,
            title: { display: true, text: "AIR (Rank)", color: textColor },
            ticks: {
              color: textColor,
              callback: (val) => {
                const nice = [1, 10, 100, 1000, 5000, 10000];
                return nice.includes(Number(val)) ? Number(val).toLocaleString() : "";
              },
            },
            grid: { color: gridColor },
            border: { color: gridColor },
          },
        },
      },
    });
  }, [isDark]);

  useEffect(() => {
    buildChart();
    return () => { chartRef.current?.destroy(); };
  }, [buildChart]);

  // Using Pointer events to handle both mouse and touch elegantly
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const chart = chartRef.current;
    if (!chart) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xScale = chart.scales["x"];
    const yScale = chart.scales["y"];
    if (!xScale || !yScale) return;

    if (
      mouseX < xScale.left || mouseX > xScale.right ||
      mouseY < yScale.top  || mouseY > yScale.bottom
    ) {
      setHover(null);
      return;
    }

    const marksAtCursor = xScale.getValueForPixel(mouseX) ?? 0;
    const clampedMarks = Math.min(100, Math.max(35, marksAtCursor));
    const r26 = interpolateRank(DATA_2026, clampedMarks);
    const r25 = interpolateRank(DATA_2025, clampedMarks);

    const tooltipWidth = 190;
    let tx = mouseX + 14;
    
    // Smart flip and clamp for mobile screens
    if (tx + tooltipWidth > rect.width) {
      tx = mouseX - tooltipWidth - 14;
      if (tx < 0) tx = (rect.width - tooltipWidth) / 2;
    }

    setHover({ x: tx, y: Math.max(8, mouseY - 40), marks: clampedMarks, r26, r25 });
  }, []);

  const handlePointerLeave = useCallback(() => setHover(null), []);

  const bg      = isDark ? "bg-[#171614]"     : "bg-[#f7f6f2]";
  const surface = isDark ? "bg-[#1c1b19]"     : "bg-[#f9f8f5]";
  const sfOff   = isDark ? "bg-[#1d1c1a]"     : "bg-[#f3f0ec]";
  const border  = isDark ? "border-[#393836]" : "border-[#d4d1ca]";
  const text    = isDark ? "text-[#cdccca]"   : "text-[#28251d]";
  const muted   = isDark ? "text-[#797876]"   : "text-[#7a7974]";
  const primary = isDark ? "#4f98a3"          : "#01696f";
  const accent2 = isDark ? "#fdab43"          : "#964219";
  const dot26   = isDark ? "bg-[#4f98a3]"     : "bg-[#01696f]";
  const dot25   = isDark ? "bg-[#fdab43]"     : "bg-[#964219]";

  // Added opacity to bg for glassmorphism
  const tooltipBg     = isDark ? "rgba(32, 31, 29, 0.85)" : "rgba(249, 248, 245, 0.85)";
  const tooltipBorder = isDark ? "rgba(57, 56, 54, 0.6)" : "rgba(212, 209, 202, 0.6)";
  const tooltipText   = isDark ? "#cdccca" : "#28251d";
  const tooltipMuted  = isDark ? "#797876" : "#7a7974";

  return (
    <div
      className={`${bg} ${text} min-h-dvh flex flex-col p-4 sm:px-6 sm:py-8 transition-colors duration-300`}
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <header className="w-full max-w-[1200px] mx-auto flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight">GATE CSE — Marks vs AIR</h1>
          <p className={`${muted} text-xs sm:text-sm mt-1.5`}>
            2025 &amp; 2026 cutoff comparison — estimate your rank.
          </p>
        </div>
        <button
          onClick={() => setIsDark((d) => !d)}
          className={`${surface} ${border} border rounded-lg px-3 py-2 flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap hover:opacity-80 transition-all active:scale-95`}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span className="hidden sm:inline">Toggle theme</span>
        </button>
      </header>

      <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 flex-1">

        {/* Chart card - Appears SECOND on mobile, FIRST on desktop */}
        <div className={`flex-1 min-w-0 ${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col order-2 lg:order-1`}>
          <div className="flex gap-4 sm:gap-5 mb-4 flex-wrap">
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
              <span className={`w-3 h-3 rounded-full ${dot26} shrink-0`} />
              2026 GATE CSE
            </div>
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
              <span className={`w-3 h-3 rounded-full ${dot25} shrink-0`} />
              2025 GATE CSE
            </div>
          </div>

          <div
            className="relative flex-1 min-h-[280px] sm:min-h-[360px] cursor-crosshair touch-pan-y"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <canvas ref={canvasRef} />

            {hover && (
              <div
                className="pointer-events-none absolute z-20 rounded-xl text-sm shadow-xl backdrop-blur-md transition-opacity duration-150"
                style={{
                  left: hover.x,
                  top: hover.y,
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipText,
                  minWidth: 190,
                  padding: "12px 16px",
                }}
              >
                <p className="font-bold mb-3 border-b pb-2" style={{ color: tooltipText, borderColor: tooltipBorder }}>
                  Marks: {hover.marks.toFixed(2)}
                </p>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "#4f98a3" : "#01696f" }} />
                    2026
                  </span>
                  <span className="font-semibold tabular-nums" style={{ color: tooltipText }}>
                    AIR {hover.r26.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "#fdab43" : "#964219" }} />
                    2025
                  </span>
                  <span className="font-semibold tabular-nums" style={{ color: tooltipText }}>
                    AIR {hover.r25.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Appears FIRST on mobile, SECOND on desktop */}
        <div className="lg:w-[280px] shrink-0 flex flex-col gap-4 sm:gap-5 order-1 lg:order-2">
          
          <div className={`${surface} ${border} border rounded-2xl p-5 shadow-sm`}>
            <h2 className="text-sm sm:text-base font-bold mb-3">Estimate Your Rank</h2>
            <label className={`${muted} text-xs block mb-3`} htmlFor="marksSlider">
              Drag the slider to set marks
            </label>
            <input
              id="marksSlider"
              type="range"
              min={30} max={100} step={0.1}
              value={marks}
              onChange={(e) => setMarks(parseFloat(e.target.value))}
              className="w-full cursor-pointer h-1.5 rounded-lg appearance-none bg-black/10 dark:bg-white/10 outline-none"
              style={{ accentColor: primary }}
            />
            <div className="text-4xl sm:text-5xl font-bold tabular-nums text-center mt-5 mb-1 tracking-tight">
              {marks.toFixed(1)}
            </div>
            <p className={`text-xs text-center font-medium uppercase tracking-wider ${muted}`}>out of 100</p>
          </div>

          {/* Grid layout on mobile so cards sit side by side */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primary }}>
                2026 Estimate
              </p>
              <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                  {rank2026 <= 1 ? "~1" : `~${rank2026.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent2 }}>
                2025 Estimate
              </p>
              <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                  {rank2025 <= 1 ? "~1" : `~${rank2025.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
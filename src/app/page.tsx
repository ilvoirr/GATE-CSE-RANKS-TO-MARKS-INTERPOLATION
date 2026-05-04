"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// ── GATE CSE Data ──────────────────────────────────────────────────────────────
const GATE_2026 = [
  { m: 92.57, r: 1 }, { m: 89.8, r: 5 }, { m: 88.73, r: 6 }, { m: 81.82, r: 31 },
  { m: 80.45, r: 39 }, { m: 77.26, r: 75 }, { m: 75.31, r: 113 }, { m: 74.92, r: 122 },
  { m: 74.66, r: 126 }, { m: 71.13, r: 235 }, { m: 70.78, r: 248 }, { m: 70.42, r: 275 },
  { m: 68.47, r: 360 }, { m: 68.37, r: 366 }, { m: 66.51, r: 466 }, { m: 65.26, r: 544 },
  { m: 64.57, r: 573 }, { m: 63.91, r: 659 }, { m: 62.93, r: 764 }, { m: 62.88, r: 840 },
  { m: 62.15, r: 861 }, { m: 61.3, r: 972 }, { m: 60.65, r: 1061 }, { m: 58.69, r: 1366 },
  { m: 57.8, r: 1573 }, { m: 57.72, r: 1535 }, { m: 56.09, r: 1878 },
  { m: 46.27, r: 5331 }, { m: 39.47, r: 10770 },
];

const GATE_2025 = [
  { m: 100, r: 1 }, { m: 90.75, r: 8 }, { m: 88.06, r: 20 }, { m: 81.56, r: 93 },
  { m: 76.04, r: 241 }, { m: 75.36, r: 273 }, { m: 73.44, r: 342 }, { m: 71.11, r: 460 },
  { m: 69.54, r: 574 }, { m: 67.59, r: 761 }, { m: 67.02, r: 822 }, { m: 66.2, r: 932 },
  { m: 64.99, r: 1086 }, { m: 63.75, r: 1252 }, { m: 60.47, r: 1726 },
  { m: 46.47, r: 5765 }, { m: 40.94, r: 8706 },
];

// ── CAT 2025 Data ──────────────────────────────────────────────────────────────
const CAT_DATA = [
  { m: 145, r: 1,      p: 100    },
  { m: 138, r: 5,      p: 100    },
  { m: 132, r: 12,     p: 100    },
  { m: 126, r: 28,     p: 99.99  },
  { m: 120, r: 56,     p: 99.98  },
  { m: 117.50, r: 112, p: 99.96  },
  { m: 111.90, r: 280, p: 99.90  },
  { m: 105.56, r: 476, p: 99.83  },
  { m: 99.47, r: 784,  p: 99.72  },
  { m: 96.73, r: 1008, p: 99.64  },
  { m: 93.19, r: 1400, p: 99.50  },
  { m: 91.73, r: 1596, p: 99.43  },
  { m: 89.93, r: 1848, p: 99.34  },
  { m: 84.64, r: 2828, p: 98.99  },
  { m: 84.26, r: 2940, p: 98.95  },
  { m: 83.49, r: 3136, p: 98.88  },
  { m: 82.13, r: 3500, p: 98.75  },
  { m: 80.72, r: 3864, p: 98.62  },
  { m: 78.94, r: 4424, p: 98.42  },
  { m: 75.98, r: 5460, p: 98.05  },
  { m: 73.65, r: 6496, p: 97.68  },
  { m: 71.04, r: 7840, p: 97.20  },
  { m: 69.96, r: 8428, p: 96.99  },
  { m: 68.71, r: 9184, p: 96.72  },
  { m: 67.65, r: 9856, p: 96.48  },
  { m: 62.29, r: 14000, p: 95.00 },
  { m: 60.98, r: 15204, p: 94.57 },
  { m: 59.79, r: 16408, p: 94.14 },
  { m: 58.08, r: 18256, p: 93.48 },
  { m: 54.69, r: 22344, p: 92.02 },
  { m: 52.53, r: 25284, p: 90.97 },
  { m: 51.91, r: 26180, p: 90.65 },
  { m: 49.99, r: 29288, p: 89.54 },
  { m: 45.16, r: 38052, p: 86.41 },
  { m: 44.91, r: 38500, p: 86.25 },
  { m: 40.53, r: 48580, p: 82.65 },
  { m: 37.64, r: 56196, p: 79.93 },
  { m: 37.23, r: 57456, p: 79.48 },
  { m: 29.91, r: 81984, p: 70.72 },
  { m: 18.00, r: 140000, p: 50.00 },
];

// ── Interpolation helpers ──────────────────────────────────────────────────────
function interpolateRank(data: { m: number; r: number }[], marks: number): number {
  const sorted = [...data].sort((a, b) => b.m - a.m);
  const clampedMarks = Math.min(sorted[0].m, Math.max(sorted[sorted.length - 1].m, marks));
  if (clampedMarks >= sorted[0].m) return sorted[0].r;
  if (clampedMarks <= sorted[sorted.length - 1].m) return sorted[sorted.length - 1].r;
  for (let i = 0; i < sorted.length - 1; i++) {
    const hi = sorted[i], lo = sorted[i + 1];
    if (clampedMarks <= hi.m && clampedMarks >= lo.m) {
      const t = (hi.m - clampedMarks) / (hi.m - lo.m);
      return Math.round(hi.r + t * (lo.r - hi.r));
    }
  }
  return sorted[sorted.length - 1].r;
}

function interpolateCAT(marks: number): { r: number; p: number } {
  const sorted = [...CAT_DATA].sort((a, b) => b.m - a.m);
  // Hard clamp to actual data boundaries — no extrapolation beyond top/bottom
  if (marks >= sorted[0].m) return { r: sorted[0].r, p: sorted[0].p };
  if (marks <= sorted[sorted.length - 1].m) return { r: sorted[sorted.length - 1].r, p: sorted[sorted.length - 1].p };
  for (let i = 0; i < sorted.length - 1; i++) {
    const hi = sorted[i], lo = sorted[i + 1];
    if (marks <= hi.m && marks >= lo.m) {
      const t = (hi.m - marks) / (hi.m - lo.m);
      return {
        r: Math.round(hi.r + t * (lo.r - hi.r)),
        p: parseFloat((hi.p + t * (lo.p - hi.p)).toFixed(2)),
      };
    }
  }
  return { r: sorted[sorted.length - 1].r, p: sorted[sorted.length - 1].p };
}

// ── Icons ──────────────────────────────────────────────────────────────────────
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

type HoverInfo = {
  x: number; y: number; marks: number;
  r26?: number; r25?: number;
  catR?: number; catP?: number;
} | null;
type ExamMode = "gate" | "cat";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MarksAIR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [mode, setMode] = useState<ExamMode>("gate");
  const [marks, setMarks] = useState(62);
  const [hover, setHover] = useState<HoverInfo>(null);

  const rank2026 = interpolateRank(GATE_2026, marks);
  const rank2025 = interpolateRank(GATE_2025, marks);
  const catResult = interpolateCAT(marks);

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg      = isDark ? "bg-[#171614]"     : "bg-[#f7f6f2]";
  const surface = isDark ? "bg-[#1c1b19]"     : "bg-[#f9f8f5]";
  const sfOff   = isDark ? "bg-[#1d1c1a]"     : "bg-[#f3f0ec]";
  const border  = isDark ? "border-[#393836]" : "border-[#d4d1ca]";
  const text    = isDark ? "text-[#cdccca]"   : "text-[#28251d]";
  const muted   = isDark ? "text-[#797876]"   : "text-[#7a7974]";

  const primary   = isDark ? "#4f98a3" : "#01696f";
  const accent2   = isDark ? "#fdab43" : "#964219";
  const accentCat = isDark ? "#a78bfa" : "#6d28d9";
  const accentCat2 = isDark ? "#f472b6" : "#be185d";

  const dot26  = isDark ? "bg-[#4f98a3]" : "bg-[#01696f]";
  const dot25  = isDark ? "bg-[#fdab43]" : "bg-[#964219]";

  const tooltipBg     = isDark ? "rgba(28,27,25,0.96)" : "rgba(249,248,245,0.96)";
  const tooltipBorder = isDark ? "rgba(57,56,54,0.7)"  : "rgba(212,209,202,0.7)";
  const tooltipText   = isDark ? "#cdccca" : "#28251d";
  const tooltipMuted  = isDark ? "#797876" : "#7a7974";

  // ── Build chart ───────────────────────────────────────────────────────────────
  const buildChart = useCallback(() => {
    if (!canvasRef.current) return;
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    const tickColor = isDark ? "#797876" : "#7a7974";

    chartRef.current?.destroy();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (mode === "gate") {
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "2026",
              data: GATE_2026.map((d) => ({ x: d.m, y: d.r })),
              borderColor: isDark ? "#4f98a3" : "#01696f",
              pointBackgroundColor: isDark ? "#4f98a3" : "#01696f",
              pointBorderColor: isDark ? "#1c1b19" : "#f9f8f5",
              pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
              borderWidth: 2.5, tension: 0.35, fill: false,
            },
            {
              label: "2025",
              data: GATE_2025.map((d) => ({ x: d.m, y: d.r })),
              borderColor: isDark ? "#fdab43" : "#964219",
              pointBackgroundColor: isDark ? "#fdab43" : "#964219",
              pointBorderColor: isDark ? "#1c1b19" : "#f9f8f5",
              pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
              borderWidth: 2.5, tension: 0.35, fill: false,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          hover: { mode: undefined },
          scales: {
            x: {
              type: "linear", min: 35, max: 100,
              title: { display: true, text: "Marks", color: tickColor },
              ticks: { color: tickColor, stepSize: 10 },
              grid: { color: gridColor }, border: { color: gridColor },
            },
            y: {
              type: "logarithmic", reverse: true, min: 1,
              title: { display: true, text: "AIR (Rank)", color: tickColor },
              ticks: {
                color: tickColor,
                callback: (val) => [1, 10, 100, 1000, 5000, 10000].includes(Number(val))
                  ? Number(val).toLocaleString() : "",
              },
              grid: { color: gridColor }, border: { color: gridColor },
            },
          },
        },
      });
    } else {
      // CAT: X = marks (15–150), Y = 100 - percentile (transformed so high %ile = top of chart)
      // We plot (100 - p) on Y so 100%ile is at the top, 50%ile at the bottom.
      // Ticks are relabelled back to real percentile values.
      const catSorted = [...CAT_DATA].sort((a, b) => a.m - b.m);

      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [{
            label: "CAT 2025",
            // y = 100 - p gives top = 100%ile (y=0), bottom = 50%ile (y=50)
            data: catSorted.map((d) => ({ x: d.m, y: 100 - d.p })),
            borderColor: isDark ? "#a78bfa" : "#6d28d9",
            pointBackgroundColor: isDark ? "#a78bfa" : "#6d28d9",
            pointBorderColor: isDark ? "#1c1b19" : "#f9f8f5",
            pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
            borderWidth: 2.5, tension: 0.35, fill: false,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          hover: { mode: undefined },
          scales: {
            x: {
              type: "linear", min: 15, max: 150,
              title: { display: true, text: "Marks", color: tickColor },
              ticks: { color: tickColor, stepSize: 15 },
              grid: { color: gridColor }, border: { color: gridColor },
            },
            y: {
              // y range: 0 (100%ile) to 52 (just below 50%ile)
              // REVERSED so low y-values (high percentile) appear at top
              type: "linear",
              min: 0,
              max: 52,
              reverse: false, // we handle direction via the transform
              title: { display: true, text: "Percentile", color: tickColor },
              ticks: {
                color: tickColor,
                // Show key percentile milestones — relabel from (100-p) back to p
                callback: (val) => {
                  const pctile = 100 - Number(val);
                  const milestones = [100, 99.99, 99.9, 99.5, 99, 98, 95, 90, 80, 70, 50];
                  const match = milestones.find((m) => Math.abs(m - pctile) < 0.06);
                  if (match !== undefined) {
                    return match === 100 ? "100%ile" : `${match}%ile`;
                  }
                  return "";
                },
              },
              grid: { color: gridColor }, border: { color: gridColor },
            },
          },
        },
      });
    }
  }, [isDark, mode]);

  useEffect(() => {
    buildChart();
    return () => { chartRef.current?.destroy(); };
  }, [buildChart]);

  useEffect(() => {
    setMarks(mode === "gate" ? 62 : 80);
    setHover(null);
  }, [mode]);

  // ── Pointer handlers ──────────────────────────────────────────────────────────
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const chart = chartRef.current;
    if (!chart) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xScale = chart.scales["x"];
    const yScale = chart.scales["y"];
    if (!xScale || !yScale) return;
    if (mouseX < xScale.left || mouseX > xScale.right || mouseY < yScale.top || mouseY > yScale.bottom) {
      setHover(null); return;
    }
    const marksAtCursor = xScale.getValueForPixel(mouseX) ?? 0;
    const tooltipWidth = 210;
    let tx = mouseX + 14;
    if (tx + tooltipWidth > rect.width) {
      tx = mouseX - tooltipWidth - 14;
      if (tx < 0) tx = (rect.width - tooltipWidth) / 2;
    }

    if (mode === "gate") {
      const c = Math.min(100, Math.max(35, marksAtCursor));
      setHover({ x: tx, y: Math.max(8, mouseY - 44), marks: c,
        r26: interpolateRank(GATE_2026, c),
        r25: interpolateRank(GATE_2025, c),
      });
    } else {
      const c = Math.min(145, Math.max(18, marksAtCursor));
      const { r, p } = interpolateCAT(c);
      setHover({ x: tx, y: Math.max(8, mouseY - 44), marks: c, catR: r, catP: p });
    }
  }, [mode]);

  const handlePointerLeave = useCallback(() => setHover(null), []);

  // ── Slider config ─────────────────────────────────────────────────────────────
  const sliderMin   = mode === "gate" ? 30  : 18;
  const sliderMax   = mode === "gate" ? 100 : 145;
  const sliderStep  = mode === "gate" ? 0.1 : 0.5;
  const sliderColor = mode === "gate" ? primary : accentCat;

  return (
    <div
      className={`${bg} ${text} min-h-[100dvh] flex flex-col p-4 sm:px-6 sm:py-8 transition-colors duration-300`}
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="w-full max-w-[1200px] mx-auto flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {mode === "gate" ? "GATE CSE" : "CAT 2025"} — Marks vs {mode === "gate" ? "AIR" : "Percentile"}
          </h1>
          <p className={`${muted} text-xs sm:text-sm mt-1.5`}>
            {mode === "gate"
              ? "2025 & 2026 cutoff comparison — estimate your rank."
              : "Score vs percentile — hover the chart to explore."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Exam toggle */}
          <div
            className={`${surface} ${border} border rounded-xl p-1 flex items-center gap-0.5`}
            role="group"
            aria-label="Exam selector"
          >
            {(["gate", "cat"] as ExamMode[]).map((m) => {
              const isActive = mode === m;
              const activeColor = m === "gate" ? primary : accentCat;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? activeColor + "1a" : "transparent",
                    color: isActive ? activeColor : isDark ? "#797876" : "#7a7974",
                    boxShadow: isActive ? `0 0 0 1px ${activeColor}44` : "none",
                  }}
                >
                  {m.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`${surface} ${border} border rounded-xl px-3 py-2 flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap hover:opacity-80 transition-all active:scale-95`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">Toggle theme</span>
          </button>
        </div>
      </header>

      <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-5 flex-1">

        {/* ── Chart card ── */}
        <div className={`flex-1 min-w-0 ${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col order-2 lg:order-1`}>
          {mode === "gate" ? (
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
          ) : (
            <div className="flex gap-4 sm:gap-5 mb-4 flex-wrap items-center">
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: accentCat }} />
                CAT 2025
              </div>
              <span className={`text-xs ${muted} ml-auto`}>↑ higher = better percentile</span>
            </div>
          )}

          <div
            className="relative flex-1 min-h-[280px] sm:min-h-[360px] cursor-crosshair touch-pan-y"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <canvas ref={canvasRef} />

            {/* ── Tooltip ── */}
            {hover && (
              <div
                className="pointer-events-none absolute z-20 text-sm shadow-xl backdrop-blur-sm"
                style={{
                  left: hover.x,
                  top: hover.y,
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipText,
                  minWidth: 210,
                  padding: "10px 14px",
                  borderRadius: "12px",
                  transition: "opacity 0.1s",
                }}
              >
                {/* Marks header row */}
                <div
                  className="flex items-center justify-between mb-2 pb-2"
                  style={{ borderBottom: `1px solid ${tooltipBorder}` }}
                >
                  <span style={{ color: tooltipMuted }} className="text-xs font-medium uppercase tracking-wide">Marks</span>
                  <span className="font-bold tabular-nums">{hover.marks.toFixed(2)}</span>
                </div>

                {mode === "gate" ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isDark ? "#4f98a3" : "#01696f" }} />
                        <span className="text-xs">2026 AIR</span>
                      </div>
                      <span className="font-semibold tabular-nums text-sm">~{hover.r26?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isDark ? "#fdab43" : "#964219" }} />
                        <span className="text-xs">2025 AIR</span>
                      </div>
                      <span className="font-semibold tabular-nums text-sm">~{hover.r25?.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accentCat }} />
                        <span className="text-xs">Percentile</span>
                      </div>
                      <span className="font-semibold tabular-nums text-sm">{hover.catP?.toFixed(2)}%ile</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accentCat2 }} />
                        <span className="text-xs">Rank</span>
                      </div>
                      <span className="font-semibold tabular-nums text-sm">~{hover.catR?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:w-[280px] shrink-0 flex flex-col gap-4 sm:gap-5 order-1 lg:order-2">

          <div className={`${surface} ${border} border rounded-2xl p-5 shadow-sm`}>
            <h2 className="text-sm sm:text-base font-bold mb-3">Estimate Your {mode === "gate" ? "Rank" : "Percentile"}</h2>
            <label className={`${muted} text-xs block mb-3`} htmlFor="marksSlider">
              Drag the slider to set marks
            </label>
            <input
              id="marksSlider"
              type="range"
              min={sliderMin} max={sliderMax} step={sliderStep}
              value={marks}
              onChange={(e) => setMarks(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: sliderColor }}
            />
            <div className="text-4xl sm:text-5xl font-bold tabular-nums text-center mt-5 mb-1 tracking-tight">
              {marks.toFixed(1)}
            </div>
            <p className={`text-xs text-center font-medium uppercase tracking-wider ${muted}`}>
              out of {mode === "gate" ? "100" : "198"}
            </p>
          </div>

          {/* Result cards */}
          {mode === "gate" ? (
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primary }}>
                  2026 Estimate
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                    ~{rank2026.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent2 }}>
                  2025 Estimate
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                    ~{rank2025.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentCat }}>
                  Percentile
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                    {catResult.p >= 100 ? "100" : catResult.p.toFixed(2)}
                    <span className="text-sm font-medium ml-0.5">%ile</span>
                  </span>
                </div>
              </div>
              <div className={`${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentCat2 }}>
                  Rank
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-3 sm:px-4 sm:py-4`}>
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                    ~{catResult.r.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
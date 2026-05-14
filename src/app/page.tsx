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
  { m: 46.27, r: 5331 }, { m: 39.47, r: 10770 }, { m: 36.54, r: 14568 },
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
  { m: 145.00, r: 1,      p: 100    },
  { m: 141.50, r: 3,      p: 100    },
  { m: 138.00, r: 5,      p: 100    },
  { m: 135.43, r: 8,      p: 100    },
  { m: 133.71, r: 10,     p: 100    },
  { m: 132.00, r: 12,     p: 100    },
  { m: 130.88, r: 15,     p: 100    },
  { m: 129.00, r: 20,     p: 100    },
  { m: 127.12, r: 25,     p: 99.99  },
  { m: 126.00, r: 28,     p: 99.99  },
  { m: 124.50, r: 35,     p: 99.99  },
  { m: 123.43, r: 40,     p: 99.99  },
  { m: 121.29, r: 50,     p: 99.98  },
  { m: 120.00, r: 56,     p: 99.98  },
  { m: 119.38, r: 70,     p: 99.98  },
  { m: 118.93, r: 80,     p: 99.97  },
  { m: 118.04, r: 100,    p: 99.96  },
  { m: 117.50, r: 112,    p: 99.96  },
  { m: 116.90, r: 130,    p: 99.95  },
  { m: 116.23, r: 150,    p: 99.95  },
  { m: 115.40, r: 175,    p: 99.94  },
  { m: 114.57, r: 200,    p: 99.93  },
  { m: 112.90, r: 250,    p: 99.91  },
  { m: 111.90, r: 280,    p: 99.90  },
  { m: 109.64, r: 350,    p: 99.88  },
  { m: 108.02, r: 400,    p: 99.86  },
  { m: 105.56, r: 476,    p: 99.83  },
  { m: 105.09, r: 500,    p: 99.82  },
  { m: 99.47,  r: 784,    p: 99.72  },
  { m: 96.73,  r: 1008,   p: 99.64  },
  { m: 93.19,  r: 1400,   p: 99.50  },
  { m: 91.73,  r: 1596,   p: 99.43  },
  { m: 89.93,  r: 1848,   p: 99.34  },
  { m: 84.64,  r: 2828,   p: 98.99  },
  { m: 84.26,  r: 2940,   p: 98.95  },
  { m: 83.49,  r: 3136,   p: 98.88  },
  { m: 82.13,  r: 3500,   p: 98.75  },
  { m: 80.72,  r: 3864,   p: 98.62  },
  { m: 80.33,  r: 3986,   p: 98.58  },
  { m: 80.24,  r: 4015,   p: 98.57  },
  { m: 80.14,  r: 4046,   p: 98.55  },
  { m: 80.05,  r: 4075,   p: 98.54  },
  { m: 79.97,  r: 4100,   p: 98.54  },
  { m: 79.85,  r: 4137,   p: 98.52  },
  { m: 79.78,  r: 4160,   p: 98.51  },
  { m: 79.70,  r: 4184,   p: 98.51  },
  { m: 79.63,  r: 4206,   p: 98.50  },
  { m: 79.52,  r: 4240,   p: 98.49  },
  { m: 79.46,  r: 4260,   p: 98.48  },
  { m: 79.37,  r: 4288,   p: 98.47  },
  { m: 79.31,  r: 4307,   p: 98.46  },
  { m: 79.22,  r: 4335,   p: 98.45  },
  { m: 79.11,  r: 4369,   p: 98.44  },
  { m: 79.01,  r: 4402,   p: 98.43  },
  { m: 78.94,  r: 4424,   p: 98.42  },
  { m: 78.91,  r: 4436,   p: 98.42  },
  { m: 75.98,  r: 5460,   p: 98.05  },
  { m: 73.65,  r: 6496,   p: 97.68  },
  { m: 71.75,  r: 7475,   p: 97.33  },
  { m: 71.68,  r: 7512,   p: 97.32  },
  { m: 71.59,  r: 7555,   p: 97.30  },
  { m: 71.52,  r: 7593,   p: 97.29  },
  { m: 71.45,  r: 7631,   p: 97.28  },
  { m: 71.37,  r: 7671,   p: 97.26  },
  { m: 71.28,  r: 7716,   p: 97.24  },
  { m: 71.17,  r: 7773,   p: 97.22  },
  { m: 71.11,  r: 7803,   p: 97.21  },
  { m: 71.04,  r: 7840,   p: 97.20  },
  { m: 69.96,  r: 8428,   p: 96.99  },
  { m: 68.71,  r: 9184,   p: 96.72  },
  { m: 67.65,  r: 9856,   p: 96.48  },
  { m: 64.93,  r: 11959,  p: 95.73  },
  { m: 64.86,  r: 12010,  p: 95.71  },
  { m: 64.79,  r: 12066,  p: 95.69  },
  { m: 64.72,  r: 12121,  p: 95.67  },
  { m: 64.64,  r: 12185,  p: 95.65  },
  { m: 62.29,  r: 14000,  p: 95.00  },
  { m: 60.98,  r: 15204,  p: 94.57  },
  { m: 59.79,  r: 16408,  p: 94.14  },
  { m: 58.08,  r: 18256,  p: 93.48  },
  { m: 57.08,  r: 19460,  p: 93.05  },
  { m: 54.69,  r: 22344,  p: 92.02  },
  { m: 52.53,  r: 25284,  p: 90.97  },
  { m: 51.91,  r: 26180,  p: 90.65  },
  { m: 49.99,  r: 29288,  p: 89.54  },
  { m: 49.88,  r: 29485,  p: 89.47  },
  { m: 45.16,  r: 38052,  p: 86.41  },
  { m: 44.91,  r: 38500,  p: 86.25  },
  { m: 44.47,  r: 39503,  p: 85.89  },
  { m: 40.53,  r: 48580,  p: 82.65  },
  { m: 37.64,  r: 56196,  p: 79.93  },
  { m: 37.23,  r: 57456,  p: 79.48  },
  { m: 29.91,  r: 81984,  p: 70.72  },
  { m: 18.00,  r: 140000, p: 50.00  },
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
  varcP?: number; dilrP?: number; qaP?: number;
} | null;
type ExamMode = "gate" | "cat";
type CatInputMode = "total" | "sections";

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MarksAIR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [mode, setMode] = useState<ExamMode>("gate");
  
  // Independent state for GATE & CAT
  const [gateMarks, setGateMarks] = useState(62);
  
  // CAT States
  const [catInputMode, setCatInputMode] = useState<CatInputMode>("sections");
  const [catTotalOnly, setCatTotalOnly] = useState(80);
  const [catScores, setCatScores] = useState({ varc: 27, dilr: 26, qa: 27 });
  
  const [hover, setHover] = useState<HoverInfo>(null);

  const currentCatTotal = catInputMode === "sections" 
    ? catScores.varc + catScores.dilr + catScores.qa 
    : catTotalOnly;

  const rank2026 = interpolateRank(GATE_2026, gateMarks);
  const rank2025 = interpolateRank(GATE_2025, gateMarks);
  
  const catResult = interpolateCAT(currentCatTotal);
  
  // UI Sectional Results
  const varcResult = interpolateCAT(catScores.varc * (204/72));
  const dilrResult = interpolateCAT(catScores.dilr * (204/66));
  const qaResult   = interpolateCAT(catScores.qa * (204/66));

  // Sync state between total and sections based on proportions
  const handleCatModeToggle = (newMode: CatInputMode) => {
    if (newMode === catInputMode) return;
    if (newMode === "total") {
      setCatTotalOnly(catScores.varc + catScores.dilr + catScores.qa);
    } else {
      const t = catTotalOnly;
      const varc = Math.round(t * (72 / 204));
      const dilr = Math.round(t * (66 / 204));
      const qa = t - varc - dilr; // remainder guarantees exact sum
      setCatScores({ varc, dilr, qa });
    }
    setCatInputMode(newMode);
  };

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg      = isDark ? "bg-[#171614]"     : "bg-[#f7f6f2]";
  const surface = isDark ? "bg-[#1c1b19]"     : "bg-[#ffffff]";
  const sfOff   = isDark ? "bg-[#232220]"     : "bg-[#f3f0ec]";
  const border  = isDark ? "border-[#393836]" : "border-[#e5e3db]";
  const text    = isDark ? "text-[#cdccca]"   : "text-[#28251d]";
  const muted   = isDark ? "text-[#797876]"   : "text-[#8a8880]";

  const primary   = isDark ? "#4f98a3" : "#01696f";
  const accent2   = isDark ? "#fdab43" : "#964219";
  const accentCat = isDark ? "#a78bfa" : "#8b5cf6";
  const accentCat2 = isDark ? "#f472b6" : "#ec4899";

  const dot26  = isDark ? "bg-[#4f98a3]" : "bg-[#01696f]";
  const dot25  = isDark ? "bg-[#fdab43]" : "bg-[#964219]";

  const tooltipBg     = isDark ? "rgba(28,27,25,0.96)" : "rgba(249,248,245,0.96)";
  const tooltipBorder = isDark ? "rgba(57,56,54,0.7)"  : "rgba(212,209,202,0.7)";
  const tooltipText   = isDark ? "#cdccca" : "#28251d";
  const tooltipMuted  = isDark ? "#797876" : "#7a7974";

  // Section Colors
  const varcColor = isDark ? "#60a5fa" : "#3b82f6";
  const dilrColor = isDark ? "#34d399" : "#10b981";
  const qaColor   = isDark ? "#fbbf24" : "#f59e0b";

  // ── Build chart ───────────────────────────────────────────────────────────────
  const buildChart = useCallback(() => {
    if (!canvasRef.current) return;
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    const tickColor = isDark ? "#797876" : "#7a7974";
    const pageBg    = isDark ? "#171614" : "#f7f6f2";

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
              pointBorderColor: isDark ? "#1c1b19" : "#ffffff",
              pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
              borderWidth: 2.5, tension: 0.35, fill: false,
              order: 1,
            },
            {
              label: "2025",
              data: GATE_2025.map((d) => ({ x: d.m, y: d.r })),
              borderColor: isDark ? "#fdab43" : "#964219",
              pointBackgroundColor: isDark ? "#fdab43" : "#964219",
              pointBorderColor: isDark ? "#1c1b19" : "#ffffff",
              pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
              borderWidth: 2.5, tension: 0.35, fill: false,
              order: 2,
            },
            {
              label: "Current",
              data: [],
              pointBackgroundColor: isDark ? "#4f98a3" : "#01696f",
              pointBorderColor: pageBg,
              pointBorderWidth: 3,
              pointRadius: 8,
              pointHoverRadius: 8,
              showLine: false,
              order: 0,
            }
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          hover: { mode: undefined },
          scales: {
            x: {
              type: "linear", min: 30, max: 100,
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
      const catSorted = [...CAT_DATA].sort((a, b) => a.m - b.m);
      const datasets: any[] = [
        {
          label: "Total Score",
          data: catSorted.map((d) => ({ x: d.m, y: 100 - d.p })),
          borderColor: isDark ? "#a78bfa" : "#8b5cf6",
          pointBackgroundColor: isDark ? "#a78bfa" : "#8b5cf6",
          pointBorderColor: isDark ? "#1c1b19" : "#ffffff",
          pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
          borderWidth: 2.5, tension: 0.35, fill: false,
          order: 1,
        }
      ];

      // Dynamically generate section lines based on total scaling 
      if (catInputMode === "sections") {
        const generateSectionData = (maxMarks: number) => {
          const d = [];
          for(let i=0; i<=maxMarks; i+=3) {
            d.push({ x: i, y: 100 - interpolateCAT(i * (204/maxMarks)).p });
          }
          return d;
        };

        datasets.push(
          {
            label: "VARC",
            data: generateSectionData(72),
            borderColor: varcColor,
            pointRadius: 0, pointHoverRadius: 0,
            borderWidth: 2, tension: 0.35, fill: false, borderDash: [4, 4],
            order: 2,
          },
          {
            label: "DILR",
            data: generateSectionData(66),
            borderColor: dilrColor,
            pointRadius: 0, pointHoverRadius: 0,
            borderWidth: 2, tension: 0.35, fill: false, borderDash: [4, 4],
            order: 3,
          },
          {
            label: "QA",
            data: generateSectionData(66),
            borderColor: qaColor,
            pointRadius: 0, pointHoverRadius: 0,
            borderWidth: 2, tension: 0.35, fill: false, borderDash: [4, 4],
            order: 4,
          }
        );
      }

      datasets.push({
        label: "Your Score",
        data: [],
        pointBackgroundColor: isDark ? "#f472b6" : "#ec4899",
        pointBorderColor: pageBg,
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 8,
        showLine: false,
        order: 0,
      });

      chartRef.current = new Chart(ctx, {
        type: "line",
        data: { datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          hover: { mode: undefined },
          scales: {
            x: {
              type: "linear", min: 0, max: 150,
              title: { display: true, text: "Marks", color: tickColor },
              ticks: { color: tickColor, stepSize: 25 },
              grid: { color: gridColor }, border: { color: gridColor },
            },
            y: {
              type: "linear", min: 0, max: 52, reverse: false, 
              title: { display: true, text: "Percentile", color: tickColor },
              ticks: {
                color: tickColor,
                callback: (val) => {
                  const pctile = 100 - Number(val);
                  const milestones = [100, 99.9, 99, 95, 90, 80, 70, 50];
                  const match = milestones.find((m) => Math.abs(m - pctile) < 0.1);
                  if (match !== undefined) return match === 100 ? "100%ile" : `${match}%ile`;
                  return "";
                },
              },
              grid: { color: gridColor }, border: { color: gridColor },
            },
          },
        },
      });
    }
  }, [isDark, mode, catInputMode]);

  useEffect(() => {
    buildChart();
    return () => { chartRef.current?.destroy(); };
  }, [buildChart]);

  // Handle Smooth Point Updates
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (mode === "gate" && chart.data.datasets.length >= 3) {
      chart.data.datasets[2].data = [{ x: gateMarks, y: interpolateRank(GATE_2026, gateMarks) }];
      chart.update('none'); 
    } else if (mode === "cat") {
      const visualX = Math.max(0, Math.min(currentCatTotal, 150));
      const userDatasetIndex = chart.data.datasets.findIndex(ds => ds.label === "Your Score");
      if (userDatasetIndex !== -1) {
        chart.data.datasets[userDatasetIndex].data = [{ x: visualX, y: 100 - interpolateCAT(currentCatTotal).p }];
        chart.update('none');
      }
    }
  }, [gateMarks, currentCatTotal, mode, catInputMode]);

  useEffect(() => {
    setHover(null);
  }, [mode, catInputMode]);

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
      const c = Math.min(100, Math.max(30, marksAtCursor));
      setHover({ x: tx, y: Math.max(8, mouseY - 44), marks: c,
        r26: interpolateRank(GATE_2026, c),
        r25: interpolateRank(GATE_2025, c),
      });
    } else {
      const c = Math.min(150, Math.max(0, marksAtCursor));
      const { r, p } = interpolateCAT(c);
      
      let varcP, dilrP, qaP;
      if (catInputMode === "sections") {
        if (c <= 72) varcP = interpolateCAT(c * (204/72)).p;
        if (c <= 66) dilrP = interpolateCAT(c * (204/66)).p;
        if (c <= 66) qaP = interpolateCAT(c * (204/66)).p;
      }
      
      setHover({ x: tx, y: Math.max(8, mouseY - 44), marks: c, catR: r, catP: p, varcP, dilrP, qaP });
    }
  }, [mode, catInputMode]);

  const handlePointerLeave = useCallback(() => setHover(null), []);

  return (
    <div
      className={`${bg} ${text} min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden flex flex-col p-4 sm:p-5 transition-colors duration-300`}
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="flex-none w-full max-w-[1200px] mx-auto flex justify-between items-start mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {mode === "gate" ? "GATE CSE" : "CAT 2025"} — Marks vs {mode === "gate" ? "AIR" : "Percentile"}
          </h1>
          <p className={`${muted} text-xs sm:text-sm mt-1`}>
            {mode === "gate"
              ? "2025 & 2026 cutoff comparison — estimate your rank."
              : "Score vs percentile — hover the chart to explore."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`${surface} ${border} border rounded-xl p-1 flex items-center gap-0.5 shadow-sm`}>
            {(["gate", "cat"] as ExamMode[]).map((m) => {
              const isActive = mode === m;
              const activeColor = m === "gate" ? primary : accentCat;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? activeColor + "1a" : "transparent",
                    color: isActive ? activeColor : muted,
                    boxShadow: isActive ? `0 0 0 1px ${activeColor}44` : "none",
                  }}
                >
                  {m.toUpperCase()}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsDark((d) => !d)}
            className={`${surface} ${border} border rounded-xl px-3 py-2 flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap hover:opacity-80 transition-all active:scale-95 shadow-sm`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="hidden sm:inline">Theme</span>
          </button>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-5 flex-1 min-h-0">

        {/* ── Chart card ── */}
        <div className={`flex-1 min-w-0 min-h-0 ${surface} ${border} border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col order-2 lg:order-1`}>
          {mode === "gate" ? (
            <div className="flex gap-4 sm:gap-5 mb-3 flex-wrap flex-none">
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
            <div className="flex gap-4 sm:gap-5 mb-3 flex-wrap items-center flex-none">
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: accentCat }} />
                Total %ile
              </div>
              {catInputMode === "sections" && (
                <>
                  <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                    <span className="w-3 h-1 rounded-full shrink-0" style={{ background: varcColor }} />
                    VARC
                  </div>
                  <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                    <span className="w-3 h-1 rounded-full shrink-0" style={{ background: dilrColor }} />
                    DILR
                  </div>
                  <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                    <span className="w-3 h-1 rounded-full shrink-0" style={{ background: qaColor }} />
                    QA
                  </div>
                </>
              )}
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${muted}`}>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: accentCat2 }} />
                Your Score Marker
              </div>
            </div>
          )}

          {/* Canvas container */}
          <div
            className="relative flex-1 min-h-[250px] lg:min-h-0 cursor-crosshair touch-pan-y"
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
                        <span className="text-xs">Total %ile</span>
                      </div>
                      <span className="font-semibold tabular-nums text-sm">{hover.catP?.toFixed(2)}%ile</span>
                    </div>
                    
                    {catInputMode === "sections" && (
                      <>
                        {hover.varcP !== undefined && (
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: varcColor }} />
                              <span className="text-xs">VARC %ile</span>
                            </div>
                            <span className="font-semibold tabular-nums text-sm">{hover.varcP.toFixed(2)}%ile</span>
                          </div>
                        )}
                        {hover.dilrP !== undefined && (
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dilrColor }} />
                              <span className="text-xs">DILR %ile</span>
                            </div>
                            <span className="font-semibold tabular-nums text-sm">{hover.dilrP.toFixed(2)}%ile</span>
                          </div>
                        )}
                        {hover.qaP !== undefined && (
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: qaColor }} />
                              <span className="text-xs">QA %ile</span>
                            </div>
                            <span className="font-semibold tabular-nums text-sm">{hover.qaP.toFixed(2)}%ile</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center justify-between gap-6 pt-1 mt-0.5 border-t" style={{ borderColor: tooltipBorder }}>
                      <div className="flex items-center gap-2" style={{ color: tooltipMuted }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accentCat2 }} />
                        <span className="text-xs">Overall Rank</span>
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
        <div className="lg:w-[300px] shrink-0 flex flex-col gap-3 sm:gap-4 order-1 lg:order-2 overflow-y-auto lg:overflow-visible">

          {mode === "gate" ? (
            <div className={`${surface} ${border} border rounded-2xl p-4 shadow-sm`}>
              <h2 className="text-sm font-bold mb-2">Estimate Your Rank</h2>
              <label className={`${muted} text-xs block mb-3`} htmlFor="marksSlider">
                Drag the slider to set marks
              </label>
              <input
                id="marksSlider"
                type="range"
                min={30} max={100} step={0.1}
                value={gateMarks}
                onChange={(e) => setGateMarks(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: primary }}
              />
              <div className="text-4xl sm:text-5xl font-bold tabular-nums text-center mt-4 mb-1 tracking-tight">
                {gateMarks.toFixed(1)}
              </div>
              <p className={`text-[10px] text-center font-medium uppercase tracking-wider ${muted}`}>
                out of 100
              </p>
            </div>
          ) : (
            <div className={`${surface} ${border} border rounded-2xl p-4 shadow-sm flex flex-col`}>
              
              {/* Premium Header & Toggle */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold">Your Score</h2>
                <div className={`flex items-center p-0.5 rounded-lg border ${border} ${sfOff}`}>
                  <button
                    onClick={() => handleCatModeToggle("total")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${catInputMode === "total" ? `${surface} shadow-sm text-[${accentCat}]` : muted}`}
                  >
                    Total
                  </button>
                  <button
                    onClick={() => handleCatModeToggle("sections")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${catInputMode === "sections" ? `${surface} shadow-sm text-[${accentCat}]` : muted}`}
                  >
                    Sections
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {catInputMode === "total" ? (
                  <div className={`p-3.5 rounded-xl border ${border} ${sfOff}`}>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: accentCat }}>Total Marks</label>
                      <span className="text-sm font-bold tabular-nums">{catTotalOnly} <span className={`text-[10px] font-medium opacity-60 ${muted}`}>/ 204</span></span>
                    </div>
                    <input
                      type="range" min={0} max={204} step={1}
                      value={catTotalOnly}
                      onChange={(e) => setCatTotalOnly(parseInt(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: accentCat }}
                    />
                  </div>
                ) : (
                  <>
                    {/* VARC Glass Slider */}
                    <div className="p-3 rounded-xl border" style={{ borderColor: `${varcColor}33`, backgroundColor: `${varcColor}0d` }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: varcColor }}>VARC</label>
                        <span className="text-sm font-bold tabular-nums" style={{ color: text }}>{catScores.varc} <span className="text-[10px] font-medium opacity-50">/ 72</span></span>
                      </div>
                      <input
                        type="range" min={0} max={72} step={1}
                        value={catScores.varc}
                        onChange={(e) => setCatScores(prev => ({ ...prev, varc: parseInt(e.target.value) }))}
                        className="w-full cursor-pointer"
                        style={{ accentColor: varcColor }}
                      />
                    </div>

                    {/* DILR Glass Slider */}
                    <div className="p-3 rounded-xl border" style={{ borderColor: `${dilrColor}33`, backgroundColor: `${dilrColor}0d` }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dilrColor }}>DILR</label>
                        <span className="text-sm font-bold tabular-nums" style={{ color: text }}>{catScores.dilr} <span className="text-[10px] font-medium opacity-50">/ 66</span></span>
                      </div>
                      <input
                        type="range" min={0} max={66} step={1}
                        value={catScores.dilr}
                        onChange={(e) => setCatScores(prev => ({ ...prev, dilr: parseInt(e.target.value) }))}
                        className="w-full cursor-pointer"
                        style={{ accentColor: dilrColor }}
                      />
                    </div>

                    {/* QA Glass Slider */}
                    <div className="p-3 rounded-xl border" style={{ borderColor: `${qaColor}33`, backgroundColor: `${qaColor}0d` }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: qaColor }}>QA</label>
                        <span className="text-sm font-bold tabular-nums" style={{ color: text }}>{catScores.qa} <span className="text-[10px] font-medium opacity-50">/ 66</span></span>
                      </div>
                      <input
                        type="range" min={0} max={66} step={1}
                        value={catScores.qa}
                        onChange={(e) => setCatScores(prev => ({ ...prev, qa: parseInt(e.target.value) }))}
                        className="w-full cursor-pointer"
                        style={{ accentColor: qaColor }}
                      />
                    </div>

                    {/* 4th Slider: Master Total Control */}
                    <div className="mt-2 pt-3 border-t" style={{ borderColor: border }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accentCat2 }}>Master Total</label>
                        <span className="text-sm font-bold tabular-nums">{currentCatTotal} <span className={`text-[10px] font-medium opacity-60 ${muted}`}>/ 204</span></span>
                      </div>
                      <input
                        type="range" min={0} max={204} step={1}
                        value={currentCatTotal}
                        onChange={(e) => {
                          const t = parseInt(e.target.value);
                          const varc = Math.round(t * (72 / 204));
                          const dilr = Math.round(t * (66 / 204));
                          const qa = t - varc - dilr;
                          setCatScores({ varc, dilr, qa });
                        }}
                        className="w-full cursor-pointer"
                        style={{ accentColor: accentCat2 }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Premium Result Dashboard */}
          {mode === "gate" ? (
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className={`${surface} ${border} border rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>
                  2026 Estimate
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-2 sm:px-4 sm:py-3`}>
                  <span className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                    ~{rank2026.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className={`${surface} ${border} border rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col justify-between`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent2 }}>
                  2025 Estimate
                </p>
                <div className={`${sfOff} ${border} border rounded-xl px-3 py-2 sm:px-4 sm:py-3`}>
                  <span className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                    ~{rank2025.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Top Row: Total Percentile & Rank */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`${surface} ${border} border rounded-2xl p-4 shadow-sm flex flex-col items-start justify-center`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: accentCat }}>
                    Total %ile
                  </p>
                  <span className="text-2xl font-bold tabular-nums tracking-tight">
                    {catResult.p >= 100 ? "100" : catResult.p.toFixed(2)}
                    <span className="text-xs font-medium ml-0.5 opacity-60">%ile</span>
                  </span>
                </div>
                <div className={`${surface} ${border} border rounded-2xl p-4 shadow-sm flex flex-col items-start justify-center`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: accentCat2 }}>
                    Overall Rank
                  </p>
                  <span className="text-2xl font-bold tabular-nums tracking-tight">
                    ~{catResult.r.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Sectional Cards (Visible only in Sections mode) */}
              {catInputMode === "sections" && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border p-2.5 flex flex-col items-center justify-center shadow-sm" style={{ borderColor: `${varcColor}33`, backgroundColor: `${varcColor}0a` }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: varcColor }}>VARC</span>
                    <span className="text-sm font-bold tabular-nums">{varcResult.p >= 100 ? "100" : varcResult.p.toFixed(2)}</span>
                  </div>
                  <div className="rounded-xl border p-2.5 flex flex-col items-center justify-center shadow-sm" style={{ borderColor: `${dilrColor}33`, backgroundColor: `${dilrColor}0a` }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: dilrColor }}>DILR</span>
                    <span className="text-sm font-bold tabular-nums">{dilrResult.p >= 100 ? "100" : dilrResult.p.toFixed(2)}</span>
                  </div>
                  <div className="rounded-xl border p-2.5 flex flex-col items-center justify-center shadow-sm" style={{ borderColor: `${qaColor}33`, backgroundColor: `${qaColor}0a` }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: qaColor }}>QA</span>
                    <span className="text-sm font-bold tabular-nums">{qaResult.p >= 100 ? "100" : qaResult.p.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
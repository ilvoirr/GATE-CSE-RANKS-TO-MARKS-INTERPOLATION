# GATE CSE Marks vs AIR Interpolation

This application provides an interactive visualization of GATE CSE (Computer Science Engineering) marks versus AIR (All India Rank) data. The data is gathered from online sources and represents actual student results.

## 🚀 Live Demo
**Try it now**: https://gate-cse-ranks-to-marks-interpolati.vercel.app/

## Features

- **Interactive Chart**: Compare 2025 and 2026 GATE CSE cutoffs with a logarithmic scale
- **Rank Estimation**: Use the slider to estimate your AIR for any marks value
- **Real-time Interpolation**: Get instant rank estimates as you adjust marks
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Hover Tooltips**: Detailed information when hovering over the chart

## How It Works

The application uses interpolation algorithms to estimate ranks between known data points. The chart displays:
- X-axis: Marks (30-100)
- Y-axis: AIR Rank (logarithmic scale, inverted so Rank 1 is at top)
- Two datasets: 2025 and 2026 GATE CSE results

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Source

The marks and rank data is collected from publicly available GATE results and student discussions online. This is for estimation purposes only - actual ranks may vary based on various factors.

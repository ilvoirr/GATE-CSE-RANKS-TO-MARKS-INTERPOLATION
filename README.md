# GATE CSE & CAT 2025 Marks vs Rank Interpolation

This application provides interactive visualization of marks versus rank data for GATE CSE and CAT 2025 exams. The data is gathered from online sources and represents actual student results, helping aspirants estimate their ranks and percentiles based on their performance.

## 🚀 Live Demo
**Try it now**: https://gate-cse-ranks-to-marks-interpolati.vercel.app/

## Features

- **GATE CSE Analysis**: Interactive chart comparing 2025 and 2026 GATE CSE marks vs AIR
- **CAT 2025 Analysis**: Marks to rank and percentile interpolation for CAT 2025 exam
- **Real-time Interpolation**: Get instant rank/percentile estimates as you adjust marks
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Hover Tooltips**: Detailed information when hovering over the chart

## How It Works

The application uses interpolation algorithms to estimate ranks and percentiles between known data points:

- **GATE CSE**: X-axis shows marks (30-100), Y-axis shows AIR Rank (logarithmic scale)
- **CAT 2025**: Scaled score to rank and percentile interpolation based on actual CAT 2025 data

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Source

The marks and rank data is collected from publicly available GATE and CAT 2025 results online. This is for estimation purposes only - actual ranks/percentiles may vary based on various factors.

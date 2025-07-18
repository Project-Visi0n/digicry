
import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";

import ShapeGallery from "./Breathing/ShapeGallery";
import BreathControl from "./Breathing/BreathControl";

const INITIAL_SHAPES = [
  { name: "Circle", path: "M50,25 a25,25 0 1,0 0.00001,0" },
  { name: "Cross", path: "M20,50 L80,50 M50,20 L50,80" },
  { name: "Ellipse", path: "M75,50a25,15 0 1,1-50,0a25,15 0 1,1 50,0" },
  {
    name: "Isocube",
    path: "M30,70 L70,70 L70,30 L30,30 Z M30,30 L50,10 L70,30 M70,70 L50,90 L30,70 M50,10 L50,90",
  },
  { name: "Kite", path: "M50,10 L90,50 L50,90 L10,50 Z" },
  { name: "Lens", path: "M30,50 A20,20 0 0,1 70,50 A20,20 0 0,1 30,50" },
  { name: "Line", path: "M20,80 L80,20" },
  { name: "Omino", path: "M30,30 h40 v40 h-40 Z M50,30 v40" },
  { name: "Polygon", path: "M50,15 L85,85 L15,85 Z" },
  { name: "Polygram", path: "M50,15 L61,85 L15,35 H85 L39,85 Z" },
  { name: "Polyline", path: "M10,90 L30,10 L50,90 L70,10 L90,90" },
  {
    name: "RadialLines",
    path: "M50,10 L50,90 M10,50 L90,50 M20,20 L80,80 M80,20 L20,80",
  },
  { name: "Rect", path: "M20,30 h60 v40 h-60 Z" },
  { name: "RegPolygon", path: "M50,10 L90,35 L73,80 L27,80 L10,35 Z" },
  {
    name: "RoundedRect",
    path: "M30,30 h40 a10,10 0 0,1 10,10 v20 a10,10 0 0,1 -10,10 h-40 a10,10 0 0,1 -10,-10 v-20 a10,10 0 0,1 10,-10 Z",
  },
  {
    name: "RoundedSquare",
    path: "M30,30 h40 a10,10 0 0,1 10,10 v20 a10,10 0 0,1 -10,10 h-40 a10,10 0 0,1 -10,-10 v-20 a10,10 0 0,1 10,-10 Z",
  },
  { name: "Sector", path: "M50,50 L50,10 A40,40 0 0,1 90,50 Z" },
  { name: "Segment", path: "M50,50 L90,50 A40,40 0 0,0 50,10 Z" },
  { name: "Square", path: "M30,30 h40 v40 h-40 Z" },
  {
    name: "Star",
    path: "M50,15 L61,35 L85,39 L67,57 L71,81 L50,70 L29,81 L33,57 L15,39 L39,35 Z",
  },
  { name: "SymH", path: "M20,50 h60 M50,20 v60" },
  { name: "SymI", path: "M50,20 v60" },
  { name: "SymV", path: "M50,20 v60 M20,50 h60" },
  { name: "SymX", path: "M20,20 L80,80 M80,20 L20,80" },
  { name: "Triangle", path: "M50,15 L85,85 L15,85 Z" },
];

export default function Breathe() {
  // Store in seconds for UI, convert to ms for BreathControl
  const [durationSec, setDurationSec] = useState(2);
  const [holdSec, setHoldSec] = useState(1);
  const [paused, setPaused] = useState(false);
  const [startPath, setStartPath] = useState(INITIAL_SHAPES[0].path);
  const [endPath, setEndPath] = useState(INITIAL_SHAPES[1].path);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        marginTop: 40,
      }}
    >
      <h2>Breathe</h2>

      {/* Shape selection menus */}
      <div
        style={{
          width: 420,
          margin: "0 auto 16px auto",
          padding: 12,
          border: "2px solid #ccc",
          borderRadius: 12,
          background: "#fafbfc",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Start Shape</div>
        <div
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "4px 0 12px 0",
            border: "1px solid #eee",
            borderRadius: 8,
            background: "#fff",
            marginBottom: 8,
          }}
        >
          <ShapeGallery
            shapes={INITIAL_SHAPES}
            onSelect={setStartPath}
            selectedPath={startPath}
          />
        </div>
        <div style={{ margin: "16px 0 8px 0", fontWeight: 600 }}>End Shape</div>
        <div
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "4px 0 12px 0",
            border: "1px solid #eee",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          <ShapeGallery
            shapes={INITIAL_SHAPES}
            onSelect={setEndPath}
            selectedPath={endPath}
          />
        </div>
      </div>

      <div style={{ width: 320, margin: "24px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <span>Animation Duration: {durationSec.toFixed(1)} s</span>
          <Slider
            min={0.5}
            max={6}
            step={0.1}
            value={durationSec}
            onChange={(_, v) => setDurationSec(Number(v))}
            valueLabelDisplay="auto"
            sx={{ color: "var(--mint)" }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <span>Hold Time: {holdSec.toFixed(1)} s</span>
          <Slider
            min={0}
            max={4}
            step={0.1}
            value={holdSec}
            onChange={(_, v) => setHoldSec(Number(v))}
            valueLabelDisplay="auto"
            sx={{ color: "var(--pink)" }}
          />
        </div>
        <Button
          variant="contained"
          onClick={() => setPaused((p) => !p)}
          sx={{
            background: paused ? "var(--mint)" : "var(--pink)",
            color: "#333",
          }}
        >
          {paused ? "Start" : "Pause"}
        </Button>
      </div>
      <BreathControl
        duration={Math.round(durationSec * 1000)}
        hold={Math.round(holdSec * 1000)}
        paused={paused}
        startPath={startPath}
        endPath={endPath}
        key={[paused, durationSec, holdSec, startPath, endPath].join("-")}
      />
    </div>
  );
}

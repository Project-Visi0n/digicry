
import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import BreathControl from "../../../BreathControl";

export default function Breathe() {
  // Store in seconds for UI, convert to ms for BreathControl
  const [durationSec, setDurationSec] = useState(2);
  const [holdSec, setHoldSec] = useState(1);
  const [paused, setPaused] = useState(false);

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
        key={paused + '-' + durationSec + '-' + holdSec}
      />
    </div>
  );
}

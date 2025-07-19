import React, { useRef, useEffect, useState } from "react";
import { interpolate } from "flubber";

import PropTypes from "prop-types";


// Safe polyfill for requestAnimationFrame/cancelAnimationFrame for SSR/Node
function requestAnimationFrameSafe(cb) {
  if (typeof window !== "undefined" && window.requestAnimationFrame) return window.requestAnimationFrame(cb);
  if (typeof global !== "undefined" && global.requestAnimationFrame) return global.requestAnimationFrame(cb);
  return setTimeout(cb, 16);
}
function cancelAnimationFrameSafe(id) {
  if (typeof window !== "undefined" && window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
  if (typeof global !== "undefined" && global.cancelAnimationFrame) return global.cancelAnimationFrame(id);
  return clearTimeout(id);
}

export default function BreathControl({
  duration = 2000,
  hold = 1000,
  paused = false,
  startPath,
  endPath,
}) {
  // Support multi-path shapes: extract the main path for morphing, but render all paths
  const getMainPath = (shape) => {
    if (Array.isArray(shape)) {
      // Use the first path's d for morphing
      return shape[0] && shape[0].d ? shape[0].d : "";
    }
    return shape;
  };
  const [t, setT] = useState(0); // 0: start, 1: end
  const [reversed, setReversed] = useState(false);
  const [phase, setPhase] = useState("morphing"); // 'morphing' or 'holding'
  const requestRef = useRef();
  const startRef = useRef();
  const holdTimeout = useRef();

  useEffect(() => {
    if (paused) {
      cancelAnimationFrameSafe(requestRef.current);
      clearTimeout(holdTimeout.current);
      return;
    }

    function animate(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      let progress = Math.min(elapsed / duration, 1);
      if (reversed) progress = 1 - progress;
      setT(progress);
      if (elapsed < duration) {
        requestRef.current = requestAnimationFrameSafe(animate);
      } else {
        setT(reversed ? 0 : 1);
        setPhase("holding");
      }
    }

    if (phase === "morphing") {
      requestRef.current = requestAnimationFrameSafe(animate);
    } else if (phase === "holding") {
      holdTimeout.current = setTimeout(() => {
        setReversed((r) => !r);
        setPhase("morphing");
        startRef.current = null;
      }, hold);
    }

    return () => {
      cancelAnimationFrameSafe(requestRef.current);
      clearTimeout(holdTimeout.current);
    };
  }, [reversed, duration, hold, paused, phase]);

  // Create a flubber interpolator between startPath and endPath (main path only)
  const interpolator = interpolate(getMainPath(startPath), getMainPath(endPath), {
    maxSegmentLength: 2,
  });
  // Get the current SVG path for the morph, based on t (progress)
  const d = interpolator(t);


  // Interpolate between two hex colors (a, b) by tt (0-1)
  // Used to smoothly transition the fill color as the shape morphs
  function lerpColor(a, b, tt) {
    const ah = a.replace("#", "");
    const bh = b.replace("#", "");
    const ar = parseInt(ah.substring(0, 2), 16);
    const ag = parseInt(ah.substring(2, 4), 16);
    const ab = parseInt(ah.substring(4, 6), 16);
    const br = parseInt(bh.substring(0, 2), 16);
    const bg = parseInt(bh.substring(2, 4), 16);
    const bb = parseInt(bh.substring(4, 6), 16);
    const rr = Math.round(ar + (br - ar) * tt);
    const rg = Math.round(ag + (bg - ag) * tt);
    const rb = Math.round(ab + (bb - ab) * tt);
    return `rgb(${rr},${rg},${rb})`;
  }


  // Define start and end colors for morph
  // These should match the CSS variables
  const mint = "#B8F2E6";
  const pink = "#FFA69E";
  // Interpolated fill color for current morph progress
  const fill = lerpColor(mint, pink, t);

  // Render the animated SVG
  // If either shape is multi-path, render all paths on top of the morphing outline
  const renderExtraPaths = (shape) => {
    if (!Array.isArray(shape)) return null;
    // Skip the first path (used for morphing)
    return shape.slice(1).map((p, i) => (
      <path
        key={p.d + (p.fill || "") + (p.stroke || "")}
        d={p.d}
        fill={p.fill || "none"}
        stroke={p.stroke || "#333"}
        strokeWidth={p.stroke === "none" ? 0 : 2}
      />
    ));
  };

  return (
    <div
      style={{
        width: 400,
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        background: "rgba(255,255,255,0.18)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1.5px solid rgba(255,255,255,0.35)",
        outline: "1px solid rgba(184,242,230,0.25)",
        transition: "box-shadow 0.2s",
        margin: "0 auto"
      }}
    >
      <svg
        width="340"
        height="340"
        viewBox="0 0 100 100"
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Add margin and center the shape with a group transform */}
        <g transform="translate(10,10) scale(0.8)">
          {/* Morphing outline (face) */}
          <path d={d} fill={fill} fillOpacity={0.85} />
          {/* Extra features for start/end shape */}
          {renderExtraPaths(startPath)}
          {renderExtraPaths(endPath)}
        </g>
      </svg>
    </div>
  );
}

BreathControl.propTypes = {
  duration: PropTypes.number.isRequired,
  hold: PropTypes.number.isRequired,
  paused: PropTypes.bool.isRequired,
  startPath: PropTypes.string.isRequired,
  endPath: PropTypes.string.isRequired,
};


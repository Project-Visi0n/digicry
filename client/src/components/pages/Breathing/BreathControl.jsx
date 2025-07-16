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

  // Create a flubber interpolator between startPath and endPath
  // This function returns a path string for any t between 0 (start) and 1 (end)
  const interpolator = interpolate(startPath, endPath, {
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
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 100 100"
      style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
    >
      {/* Add margin and center the shape with a group transform */}
      <g transform="translate(10,10) scale(0.8)">
        <path d={d} fill={fill} fillOpacity={0.85} />
      </g>
    </svg>
  );
}

BreathControl.propTypes = {
  duration: PropTypes.number.isRequired,
  hold: PropTypes.number.isRequired,
  paused: PropTypes.bool.isRequired,
  startPath: PropTypes.string.isRequired,
  endPath: PropTypes.string.isRequired,
};


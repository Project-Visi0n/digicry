// Polyfill for globalThis if not defined (for older environments)
// eslint-disable-next-line no-var
const getGlobal = () => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  return this;
};
const globalCtx = getGlobal();

import React, { useRef, useEffect, useState } from "react";
import { interpolate } from "flubber";

const trianglePath =
  "M 15.9405 9.31846 L 16.5015 10.2858 L 17.0625 11.2531 L 17.6234 12.2204 L 18.1844 13.1878 L 18.7453 14.1551 L 19.3063 15.1224 L 19.8673 16.0898 L 20.4282 17.0571 L 20.9892 18.0244 L 21.5502 18.9917 L 22.1111 19.9591 L 22.6721 20.9264 L 23.2331 21.8937 L 23.794 22.8611 L 24.355 23.8284 L 24.916 24.7957 L 25.4769 25.763 L 26.0379 26.7304 L 26.5989 27.6977 L 27.1598 28.665 L 27.7208 29.6324 L 28.2818 30.5997 L 28.8427 31.567 L 29.4037 32.5343 L 29.9647 33.5017 L 30.5256 34.469 L 31.0866 35.4363 L 31.6476 36.4037 L 32.2085 37.371 L 32.7695 38.3383 L 33.3305 39.3056 L 33.8914 40.273 L 32.7732 40.2751 L 31.655 40.2773 L 30.5368 40.2794 L 29.4186 40.2816 L 28.3004 40.2837 L 27.1821 40.2858 L 26.0639 40.288 L 24.9457 40.2901 L 23.8275 40.2923 L 22.7093 40.2944 L 21.5911 40.2966 L 20.4729 40.2987 L 19.3546 40.3009 L 18.2364 40.303 L 17.1182 40.3052 L 16 40.3073 L 14.8818 40.3095 L 13.7636 40.3116 L 12.6454 40.3137 L 11.5271 40.3159 L 10.4089 40.318 L 9.29072 40.3202 L 8.1725 40.3223 L 7.05429 40.3245 L 5.93608 40.3266 L 4.81786 40.3288 L 3.69965 40.3309 L 2.58144 40.3331 L 1.46322 40.3352 L 0.345008 40.3374 L -0.773206 40.3395 L -1.89142 40.3417 L -1.33417 39.3722 L -0.776923 38.4027 L -0.219675 37.4332 L 0.337573 36.4638 L 0.894821 35.4943 L 1.45207 34.5248 L 2.00932 33.5553 L 2.56657 32.5859 L 3.12381 31.6164 L 3.68106 30.6469 L 4.23831 29.6774 L 4.79556 28.708 L 5.35281 27.7385 L 5.91005 26.769 L 6.4673 25.7995 L 7.02455 24.8301 L 7.5818 23.8606 L 8.13905 22.8911 L 8.69629 21.9216 L 9.25354 20.9522 L 9.81079 19.9827 L 10.368 19.0132 L 10.9253 18.0437 L 11.4825 17.0743 L 12.0398 16.1048 L 12.597 15.1353 L 13.1543 14.1658 L 13.7115 13.1964 L 14.2688 12.2269 L 14.826 11.2574 L 15.3833 10.2879 Z";
const circlePath =
  "M 29.3829 16.6543 A 13.4027 13.4027 0 0 1 29.3184 17.968 A 13.4027 13.4027 0 0 1 29.1254 19.269 A 13.4027 13.4027 0 0 1 28.8058 20.5449 A 13.4027 13.4027 0 0 1 28.3627 21.7833 A 13.4027 13.4027 0 0 1 27.8003 22.9723 A 13.4027 13.4027 0 0 1 27.1242 24.1004 A 13.4027 13.4027 0 0 1 26.3407 25.1568 A 13.4027 13.4027 0 0 1 25.4574 26.1314 A 13.4027 13.4027 0 0 1 24.4828 27.0147 A 13.4027 13.4027 0 0 1 23.4264 27.7982 A 13.4027 13.4027 0 0 1 22.2982 28.4744 A 13.4027 13.4027 0 0 1 21.1093 29.0367 A 13.4027 13.4027 0 0 1 19.8709 29.4799 A 13.4027 13.4027 0 0 1 18.595 29.7995 A 13.4027 13.4027 0 0 1 17.294 29.9925 A 13.4027 13.4027 0 0 1 15.9802 30.057 A 13.4027 13.4027 0 0 1 14.6665 29.9925 A 13.4027 13.4027 0 0 1 13.3654 29.7995 A 13.4027 13.4027 0 0 1 12.0896 29.4799 A 13.4027 13.4027 0 0 1 10.8512 29.0368 A 13.4027 13.4027 0 0 1 9.66219 28.4744 A 13.4027 13.4027 0 0 1 8.53405 27.7983 A 13.4027 13.4027 0 0 1 7.47761 27.0148 A 13.4027 13.4027 0 0 1 6.50305 26.1315 A 13.4027 13.4027 0 0 1 5.61977 25.1569 A 13.4027 13.4027 0 0 1 4.83626 24.1005 A 13.4027 13.4027 0 0 1 4.16006 22.9724 A 13.4027 13.4027 0 0 1 3.5977 21.7834 A 13.4027 13.4027 0 0 1 3.15459 20.545 A 13.4027 13.4027 0 0 1 2.83499 19.2691 A 13.4027 13.4027 0 0 1 2.642 17.9681 A 13.4027 13.4027 0 0 1 2.57745 16.6543 A 13.4027 13.4027 0 0 1 2.64198 15.3406 A 13.4027 13.4027 0 0 1 2.83498 14.0395 A 13.4027 13.4027 0 0 1 3.15456 12.7637 A 13.4027 13.4027 0 0 1 3.59766 11.5253 A 13.4027 13.4027 0 0 1 4.16001 10.3363 A 13.4027 13.4027 0 0 1 4.83619 9.20815 A 13.4027 13.4027 0 0 1 5.61969 8.15172 A 13.4027 13.4027 0 0 1 6.50298 7.17715 A 13.4027 13.4027 0 0 1 7.47752 6.29387 A 13.4027 13.4027 0 0 1 8.53395 5.51036 A 13.4027 13.4027 0 0 1 9.6621 4.83417 A 13.4027 13.4027 0 0 1 10.8511 4.2718 A 13.4027 13.4027 0 0 1 12.0895 3.82869 A 13.4027 13.4027 0 0 1 13.3653 3.5091 A 13.4027 13.4027 0 0 1 14.6664 3.3161 A 13.4027 13.4027 0 0 1 15.9802 3.25155 A 13.4027 13.4027 0 0 1 17.2939 3.31609 A 13.4027 13.4027 0 0 1 18.5949 3.50908 A 13.4027 13.4027 0 0 1 19.8708 3.82866 A 13.4027 13.4027 0 0 1 21.1092 4.27176 A 13.4027 13.4027 0 0 1 22.2982 4.83412 A 13.4027 13.4027 0 0 1 23.4263 5.5103 A 13.4027 13.4027 0 0 1 24.4827 6.2938 A 13.4027 13.4027 0 0 1 25.4573 7.17708 A 13.4027 13.4027 0 0 1 26.3406 8.15163 A 13.4027 13.4027 0 0 1 27.1241 9.20806 A 13.4027 13.4027 0 0 1 27.8003 10.3362 A 13.4027 13.4027 0 0 1 28.3626 11.5252 A 13.4027 13.4027 0 0 1 28.8058 12.7636 A 13.4027 13.4027 0 0 1 29.1254 14.0394 A 13.4027 13.4027 0 0 1 29.3184 15.3405 A 13.4027 13.4027 0 0 1 29.3829 16.6543 Z";

// duration: ms for morph, hold: ms to pause on each shape, paused: bool
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line react/prop-types

export default function BreathControl({
  duration = 2000,
  hold = 1000,
  paused = false,
}) {
  const [t, setT] = useState(0); // 0: triangle, 1: circle
  const [reversed, setReversed] = useState(false);
  const [phase, setPhase] = useState("morphing"); // 'morphing' or 'holding'
  const requestRef = useRef();
  const startRef = useRef();
  const holdTimeout = useRef();

  useEffect(() => {
    if (paused) {
      if (typeof globalCtx.cancelAnimationFrame === "function") {
        globalCtx.cancelAnimationFrame(requestRef.current);
      }
      clearTimeout(holdTimeout.current);
      return;
    }

    if (phase === "morphing") {
      // Define the animation function
      function animate(now) {
        // If this is the first frame, set the start time
        if (!startRef.current) startRef.current = now;
        // Calculate how much time has passed since animation started
        const elapsed = now - startRef.current;
        // Calculate progress (0 to 1) based on elapsed time and duration
        let progress = Math.min(elapsed / duration, 1);
        // If reversed, invert the progress (for morphing back)
        if (reversed) progress = 1 - progress;
        // Update the morph progress state
        setT(progress);
        // If animation is not finished
        if (elapsed < duration) {
          // Request the next animation frame
          if (typeof globalCtx.requestAnimationFrame === "function") {
            requestRef.current = globalCtx.requestAnimationFrame(animate);
          }
        } else {
          // If animation is finished, snap to end shape and switch to holding phase
          setT(reversed ? 0 : 1);
          setPhase("holding");
        }
      }
      // Start the animation loop
      if (typeof globalCtx.requestAnimationFrame === "function") {
        requestRef.current = globalCtx.requestAnimationFrame(animate);
      }
    } else if (phase === "holding") {
      // If in holding phase, set a timeout to pause before morphing again
      holdTimeout.current = setTimeout(() => {
        // Reverse the morph direction
        setReversed((r) => !r);
        // Switch back to morphing phase
        setPhase("morphing");
        // Reset the start time for the next morph
        startRef.current = null;
      }, hold);
    }

    // Cleanup function for useEffect
    return () => {
      // Cancel any ongoing animation frame
      if (typeof globalCtx.cancelAnimationFrame === "function") {
        globalCtx.cancelAnimationFrame(requestRef.current);
      }
      // Clear the hold timeout
      clearTimeout(holdTimeout.current);
    };
  }, [reversed, duration, hold, paused, phase]);


  // Create a flubber interpolator between triangle and circle
  // This function returns a path string for any t between 0 (triangle) and 1 (circle)
  const interpolator = interpolate(trianglePath, circlePath, {
    maxSegmentLength: 2,
  });
  // Get the current SVG path for the morph, based on t (progress)
  const d = interpolator(t);


  // Interpolate between two hex colors (a, b) by tt (0-1)
  // Used to smoothly transition the fill color as the shape morphs
  function lerpColor(a, b, tt) {
    // Remove # from hex
    const ah = a.replace("#", "");
    const bh = b.replace("#", "");
    // Parse RGB components for both colors
    const ar = parseInt(ah.substring(0, 2), 16);
    const ag = parseInt(ah.substring(2, 4), 16);
    const ab = parseInt(ah.substring(4, 6), 16);
    const br = parseInt(bh.substring(0, 2), 16);
    const bg = parseInt(bh.substring(2, 4), 16);
    const bb = parseInt(bh.substring(4, 6), 16);
    // Linear interpolate each channel
    const rr = Math.round(ar + (br - ar) * tt);
    const rg = Math.round(ag + (bg - ag) * tt);
    const rb = Math.round(ab + (bb - ab) * tt);
    // Return as rgb string
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
      width="500"
      height="500"
      viewBox="0 0 40 40"
      style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
    >
      {/* Animated morphing path */}
      <path d={d} fill={fill} fillOpacity={0.85} />
    </svg>
  );
}

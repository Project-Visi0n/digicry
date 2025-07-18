import React from "react";
import PropTypes from "prop-types";

// Renders a horizontal scrollable gallery of SVG shapes
export default function ShapeGallery({ shapes, onSelect, selectedPath }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
      {shapes.map((shape) => (
        <button
          type="button"
          key={shape.name}
          onClick={() => onSelect(shape.path)}
          style={{
            border:
              selectedPath === shape.path
                ? "2px solid var(--mint, #B8F2E6)"
                : "1px solid #ccc",
            borderRadius: 8,
            background: selectedPath === shape.path ? "#f0fffd" : "#fff",
            padding: 4,
            cursor: "pointer",
            outline: "none",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: selectedPath === shape.path ? "0 0 0 2px #B8F2E6" : "none",
            transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
          }}
          aria-label={shape.name}
        >
          <svg
            width={40}
            height={40}
            viewBox="0 0 100 100"
            style={{ display: "block" }}
          >
            <g transform="translate(10,10) scale(0.8)">
              {Array.isArray(shape.path)
                ? shape.path.map((p) => (
                    <path
                      key={p.d + (p.fill || "") + (p.stroke || "")}
                      d={p.d}
                      fill={p.fill || "none"}
                      stroke={p.stroke || "#333"}
                      strokeWidth={p.stroke === "none" ? 0 : 2}
                    />
                  ))
                : (
                    <path
                      d={shape.path}
                      fill="#eee"
                      stroke="#333"
                      strokeWidth={2}
                    />
                  )}
            </g>
          </svg>
        </button>
      ))}
    </div>
  );
}

ShapeGallery.propTypes = {
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedPath: PropTypes.string.isRequired,
};


import React from "react";

export default function ShapeGallery({ shapes, onSelect, selectedPath }) {
  return (
    <div style={{
      display: "flex",
      overflowX: "auto",
      padding: "1rem 0",
      gap: "1rem",
      borderBottom: "1px solid #eee"
    }}>
      {shapes.map((shape, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(shape.path)}
          style={{
            border: shape.path === selectedPath ? "2px solid #FFA69E" : "2px solid transparent",
            borderRadius: 8,
            cursor: "pointer",
            background: "#fff",
            boxShadow: "0 1px 4px #0001",
            padding: 4,
            minWidth: 60,
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <svg width="48" height="48" viewBox="0 0 40 40">
            <path d={shape.path} fill="#B8F2E6" stroke="#333" />
          </svg>
        </div>
      ))}
    </div>
  );
}

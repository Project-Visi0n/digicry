// ...existing code...
import React, { useState, useEffect, useContext } from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ShapeGallery from "./ShapeGallery";
import BreathControl from "./BreathControl";
import { AuthContext } from "../../../context/AuthContext";

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
  { name: "Triangle", path: "M50,15 L85,85 L15,85 Z" } 
];

function Breathe() {
  const { user } = useContext(AuthContext);
  const [favorite, setFavorite] = useState(null);
  const [favoriteCombos, setFavoriteCombos] = useState([]);

  // Fetch favorite shape combos for this user
  const fetchFavorites = () => {
    if (!user || !user._id) return;
    fetch(`/api/favorites/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFavorite(data[0]);
          setFavoriteCombos(data);
        } else {
          setFavorite(null);
          setFavoriteCombos([]);
        }
      })
      .catch(() => {
        setFavorite(null);
        setFavoriteCombos([]);
      });
  };
  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const [durationSec, setDurationSec] = useState(4);
  const [holdSec, setHoldSec] = useState(1);
  const [paused, setPaused] = useState(false);
  const [startPath, setStartPath] = useState(INITIAL_SHAPES[0].path);
  const [endPath, setEndPath] = useState(INITIAL_SHAPES[1].path);

  // Save favorite shape combo handler (stub)
  const handleSaveFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user && user._id, startPath, endPath }),
      });
      if (res.ok) {
        fetchFavorites();
        // alert("Favorite saved!");
      } else {
        // alert("Failed to save favorite");
      }
    } catch (err) {
      // alert("Error saving favorite");
    }
  };
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
      {/* Main area: sliders (left), breathing shape (center), shape galleries (right) */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          margin: "24px 0",
        }}
      >
        {/* Sliders and pause/save controls (left) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: 24,
          }}
        >
          <div
            style={{
              height: 320,
              display: "flex",
              flexDirection: "row",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ marginBottom: 8 }}>Duration</span>
              <Slider
                orientation="vertical"
                min={0.5}
                max={6}
                step={0.1}
                value={durationSec}
                onChange={(_, v) => setDurationSec(Number(v))}
                valueLabelDisplay="auto"
                sx={{ color: "var(--mint)", height: 200 }}
              />
              <span style={{ marginTop: 8 }}>{durationSec.toFixed(1)} s</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ marginBottom: 8 }}>Hold</span>
              <Slider
                orientation="vertical"
                min={0}
                max={4}
                step={0.1}
                value={holdSec}
                onChange={(_, v) => setHoldSec(Number(v))}
                valueLabelDisplay="auto"
                sx={{ color: "var(--pink)", height: 200 }}
              />
              <span style={{ marginTop: 8 }}>{holdSec.toFixed(1)} s</span>
            </div>
          </div>
          <Button
            variant="contained"
            onClick={() => setPaused((p) => !p)}
            sx={{
              background: paused ? "var(--mint)" : "var(--pink)",
              color: "#333",
              marginTop: 16,
            }}
          >
            {paused ? "Start" : "Pause"}
          </Button>
        </div>
        {/* Morphing shape (center) */}
        <div style={{ margin: "0 32px" }}>
          <BreathControl
            duration={Math.round(durationSec * 1000)}
            hold={Math.round(holdSec * 1000)}
            paused={paused}
            startPath={startPath}
            endPath={endPath}
            key={[paused, durationSec, holdSec, startPath, endPath].join("-")}
          />
        </div>
        {/* Shape galleries stacked vertically to the right of shape and Save button below */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 32,
            minWidth: 400,
            minHeight: 600,
            width: 400,
            height: 600,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 360,
              height: 560,
              padding: 20,
              borderRadius: 24,
              background: "rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              outline: "1px solid rgba(184, 242, 230, 0.25)",
              transition: "box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              overflowY: "auto",
              overflowX: "hidden",
              gap: 24,
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Start Shape</div>
            <div
              style={{
                width: "100%",
                height: 260,
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                padding: "20px 0 20px 0",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 12,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 20,
              }}
            >
              <ShapeGallery
                shapes={INITIAL_SHAPES}
                onSelect={setStartPath}
                selectedPath={startPath}
              />
            </div>
            <div style={{ margin: "16px 0 8px 0", fontWeight: 600 }}>
              End Shape
            </div>
            <div
              style={{
                width: "100%",
                height: 260,
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                padding: "20px 0 20px 0",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 12,
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 20,
              }}
            >
              <ShapeGallery
                shapes={INITIAL_SHAPES}
                onSelect={setEndPath}
                selectedPath={endPath}
              />
            </div>
          </div>
          {/* Favorite Shape Combo Preview Box */}
          {favorite && (
            <div
              style={{
                marginTop: 18,
                width: 360,
                minHeight: 60,
                borderRadius: 16,
                background: "rgba(255,255,255,0.22)",
                boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                padding: 12,
                gap: 24,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, marginBottom: 2 }}>Favorite Start</div>
                <svg width="48" height="48" viewBox="0 0 100 100">
                  <path d={favorite.startShapePath} fill="#B8F2E6" fillOpacity="0.7" />
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, marginBottom: 2 }}>Favorite End</div>
                <svg width="48" height="48" viewBox="0 0 100 100">
                  <path d={favorite.endShapePath} fill="#FFA69E" fillOpacity="0.7" />
                </svg>
              </div>
            </div>
          )}
          {/* Favorite Shape Combos List Box (always visible) */}
          <div
            style={{
              marginTop: 16,
              width: 360,
              maxHeight: 120,
              overflowY: "auto",
              borderRadius: 16,
              background: "rgba(255,255,255,0.18)",
              boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: 10,
              justifyContent: favoriteCombos.length === 0 ? "center" : "flex-start",
            }}
          >
            {favoriteCombos.length === 0 ? (
              <span style={{ color: "#888", fontSize: 15 }}>No favorites yet</span>
            ) : (
              favoriteCombos.map((combo, idx) => (
                <div
                  key={combo._id || idx}
                  role="button"
                  tabIndex={0}
                  aria-label="Recall this favorite shape combo"
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    borderRadius: 8,
                    transition: "border 0.2s",
                  }}
                  onClick={() => {
                    setStartPath(combo.startShapePath);
                    setEndPath(combo.endShapePath);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setStartPath(combo.startShapePath);
                      setEndPath(combo.endShapePath);
                    }
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.border = "2px solid #B8F2E6";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "2px solid #B8F2E6";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.border = "2px solid transparent";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "2px solid transparent";
                  }}
                  title="Click to use this combo"
                >
                  {/* Combined SVG path for start+end */}
                  <svg width="48" height="48" viewBox="0 0 100 100">
                    <path
                      d={combo.startShapePath}
                      fill="#B8F2E6"
                      fillOpacity="0.7"
                    />
                    <path
                      d={combo.endShapePath}
                      fill="#FFA69E"
                      fillOpacity="0.7"
                    />
                  </svg>
                </div>
              ))
            )}
          </div>
          {/* Save Favorite Shapes button below the gallery */}
          <Button
            variant="outlined"
            onClick={handleSaveFavorite}
            sx={{ marginTop: 18, width: 360 }}
          >
            Save Favorite Shapes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Breathe;

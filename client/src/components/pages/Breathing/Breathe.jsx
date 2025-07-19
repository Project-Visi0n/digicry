// ...existing code...
import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import ShapeGallery from "./ShapeGallery";
import BreathControl from "./BreathControl";
import { AuthContext } from "../../../context/AuthContext";



function Breathe() {
  const { user } = useContext(AuthContext);
  const [favoriteCombos, setFavoriteCombos] = useState([]);
  const [shapes, setShapes] = useState([]);

  // Fetch favorite shape combos for this user
  const fetchFavorites = () => {
    if (!user || !user._id) return;
    fetch(`/api/favorites/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFavoriteCombos(data);
        } else {
          setFavoriteCombos([]);
        }
      })
      .catch(() => {
        setFavoriteCombos([]);
      });
  };

  // Fetch shapes from backend on mount
  useEffect(() => {
    fetchFavorites();
    fetch("/api/shapes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setShapes(data);
        } else {
          setShapes([]);
        }
      })
      .catch(() => setShapes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [durationSec, setDurationSec] = useState(4);
  const [holdSec, setHoldSec] = useState(1);
  const [paused, setPaused] = useState(false);
  const [startPath, setStartPath] = useState("");
  const [endPath, setEndPath] = useState("");

  // Set initial start/end path when shapes are loaded
  useEffect(() => {
    if (shapes.length > 1) {
      setStartPath(shapes[0].path);
      setEndPath(shapes[1].path);
    }
  }, [shapes]);

  // Modal state for edit and delete confirmation
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // favorite combo to edit
  const [pendingEdit, setPendingEdit] = useState(null); // {startPath, endPath, combo}
  const [deleteTarget, setDeleteTarget] = useState(null); // favorite combo to delete

  // Save favorite shape combo handler (only if not editing)
  const handleSaveFavorite = async () => {
    if (editTarget) {
      // In edit mode, open modal for PATCH
      setPendingEdit({ startPath, endPath, combo: editTarget });
      setEditModalOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user && user._id, startPath, endPath }),
      });
      if (res.ok) {
        fetchFavorites();
      } else {
        // alert("Failed to save favorite");
      }
    } catch (err) {
      // alert("Error saving favorite");
    }
  };

  // DELETE favorite shape combo
  const handleDeleteFavorite = async (comboId) => {
    try {
      const res = await fetch(`/api/favorites/${comboId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchFavorites();
      } else {
        // alert("Failed to delete favorite");
      }
    } catch (err) {
      // alert("Error deleting favorite");
    }
  };

  // PATCH favorite shape combo
  const handlePatchFavorite = async (comboId, newStartPath, newEndPath) => {
    try {
      const res = await fetch(`/api/favorites/${comboId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startPath: newStartPath, endPath: newEndPath }),
      });
      if (res.ok) {
        fetchFavorites();
      } else {
        // alert("Failed to update favorite");
      }
    } catch (err) {
      // alert("Error updating favorite");
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
          {startPath && endPath ? (
            <BreathControl
              duration={Math.round(durationSec * 1000)}
              hold={Math.round(holdSec * 1000)}
              paused={paused}
              startPath={startPath}
              endPath={endPath}
              key={[paused, durationSec, holdSec, startPath, endPath].join("-")}
            />
          ) : (
            <div style={{ width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              Loading shapes...
            </div>
          )}
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
                shapes={shapes}
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
                shapes={shapes}
                onSelect={setEndPath}
                selectedPath={endPath}
              />
            </div>
          </div>
          {/* Favorites List Box (single, horizontal, with label) */}
          <div style={{ marginTop: 18, width: 360 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 16 }}>
              Favorites
            </div>
            <div
              style={{
                width: "100%",
                minHeight: 60,
                maxHeight: 120,
                overflowX: "auto",
                overflowY: "hidden",
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
                whiteSpace: "nowrap",
              }}
            >
              {favoriteCombos.length === 0 ? (
                <span style={{ color: "#888", fontSize: 15 }}>
                  No favorites yet
                </span>
              ) : (
                favoriteCombos.map((combo, idx) => (
                  <div
                    key={combo._id || idx}
                    style={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Recall this favorite shape combo"
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        border:
                          editTarget && editTarget._id === combo._id
                            ? "2px solid #FFA69E"
                            : "2px solid transparent",
                        borderRadius: 8,
                        transition: "border 0.2s",
                        display: "inline-block",
                        outline:
                          editTarget && editTarget._id === combo._id
                            ? "2px solid #FFA69E"
                            : undefined,
                      }}
                      onClick={() => {
                        if (editTarget && editTarget._id === combo._id) {
                          setPendingEdit({ startPath, endPath, combo });
                          setEditModalOpen(true);
                        } else if (editTarget) {
                          setEditTarget(combo);
                        } else {
                          setStartPath(combo.startShapePath);
                          setEndPath(combo.endShapePath);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (editTarget && editTarget._id === combo._id) {
                            setPendingEdit({ startPath, endPath, combo });
                            setEditModalOpen(true);
                          } else if (editTarget) {
                            setEditTarget(combo);
                          } else {
                            setStartPath(combo.startShapePath);
                            setEndPath(combo.endShapePath);
                          }
                        }
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.border = "2px solid #B8F2E6";
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border = "2px solid #B8F2E6";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.border =
                          editTarget && editTarget._id === combo._id
                            ? "2px solid #FFA69E"
                            : "2px solid transparent";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border =
                          editTarget && editTarget._id === combo._id
                            ? "2px solid #FFA69E"
                            : "2px solid transparent";
                      }}
                      title={
                        editTarget && editTarget._id === combo._id
                          ? "Click to confirm edit"
                          : editTarget
                          ? "Click to select for editing"
                          : "Click to use this combo"
                      }
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
                    {/* Delete button for each favorite */}
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{
                        marginTop: 0.5,
                        fontSize: 10,
                        minWidth: 0,
                        padding: "2px 8px",
                      }}
                      onClick={() => {
                        setDeleteTarget(combo);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
            {/* Edit Favorite Button */}
            <Button
              variant="outlined"
              sx={{ marginTop: 10, width: 360 }}
              onClick={() => setEditTarget(editTarget ? null : { _id: null })}
              disabled={favoriteCombos.length === 0}
            >
              {editTarget ? "Cancel Edit" : "Edit Favorite"}
            </Button>
            {/* If editTarget is set (edit mode), show instructions */}
            {editTarget && (
              <div style={{ marginTop: 8, color: "#888", fontSize: 14 }}>
                {editTarget._id
                  ? "Click the favorite above again to confirm editing it with the current shapes."
                  : "Click a favorite above to select it for editing."}
              </div>
            )}
          </div>
          {/* Edit Confirmation Modal */}
          <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>Edit Favorite</DialogTitle>
            <DialogContent>
              Your favorite will now be changed. Are you sure?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditTarget(null);
                  setPendingEdit(null);
                }}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  if (pendingEdit && pendingEdit.combo) {
                    handlePatchFavorite(
                      pendingEdit.combo._id,
                      pendingEdit.startPath,
                      pendingEdit.endPath,
                    );
                  }
                  setEditModalOpen(false);
                  setEditTarget(null);
                  setPendingEdit(null);
                }}
                variant="contained"
                color="primary"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          {/* Delete Confirmation Modal */}
          <Dialog
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          >
            <DialogTitle>Delete Favorite</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this favorite?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  if (deleteTarget && deleteTarget._id) {
                    handleDeleteFavorite(deleteTarget._id);
                  }
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                variant="contained"
                color="error"
              >
                Yes, Delete
              </Button>
            </DialogActions>
          </Dialog>
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

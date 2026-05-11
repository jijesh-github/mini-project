import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

const CanvasEditor = ({ onCanvasReady, templateJson }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
    });

    fabricCanvasRef.current = canvas;

    // Fix 2: Enable Editing Mode on Click
    canvas.on("mouse:dblclick", function (e) {
      const obj = e.target;
      if (obj && (obj.type === "i-text" || obj.type === "text" || obj.type === "textbox")) {
        canvas.setActiveObject(obj);
        if (obj.enterEditing) {
          obj.enterEditing();
          obj.selectAll();
        }
      }
    });

    // Fix 6: Exit Editing Mode
    canvas.on("editing:exited", () => {
      canvas.requestRenderAll();
    });

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    return () => {
      // Cleanup event listeners
      canvas.off("mouse:dblclick");
      canvas.off("editing:exited");
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Function to apply responsive scaling (Fix 1)
  const applyScaling = () => {
    const container = containerRef.current;
    const canvas = fabricCanvasRef.current;
    if (!container || !canvas || !templateJson) return;

    let json;
    try {
      json = typeof templateJson === "string" ? JSON.parse(templateJson) : templateJson;
    } catch { return; }

    const containerWidth = container.clientWidth - 40; 
    const containerHeight = container.clientHeight - 40;

    const baseWidth = json.width || 800; // Base size for posters
    const baseHeight = json.height || 500;

    // Calculate scale
    const scaleX = containerWidth / baseWidth;
    const scaleY = containerHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    // Apply scaling
    canvas.setDimensions({
      width: baseWidth * scale,
      height: baseHeight * scale
    });
    canvas.setZoom(scale);
    canvas.requestRenderAll();
  };

  // Update canvas when templateJson changes
  useEffect(() => {
    if (fabricCanvasRef.current && templateJson) {
      try {
        // Deep clone to avoid mutating external state
        const jsonStr = typeof templateJson === "string" ? templateJson : JSON.stringify(templateJson);
        const json = JSON.parse(jsonStr);
        
        // Convert text types to i-text BEFORE loading, so Fabric instantiates the correct IText classes!
        if (json && json.objects) {
          json.objects.forEach(obj => {
            if (obj.type === "text") {
              obj.type = "i-text";
            }
          });
        }

        const canvas = fabricCanvasRef.current;
        const canvasWidth = json.width || 800;

        canvas.loadFromJSON(json).then(() => {
          
          canvas.getObjects().forEach(obj => {
            if (obj.type === "text" || obj.type === "i-text" || obj.type === "textbox") {
              obj.set({ 
                selectable: true, 
                editable: true,
                hasControls: true,
                hasBorders: true
              });
            } else {
              obj.set({ selectable: false });
            }
          });

          // Fix 4: After loadFromJSON, call renderAll and re-apply zoom
          applyScaling();
          canvas.renderAll();
        }).catch(err => console.error("Fabric loadFromJSON error:", err));
      } catch (err) {
        console.error("Error parsing/loading Fabric JSON:", err);
      }
    }
  }, [templateJson]);

  // Fix 2: Add a ResizeObserver to re-apply the zoom scale whenever the container resizes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      applyScaling();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [templateJson]);

  // Fix 5: Canvas wrapper div styling
  return (
    <div ref={containerRef} style={{
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%"
    }} className="bg-slate-900/50 rounded-2xl border border-white/5 relative">
      <div className="shadow-2xl shadow-black/40 rounded-sm">
         <canvas id="canvas" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;

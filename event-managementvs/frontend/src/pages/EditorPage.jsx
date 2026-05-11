import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Send, Download, Settings2, HelpCircle, Layers } from "lucide-react";
import CanvasEditor from "../components/CanvasEditor";
import Toolbar from "../components/Toolbar";
import axios from "axios";

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [revision, setRevision] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState(null);
  const [prompt, setPrompt] = useState("");

  // 1. Fetch template data on load
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/templates/${id}`);
        console.log("Template API Response:", response.data);
        setTemplate(response.data);
      } catch (err) {
        console.error("Failed to fetch template:", err);
      }
    };
    if (id) fetchTemplate();
  }, [id]);

  const onCanvasReady = (fabricCanvas) => {
    setCanvas(fabricCanvas);

    fabricCanvas.on("selection:created", (e) => { setActiveObject(e.selected[0]); setRevision(r => r+1); });
    fabricCanvas.on("selection:updated", (e) => { setActiveObject(e.selected[0]); setRevision(r => r+1); });
    fabricCanvas.on("selection:cleared", () => { setActiveObject(null); setRevision(r => r+1); });
    fabricCanvas.on("object:modified", () => { setRevision(r => r+1); });
  };

  // Fix 5: Fix Toolbar Controls
  const handleAction = useCallback((type, value) => {
    if (!canvas || !activeObject) return;

    // IMPORTANT: Only text objects should be editable via toolbar
    const isText = activeObject.type === "text" || activeObject.type === "i-text" || activeObject.type === "textbox";
    if (!isText) return;

    if (type === "bold") {
        activeObject.set(
          "fontWeight", 
          activeObject.fontWeight === "bold" ? "normal" : "bold"
        );
    } else if (type === "italic") {
        activeObject.set(
          "fontStyle", 
          activeObject.fontStyle === "italic" ? "normal" : "italic"
        );
    } else if (type === "fontSize") {
        // Adjust for relative increase/decrease
        activeObject.set("fontSize", activeObject.fontSize + value);
    } else if (type === "color") {
        activeObject.set("fill", value);
    } else if (type === "fontFamily") {
        activeObject.set("fontFamily", value);
    }

    canvas.renderAll();
    canvas.requestRenderAll();
    // Force re-render of component to update Toolbar UI
    setActiveObject(canvas.getActiveObject ? canvas.getActiveObject() : null);
    setRevision(r => r + 1);
  }, [canvas, activeObject]);

  const applyContent = (data) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    console.log("Canvas Objects:", objects);
    console.log("Incoming Data:", data);

    objects.forEach(obj => {
      const type = (obj.customType || obj.get?.("customType") || "").toLowerCase();
      
      if (!type) {
        console.warn("Missing customType:", obj);
      }

      if (type === "title") {
        obj.set({ text: data.title || "" });
      } else if (type === "description") {
        obj.set({ text: data.description || "" });
      } else if (type === "date") {
        obj.set({ text: data.date || "" });
      }
    });

    canvas.requestRenderAll();
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate-content", {
        prompt: prompt
      });
      
      const parsed = typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
        
      applyContent(parsed);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `event-design-${id}.png`;
    link.click();
  };

  return (
    <div className="h-screen pt-16 flex overflow-hidden">
      {/* Left Panel: Inputs */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[400px] border-r border-white/10 glass p-8 flex flex-col gap-8 z-10"
      >
        <div className="flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
             Design Settings <Settings2 className="w-4 h-4 text-white/40" />
           </h2>
           <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
             <HelpCircle className="w-5 h-5" />
           </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-indigo-400">Event Details</label>
            <textarea
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your event details or description here... (e.g. A hackathon called InnovateTech on March 20th at the Main Auditorium)"
            />
            <p className="text-[10px] text-white/20 italic">AI will automatically extract title, description, and date.</p>
          </div>

          <button
            onClick={generateContent}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              isGenerating ? "bg-indigo-500/20 text-indigo-300 cursor-not-allowed" : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
            }`}
          >
            {isGenerating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isGenerating ? "Generating..." : "Generate AI Content"}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex items-center gap-2 text-white/20 text-xs font-medium mb-4">
                <Layers className="w-4 h-4" /> RECENT LAYERS
             </div>
             <div className="space-y-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-full h-12 bg-white/5 rounded-lg border border-white/5 animate-pulse" />
                ))}
             </div>
        </div>
      </motion.div>

      {/* Main Panel: Canvas */}
      <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
        {/* Top Toolbar Area */}
        <div className="h-20 flex items-center justify-between px-12 z-20">
            <div className="flex items-center gap-4">
                <Toolbar activeObject={activeObject} onAction={handleAction} />
            </div>

            <div className="flex items-center gap-3">
                <button className="p-3 glass rounded-xl border-white/5 text-white/60 hover:text-white transition-colors">
                    <Send className="w-5 h-5" />
                </button>
                <button 
                  onClick={downloadCanvas}
                  className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl"
                >
                    <Download className="w-5 h-5" />
                    Download PNG
                </button>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-auto custom-scrollbar">
           <CanvasEditor 
              onCanvasReady={onCanvasReady} 
              templateJson={template?.fabric_json} 
           />
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-6 right-6 p-3 glass rounded-full border-white/5 text-white/20 text-[10px] tracking-widest font-black uppercase">
            Fabric.js v7.2 Preview Engine
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

import React from "react";
import { Bold, Italic, Type, Palette, Type as TypeIcon, Minus, Plus } from "lucide-react";

const Toolbar = ({ onAction, activeObject }) => {
  const isText = activeObject && (activeObject.type === "text" || activeObject.type === "i-text" || activeObject.type === "textbox");

  if (!isText) {
    return (
      <div className="flex items-center gap-4 px-6 h-14 glass rounded-xl border-white/5 opacity-40 cursor-not-allowed">
        <p className="text-sm text-white/40">Select a text object to edit styles</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 h-14 glass rounded-xl border-white/10 shadow-lg animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center gap-1 pr-4 border-right-white/10 border-r">
        <button
          onClick={() => onAction("bold")}
          className={`p-2 rounded-lg transition-colors ${activeObject.fontWeight === "bold" ? "bg-indigo-500 text-white" : "text-white/60 hover:bg-white/5"}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
           onClick={() => onAction("italic")}
          className={`p-2 rounded-lg transition-colors ${activeObject.fontStyle === "italic" ? "bg-indigo-500 text-white" : "text-white/60 hover:bg-white/5"}`}
        >
          <Italic className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pr-4 border-right-white/10 border-r">
        <button onClick={() => onAction("fontSize", -2)} className="p-2 rounded-lg text-white/60 hover:bg-white/5">
          <Minus className="w-3 h-3" />
        </button>
        <div className="w-10 text-center text-sm font-bold text-white">
          {Math.round(activeObject.fontSize)}
        </div>
        <button onClick={() => onAction("fontSize", 2)} className="p-2 rounded-lg text-white/60 hover:bg-white/5">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-lg text-white/60 hover:bg-white/5 transition-colors">
            <Palette className="w-4 h-4" />
            <div
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: typeof activeObject.fill === 'string' ? activeObject.fill : '#fff' }}
            />
          </button>
          
           {/* Color Picker simplified */}
           <div className="absolute top-12 left-0 hidden group-hover:block z-50 p-2 glass rounded-xl border-white/10 grid grid-cols-4 gap-1">
            {["#ffffff", "#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#a855f7"].map(c => (
              <button
                key={c}
                onClick={() => onAction("color", c)}
                className="w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
           </div>
        </div>

        <select
          onChange={(e) => onAction("fontFamily", e.target.value)}
          value={activeObject.fontFamily}
          className="bg-transparent text-sm text-white border-none focus:ring-0 outline-none cursor-pointer hover:bg-white/5 rounded-lg p-1"
        >
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Serif">Serif</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;

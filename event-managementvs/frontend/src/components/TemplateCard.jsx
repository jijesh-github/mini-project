import React from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";

const TemplateCard = ({ template, onClick, isSelected }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative glass rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
        isSelected ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "border-white/5 hover:border-white/20"
      }`}
      onClick={onClick}
    >
      <div className="aspect-[4/5] bg-slate-800 overflow-hidden relative">
        {/* Full Image */}
        <img
          src={template.previewUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400"}
          alt={template.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="w-full">
            <h4 className="text-white font-bold text-lg mb-1">{template.name}</h4>
            <p className="text-white/60 text-xs">Click to Customize</p>
          </div>
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white border-2 border-white shadow-lg">
            <Check className="w-5 h-5" />
          </div>
        )}

        {/* Hover Action Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-indigo-500/90 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
             <Plus className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;

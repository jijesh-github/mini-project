import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Card = ({ title, description, icon: Icon, onClick, color = "indigo" }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    blue: "from-blue-500 to-blue-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-full glass p-6 rounded-2xl border-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden shadow-2xl"
      onClick={onClick}
    >
      {/* Background glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-linear-to-br ${colorMap[color]} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

      <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${colorMap[color]} flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20`}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold text-white/40 group-hover:text-white transition-colors mt-auto">
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

export default Card;

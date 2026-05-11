import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { Image, Mail, Play, FileText, Sparkles } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Poster Generator",
      description: "Create stunning event posters with AI-powered content and beautiful templates.",
      icon: Image,
      route: "/posters",
      color: "indigo",
    },
    {
      title: "Invitation Generator",
      description: "Personalize event invitations with ease. Perfect for weddings, meetups, and more.",
      icon: Mail,
      route: "/invitations",
      color: "purple",
    },
    {
      title: "AI Reel Generator",
      description: "Generate stunning promotional video reels for your events instantly with AI.",
      icon: Play,
      route: "/reels",
      color: "pink",
    },
    {
      title: "Event Report Generator",
      description: "Transform event data and notes into professional, ready-to-share PDF reports.",
      icon: FileText,
      route: "/reports",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 lg:px-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6 tracking-wider uppercase">
          <Sparkles className="w-3 h-3" />
          AI-Powered Content Engine
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
          Create <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">Unforgettable</span> Events
        </h1>
        <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform to generate posters, invitations, reels, and reports using state-of-the-art AI.
        </p>
      </motion.div>

      {/* Grid Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Card
              {...feature}
              onClick={() => navigate(feature.route)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
      >
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-white/40 text-sm italic">"The future of event marketing is here."</p>
         </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

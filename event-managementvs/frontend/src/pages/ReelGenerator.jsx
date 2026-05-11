import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Sparkles, Send, Play, Clapperboard, Share2, Copy, Check, Download } from "lucide-react";

const ReelGenerator = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    
    try {
      // Correct backend endpoint: /api/generate-reel
      const response = await axios.post("http://127.0.0.1:8000/api/generate-reel", {
        text: topic
      });
      
      if (response.data && response.data.video_url) {
        setVideoUrl(response.data.video_url);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Reel Generation failed", err);
      setError("Reel generation failed. Please check backend logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 lg:px-24 max-w-4xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Clapperboard className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">AI Event Reel Generator</h1>
          <p className="text-white/40 text-sm">Generate stunning promotional video reels for your events instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-pink-400">What's the Event Topic?</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI-Powered Tech Meetup"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
              isGenerating || !topic ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-linear-to-r from-pink-500 to-rose-600 text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
            }`}
          >
            {isGenerating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
                <Sparkles className="w-5 h-5" />
            )}
            {isGenerating ? "Generating Reel..." : "Generate Reel"}
          </button>
        </div>

        {/* Output Section */}
        <AnimatePresence mode="wait">
          {videoUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-3xl border-white/10 flex flex-col relative"
            >
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                    <Play className="w-4 h-4" /> GENERATED REEL
                 </div>
                 <div className="flex items-center gap-2">
                    <a 
                      href={videoUrl} 
                      download="event_reel.mp4"
                      className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                    >
                        <Download className="w-4 h-4" />
                    </a>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
              
              <div className="aspect-[9/16] w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
                  <video 
                    key={videoUrl}
                    controls 
                    className="w-full h-full object-contain"
                    autoPlay
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
              </div>
              
              <p className="mt-4 text-[10px] text-white/20 font-mono text-center uppercase tracking-tighter">
                Video saved at {videoUrl}
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 rounded-3xl border-rose-500/20 flex flex-col items-center justify-center text-center text-rose-400"
            >
              <p className="text-sm">{error}</p>
              <button 
                onClick={handleGenerate}
                className="mt-4 text-xs underline hover:text-rose-300"
              >
                Retry
              </button>
            </motion.div>
          ) : (
              <div className="glass p-8 rounded-3xl border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                  <Play className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-sm">Enter a topic and click generate to see the AI magic.</p>
              </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReelGenerator;

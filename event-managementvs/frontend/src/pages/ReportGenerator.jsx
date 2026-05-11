import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Send, FileText, Share2, Copy, Check, Download, History, AlertCircle } from "lucide-react";
import axios from "axios";

const ReportGenerator = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!inputText) return;
    setIsGenerating(true);
    setError(null);
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/generate-circular", 
            { text: inputText },
            { responseType: 'blob' }
        );

        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        
        // Trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'event_circular.docx');
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setGeneratedFile(true);
    } catch (err) {
        console.error("Circular generation failed:", err);
        setError("Failed to generate report. Please check your connection and try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 lg:px-24 max-w-6xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">AI Report Expert</h1>
          <p className="text-white/40 text-sm tracking-tight">Paste your raw notes and let AI structure them into a professional report.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 glass p-8 rounded-3xl border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-blue-400">Raw Notes / Event Data</label>
            <textarea
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-none text-sm font-mono placeholder:text-white/10"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your rough notes here (attendees, feedback, key moments)..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputText}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                isGenerating || !inputText ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                }`}
            >
                {isGenerating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="w-5 h-5" />
                </motion.div>
                ) : (
                    <Sparkles className="w-5 h-5 text-blue-300" />
                )}
                {isGenerating ? "Analyzing & Generating..." : "Generate Pro Report"}
            </button>
            <button className="px-6 py-4 glass rounded-xl border-white/5 text-white/40 hover:text-white transition-colors flex items-center gap-2">
                <History className="w-5 h-5" />
                Drafts
            </button>
          </div>
        </div>

        {/* Output Section */}
        <AnimatePresence mode="wait">
          {error ? (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 glass p-8 rounded-3xl border-red-500/20 flex flex-col items-center justify-center text-center text-red-400"
             >
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">Generation Failed</h3>
                <p className="text-sm opacity-80 max-w-xs">{error}</p>
             </motion.div>
          ) : generatedFile ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 glass p-8 rounded-3xl border-green-500/20 flex flex-col items-center justify-center text-center"
            >
               <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                 <Check className="w-10 h-10 text-green-400" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">Report Ready!</h3>
               <p className="text-white/40 text-sm mb-8 max-w-xs">Your professional event circular has been generated and downloaded as a Word document.</p>
               
               <div className="flex flex-col gap-3 w-full max-w-xs">
                 <button 
                    onClick={handleGenerate}
                    className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                 >
                    <Download className="w-5 h-5" />
                    Download Again
                 </button>
                 <button className="w-full py-4 glass rounded-xl border-white/5 text-white/60 font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Share Document
                 </button>
               </div>
            </motion.div>
          ) : (
              <div className="flex-1 glass p-8 rounded-3xl border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                  <div className="p-6 rounded-full bg-white/5 mb-6">
                      <FileText className="w-12 h-12 text-white/10" />
                  </div>
                  <h3 className="text-lg font-bold text-white/60 mb-2 whitespace-nowrap">Your final report will appear here</h3>
                  <p className="max-w-[280px] text-xs leading-relaxed">Simply provide your event notes on the left, and our AI will do the heavy lifting of formatting and professional writing for you.</p>
              </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportGenerator;

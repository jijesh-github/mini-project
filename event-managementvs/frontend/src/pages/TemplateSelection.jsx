import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Search, Filter, Sparkles, AlertCircle } from "lucide-react";
import TemplateCard from "../components/TemplateCard";

const TemplateSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPoster = location.pathname.includes("poster");
    const categoryName = isPoster ? "Poster" : "Invitation";
    const categoryQuery = isPoster ? "poster" : "invitation";

    const [searchTerm, setSearchTerm] = useState("");
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/templates?category=${categoryQuery}`);
                setTemplates(response.data);
            } catch (err) {
                console.error("Failed to fetch templates:", err);
                setError("Failed to load templates. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [categoryQuery]);

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                   <button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group"
                   >
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     Back to Dashboard
                   </button>
                   <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                    Select a Template
                     <div className="px-3 py-1 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-[10px] uppercase font-black">
                        {categoryName}
                    </div>
                   </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input 
                            type="text" 
                            placeholder="Search templates..."
                            className="glass pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="glass p-2.5 rounded-xl border-white/5 hover:bg-white/5 text-white/60">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="aspect-[4/5] bg-white/5 rounded-xl border border-white/5" />
                    ))}
                </div>
            ) : (
                <motion.div 
                    layout
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <TemplateCard 
                                    template={template} 
                                    onClick={() => navigate(`/editor/${template.id}`)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredTemplates.length === 0 && (
                <div className="text-center py-24 glass rounded-3xl border-dashed border-white/10">
                    <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white/60">No templates found</h3>
                    <p className="text-white/30 text-sm mt-2">Try a different search term or category.</p>
                </div>
            )}
        </div>
    );
};

export default TemplateSelection;

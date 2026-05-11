import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, GitBranch, Globe } from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);
      localStorage.setItem("token", response.data.access_token);
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* Left Panel – Branding */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden"
      >
        {/* Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">EventAI</span>
        </div>

        {/* Headline */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-400 font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> AI-Powered Platform
          </div>
          <h1 className="text-5xl font-black text-white leading-tight">
            Create events<br />
            that <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">leave a mark.</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-md">
            Generate stunning posters, invitations, reels, and reports — all powered by AI.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative glass p-6 rounded-2xl border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              AK
            </div>
            <div>
              <p className="text-white text-sm font-bold">Arjun K.</p>
              <p className="text-white/30 text-xs">Event Manager, TechSummit</p>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed italic">
            "EventAI saved us 12+ hours of design work. The AI poster generator is unreal."
          </p>
        </div>
      </motion.div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">EventAI</span>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-white/40">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Sign up free →
              </Link>
            </p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="glass flex items-center justify-center gap-2 py-3 rounded-xl border-white/5 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Globe className="w-4 h-4" /> Google
            </button>
            <button className="glass flex items-center justify-center gap-2 py-3 rounded-xl border-white/5 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <GitBranch className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/15 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-white/40">Password</label>
                <Link to="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="login-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  maxLength={72}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/15 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                isLoading
                  ? "bg-indigo-500/20 text-indigo-300 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95"
              }`}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

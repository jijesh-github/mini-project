import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  GitBranch, Globe, CheckCircle2, Image, FileText, Play,
} from "lucide-react";
import axios from "axios";

const features = [
  { icon: Image, label: "AI Poster Generator", desc: "Create event posters in seconds" },
  { icon: Mail, label: "Invitation Maker", desc: "Personalized invites at scale" },
  { icon: Play, label: "Reel Script AI", desc: "Viral scripts on demand" },
  { icon: FileText, label: "Report Generator", desc: "Professional reports instantly" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (pw) => pw.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Email might already be registered.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* Left Panel – Feature Showcase */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">EventAI</span>
        </div>

        {/* Headline */}
        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-purple-400 font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3 h-3" /> Free to start
            </div>
            <h1 className="text-5xl font-black text-white leading-tight">
              Everything you need<br />
              to run <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">epic events.</span>
            </h1>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 glass p-4 rounded-xl border-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{f.label}</p>
                  <p className="text-white/30 text-xs">{f.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-white/20 text-xs">
          © 2026 EventAI · All rights reserved
        </p>
      </motion.div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
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
          {step === 1 ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create your account</h2>
                <p className="text-white/40">
                  Already have one?{" "}
                  <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                    Sign in →
                  </Link>
                </p>
              </div>

              {/* Social */}
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

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      name="name"
                      id="signup-name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      name="email"
                      id="signup-email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="signup-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      maxLength={72}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength indicator */}
                  {formData.password && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            formData.password.length >= lvl * 3
                              ? lvl <= 1 ? "bg-red-500" : lvl <= 2 ? "bg-yellow-500" : lvl <= 3 ? "bg-blue-500" : "bg-green-500"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="signup-confirm-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      maxLength={72}
                      className={`w-full bg-white/5 border rounded-xl pl-11 pr-20 py-3.5 text-white placeholder:text-white/15 focus:outline-none transition-colors ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? "border-red-500/50"
                          : "border-white/10 focus:border-purple-500/50"
                      }`}
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/20 leading-relaxed">
                  By signing up, you agree to our{" "}
                  <Link to="#" className="text-indigo-400 hover:underline">Terms of Service</Link> and{" "}
                  <Link to="#" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
                </p>

                <button
                  type="submit"
                  id="signup-submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    isLoading
                      ? "bg-purple-500/20 text-purple-300 cursor-not-allowed"
                      : "bg-linear-to-r from-purple-500 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95"
                  }`}
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      Create Free Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(52,211,153,0.3)]"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-black text-white mb-3">You're in! 🎉</h2>
                <p className="text-white/40 leading-relaxed">
                  Welcome to EventAI, <span className="text-white font-bold">{formData.name}</span>.<br />
                  Your account has been created successfully.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 rounded-xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

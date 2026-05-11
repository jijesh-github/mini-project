import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Home, Image, Mail, Play, FileText, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 flex items-center justify-between px-6">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">
          EventAI
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <NavLink to="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
        <NavLink to="/posters" icon={<Image className="w-4 h-4" />} label="Posters" />
        <NavLink to="/invitations" icon={<Mail className="w-4 h-4" />} label="Invitations" />
        <NavLink to="/reels" icon={<Play className="w-4 h-4" />} label="Reels" />
        <NavLink to="/reports" icon={<FileText className="w-4 h-4" />} label="Reports" />
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-white/5"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;

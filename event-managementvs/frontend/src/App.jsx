import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TemplateSelection from "./pages/TemplateSelection";
import EditorPage from "./pages/EditorPage";
import ReelGenerator from "./pages/ReelGenerator";
import ReportGenerator from "./pages/ReportGenerator";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const AUTH_PATHS = ["/login", "/signup"];

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200">
      {!isAuthPage && <Navbar />}
      <main className="relative">
        {/* Global Background Elements */}
        {!isAuthPage && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/posters" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
          <Route path="/invitations" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
          <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
          <Route path="/reels" element={<ProtectedRoute><ReelGenerator /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportGenerator /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

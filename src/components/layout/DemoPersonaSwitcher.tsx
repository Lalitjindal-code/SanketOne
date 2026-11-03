import React from 'react';
import { useAuth, DEMO_PERSONAS } from '@/context/AuthContext';
import { UserCheck, Shield, Shuffle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const DemoPersonaSwitcher: React.FC = () => {
  const { isDemoMode, role, switchDemoPersona } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isDemoMode) return null;

  const handleToggle = () => {
    const nextRole = role === 'student' ? 'admin' : 'student';
    switchDemoPersona(nextRole);

    // If currently on a role-specific page, smoothly navigate to the other portal's overview
    if (location.pathname.startsWith('/student') && nextRole === 'admin') {
      navigate('/admin/overview');
    } else if (location.pathname.startsWith('/admin') && nextRole === 'student') {
      navigate('/student/overview');
    }
  };

  const isStudent = role === 'student';
  const currentPersona = isStudent ? DEMO_PERSONAS.student : DEMO_PERSONAS.admin;

  return (
    <aside
      aria-label="Demo Persona Switcher"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 p-1.5 bg-[#1A2421]/95 backdrop-blur-md border border-[#2B3934] rounded-full shadow-2xl transition-all duration-300 hover:border-[#638F7E]"
    >
      <div className="flex items-center gap-2 px-3 py-1 bg-[#101715] rounded-full border border-[#2B3934]/60">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] font-medium text-slate-300 uppercase tracking-wider">
          Demo Persona:
        </span>
        <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-white">
          {isStudent ? (
            <UserCheck className="w-3.5 h-3.5 text-[#638F7E]" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-[#C98845]" />
          )}
          <span>{currentPersona.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#202D29] text-slate-400 rounded">
            {isStudent ? 'STUDENT' : 'ADMIN'}
          </span>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#245B56] hover:bg-[#31746E] text-white text-xs font-medium transition-all shadow-md active:scale-95"
        title={`Switch to ${isStudent ? 'Admin (Dr. Sunita Menon)' : 'Student (Aditi Sharma)'}`}
      >
        <Shuffle className="w-3.5 h-3.5" />
        <span>Switch to {isStudent ? 'Admin' : 'Student'}</span>
      </button>
    </aside>
  );
};


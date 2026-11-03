import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Shuffle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const { role, switchDemoPersona, isDemoMode } = useAuth();
  const state = location.state as { attemptedPath?: string; requiredRole?: string; userRole?: string } | null;

  return (
    <div className="min-h-screen bg-[#111817] flex items-center justify-center p-6 text-slate-200">
      <div className="max-w-md w-full bg-[#1A2421] border border-red-800/40 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-[#E05D44] mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-xs text-[#E05D44] uppercase tracking-wider font-bold">
            403 ACCESS RESTRICTED
          </div>
          <h1 className="font-display text-lg font-bold text-white">Institutional Role Mismatch</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your authenticated persona <span className="text-white font-mono font-bold">({role?.toUpperCase() || 'ANONYMOUS'})</span> does not possess custodial clearance for this sector.
          </p>
          {state?.attemptedPath && (
            <div className="p-2 bg-[#101715] border border-[#2B3934] rounded-lg font-mono text-[10px] text-slate-400">
              Attempted: {state.attemptedPath} (Requires: {state.requiredRole})
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {isDemoMode && (
            <button
              onClick={() => {
                const nextRole = role === 'student' ? 'admin' : 'student';
                switchDemoPersona(nextRole);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C98845] hover:bg-[#D89B5B] text-white text-xs font-semibold shadow-md transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Switch to {role === 'student' ? 'Admin (Dr. Sunita Menon)' : 'Student (Aditi Sharma)'}</span>
            </button>
          )}

          <Link
            to={role === 'admin' ? '/admin/overview' : '/student/overview'}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#202D29] hover:bg-[#283833] border border-[#2B3934] text-slate-200 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};


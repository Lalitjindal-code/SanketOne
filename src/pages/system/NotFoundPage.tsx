import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111817] flex items-center justify-center p-6 text-slate-200">
      <div className="max-w-md w-full bg-[#1A2421] border border-[#2B3934] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#202D29] border border-[#2B3934] flex items-center justify-center p-2 mx-auto overflow-hidden">
          <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-3xl font-extrabold text-white">404</div>
          <h1 className="font-display text-lg font-bold text-white">Signal Lost in Cadastral Void</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested telemetry endpoint or complaint docket does not exist within the campus coordinates.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245B56] hover:bg-[#31746E] text-white text-xs font-semibold shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Signal Gateway</span>
        </Link>
      </div>
    </div>
  );
};


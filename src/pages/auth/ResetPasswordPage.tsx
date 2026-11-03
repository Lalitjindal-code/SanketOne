import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111817] flex items-center justify-center p-6 text-slate-200">
      <div className="max-w-md w-full bg-[#1A2421] border border-[#2B3934] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#202D29] border border-[#2B3934] flex items-center justify-center p-0.5 overflow-hidden">
              <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-wide">
              SANKET<span className="text-primary">ONE</span>
            </span>
          </Link>
          <h1 className="font-display text-lg font-bold text-white">Reset Account Access</h1>
          <p className="text-xs text-slate-400">
            Enter your registered institutional email to receive recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#101715] border border-[#2B3934] rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="text-xs font-semibold text-white">Recovery Signal Dispatched</h2>
            <p className="text-[11px] text-slate-400">
              A secure password reset authorization link has been sent to <span className="text-slate-200 font-mono">{email}</span>.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-xs text-[#638F7E] hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.name@campus.edu"
                  className="w-full pl-9 pr-4 py-2 bg-[#101715] border border-[#2B3934] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#638F7E] focus:ring-1 focus:ring-[#638F7E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#245B56] hover:bg-[#31746E] text-white font-semibold text-xs transition-all shadow-md shadow-[#245B56]/20"
            >
              <span>Transmit Recovery Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center">
              <Link to="/auth" className="text-xs text-slate-400 hover:text-white transition-colors">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


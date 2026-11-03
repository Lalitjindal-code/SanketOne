import React from 'react';
import { Shield, BookOpen, Scale, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 px-6 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2421] border border-[#2B3934] font-mono text-xs text-[#638F7E]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>INSTITUTIONAL CHARTER</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Governance & Operational Transparency
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          SanketOne was commissioned to unify fragmented campus communication channels. By pairing strict accountability with verified student sign-offs, the platform transforms institutional maintenance into an empirical, data-driven discipline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#C98845] font-semibold text-sm">
            <Scale className="w-4 h-4" />
            <span>The Custodial Contract</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every grievance filed enters a public or confidential ledger with a tracked institutional SLA. Department heads and maintenance crews are evaluated against objective response velocity and verified resolution metrics.
          </p>
        </div>

        <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#638F7E] font-semibold text-sm">
            <Shield className="w-4 h-4" />
            <span>Student Privacy Protection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Students can raise issues with full whistleblower confidentiality. Contact credentials remain strictly guarded by Row Level Security, ensuring students can speak truth to infrastructure without apprehension.
          </p>
        </div>
      </div>

      <div className="bg-[#16201D] border border-[#2B3934] rounded-2xl p-6 flex items-center gap-4">
        <Award className="w-8 h-8 text-[#C98845] shrink-0" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">Institutional Oversight:</span> All grievance telemetry is permanently mirrored to the Deanery Audit Registry to guarantee that no report is silently dropped or prematurely closed.
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Activity, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const CampusPulsePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#2B3934]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#638F7E] mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>CAMPUS-WIDE RESOLUTION TELEMETRY</span>
        </div>
        <h1 className="font-display text-xl font-bold text-white">Campus Pulse</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Empirical facility health metrics, turnaround velocity, and departmental compliance rates.
        </p>
      </div>

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>AVG TURNAROUND TIME</span>
            <Clock className="w-4 h-4 text-[#638F7E]" />
          </div>
          <div className="font-display text-2xl font-bold text-white">38.4 hrs</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>-14% vs previous academic term</span>
          </div>
        </div>

        <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>STUDENT SIGN-OFF RATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-bold text-white">92.6%</div>
          <div className="text-[11px] text-slate-400">First-pass physical verification</div>
        </div>

        <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>ACTIVE ESCALATIONS</span>
            <AlertTriangle className="w-4 h-4 text-[#C98845]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#C98845]">2</div>
          <div className="text-[11px] text-slate-400">Under Deanery Custodial Relay</div>
        </div>
      </div>

      {/* Sector Health Breakdown */}
      <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-sm font-bold text-white">Monitored Sector Operational Index</h2>
        <div className="space-y-3">
          {[
            { sector: 'Academic Block A & B', index: 96, status: 'Optimal' },
            { sector: 'Hostel Block IV (Mahanadi)', index: 82, status: 'Elevated Backlog' },
            { sector: 'Central Library & Media Center', index: 94, status: 'Optimal' },
            { sector: 'Engineering Quad Labs', index: 88, status: 'Normal' },
          ].map((s) => (
            <div key={s.sector} className="p-3 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">{s.sector}</div>
                <div className="text-[10px] text-slate-400">{s.status}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-[#638F7E]">{s.index}%</span>
                <div className="text-[10px] text-slate-500">Compliance</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


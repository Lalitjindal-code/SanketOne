import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDemoData } from '@/context/DemoDataContext';
import { Shield, Sliders, History, Check, RotateCcw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { resetDemoData } = useDemoData();
  const [tab, setTab] = useState<'policies' | 'audit' | 'profile'>('policies');
  const [saved, setSaved] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetDemoData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#2B3934]">
        <h1 className="font-display text-xl font-bold text-white">Governance & Institutional Configuration</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure institutional SLA thresholds, review audit logs, and manage chief custodian credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2B3934] pb-2">
        <button
          onClick={() => setTab('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tab === 'policies'
              ? 'bg-[#1A2421] border border-[#2B3934] text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#C98845]" />
          <span>SLA & Protocol Rules</span>
        </button>
        <button
          onClick={() => setTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tab === 'audit'
              ? 'bg-[#1A2421] border border-[#2B3934] text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#638F7E]" />
          <span>Tamper-Evident Audit Trail</span>
        </button>
        <button
          onClick={() => setTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tab === 'profile'
              ? 'bg-[#1A2421] border border-[#2B3934] text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Chief Custodian Profile</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 sm:p-8">
        {tab === 'policies' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Institutional SLA Protocol Policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Tier 1 Target (Hazard)</label>
                  <input
                    type="number"
                    defaultValue={6}
                    className="w-full px-3 py-2 bg-[#1A2421] border border-[#2B3934] rounded-lg text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Hours before Deanery alert</span>
                </div>

                <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Tier 2 Target (Elevated)</label>
                  <input
                    type="number"
                    defaultValue={24}
                    className="w-full px-3 py-2 bg-[#1A2421] border border-[#2B3934] rounded-lg text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Hours before HOD escalation</span>
                </div>

                <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Tier 3 Target (Routine)</label>
                  <input
                    type="number"
                    defaultValue={72}
                    className="w-full px-3 py-2 bg-[#1A2421] border border-[#2B3934] rounded-lg text-xs text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Hours before shift review</span>
                </div>
              </div>

              <div className="pt-2 p-4 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Automated Duplicate Intercepts</div>
                  <div className="text-[10px] text-slate-400">Surface convergence suggestions when trigram similarity exceeds 85%</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#245B56]" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B3934] flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#245B56] hover:bg-[#31746E] text-white text-xs font-semibold shadow-md transition-all"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Policies Saved' : 'Save Institutional Policies'}</span>
              </button>
            </div>
          </form>
        )}

        {tab === 'audit' && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Immutable Governance Audit Log
            </h2>
            <div className="space-y-2 text-xs">
              {[
                { time: '10:45 AM', action: 'PRIORITY_OVERRIDE', actor: 'Dr. Sunita Menon', detail: 'Elevated SNK-9812 to Critical (Bylaw §14 Safety Hazard)' },
                { time: '09:20 AM', action: 'MERGE_CLUSTER', actor: 'Dr. Sunita Menon', detail: 'Approved Cluster Alpha merge (SNK-9014, SNK-9018, SNK-9022)' },
                { time: 'Yesterday', action: 'DEPT_REASSIGN', actor: 'System Relay', detail: 'Transferred SNK-8841 to HVAC Operations' },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#C98845] font-bold mr-2">[{log.action}]</span>
                    <span className="text-slate-200">{log.detail}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">Actor: {log.actor}</div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] space-y-2">
              <div className="font-semibold text-white">Chief Custodian Identity</div>
              <div className="text-slate-300">Name: {user?.fullName || 'Dr. Sunita Menon'}</div>
              <div className="text-slate-400 font-mono">Email: dean.affairs@campus.edu</div>
              <div className="text-slate-400">Jurisdiction: Institutional Student Affairs & Maintenance Governance</div>
            </div>

            {/* Demo Reset Card */}
            <div className="p-4 bg-[#151E1C] rounded-xl border border-dashed border-[#C98845]/50 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C98845] animate-pulse"></span>
                  <span>Demo State Store Maintenance</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Reset all local complaints, clusters, SLA states, and notifications back to initial factory demo seed.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-[#C98845]/20 hover:bg-[#C98845]/30 text-[#C98845] border border-[#C98845]/40 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resetDone ? 'Reset Completed ✓' : 'Reset Demo State'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDemoData } from '@/context/DemoDataContext';
import { User, Bell, Shield, Check, RotateCcw } from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { resetDemoData } = useDemoData();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#2B3934]">
        <h1 className="font-display text-xl font-bold text-white">Student Account & Preferences</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your verified student profile, residential demarcation, and notification dispatch rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2B3934] pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-[#1A2421] border border-[#2B3934] text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#638F7E]" />
          <span>Profile & Demarcation</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'notifications'
              ? 'bg-[#1A2421] border border-[#2B3934] text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-[#C98845]" />
          <span>Notification Routing</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 sm:p-8">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullName || 'Aditi Sharma'}
                  className="w-full px-4 py-2.5 bg-[#101715] border border-[#2B3934] rounded-xl text-xs text-white focus:outline-none focus:border-[#638F7E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  Roll / Enrollment Number
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue={user?.rollNumber || '22BCS041'}
                  className="w-full px-4 py-2.5 bg-[#101715]/60 border border-[#2B3934] rounded-xl text-xs text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  Institutional Email
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email || 'aditi.sharma@campus.edu'}
                  className="w-full px-4 py-2.5 bg-[#101715]/60 border border-[#2B3934] rounded-xl text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  Department / Faculty
                </label>
                <input
                  type="text"
                  defaultValue={user?.departmentOrFaculty || 'Computer Science & Engineering'}
                  className="w-full px-4 py-2.5 bg-[#101715] border border-[#2B3934] rounded-xl text-xs text-white focus:outline-none focus:border-[#638F7E]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  Hostel / Living Quarters Demarcation
                </label>
                <input
                  type="text"
                  defaultValue={user?.hostelBlock || 'Hostel Block IV (Mahanadi) • Room 412'}
                  className="w-full px-4 py-2.5 bg-[#101715] border border-[#2B3934] rounded-xl text-xs text-white focus:outline-none focus:border-[#638F7E]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B3934] flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#638F7E]" />
                <span>Identity protected by Row Level Security</span>
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#245B56] hover:bg-[#31746E] text-white text-xs font-semibold shadow-md transition-all"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Preferences Saved' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>

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

        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Status Transition Alerts</div>
                <div className="text-[11px] text-slate-400">Receive in-app alerts when complaints enter Progress or Resolved</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#245B56]" />
            </div>

            <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Verification Gate Reminders</div>
                <div className="text-[11px] text-slate-400">Receive priority reminders when resolved repairs require your sign-off</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#245B56]" />
            </div>

            <div className="p-4 bg-[#101715] rounded-xl border border-[#2B3934] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Campus-Wide Broadcasts</div>
                <div className="text-[11px] text-slate-400">Deanery urgent maintenance bulletins and shutdown notices</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#245B56]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


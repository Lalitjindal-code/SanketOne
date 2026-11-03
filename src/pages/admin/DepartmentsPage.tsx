import React from 'react';
import { Plus } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const departments = [
    {
      code: 'ESTATES',
      name: 'Estates & Civil Infrastructure',
      head: 'Prof. V. Ramanathan',
      staffCount: 18,
      slaAdherence: '94.6%',
      defaultSla: '24 hrs',
      activeTickets: 12,
    },
    {
      code: 'HVAC',
      name: 'HVAC & Climate Systems',
      head: 'Er. A. Kulkarni',
      staffCount: 8,
      slaAdherence: '86.2%',
      defaultSla: '12 hrs',
      activeTickets: 6,
    },
    {
      code: 'IT_NET',
      name: 'Campus IT & Wi-Fi Operations',
      head: 'Dr. Sunita Rao',
      staffCount: 12,
      slaAdherence: '96.8%',
      defaultSla: '6 hrs',
      activeTickets: 4,
    },
    {
      code: 'SANITATION',
      name: 'Sanitation & Hygiene Services',
      head: 'M. S. Deshmukh',
      staffCount: 24,
      slaAdherence: '98.1%',
      defaultSla: '8 hrs',
      activeTickets: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B3934]">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Department Roster & SLA Parameters</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational divisions, field technician capacity, and institutional turnaround benchmarks.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B56] hover:bg-[#31746E] text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.code} className="p-6 bg-[#1A2421] border border-[#2B3934] rounded-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#202D29] text-[#638F7E] font-bold border border-[#2B3934]">
                  {dept.code}
                </span>
                <h2 className="text-base font-bold text-white mt-1.5">{dept.name}</h2>
                <div className="text-xs text-slate-400">Head: {dept.head}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-emerald-400">{dept.slaAdherence}</span>
                <div className="text-[10px] text-slate-500 font-mono">SLA Compliance</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#101715] rounded-xl border border-[#2B3934] text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Field Crew</div>
                <div className="font-bold text-white mt-0.5">{dept.staffCount} Assignees</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Default SLA</div>
                <div className="font-bold text-[#638F7E] mt-0.5">{dept.defaultSla}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Active Dockets</div>
                <div className="font-bold text-[#C98845] mt-0.5">{dept.activeTickets} Open</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

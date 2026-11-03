import React from 'react';
import { ArrowRight, Radio, Search, Wrench, CheckCircle2, RotateCcw } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'Incident Intake & Spatial Intercept',
      icon: Radio,
      description: 'Student files an issue with category and zone. The system intercepts duplicate reports in the vicinity, allowing the student to add their endorsement (+1) rather than fragmenting the ticket.',
    },
    {
      step: '02',
      title: 'Department Triage & SLA Allocation',
      icon: Search,
      description: 'Administration or dispatch systems assign the ticket to the responsible department (Estates, HVAC, IT, Sanitation) and initialize the active SLA countdown timer.',
    },
    {
      step: '03',
      title: 'Field Execution & Repair Evidence',
      icon: Wrench,
      description: 'Field technicians perform physical remediation and upload timestamped photographic proof of resolution into the custodial record.',
    },
    {
      step: '04',
      title: 'Student Verification Gate',
      icon: CheckCircle2,
      description: 'The status transitions to Resolved, notifying the complainant and endorsing students. The ticket is held in escrow until students physically inspect and verify the fix.',
    },
    {
      step: '05',
      title: 'Verified Closure or Structured Reopen',
      icon: RotateCcw,
      description: 'Complainants click Confirm to seal the record into the permanent institutional archive, or click Reopen with a reason to send the ticket back to the maintenance crew.',
    },
  ];

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          The 5-Stage Grievance Lifecycle
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          SanketOne enforces a deterministic operational state machine. The lifecycle is non-bypassable and strictly reversible: technicians cannot unilaterally force closure without student sign-off.
        </p>
      </div>

      <div className="space-y-6">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="bg-[#1A2421] border border-[#2B3934] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-2xl font-bold text-[#638F7E]/60">{stage.step}</span>
                <div className="w-10 h-10 rounded-xl bg-[#202D29] border border-[#2B3934] flex items-center justify-center text-[#638F7E]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-white">{stage.title}</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="hidden md:block w-5 h-5 text-slate-500 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};


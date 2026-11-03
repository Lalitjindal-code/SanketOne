import React from 'react';

export const CampusOverviewPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-xl max-w-[1400px] mx-auto w-full">
        {/* Section 1: Editorial Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg border-b border-border-subtle">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-space-sm mb-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping opacity-75"></span>
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                CAMPUS INTELLIGENCE &amp; OPERATIONS // CENTRAL REGISTRY
              </span>
              <span className="text-border-strong font-micro-label text-micro-label">|</span>
              <span className="px-space-xs py-0.5 bg-surface-2 text-copper-400 font-micro-label text-micro-label rounded tracking-widest uppercase">
                ILLUSTRATIVE PREVIEW DATA
              </span>
            </div>
            <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">Campus Overview</h1>
            <p className="font-body-md text-body-md text-text-secondary mt-space-xs">
              Monitor campus issues, prioritize action, and track resolution performance in real time across academic
              blocks, residential quads, and utility nodes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="relative">
              <button
                className="h-10 px-space-md bg-surface-1 hover:bg-surface-2 border border-border-default hover:border-border-strong text-text-primary font-label text-label flex items-center gap-space-sm transition-colors rounded"
                id="btn-period"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-primary">calendar_today</span>
                <span>Trailing 30 Days</span>
                <span className="material-symbols-outlined text-[15px] text-text-muted">expand_more</span>
              </button>
            </div>
            <div className="relative">
              <button
                className="h-10 px-space-md bg-surface-1 hover:bg-surface-2 border border-border-default hover:border-border-strong text-text-primary font-label text-label flex items-center gap-space-sm transition-colors rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-brand-300">school</span>
                <span>Spring 2025 Semester</span>
                <span className="material-symbols-outlined text-[15px] text-text-muted">expand_more</span>
              </button>
            </div>
            <button
              className="h-10 px-space-md bg-copper-500 hover:bg-copper-400 border border-copper-400 text-text-primary font-label text-label tracking-wide flex items-center gap-space-sm transition-colors rounded shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Dossier (CSV/PDF)</span>
            </button>
          </div>
        </header>

        {/* Section 2: Operational KPI Metric Matrix */}
        <section aria-label="Operational Key Metrics" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-md">
          {/* Total Complaints */}
          <div className="bg-surface-1 p-space-md rounded border border-border-subtle hover:border-border-default transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                Total Complaints
              </span>
              <span className="material-symbols-outlined text-text-disabled text-[18px]">analytics</span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary">412</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-brand-300">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+14% vs trailing month</span>
            </div>
          </div>
          {/* Open Complaints */}
          <div className="bg-surface-1 p-space-md rounded border border-border-subtle hover:border-border-default transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                Open Complaints
              </span>
              <span className="material-symbols-outlined text-text-disabled text-[18px]">inbox</span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary">28</span>
              <span className="text-text-muted font-body-sm text-body-sm">active</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-priority-medium"></span>
              <span>Active triage backlog</span>
            </div>
          </div>
          {/* Critical Issues (Safety Highlight) */}
          <div className="bg-surface-1 p-space-md rounded border border-priority-critical bg-status-critical-bg/30 hover:border-status-critical-border transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-priority-critical/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-priority-critical tracking-wider font-semibold">
                Critical Issues
              </span>
              <span className="px-1.5 py-0.5 rounded bg-status-critical-bg border border-status-critical-border text-status-critical-text font-micro-label text-micro-label">
                ACTION REQ
              </span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-priority-critical">03</span>
              <span className="text-priority-critical/70 font-body-sm text-body-sm">hazards</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-status-critical-text">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>Deanery SLA enforcement</span>
            </div>
          </div>
          {/* In Progress */}
          <div className="bg-surface-1 p-space-md rounded border border-border-subtle hover:border-border-default transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                In Progress
              </span>
              <span className="material-symbols-outlined text-text-disabled text-[18px]">engineering</span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary">14</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-status-in-progress-text">
              <span className="material-symbols-outlined text-[14px]">sync</span>
              <span>Assigned to field squads</span>
            </div>
          </div>
          {/* Overdue Breached */}
          <div className="bg-surface-1 p-space-md rounded border border-copper-400 bg-secondary-container/20 hover:border-copper-500 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-copper-400 tracking-wider font-semibold">
                Overdue Breached
              </span>
              <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-micro-label text-micro-label border border-copper-600">
                SLA 24H
              </span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-copper-400">02</span>
              <span className="text-copper-400/80 font-body-sm text-body-sm">breaches</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-on-secondary-container">
              <span className="material-symbols-outlined text-[14px]">timer_off</span>
              <span>Exceeded mandatory cap</span>
            </div>
          </div>
          {/* Mean Resolution Time */}
          <div className="bg-surface-1 p-space-md rounded border border-border-subtle hover:border-border-default transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                Mean Resolution
              </span>
              <span className="material-symbols-outlined text-text-disabled text-[18px]">av_timer</span>
            </div>
            <div className="my-space-sm flex items-baseline gap-space-xs">
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary">1.8d</span>
              <span className="text-text-muted font-body-sm text-body-sm">/ 2.0d SLA</span>
            </div>
            <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-status-resolved-text">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Compliant (10% surplus)</span>
            </div>
          </div>
        </section>

        {/* Section 3: Two-Column Operational Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN (~62% = 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Velocity Chart Card */}
            <article className="bg-surface-1 rounded border border-border-subtle p-space-lg flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-micro-label text-micro-label uppercase text-primary tracking-widest font-semibold">
                      VELOCITY METRICS
                    </span>
                    <span className="font-micro-label text-micro-label text-text-disabled">//</span>
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">
                      6 TRAILING CALENDAR WEEKS
                    </span>
                  </div>
                  <h2 className="font-headline-3 text-headline-3 text-text-primary mt-0.5">
                    Intake Velocity vs. Resolution Velocity
                  </h2>
                </div>
                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-text-secondary">
                    <span className="w-2.5 h-2.5 rounded-sm bg-brand-500"></span>
                    <span>Intake (Reported)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-micro-label text-micro-label text-text-secondary">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                    <span>Verified Resolved</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-inset p-space-md rounded border border-border-subtle relative">
                {/* Inline Chart SVG */}
                <div className="w-full overflow-x-auto">
                  <svg
                    className="w-full h-56 min-w-[620px] overflow-visible text-border-subtle"
                    preserveAspectRatio="none"
                    viewBox="0 0 760 220"
                  >
                    {/* Grid Lines */}
                    <line stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="40" x2="740" y1="20" y2="20"></line>
                    <line stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="40" x2="740" y1="70" y2="70"></line>
                    <line stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="40" x2="740" y1="120" y2="120"></line>
                    <line stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="40" x2="740" y1="170" y2="170"></line>
                    {/* Left Axis Labels */}
                    <text fill="#82938A" fontFamily="Space Grotesk" fontSize="10" textAnchor="end" x="30" y="24">
                      100
                    </text>
                    <text fill="#82938A" fontFamily="Space Grotesk" fontSize="10" textAnchor="end" x="30" y="74">
                      75
                    </text>
                    <text fill="#82938A" fontFamily="Space Grotesk" fontSize="10" textAnchor="end" x="30" y="124">
                      50
                    </text>
                    <text fill="#82938A" fontFamily="Space Grotesk" fontSize="10" textAnchor="end" x="30" y="174">
                      25
                    </text>
                    {/* Week 1: 58 reported, 49 resolved */}
                    <rect fill="#3E7567" height="105" rx="1" width="22" x="75" y="65"></rect>
                    <rect fill="#9ad1ca" height="88" rx="1" width="22" x="101" y="82"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="99" y="196">
                      Wk 04
                    </text>
                    {/* Week 2: 72 reported, 68 resolved */}
                    <rect fill="#3E7567" height="126" rx="1" width="22" x="185" y="44"></rect>
                    <rect fill="#9ad1ca" height="118" rx="1" width="22" x="211" y="52"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="209" y="196">
                      Wk 05
                    </text>
                    {/* Week 3: 84 reported, 79 resolved */}
                    <rect fill="#3E7567" height="142" rx="1" width="22" x="295" y="28"></rect>
                    <rect fill="#9ad1ca" height="134" rx="1" width="22" x="321" y="36"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="319" y="196">
                      Wk 06
                    </text>
                    {/* Week 4: 64 reported, 71 resolved */}
                    <rect fill="#3E7567" height="112" rx="1" width="22" x="405" y="58"></rect>
                    <rect fill="#9ad1ca" height="123" rx="1" width="22" x="431" y="47"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="429" y="196">
                      Wk 07
                    </text>
                    {/* Week 5: 69 reported, 64 resolved */}
                    <rect fill="#3E7567" height="118" rx="1" width="22" x="515" y="52"></rect>
                    <rect fill="#9ad1ca" height="110" rx="1" width="22" x="541" y="60"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="539" y="196">
                      Wk 08
                    </text>
                    {/* Week 6: 65 reported, 73 resolved */}
                    <rect fill="#3E7567" height="114" rx="1" width="22" x="625" y="56"></rect>
                    <rect fill="#9ad1ca" height="126" rx="1" width="22" x="651" y="44"></rect>
                    <text fill="#82938A" fontFamily="Inter" fontSize="11" textAnchor="middle" x="649" y="196">
                      Wk 09 (Curr)
                    </text>
                    {/* Median Closure Latency Sparkline Curve */}
                    <path
                      d="M 99 135 Q 209 115 319 98 T 539 74 T 649 52"
                      fill="none"
                      stroke="#ffb870"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                    <circle cx="99" cy="135" fill="#ffb870" r="3.5"></circle>
                    <circle cx="209" cy="115" fill="#ffb870" r="3.5"></circle>
                    <circle cx="319" cy="98" fill="#ffb870" r="3.5"></circle>
                    <circle cx="429" cy="85" fill="#ffb870" r="3.5"></circle>
                    <circle cx="539" cy="74" fill="#ffb870" r="3.5"></circle>
                    <circle cx="649" cy="52" fill="#ffb870" r="3.5"></circle>
                  </svg>
                </div>
                {/* Metric Callout Badge Overlay */}
                <div className="mt-space-sm pt-space-sm border-t border-border-subtle flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">
                      LATENCY TRAJECTORY:
                    </span>
                    <span className="font-label text-label text-secondary flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      <span>-32.4% Median Turnaround Latency (3.1d → 1.8d)</span>
                    </span>
                  </div>
                  <div className="font-micro-label text-micro-label text-text-disabled">
                    DATA AUDIT VERIFIED VIA TELEMETRY FEED
                  </div>
                </div>
              </div>

              {/* Priority & Severity Distribution Bar Breakdown */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                    CURRENT BACKLOG BY SEVERITY TIER
                  </span>
                  <span className="font-micro-label text-micro-label text-text-secondary">28 Open In-Flight</span>
                </div>
                {/* Proportional Bar Track */}
                <div className="w-full h-3 bg-surface-inset rounded flex overflow-hidden p-0.5 gap-0.5">
                  <div className="bg-priority-critical h-full rounded-sm" style={{ width: '10.7%' }} title="Critical: 3"></div>
                  <div className="bg-priority-high h-full rounded-sm" style={{ width: '28.6%' }} title="High: 8"></div>
                  <div className="bg-priority-medium h-full rounded-sm" style={{ width: '42.9%' }} title="Medium: 12"></div>
                  <div className="bg-priority-low h-full rounded-sm" style={{ width: '17.8%' }} title="Low: 5"></div>
                </div>
                {/* Chips / Immediate Filter Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-xs">
                  <button
                    className="p-space-xs bg-surface-inset hover:bg-surface-2 border border-border-subtle rounded flex items-center justify-between transition-colors group"
                    type="button"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-priority-critical"></span>
                      <span className="font-micro-label text-micro-label uppercase text-text-secondary group-hover:text-text-primary">
                        CRITICAL
                      </span>
                    </div>
                    <span className="font-headline-4 text-sm font-semibold text-priority-critical">03</span>
                  </button>
                  <button
                    className="p-space-xs bg-surface-inset hover:bg-surface-2 border border-border-subtle rounded flex items-center justify-between transition-colors group"
                    type="button"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-priority-high"></span>
                      <span className="font-micro-label text-micro-label uppercase text-text-secondary group-hover:text-text-primary">
                        HIGH
                      </span>
                    </div>
                    <span className="font-headline-4 text-sm font-semibold text-priority-high">08</span>
                  </button>
                  <button
                    className="p-space-xs bg-surface-inset hover:bg-surface-2 border border-border-subtle rounded flex items-center justify-between transition-colors group"
                    type="button"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-priority-medium"></span>
                      <span className="font-micro-label text-micro-label uppercase text-text-secondary group-hover:text-text-primary">
                        MEDIUM
                      </span>
                    </div>
                    <span className="font-headline-4 text-sm font-semibold text-priority-medium">12</span>
                  </button>
                  <button
                    className="p-space-xs bg-surface-inset hover:bg-surface-2 border border-border-subtle rounded flex items-center justify-between transition-colors group"
                    type="button"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-priority-low"></span>
                      <span className="font-micro-label text-micro-label uppercase text-text-secondary group-hover:text-text-primary">
                        LOW
                      </span>
                    </div>
                    <span className="font-headline-4 text-sm font-semibold text-priority-low">05</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Active High-Priority Docket Table Card */}
            <article className="bg-surface-1 rounded border border-border-subtle p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between flex-wrap gap-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-micro-label text-micro-label uppercase text-secondary tracking-widest font-semibold">
                      TRIAGE ESCALATIONS
                    </span>
                    <span className="font-micro-label text-micro-label text-text-disabled">//</span>
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">
                      EXPEDITED HANDLING
                    </span>
                  </div>
                  <h2 className="font-headline-3 text-headline-3 text-text-primary mt-0.5">
                    Active High-Priority Docket
                  </h2>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 rounded bg-surface-inset border border-border-subtle text-text-muted font-micro-label text-micro-label">
                    4 OF 28 DISPLAYED
                  </span>
                  <button
                    className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-text-primary font-label text-label rounded border border-border-default transition-colors flex items-center gap-1"
                    type="button"
                  >
                    <span>View All In-Flight</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-space-lg px-space-lg">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-background-raised border-b border-border-subtle">
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        Ticket ID
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        Grievance &amp; Location
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        Severity
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        Status
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        Assigned Dept
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted">
                        SLA Window
                      </th>
                      <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase text-text-muted text-right">
                        Quick Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-body-sm text-body-sm">
                    {/* Row 1 */}
                    <tr className="hover:bg-surface-2/60 transition-colors">
                      <td className="py-space-md px-space-md font-numeric-kpi text-[14px] text-primary font-semibold">
                        #SNK-9812
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="text-text-primary font-semibold">
                            East Lift Grinding &amp; Cable Stoppage
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            <span>Engineering Quad — Block C</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-critical-bg text-status-critical-text border border-status-critical-border font-micro-label text-micro-label tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-priority-critical"></span>
                          <span>CRITICAL</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-in-progress-bg text-status-in-progress-text border border-status-in-progress-border font-micro-label text-micro-label uppercase">
                          <span>IN PROGRESS</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-text-secondary">Estates &amp; Facilities</td>
                      <td className="py-space-md px-space-md">
                        <span className="font-numeric-kpi text-[13px] text-priority-high font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>01h 45m left</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <button
                          className="h-7 px-2.5 bg-brand-600 hover:bg-brand-500 border border-brand-500 text-text-primary font-label text-label rounded transition-colors"
                          type="button"
                        >
                          Assign Tech
                        </button>
                      </td>
                    </tr>
                    {/* Row 2 (Breached/Escalated) */}
                    <tr className="hover:bg-surface-2/60 bg-status-critical-bg/10 transition-colors">
                      <td className="py-space-md px-space-md font-numeric-kpi text-[14px] text-priority-critical font-semibold">
                        #SNK-8841
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-text-primary font-semibold">
                              Building 3 HVAC Chiller Failure
                            </span>
                            <span className="px-1 py-0.2 rounded bg-status-critical-bg text-status-critical-text border border-status-critical-border font-micro-label text-[9px] uppercase">
                              ESCALATED DEAN
                            </span>
                          </div>
                          <span className="font-micro-label text-micro-label text-text-muted flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            <span>Academic Complex Block 3</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-critical-bg text-status-critical-text border border-status-critical-border font-micro-label text-micro-label tracking-wide uppercase font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-priority-critical animate-ping"></span>
                          <span>CRITICAL</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-in-progress-bg text-status-in-progress-text border border-status-in-progress-border font-micro-label text-micro-label uppercase">
                          <span>IN PROGRESS</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-text-secondary">Mech Maintenance</td>
                      <td className="py-space-md px-space-md">
                        <span className="font-numeric-kpi text-[13px] text-copper-400 font-semibold flex items-center gap-1 bg-surface-inset px-2 py-0.5 rounded border border-copper-600 w-fit">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          <span>BREACHED (+42m)</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <button
                          className="h-7 px-2.5 bg-copper-500 hover:bg-copper-400 border border-copper-400 text-text-primary font-label text-label rounded transition-colors"
                          type="button"
                        >
                          Escalate
                        </button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-surface-2/60 transition-colors">
                      <td className="py-space-md px-space-md font-numeric-kpi text-[14px] text-primary font-semibold">
                        #SNK-8802
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="text-text-primary font-semibold">
                            Water cooler non-operational 2nd Floor
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            <span>Academic Block B — East Wing</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-raised-bg text-status-raised-text border border-status-raised-border font-micro-label text-micro-label tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-priority-high"></span>
                          <span>HIGH</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-in-progress-bg text-status-in-progress-text border border-status-in-progress-border font-micro-label text-micro-label uppercase">
                          <span>IN PROGRESS</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-text-secondary">Estates Plumbing</td>
                      <td className="py-space-md px-space-md">
                        <span className="font-numeric-kpi text-[13px] text-text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-text-muted">schedule</span>
                          <span>04h 12m left</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <button
                          className="h-7 px-2.5 bg-surface-2 hover:bg-surface-3 border border-border-default text-text-primary font-label text-label rounded transition-colors"
                          type="button"
                        >
                          View Docket
                        </button>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="hover:bg-surface-2/60 transition-colors">
                      <td className="py-space-md px-space-md font-numeric-kpi text-[14px] text-primary font-semibold">
                        #SNK-8794
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="text-text-primary font-semibold">
                            Projector bulb burnout Room 204
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            <span>Science Quad Lab 4</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-surface-2 text-priority-medium border border-border-default font-micro-label text-micro-label tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-priority-medium"></span>
                          <span>MEDIUM</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-status-under-review-bg text-status-under-review-text border border-status-under-review-border font-micro-label text-micro-label uppercase">
                          <span>UNDER REVIEW</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-text-secondary">AV &amp; Classroom IT</td>
                      <td className="py-space-md px-space-md">
                        <span className="font-numeric-kpi text-[13px] text-text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-text-muted">schedule</span>
                          <span>18h 30m left</span>
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <button
                          className="h-7 px-2.5 bg-surface-2 hover:bg-surface-3 border border-border-default text-text-primary font-label text-label rounded transition-colors"
                          type="button"
                        >
                          Triage
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN (~38% = 4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Department Accountability Matrix */}
            <div className="bg-surface-1 rounded border border-border-subtle p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-primary tracking-widest font-semibold">
                    SLA COMPLIANCE INDEX
                  </span>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mt-0.5">
                    Department Accountability
                  </h3>
                </div>
                <span className="material-symbols-outlined text-text-muted text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col divide-y divide-border-subtle">
                {/* Estates & Facilities */}
                <div className="py-space-sm first:pt-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label text-text-primary font-semibold">
                      Estates &amp; Facilities
                    </span>
                    <span className="font-micro-label text-micro-label text-brand-300 font-semibold">94% SLA</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-inset rounded overflow-hidden">
                    <div className="bg-brand-500 h-full rounded" style={{ width: '94%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-micro-label text-micro-label text-text-muted">
                    <span>11 Open Active</span>
                    <span>Mean: 1.4d turnaround</span>
                  </div>
                </div>
                {/* Electrical & HVAC (Friction Highlight) */}
                <div className="py-space-sm flex flex-col gap-1.5 bg-status-raised-bg/15 -mx-space-md px-space-md rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label text-label text-text-primary font-semibold">
                        Electrical &amp; HVAC
                      </span>
                      <span className="px-1 py-0.2 rounded bg-secondary-container text-on-secondary-container font-micro-label text-[9px] uppercase border border-copper-600">
                        FRICTION
                      </span>
                    </div>
                    <span className="font-micro-label text-micro-label text-priority-high font-semibold">88% SLA</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-inset rounded overflow-hidden">
                    <div className="bg-priority-high h-full rounded" style={{ width: '88%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-micro-label text-micro-label text-text-muted">
                    <span>8 Open Active</span>
                    <span className="text-priority-high font-semibold">Mean: 2.1d (Target: 2.0d)</span>
                  </div>
                </div>
                {/* IT & Network */}
                <div className="py-space-sm flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label text-text-primary font-semibold">
                      IT &amp; Network Infrastructure
                    </span>
                    <span className="font-micro-label text-micro-label text-status-verified-text font-semibold">
                      98% SLA
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-inset rounded overflow-hidden">
                    <div className="bg-primary h-full rounded" style={{ width: '98%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-micro-label text-micro-label text-text-muted">
                    <span>5 Open Active</span>
                    <span>Mean: 0.8d turnaround</span>
                  </div>
                </div>
                {/* Sanitation & Hygiene */}
                <div className="py-space-sm last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label text-text-primary font-semibold">
                      Sanitation &amp; Hygiene
                    </span>
                    <span className="font-micro-label text-micro-label text-brand-300 font-semibold">91% SLA</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-inset rounded overflow-hidden">
                    <div className="bg-brand-400 h-full rounded" style={{ width: '91%' }}></div>
                  </div>
                  <div className="flex items-center justify-between font-micro-label text-micro-label text-text-muted">
                    <span>4 Open Active</span>
                    <span>Mean: 1.2d turnaround</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Systemic Infrastructure Hotspot Radar */}
            <div className="bg-surface-1 rounded border border-border-subtle p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-priority-critical"></span>
                    <span className="font-micro-label text-micro-label uppercase text-priority-critical tracking-widest font-semibold">
                      TELEMETRY ANOMALY
                    </span>
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mt-0.5">Hotspot Radar</h3>
                </div>
                <span className="material-symbols-outlined text-text-disabled text-[20px]">radar</span>
              </div>
              {/* Highlight Anomaly */}
              <div className="p-space-md bg-status-critical-bg/25 border border-status-critical-border rounded flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label text-text-primary font-semibold">
                    Building 3 Chiller Manifold
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-status-critical-bg text-priority-critical font-micro-label text-micro-label font-semibold">
                    5 BREAKDOWNS
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  5 repeated failures in trailing 45 days. 89 affected residents/labs. Recommended capital replacement of
                  main coolant valve.
                </p>
                <div className="pt-space-xs flex items-center justify-between border-t border-status-critical-border/50 font-micro-label text-micro-label">
                  <span className="text-priority-critical flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">report</span>
                    <span>Requires Deanery Capital Cap</span>
                  </span>
                  <button
                    className="text-text-primary hover:text-primary transition-colors underline underline-offset-2"
                    type="button"
                  >
                    Order Audit
                  </button>
                </div>
              </div>
              {/* Secondary Anomaly */}
              <div className="p-space-md bg-surface-inset border border-border-subtle rounded flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label text-text-primary font-semibold">
                    Hostel Block IV Hot Water Pressure
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-2 text-priority-high font-micro-label text-micro-label font-semibold">
                    3 REPORTS / 7D
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Solar auxiliary boiler thermal regulator unstable during early morning peak load. Field technician
                  dispatched.
                </p>
              </div>
            </div>

            {/* Recent Governance Sign-Offs & Audited Wins */}
            <div className="bg-surface-1 rounded border border-border-subtle p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-brand-300 tracking-widest font-semibold">
                    VERIFIED CIVIC WINS
                  </span>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mt-0.5">
                    Audited Governance Closures
                  </h3>
                </div>
                <span className="material-symbols-outlined text-brand-300 text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {/* Win 1 */}
                <div className="p-space-sm bg-surface-inset rounded border border-border-subtle flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded bg-status-verified-bg flex items-center justify-center text-status-verified-text flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label text-label text-text-primary font-semibold truncate">
                      Library 3rd Fl Wi-Fi Deadzone Resolved
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted mt-0.5">
                      Verified by Student Quorum Sign-off • 3 additional dual-band mesh APs active.
                    </span>
                    <span className="font-micro-label text-[10px] text-brand-300 uppercase tracking-wider mt-1">
                      LEDGER TX: #SNK-V-49912
                    </span>
                  </div>
                </div>
                {/* Win 2 */}
                <div className="p-space-sm bg-surface-inset rounded border border-border-subtle flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded bg-status-verified-bg flex items-center justify-center text-status-verified-text flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label text-label text-text-primary font-semibold truncate">
                      Central Mess RO UV Filtration Swap
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted mt-0.5">
                      Microbiology lab water purity test clearance signed: 99.98% purity index.
                    </span>
                    <span className="font-micro-label text-[10px] text-brand-300 uppercase tracking-wider mt-1">
                      LEDGER TX: #SNK-V-49887
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Governance Footer */}
        <footer className="mt-space-md pt-space-lg pb-space-xl border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-space-md text-text-muted font-micro-label text-micro-label">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-resolved-border"></span>
              <span className="text-text-secondary uppercase">INSTITUTIONAL REGISTRY ACTIVE</span>
            </div>
            <span>//</span>
            <span>WCAG AA CONTRAST CERTIFIED</span>
            <span>//</span>
            <span>SANKET-ONE PROTOCOL ENGINE v2.4.1</span>
          </div>
          <div className="flex items-center gap-space-md text-text-disabled uppercase tracking-wider">
            <span>SECURITY CLEARANCE: LEVEL 3 DEANERY</span>
            <span>ENCRYPTED END-TO-END</span>
            <span>© 2025 SANKETONE SYSTEMS</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

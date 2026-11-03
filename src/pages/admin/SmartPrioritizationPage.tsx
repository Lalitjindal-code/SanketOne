import React, { useState } from 'react';
import { useDemoData } from '@/context/DemoDataContext';

interface SecondaryReport {
  id: string;
  time: string;
  semanticFit: string;
  summary: string;
  offset: string;
  complainant: string;
}

const SECONDARY_REPORTS: SecondaryReport[] = [
  {
    id: '#SNK-9019',
    time: 'Filed 07:42 AM',
    semanticFit: '96% Semantic Fit',
    summary: '"No hot water in 3rd floor showers since 6 AM"',
    offset: 'Physical Offset: ~15m vertical, same pipe stack',
    complainant: 'Complainant: Hostel Wing A (18 Reps)',
  },
  {
    id: '#SNK-9024',
    time: 'Filed 08:05 AM',
    semanticFit: '91% Semantic Fit',
    summary: '"Water pipe knocking sound and low tap trickle in Block IV Wing B"',
    offset: 'Physical Offset: ~20m lateral corridor branch',
    complainant: 'Complainant: Varun Nair (Wing B)',
  },
  {
    id: '#SNK-9031',
    time: 'Filed 08:31 AM',
    semanticFit: '98% Semantic Fit',
    summary: '"Basement pump shut down, water completely cold"',
    offset: 'Physical Offset: ~5m from manifold breaker node',
    complainant: 'Complainant: Facility Warden',
  },
];

export const SmartPrioritizationPage: React.FC = () => {
  const { acceptSuggestedPriority, mergeCluster } = useDemoData();
  const [snk9812State, setSnk9812State] = useState<'pending' | 'accepted' | 'kept'>('pending');
  const [snk9014State, setSnk9014State] = useState<'pending' | 'promoted' | 'kept'>('pending');
  const [checkedReports, setCheckedReports] = useState<Record<string, boolean>>({
    '#SNK-9019': true,
    '#SNK-9024': true,
    '#SNK-9031': true,
  });
  const [clusterMerged, setClusterMerged] = useState(false);
  const [compareModalId, setCompareModalId] = useState<string | null>(null);

  const handleAcceptSnk9812 = () => {
    acceptSuggestedPriority('SNK-9812', 'critical', 'Urgency Surge score 98/100 confirmed by Admin');
    setSnk9812State('accepted');
  };

  const handlePromoteSnk9014 = () => {
    acceptSuggestedPriority('SNK-9014', 'high', 'Urgency Surge score 82/100 confirmed by Admin');
    setSnk9014State('promoted');
  };

  const handleMergeCluster = () => {
    const activeSelected = Object.keys(checkedReports)
      .filter((k) => checkedReports[k])
      .map((k) => k.replace('#', ''));
    mergeCluster('cluster-alpha', 'SNK-9014', activeSelected);
    setClusterMerged(true);
  };

  const toggleReport = (id: string) => {
    setCheckedReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Command Strip & Context Header */}
      <div className="px-space-lg pt-space-lg pb-space-md border-b border-border-subtle bg-surface-1 flex flex-col gap-space-md">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-widest">
                CAMPUS INTELLIGENCE // ALGORITHMIC TRIAGE &amp; SIGNAL AGGREGATION
              </span>
              <span className="font-micro-label text-micro-label text-text-disabled">//</span>
              <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest">
                ENGINE REVISION 4.19
              </span>
            </div>
            <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight mt-1">
              Smart Prioritization &amp; Duplicate Clustering
            </h1>
            <p className="font-body-md text-body-md text-text-secondary max-w-4xl mt-1">
              Review AI-suggested priorities, verify recurring patterns, and evaluate potential duplicate complaints without automated merging.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start lg:self-end">
            <span className="px-space-sm py-1 bg-surface-2 border border-border-default text-text-muted font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-brand-300">verified_user</span>
              Zero-Silent-Merge Policy Active
            </span>
            <button
              className="h-9 px-space-md bg-brand-600 hover:bg-brand-500 text-text-primary border border-brand-500 font-label text-label tracking-wide uppercase transition-colors flex items-center gap-1.5 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sync_saved_locally</span>
              Commit Triage Batch
            </button>
          </div>
        </div>

        {/* Global Telemetry Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-subtle border border-border-subtle">
          <div className="bg-surface-inset px-space-md py-space-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                DETECTED CORRELATIONS
              </span>
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary leading-none mt-1">
                14 Clusters
              </span>
            </div>
            <div className="w-10 h-10 bg-surface-2 border border-border-default flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
          </div>
          <div className="bg-surface-inset px-space-md py-space-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                STRUCTURAL COUPLING
              </span>
              <span className="font-numeric-kpi text-numeric-kpi text-secondary leading-none mt-1">
                6 Cross-Zone
              </span>
            </div>
            <div className="w-10 h-10 bg-surface-2 border border-border-default flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
          </div>
          <div className="bg-surface-inset px-space-md py-space-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                AUTONOMOUS MERGES
              </span>
              <span className="font-numeric-kpi text-numeric-kpi text-brand-300 leading-none mt-1">
                0 Merged
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-micro-label text-micro-label text-status-resolved-text uppercase tracking-widest">
                STRICT CUSTODIAN AUDIT
              </span>
              <span className="font-micro-label text-[9px] text-text-disabled mt-0.5">
                MANUAL VERIFICATION MANDATED
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-space-lg flex flex-col gap-space-xl">
        {/* SECTION 1: PRIORITY ASSISTANCE & URGENCY SUGGESTIONS */}
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-space-sm gap-2">
            <div className="flex items-center gap-space-sm">
              <span className="px-1.5 py-0.5 bg-surface-3 text-primary font-micro-label text-micro-label uppercase">
                STAGE 01
              </span>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Algorithmic Priority Assistance &amp; Urgency Discrepancies
              </h2>
            </div>
            <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
              2 Critical Severity Adjustments Pending Acceptance
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-md">
            {/* Card A: Elevator Hazard */}
            <div
              className={`bg-surface-1 border border-border-default hover:border-border-strong transition-all flex flex-col justify-between shadow-sm ${
                snk9812State !== 'pending' ? 'opacity-50' : ''
              }`}
              id="card-snk-9812"
            >
              <div className="p-space-lg flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-space-md border-b border-border-subtle pb-space-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label text-label text-primary font-semibold tracking-wider">
                        #SNK-9812
                      </span>
                      <span className="px-1.5 py-0.5 bg-surface-2 border border-border-default text-text-secondary font-micro-label text-micro-label">
                        ADMIN COMPLEX • SHAFT B
                      </span>
                    </div>
                    <h3 className="font-headline-4 text-headline-4 text-text-primary mt-1">
                      Elevator B stuck between floors 3 and 4 with audible grinding
                    </h3>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-micro-label text-micro-label text-text-muted uppercase">SURGE SCORE</span>
                    <span className="font-numeric-kpi text-[28px] text-priority-critical font-bold leading-none mt-0.5">
                      98<span className="text-sm font-normal text-text-muted">/100</span>
                    </span>
                  </div>
                </div>

                {/* Priority Comparison Grid */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="bg-surface-inset border border-border-subtle p-space-sm flex flex-col">
                    <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
                      Student-Stated Priority
                    </span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-priority-low"></span>
                      <span className="font-label text-label text-text-secondary uppercase">NORMAL (LOW URGENCY)</span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-disabled mt-1">
                      Reported by: Siddharth Rao (UG-IV)
                    </span>
                  </div>
                  <div className="bg-status-critical-bg border border-status-critical-border p-space-sm flex flex-col">
                    <span className="font-micro-label text-micro-label text-status-critical-text uppercase tracking-wider flex items-center justify-between">
                      <span>System-Inferred Severity</span>
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-priority-critical animate-ping"></span>
                      <span className="font-label text-label text-priority-critical uppercase font-bold">
                        CRITICAL SAFETY HAZARD
                      </span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-muted mt-1">
                      Trigger: Bylaw §14 Automatic Override
                    </span>
                  </div>
                </div>

                {/* Algorithmic Reasoning Box */}
                <div className="bg-surface-inset border-l-2 border-priority-critical p-space-sm flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-priority-critical">
                    <span className="material-symbols-outlined text-[15px]">psychology</span>
                    <span className="font-micro-label text-micro-label uppercase tracking-widest font-semibold">
                      Triage Reasoning Engine
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Natural language analysis detected active passenger entrapment risk and vertical transit failure. In accordance with Campus Safety Bylaw §14, immediate Level-1 dispatch mandatory. Acoustic tokens indicate mechanical friction hazard.
                  </p>
                </div>
              </div>

              <div className="bg-surface-2 border-t border-border-subtle p-space-md flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-2">
                  <button
                    className="h-9 px-space-md bg-priority-critical/20 hover:bg-priority-critical/30 border border-status-critical-border text-status-critical-text font-label text-label tracking-wide uppercase transition-colors flex items-center gap-1.5"
                    onClick={handleAcceptSnk9812}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Accept System Priority (Critical)
                  </button>
                  <button
                    className="h-9 px-space-sm bg-surface-1 hover:bg-surface-3 border border-border-default text-text-secondary font-label text-label transition-colors"
                    onClick={() => setSnk9812State('kept')}
                    type="button"
                  >
                    Keep as Submitted
                  </button>
                </div>
                <button
                  className="h-9 px-space-sm text-text-muted hover:text-text-primary font-micro-label text-micro-label uppercase flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  Add Custodian Reason
                </button>
              </div>
            </div>

            {/* Card B: Hostel IV Manifold */}
            <div
              className={`bg-surface-1 border border-border-default hover:border-border-strong transition-all flex flex-col justify-between shadow-sm ${
                snk9014State !== 'pending' ? 'opacity-50' : ''
              }`}
              id="card-snk-9014"
            >
              <div className="p-space-lg flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-space-md border-b border-border-subtle pb-space-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label text-label text-primary font-semibold tracking-wider">
                        #SNK-9014
                      </span>
                      <span className="px-1.5 py-0.5 bg-surface-2 border border-border-default text-text-secondary font-micro-label text-micro-label">
                        BOYS HOSTEL IV • UTILITY BASEMENT
                      </span>
                    </div>
                    <h3 className="font-headline-4 text-headline-4 text-text-primary mt-1">
                      Hot water manifold leak in Boys Hostel IV basement
                    </h3>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-micro-label text-micro-label text-text-muted uppercase">SURGE SCORE</span>
                    <span className="font-numeric-kpi text-[28px] text-priority-high font-bold leading-none mt-0.5">
                      82<span className="text-sm font-normal text-text-muted">/100</span>
                    </span>
                  </div>
                </div>

                {/* Priority Comparison Grid */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="bg-surface-inset border border-border-subtle p-space-sm flex flex-col">
                    <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
                      Student-Stated Priority
                    </span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-priority-low"></span>
                      <span className="font-label text-label text-text-secondary uppercase">NORMAL (ROUTINE)</span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-disabled mt-1">
                      Reported by: Ananya S. (Wing Rep)
                    </span>
                  </div>
                  <div className="bg-status-raised-bg border border-status-raised-border p-space-sm flex flex-col">
                    <span className="font-micro-label text-micro-label text-status-raised-text uppercase tracking-wider flex items-center justify-between">
                      <span>System-Inferred Severity</span>
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-priority-high"></span>
                      <span className="font-label text-label text-priority-high uppercase font-bold">
                        HIGH PRIORITY (SURGE)
                      </span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-muted mt-1">
                      Multiplier: 54 Impacted Residents
                    </span>
                  </div>
                </div>

                {/* Algorithmic Reasoning Box */}
                <div className="bg-surface-inset border-l-2 border-priority-high p-space-sm flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-priority-high">
                    <span className="material-symbols-outlined text-[15px]">multiline_chart</span>
                    <span className="font-micro-label text-micro-label uppercase tracking-widest font-semibold">
                      Community Footprint Multiplier
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Elevated from normal due to downstream cascade: cold water shutdown directly impacts 54 enrolled residents across Block IV Wings A &amp; B. Historical recurring failure in same riser valve indicates imminent pipe burst if unresolved within 6 hours.
                  </p>
                </div>
              </div>

              <div className="bg-surface-2 border-t border-border-subtle p-space-md flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-2">
                  <button
                    className="h-9 px-space-md bg-brand-600 hover:bg-brand-500 border border-brand-400 text-text-primary font-label text-label tracking-wide uppercase transition-colors flex items-center gap-1.5"
                    onClick={handlePromoteSnk9014}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">upgrade</span>
                    Promote to High Priority
                  </button>
                  <button
                    className="h-9 px-space-sm bg-surface-1 hover:bg-surface-3 border border-border-default text-text-secondary font-label text-label transition-colors"
                    onClick={() => setSnk9014State('kept')}
                    type="button"
                  >
                    Override &amp; Keep Normal
                  </button>
                </div>
                <button
                  className="h-9 px-space-sm text-text-muted hover:text-text-primary font-micro-label text-micro-label uppercase flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">rule</span>
                  View Triage Rules
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DUPLICATE & CLUSTERED COMPLAINTS ENGINE */}
        <section className="flex flex-col gap-space-md">
          {/* Structural Notice Guard */}
          <div className="bg-surface-inset border border-secondary/30 p-space-md flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 bg-secondary/10 border border-secondary/40 flex items-center justify-center flex-shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-label text-secondary uppercase tracking-wider font-semibold">
                  Strict Duplicate Guard Policy
                </span>
                <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Complaints are <span className="text-text-primary font-semibold">NEVER</span> automatically merged. Co-signing and signal aggregation require authorized custodian verification to preserve student audit integrity.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs text-text-muted font-micro-label text-micro-label uppercase">
              <span className="w-2 h-2 rounded-full bg-status-resolved-border"></span>
              Audit Lockout Safe
            </div>
          </div>

          {/* Active Cluster Header */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="px-1.5 py-0.5 bg-surface-3 text-secondary font-micro-label text-micro-label uppercase">
                STAGE 02
              </span>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Active Cluster Review Docket
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-micro-label text-micro-label text-text-muted uppercase">
                ALGORITHM: COSINE + GEO-CAD-MESH
              </span>
            </div>
          </div>

          {/* Cluster Master Card */}
          <div className="bg-surface-1 border border-border-strong flex flex-col">
            {/* Cluster Meta Banner */}
            <div className="p-space-lg bg-surface-2/60 border-b border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 bg-primary-container border border-brand-400 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">group_work</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-status-verified-bg border border-status-verified-border text-status-verified-text font-micro-label text-micro-label uppercase font-semibold">
                      CLUSTER ALPHA // 94% SIMILARITY CONFIDENCE
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted uppercase">
                      RADIAL RANGE: 25 METERS
                    </span>
                  </div>
                  <h3 className="font-headline-2 text-headline-2 text-text-primary mt-1">
                    Hostel Block IV Plumbing &amp; Low Water Pressure
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                    4 inbound grievance signals pinpointing singular manifold failure in Block IV riser network.
                  </p>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex items-center gap-space-lg self-start lg:self-auto bg-surface-inset border border-border-subtle px-space-md py-space-sm">
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label text-text-muted uppercase">REPORTS</span>
                  <span className="font-headline-4 text-headline-4 text-text-primary font-bold">4 Linked</span>
                </div>
                <div className="h-8 w-px bg-border-default"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label text-text-muted uppercase">STUDENTS REPRESENTED</span>
                  <span className="font-headline-4 text-headline-4 text-secondary font-bold">112 Total</span>
                </div>
                <div className="h-8 w-px bg-border-default"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label text-text-muted uppercase">EST. ROOT CAUSE</span>
                  <span className="font-headline-4 text-headline-4 text-brand-300 font-bold">1 Singularity</span>
                </div>
              </div>
            </div>

            {/* Comparative Layout: Primary vs Clustered */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle">
              {/* Primary Anchor Ticket (5 cols) */}
              <div className="lg:col-span-5 p-space-lg flex flex-col justify-between bg-surface-inset/60">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-primary text-on-primary font-micro-label text-micro-label uppercase font-bold tracking-wider">
                      PRIMARY REFERENCE ANCHOR
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted uppercase">
                      FILED 07:15 AM (T-0)
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-3 text-headline-3 text-text-primary">#SNK-9014</span>
                    <span className="font-label text-label text-brand-300 font-semibold mt-1">
                      Hostel IV Basement Hot Water Manifold Rupture
                    </span>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-2 leading-relaxed">
                      "Water pooling in basement near mechanical room boiler intake. Pressure gauge reading zero on line IV-B. Hot water cut to entire East riser stack."
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-surface-2 p-2 border border-border-subtle flex flex-col">
                      <span className="font-micro-label text-[10px] text-text-muted uppercase">Direct Affected</span>
                      <span className="font-label text-label text-text-primary font-semibold">54 Residents</span>
                    </div>
                    <div className="bg-surface-2 p-2 border border-border-subtle flex flex-col">
                      <span className="font-micro-label text-[10px] text-text-muted uppercase">Asset Tag</span>
                      <span className="font-label text-label text-text-primary font-semibold">BLR-HVAC-04-MAN</span>
                    </div>
                  </div>

                  {/* Spatial Vector Visual */}
                  <div className="bg-surface-1 border border-border-default p-space-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between text-text-muted">
                      <span className="font-micro-label text-micro-label uppercase tracking-wider">
                        Campus BIM Riser Coordinates
                      </span>
                      <span className="font-micro-label text-micro-label text-primary font-semibold">
                        HOSTEL-BLD-04 // Z0
                      </span>
                    </div>
                    <div className="w-full h-16 bg-surface-inset border border-border-subtle relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-15 flex items-center justify-around pointer-events-none">
                        <span className="w-px h-full bg-primary"></span>
                        <span className="w-px h-full bg-primary"></span>
                        <span className="w-px h-full bg-primary"></span>
                        <span className="w-px h-full bg-primary"></span>
                      </div>
                      <div className="relative z-10 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-priority-critical rounded-full animate-ping"></span>
                        <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-primary">
                          VALVE MANIFOLD ZERO-POINT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-space-md border-t border-border-subtle mt-4">
                  <span className="font-micro-label text-micro-label text-text-disabled uppercase">
                    Designated Master Complaint
                  </span>
                </div>
              </div>

              {/* Secondary Inbound Reports (7 cols) */}
              <div className="lg:col-span-7 p-space-lg flex flex-col justify-between">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                      SECONDARY INCOMING REPORTS (DETECTED EQUIVALENCES)
                    </span>
                    <span className="font-micro-label text-micro-label text-secondary uppercase font-semibold">
                      3 CONVERGING TICKETS
                    </span>
                  </div>

                  {/* Report List */}
                  <div className="flex flex-col gap-space-sm">
                    {SECONDARY_REPORTS.map((report) => (
                      <div
                        key={report.id}
                        className="p-space-sm bg-surface-2 border border-border-subtle hover:border-border-default transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm"
                      >
                        <div className="flex items-start gap-space-sm">
                          <input
                            checked={!!checkedReports[report.id]}
                            onChange={() => toggleReport(report.id)}
                            className="mt-1 accent-brand-600 w-4 h-4 bg-surface-inset rounded cursor-pointer"
                            type="checkbox"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-label text-label text-text-primary font-semibold">
                                {report.id}
                              </span>
                              <span className="px-1.5 py-0.2 bg-surface-3 text-text-secondary font-micro-label text-micro-label">
                                {report.time}
                              </span>
                              <span className="text-brand-300 font-micro-label text-micro-label uppercase">
                                {report.semanticFit}
                              </span>
                            </div>
                            <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                              {report.summary}
                            </span>
                            <div className="flex items-center gap-3 text-text-muted font-micro-label text-[10px] mt-1">
                              <span>{report.offset}</span>
                              <span>•</span>
                              <span>{report.complainant}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setCompareModalId(report.id)}
                          className="h-7 px-space-xs text-text-muted hover:text-text-primary font-micro-label text-micro-label uppercase border border-border-subtle hover:border-border-default self-end sm:self-auto flex items-center gap-1"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          Compare
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custodian Decision Action Suite */}
                <div className="pt-space-md border-t border-border-subtle mt-4 flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleMergeCluster}
                      className="h-10 px-space-md bg-copper-500 hover:bg-copper-400 border border-copper-400 text-text-primary font-label text-label tracking-wide uppercase flex items-center gap-2 transition-all shadow-sm"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[17px]">merge_type</span>
                      {clusterMerged
                        ? 'Merged into Primary #SNK-9014 (Pending Review)'
                        : 'Merge Secondary Reports into Primary #SNK-9014'}
                    </button>
                    <button
                      className="h-10 px-space-md bg-surface-2 hover:bg-surface-3 border border-border-default text-text-secondary font-label text-label transition-colors"
                      type="button"
                    >
                      Keep Independent / Separate Investigations
                    </button>
                  </div>
                  <button
                    className="h-10 px-space-sm text-text-muted hover:text-text-primary font-label text-label uppercase flex items-center gap-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
                    Inspect Side-by-Side Metadata
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: RECURRING INFRASTRUCTURE HOTSPOT ANALYSIS */}
        <section className="flex flex-col gap-space-md pb-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-space-sm gap-2">
            <div className="flex items-center gap-space-sm">
              <span className="px-1.5 py-0.5 bg-surface-3 text-brand-300 font-micro-label text-micro-label uppercase">
                STAGE 03
              </span>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Recurring Infrastructure Hotspot Analysis
              </h2>
            </div>
            <div className="flex items-center gap-2 font-micro-label text-micro-label text-text-muted uppercase">
              <span>WINDOW: TRAILING 45 DAYS</span>
              <span>•</span>
              <span className="text-primary font-semibold">ROOT CAUSE ENGINE ACTIVE</span>
            </div>
          </div>

          {/* Hotspot Diagnostic Table Card */}
          <div className="bg-surface-1 border border-border-default overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-raised border-b border-border-subtle">
                    <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                      Physical Campus Node
                    </th>
                    <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                      Historical Signal Frequency
                    </th>
                    <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                      Identified Mechanical Vector
                    </th>
                    <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                      Recommended Custodial Resolution
                    </th>
                    <th className="py-space-sm px-space-md font-micro-label text-micro-label uppercase tracking-wider text-text-muted text-right">
                      Administrative Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body-sm text-body-sm">
                  {/* Hotspot Row 1: Building 3 HVAC */}
                  <tr className="hover:bg-surface-2 transition-colors">
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 bg-surface-inset border border-border-default flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[16px]">hvac</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label text-label text-text-primary font-semibold">
                            Building 3 HVAC Core
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted uppercase">
                            Engineering Quad • Sub-basement
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-status-critical-bg text-status-critical-text font-label text-label font-bold border border-status-critical-border">
                          5 distinct tickets
                        </span>
                        <span className="font-micro-label text-micro-label text-text-disabled">/ 45 days</span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col">
                        <span className="font-label text-label text-text-primary">Chiller Breaker Tripping</span>
                        <span className="font-body-sm text-text-muted text-[12px]">
                          Phase-3 overload under ambient temperatures &gt; 31°C
                        </span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="px-2 py-1 bg-surface-inset border border-priority-high/40 text-priority-high font-micro-label text-micro-label uppercase tracking-wider font-semibold">
                        Flagged for Capital Budget Replacement
                      </span>
                    </td>
                    <td className="py-space-md px-space-md text-right">
                      <button
                        className="h-8 px-space-sm bg-brand-600 hover:bg-brand-500 text-text-primary border border-brand-500 font-label text-label transition-colors"
                        type="button"
                      >
                        Draft Capital Order
                      </button>
                    </td>
                  </tr>

                  {/* Hotspot Row 2: Central Library Wi-Fi */}
                  <tr className="hover:bg-surface-2 transition-colors">
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 bg-surface-inset border border-border-default flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[16px]">wifi</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label text-label text-text-primary font-semibold">
                            Central Library North Wing Wi-Fi
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted uppercase">
                            Academic Sector • Fl. 2 Study Desks
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-status-raised-bg text-status-raised-text font-label text-label font-bold border border-status-raised-border">
                          7 intermittent drops
                        </span>
                        <span className="font-micro-label text-micro-label text-text-disabled">/ 30 days</span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col">
                        <span className="font-label text-label text-text-primary">AP-412 Roaming Firmware Flaw</span>
                        <span className="font-body-sm text-text-muted text-[12px]">
                          Client handover loop between Node 412A &amp; 412B
                        </span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="px-2 py-1 bg-status-resolved-bg border border-status-resolved-border text-status-resolved-text font-micro-label text-micro-label uppercase tracking-wider font-semibold">
                        Root Cause Patch Issued (v3.2.1-IT)
                      </span>
                    </td>
                    <td className="py-space-md px-space-md text-right">
                      <button
                        className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary border border-border-default font-label text-label transition-colors"
                        type="button"
                      >
                        Deploy IT Validation
                      </button>
                    </td>
                  </tr>

                  {/* Hotspot Row 3: Audi 2 HVAC */}
                  <tr className="hover:bg-surface-2 transition-colors">
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 bg-surface-inset border border-border-default flex items-center justify-center text-text-muted">
                          <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label text-label text-text-primary font-semibold">
                            Lecture Hall Complex Audi 2
                          </span>
                          <span className="font-micro-label text-micro-label text-text-muted uppercase">
                            Auditorium Wing • Tier 1
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-surface-3 text-text-secondary font-label text-label font-bold border border-border-default">
                          3 acoustic disturbances
                        </span>
                        <span className="font-micro-label text-micro-label text-text-disabled">/ 21 days</span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col">
                        <span className="font-label text-label text-text-primary">Acoustic Vibration Resonance</span>
                        <span className="font-body-sm text-text-muted text-[12px]">
                          Duct damper loose harmonic frequency at 50Hz
                        </span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="px-2 py-1 bg-surface-inset border border-border-default text-text-secondary font-micro-label text-micro-label uppercase tracking-wider font-semibold">
                        Acoustic Baffle Work Order Queued
                      </span>
                    </td>
                    <td className="py-space-md px-space-md text-right">
                      <button
                        className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary border border-border-default font-label text-label transition-colors"
                        type="button"
                      >
                        View Work Order #448
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Diagnostic Panel Footer Note */}
            <div className="p-space-md bg-surface-2/40 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-text-muted">
                <span className="material-symbols-outlined text-[16px] text-brand-300">analytics</span>
                <span className="font-micro-label text-micro-label uppercase">
                  Telemetry continuously mapped to Campus Maintenance Master Ledger
                </span>
              </div>
              <span className="font-micro-label text-micro-label text-text-disabled uppercase">
                ILLUSTRATIVE PREVIEW DATA • CONFIDENTIAL GOVERNANCE
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Compare Modal */}
      {compareModalId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-default w-full max-w-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">compare</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">
                  Side-by-Side Comparison: Primary vs {compareModalId}
                </h3>
              </div>
              <button
                onClick={() => setCompareModalId(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-inset p-3 border border-border-subtle">
                <span className="font-micro-label text-primary uppercase font-bold">PRIMARY #SNK-9014</span>
                <p className="text-body-sm text-text-secondary mt-2">
                  "Water pooling in basement near mechanical room boiler intake. Pressure gauge reading zero on line IV-B."
                </p>
                <div className="mt-2 text-[10px] text-text-muted font-mono">Location: Boys Hostel IV Basement</div>
              </div>
              <div className="bg-surface-inset p-3 border border-border-subtle">
                <span className="font-micro-label text-secondary uppercase font-bold">SECONDARY {compareModalId}</span>
                <p className="text-body-sm text-text-secondary mt-2">
                  {SECONDARY_REPORTS.find((r) => r.id === compareModalId)?.summary || ''}
                </p>
                <div className="mt-2 text-[10px] text-text-muted font-mono">
                  {SECONDARY_REPORTS.find((r) => r.id === compareModalId)?.offset || ''}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCompareModalId(null)}
                className="h-8 px-4 bg-surface-2 hover:bg-surface-3 border border-border-default text-text-secondary font-label text-label"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

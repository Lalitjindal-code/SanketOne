import React, { useState, useEffect } from 'react';
import { useDemoData } from '@/context/DemoDataContext';

interface EscalationRecord {
  timestamp: string;
  ticketId: string;
  issue: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  tierBadgeClass: string;
  reason: string;
  notified: string;
  outcome: string;
  outcomeClass: string;
}

const HISTORICAL_ESCALATIONS: EscalationRecord[] = [
  {
    timestamp: 'Oct 24, 10:15 AM',
    ticketId: '#SNK-8841',
    issue: 'Building 3 Chiller Overheat',
    tier: 'Tier 2',
    tierBadgeClass: 'bg-status-critical-bg text-status-critical-text',
    reason: 'No technician acknowledged ticket within 2h SLA threshold',
    notified: 'Dean of Student Affairs, Chief Engineer',
    outcome: 'Under Deanery Review',
    outcomeClass: 'bg-status-raised-bg text-status-raised-text',
  },
  {
    timestamp: 'Oct 21, 04:30 PM',
    ticketId: '#SNK-8721',
    issue: 'Library 3rd Fl Main Wi-Fi Down',
    tier: 'Tier 1',
    tierBadgeClass: 'bg-status-raised-bg text-status-raised-text',
    reason: 'Simultaneous exam session disrupted during departmental colloquium',
    notified: 'Director IT Infrastructure, Dean (Academic)',
    outcome: 'Resolved (3h 15m)',
    outcomeClass: 'bg-status-resolved-bg text-status-resolved-text',
  },
  {
    timestamp: 'Oct 18, 08:00 AM',
    ticketId: '#SNK-8610',
    issue: 'Chemistry Lab Exhaust Hood',
    tier: 'Tier 3',
    tierBadgeClass: 'bg-status-in-progress-bg text-status-in-progress-text',
    reason: 'Vendor parts shipment delayed beyond 48-hour statutory window',
    notified: 'Dean of Sciences, Lab Safety Officer',
    outcome: 'Temp Venting Certified',
    outcomeClass: 'bg-surface-2 text-text-secondary',
  },
  {
    timestamp: 'Oct 14, 11:20 AM',
    ticketId: '#SNK-8490',
    issue: 'Hostel Block B Main Transformer',
    tier: 'Tier 1',
    tierBadgeClass: 'bg-status-critical-bg text-status-critical-text',
    reason: 'Phase drop threat to emergency backup water lift pumps',
    notified: 'State Grid Liaison, Registrar, Chief Warden',
    outcome: 'Resolved (1h 40m)',
    outcomeClass: 'bg-status-resolved-bg text-status-resolved-text',
  },
  {
    timestamp: 'Oct 09, 02:45 PM',
    ticketId: '#SNK-8332',
    issue: 'Dining Hall Sewage Backflow',
    tier: 'Tier 1',
    tierBadgeClass: 'bg-status-critical-bg text-status-critical-text',
    reason: 'Severe health regulation compliance risk prior to dinner cycle',
    notified: 'Public Health Officer, Food Committee Chair',
    outcome: 'Resolved (2h 10m)',
    outcomeClass: 'bg-status-resolved-bg text-status-resolved-text',
  },
];

export const SlaEscalationsPage: React.FC = () => {
  const { dispatchContractor, recordDeferral } = useDemoData();
  const [tierFilter, setTierFilter] = useState<string>('All Tiers (1-3)');
  const [t1Seconds, setT1Seconds] = useState(1 * 3600 + 45 * 60 + 22);
  const [t2Seconds, setT2Seconds] = useState(3 * 3600 + 10 * 60 + 15);

  const [contractorDispatched, setContractorDispatched] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [deferralReason, setDeferralReason] = useState('');
  const [deferralSaved, setDeferralSaved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setT1Seconds((prev) => (prev > 0 ? prev - 1 : 0));
      setT2Seconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  };

  const filteredRecords = HISTORICAL_ESCALATIONS.filter((record) => {
    if (tierFilter === 'Tier 1 Only') return record.tier === 'Tier 1';
    if (tierFilter === 'Tier 2 Only') return record.tier === 'Tier 2';
    if (tierFilter === 'Tier 3 Only') return record.tier === 'Tier 3';
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-space-lg py-space-xl flex flex-col gap-space-xl max-w-[1400px] mx-auto">
        {/* 1. Operational Header & Metric Ribbon */}
        <section className="flex flex-col gap-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="flex flex-col max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-critical-border animate-ping"></span>
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest">
                  GOVERNANCE AUDIT // SLA INTEGRITY &amp; DEANERY ESCALATIONS
                </span>
                <span className="font-micro-label text-micro-label text-text-disabled">//</span>
                <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest">
                  TELEMETRY CYCLE 44-B
                </span>
              </div>
              <h1 className="font-headline-1 text-headline-1 text-text-primary mt-1 tracking-tight">
                SLA Tracking &amp; Escalations
              </h1>
              <p className="font-body-md text-body-md text-text-secondary mt-1">
                Enforce response time limits, monitor approaching breach deadlines, and track formal administrative escalation protocols.
              </p>
            </div>
            <div className="flex items-center gap-space-sm self-start lg:self-end">
              <div className="px-space-sm py-1 bg-surface-1 flex items-center gap-2">
                <span className="font-micro-label text-micro-label text-text-muted uppercase">AUDIT MODE:</span>
                <span className="font-micro-label text-micro-label text-primary font-semibold uppercase">
                  ACTIVE RECORDING
                </span>
              </div>
              <button
                className="h-9 px-space-md bg-surface-2 hover:bg-surface-3 text-text-primary text-label font-label flex items-center gap-1.5 transition-colors"
                onClick={() => setActiveModal('export')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-text-secondary">download</span>
                <span>Export Compliance Report</span>
              </button>
            </div>
          </div>

          {/* Context Metric Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
            <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                  Active Monitored SLAs
                </span>
                <span className="material-symbols-outlined text-primary text-[18px]">fact_check</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-numeric-kpi text-numeric-kpi text-text-primary tabular-nums">28</span>
                <span className="font-label text-label text-text-muted uppercase">Cases</span>
              </div>
              <div className="mt-2 text-micro-label font-micro-label text-text-secondary flex items-center gap-1">
                <span className="text-brand-300">↑ 3</span> vs. prior 24h interval
              </div>
            </div>

            <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                  Approaching Breach (&lt;2h)
                </span>
                <span className="material-symbols-outlined text-priority-high text-[18px]">timelapse</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-numeric-kpi text-numeric-kpi text-secondary tabular-nums">04</span>
                <span className="font-label text-label text-text-muted uppercase">Imminent</span>
              </div>
              <div className="mt-2 text-micro-label font-micro-label text-priority-high flex items-center gap-1">
                <span>Critical urgency runway</span>
              </div>
            </div>

            <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                  Currently Breached
                </span>
                <span className="material-symbols-outlined text-priority-critical text-[18px]">warning</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-numeric-kpi text-numeric-kpi text-priority-critical tabular-nums">02</span>
                <span className="font-label text-label text-text-muted uppercase">Cases</span>
              </div>
              <div className="mt-2 text-micro-label font-micro-label text-priority-critical flex items-center gap-1">
                <span>Deanery notifications live</span>
              </div>
            </div>

            <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                  Mean 1st Action Time
                </span>
                <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">speed</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-numeric-kpi text-numeric-kpi text-text-primary tabular-nums">34</span>
                <span className="font-label text-label text-text-muted uppercase">Minutes</span>
              </div>
              <div className="mt-2 text-micro-label font-micro-label text-brand-300 flex items-center gap-1">
                <span>-6m against benchmark</span>
              </div>
            </div>

            <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                  Campus Compliance
                </span>
                <span className="material-symbols-outlined text-status-verified-text text-[18px]">verified</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-numeric-kpi text-numeric-kpi text-text-primary tabular-nums">92.4%</span>
                <span className="font-micro-label text-micro-label text-priority-medium uppercase">Target: 95%</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 bg-surface-inset">
                  <div className="h-1 bg-brand-400" style={{ width: '92.4%' }}></div>
                </div>
                <span className="font-micro-label text-[9px] text-text-secondary tabular-nums">GAP: -2.6%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Operational SLA Tier Legend & Policy Protocol */}
        <section className="p-space-md bg-surface-container-low flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">gavel</span>
              <span className="font-label text-label uppercase tracking-widest text-text-primary">
                Institutional SLA Protocol Specification
              </span>
            </div>
            <span className="font-micro-label text-micro-label text-text-muted uppercase">
              Council Revision: AC-2024-R3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Tier 1 */}
            <div className="p-space-md bg-surface-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-status-critical-bg text-status-critical-text font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-priority-critical"></span> Tier 1 // Critical Hazards
                  </span>
                  <span className="font-micro-label text-micro-label text-text-muted">CODE: T1-CRIT</span>
                </div>
                <div className="font-headline-4 text-headline-4 text-text-primary">Mandatory 45m Dispatch</div>
                <p className="font-body-sm text-body-sm text-text-secondary mt-2">
                  Life safety, electrical fire hazards, active flooding, elevator passenger entrapment, server facility failures.
                </p>
              </div>
              <div className="mt-4 pt-3 bg-surface-inset p-2 flex items-center justify-between text-micro-label font-micro-label">
                <span className="text-text-muted uppercase">Auto-Escalation Target:</span>
                <span className="text-priority-critical font-semibold uppercase">Deanery Relay @ 2h 00m</span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-space-md bg-surface-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-status-raised-bg text-status-raised-text font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-priority-high"></span> Tier 2 // Major Disruption
                  </span>
                  <span className="font-micro-label text-micro-label text-text-muted">CODE: T2-HIGH</span>
                </div>
                <div className="font-headline-4 text-headline-4 text-text-primary">Initial Action &lt; 4 Hours</div>
                <p className="font-body-sm text-body-sm text-text-secondary mt-2">
                  Classroom HVAC offline, Wi-Fi outage during examinations, laboratory ventilation compromise, central mess water shortage.
                </p>
              </div>
              <div className="mt-4 pt-3 bg-surface-inset p-2 flex items-center justify-between text-micro-label font-micro-label">
                <span className="text-text-muted uppercase">Auto-Escalation Target:</span>
                <span className="text-priority-high font-semibold uppercase">Department Head @ 12h 00m</span>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-space-md bg-surface-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span> Tier 3 // Operational
                  </span>
                  <span className="font-micro-label text-micro-label text-text-muted">CODE: T3-NORM</span>
                </div>
                <div className="font-headline-4 text-headline-4 text-text-primary">Standard 24h Target</div>
                <p className="font-body-sm text-body-sm text-text-secondary mt-2">
                  Dorm furniture replacement, individual reading lamp repair, pathway lighting cosmetic defect, non-essential plumbing fixtures.
                </p>
              </div>
              <div className="mt-4 pt-3 bg-surface-inset p-2 flex items-center justify-between text-micro-label font-micro-label">
                <span className="text-text-muted uppercase">Auto-Escalation Target:</span>
                <span className="text-brand-300 font-semibold uppercase">Ombudsman Review on Breach</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Urgent Intervention Docket: Breached & Approaching Deadlines */}
        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-priority-critical"></span>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Urgent Intervention Docket
              </h2>
              <span className="font-micro-label text-micro-label px-2 py-0.5 bg-status-critical-bg text-status-critical-text uppercase">
                Immediate Action Required
              </span>
            </div>
            <span className="font-micro-label text-micro-label text-text-muted tabular-nums uppercase">
              Real-Time Refresh Interval: 15s
            </span>
          </div>

          <div className="flex flex-col gap-space-md">
            {/* Card 1: Critically Breached */}
            <div className="p-space-lg bg-surface-1 relative overflow-hidden flex flex-col lg:flex-row gap-space-lg">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-priority-critical"></div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-status-critical-bg text-status-critical-text font-micro-label text-micro-label uppercase tracking-widest font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">alarm_on</span> CRITICALLY BREACHED
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted font-mono uppercase tracking-wider">
                      CASE RECORD #SNK-8841
                    </span>
                    <span className="px-2 py-0.5 bg-surface-inset text-priority-critical font-micro-label text-micro-label uppercase">
                      Overdue by +42m
                    </span>
                  </div>
                  <h3 className="font-headline-3 text-headline-3 text-text-primary mt-1">
                    Building 3 HVAC Recurring Chiller Failure
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Third compressor trip within 48 hours. Temperature in Central Data Vault &amp; Physics Cryo-Storage approaching maximum safe operational envelope (+24°C).
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm my-space-md p-space-sm bg-surface-inset">
                  <div className="flex flex-col">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">SLA Threshold</span>
                    <span className="font-label text-label text-text-primary mt-0.5 tabular-nums">02h 00m 00s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">Total Elapsed</span>
                    <span className="font-label text-label text-priority-critical mt-0.5 tabular-nums font-semibold">
                      02h 42m 18s
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">Severity Grade</span>
                    <span className="font-label text-label text-priority-critical mt-0.5 uppercase">
                      Critical Hazard
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">Custodian Handling</span>
                    <span className="font-label text-label text-text-primary mt-0.5 truncate">
                      Estates MEP Central
                    </span>
                  </div>
                </div>

                {/* Telemetry relay message */}
                <div className="p-space-sm bg-surface-2 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
                    broadcast_on_personal
                  </span>
                  <div className="flex flex-col">
                    <span className="font-micro-label text-micro-label uppercase text-secondary font-semibold">
                      Automatic Deanery Telemetry Dispatched
                    </span>
                    <span className="font-body-sm text-body-sm text-text-primary">
                      Direct SMS &amp; secure console ping transmitted to{' '}
                      <strong className="text-text-primary">Prof. K. Venkatesh (Dean of Student Affairs)</strong> &amp;{' '}
                      <strong className="text-text-primary">Campus Chief Engineer</strong> at 10:15 AM IST.
                    </span>
                  </div>
                </div>
              </div>

              {/* Custodian Interventions */}
              <div className="w-full lg:w-80 flex flex-col justify-between bg-surface-container p-space-md gap-space-md">
                <div>
                  <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest">
                    MANDATORY CUSTODIAN ACTIONS
                  </span>
                  <div className="font-label text-label text-text-primary font-semibold mt-1">
                    Escalation Tier 2: Active Protocol
                  </div>
                  <p className="font-micro-label text-micro-label text-text-secondary mt-1">
                    Resolution plan submission required within 18 minutes to preempt Chancellor-level notification.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className={`w-full h-11 ${
                      contractorDispatched ? 'bg-status-resolved-bg text-status-resolved-text border border-status-resolved-border' : 'bg-copper-500 hover:bg-copper-400 text-text-primary'
                    } font-label text-label uppercase tracking-wide flex items-center justify-center gap-2 transition-colors`}
                    onClick={() => {
                      dispatchContractor(
                        'SNK-8841',
                        'Delta Heavy HVAC & Plumbing Unit',
                        'Emergency bypass contractor dispatched from SLA desk'
                      );
                      setContractorDispatched(true);
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    <span>{contractorDispatched ? 'Contractor Dispatched ✓' : 'Log Contractor Dispatch'}</span>
                  </button>
                  <button
                    className="w-full h-9 bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                    onClick={() => setActiveModal('deferral')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>{deferralSaved ? 'Deferral Logged ✓' : 'Record Deferral Justification'}</span>
                  </button>
                  <button
                    className="w-full h-9 bg-surface-1 hover:bg-surface-2 text-text-muted hover:text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                    onClick={() => setActiveModal('audit')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">history</span>
                    <span>View Real-Time Audit Log</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Approaching Breach Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {/* Card 2: Approaching Breach (East Lift) */}
              <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-status-raised-bg text-status-raised-text font-micro-label text-micro-label uppercase tracking-wider font-semibold">
                        APPROACHING BREACH
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted font-mono uppercase">
                        #SNK-9812
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-inset text-secondary font-micro-label text-micro-label font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span className="tabular-nums font-semibold" id="countdown-1">
                        {formatTime(t1Seconds)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-headline-4 text-headline-4 text-text-primary">
                      East Lift Grinding &amp; Cable Stoppage
                    </h4>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                      Carriage halted between floors 4 and 5 (Sarojini Naidu Hall). Confirmed empty of occupants. Mechanical brake engaged.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-2 bg-surface-inset text-micro-label font-micro-label">
                    <div>
                      <span className="text-text-muted uppercase block">Severity:</span>
                      <span className="text-priority-critical font-semibold uppercase mt-0.5 block">Critical Safety</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">Assigned Unit:</span>
                      <span className="text-text-primary mt-0.5 block truncate">Estates Lift Maintenance</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">SLA Expiry:</span>
                      <span className="text-secondary mt-0.5 block tabular-nums">12:30 PM Today</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3">
                  <button
                    className="flex-1 h-9 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                    <span>Send Priority Ping</span>
                  </button>
                  <button
                    className="h-9 px-space-md bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>Reassign Standby</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Approaching Breach (Water cooler) */}
              <div className="p-space-md bg-surface-1 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-2 transition-colors">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-status-raised-bg text-status-raised-text font-micro-label text-micro-label uppercase tracking-wider font-semibold">
                        APPROACHING BREACH
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted font-mono uppercase">
                        #SNK-8802
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-inset text-priority-high font-micro-label text-micro-label font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-priority-high"></span>
                      <span className="tabular-nums font-semibold" id="countdown-2">
                        {formatTime(t2Seconds)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-headline-4 text-headline-4 text-text-primary">
                      Water Cooler Non-Operational (2nd Floor North)
                    </h4>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                      Directly outside Exam Hall C. Ambient heat causing student distress; immediate potable supply redirection or filter replacement needed.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-2 bg-surface-inset text-micro-label font-micro-label">
                    <div>
                      <span className="text-text-muted uppercase block">Severity:</span>
                      <span className="text-priority-high font-semibold uppercase mt-0.5 block">High Priority</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">Assigned Unit:</span>
                      <span className="text-text-primary mt-0.5 block truncate">Team Delta (Plumbing)</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">SLA Expiry:</span>
                      <span className="text-text-primary mt-0.5 block tabular-nums">01:55 PM Today</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3">
                  <button
                    className="flex-1 h-9 bg-surface-2 hover:bg-surface-3 text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                    <span>Deploy Interim Water Stock</span>
                  </button>
                  <button
                    className="h-9 px-space-md bg-surface-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary font-label text-label uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Notify Warden</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Escalation History & Audit Trail Ledger */}
        <section className="flex flex-col gap-space-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Institutional Escalation Ledger
              </h2>
              <span className="font-micro-label text-micro-label text-text-muted uppercase">
                Chronological Record of Tier 1-3 Escalation Invocations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-micro-label text-micro-label text-text-secondary uppercase">Filter Tier:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-8 px-2 bg-surface-inset text-text-primary font-micro-label text-micro-label uppercase focus:outline-none cursor-pointer"
              >
                <option>All Tiers (1-3)</option>
                <option>Tier 1 Only</option>
                <option>Tier 2 Only</option>
                <option>Tier 3 Only</option>
              </select>
            </div>
          </div>

          <div className="w-full bg-surface-1 overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm min-w-[960px]">
              <thead className="bg-background-raised uppercase font-micro-label text-micro-label text-text-muted select-none">
                <tr>
                  <th className="py-3 px-space-md">Timestamp</th>
                  <th className="py-3 px-space-sm">Ticket ID</th>
                  <th className="py-3 px-space-sm">Issue Designation</th>
                  <th className="py-3 px-space-sm">Escalation Tier</th>
                  <th className="py-3 px-space-sm">Trigger Reason</th>
                  <th className="py-3 px-space-sm">Notified Parties</th>
                  <th className="py-3 px-space-md text-right">Resolution Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 font-body-sm">
                {filteredRecords.map((record) => (
                  <tr key={record.ticketId} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3.5 px-space-md font-mono text-text-secondary whitespace-nowrap">
                      {record.timestamp}
                    </td>
                    <td className="py-3.5 px-space-sm font-mono text-primary font-semibold">
                      {record.ticketId}
                    </td>
                    <td className="py-3.5 px-space-sm text-text-primary font-semibold">
                      {record.issue}
                    </td>
                    <td className="py-3.5 px-space-sm">
                      <span className={`px-2 py-0.5 ${record.tierBadgeClass} font-micro-label text-micro-label uppercase`}>
                        {record.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-sm text-text-secondary">
                      {record.reason}
                    </td>
                    <td className="py-3.5 px-space-sm text-text-primary">
                      {record.notified}
                    </td>
                    <td className="py-3.5 px-space-md text-right">
                      <span className={`px-2 py-0.5 ${record.outcomeClass} font-micro-label text-micro-label uppercase`}>
                        {record.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-micro-label font-micro-label text-text-muted px-1">
            <span>
              Displaying {filteredRecords.length} of {HISTORICAL_ESCALATIONS.length} historical escalation records for Semester 1 (2024-25)
            </span>
            <a className="text-primary hover:underline uppercase tracking-wider" href="#ledger">
              Inspect Complete Institutional Ledger →
            </a>
          </div>
        </section>

        {/* 5. Department SLA Compliance Benchmark Table */}
        <section className="flex flex-col gap-space-sm pb-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div>
              <h2 className="font-headline-3 text-headline-3 text-text-primary tracking-tight">
                Department SLA Compliance Benchmark
              </h2>
              <span className="font-micro-label text-micro-label text-text-muted uppercase">
                Semester-to-Date Performance Breakdown across All 8 Campus Divisions
              </span>
            </div>
            <div className="px-2 py-1 bg-surface-inset text-brand-300 font-micro-label text-micro-label uppercase">
              Standard Target: ≥ 95.0% On-Time
            </div>
          </div>

          <div className="w-full bg-surface-1 overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm min-w-[850px]">
              <thead className="bg-background-raised uppercase font-micro-label text-micro-label text-text-muted select-none">
                <tr>
                  <th className="py-3 px-space-md">Administrative Department</th>
                  <th className="py-3 px-space-sm">Custodian In-Charge</th>
                  <th className="py-3 px-space-sm">Total Dispatched</th>
                  <th className="py-3 px-space-sm">Breached Incidents</th>
                  <th className="py-3 px-space-sm">Avg. Breach Overrun</th>
                  <th className="py-3 px-space-md text-right">On-Time Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 tabular-nums">
                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-verified-text"></span>
                      <span>IT Infrastructure &amp; Campus Networks</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Dr. S. K. Ramanathan</td>
                  <td className="py-3 px-space-sm text-text-muted">142 cases</td>
                  <td className="py-3 px-space-sm text-text-primary">03</td>
                  <td className="py-3 px-space-sm text-text-secondary">+18 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-verified-text font-semibold">97.8%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-verified-text"></span>
                      <span>Security &amp; Campus Surveillance</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Capt. Anil Varma (Retd.)</td>
                  <td className="py-3 px-space-sm text-text-muted">98 cases</td>
                  <td className="py-3 px-space-sm text-text-primary">02</td>
                  <td className="py-3 px-space-sm text-text-secondary">+12 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-verified-text font-semibold">97.9%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-verified-text"></span>
                      <span>Hostel &amp; Residential Life</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Prof. Meera Sen</td>
                  <td className="py-3 px-space-sm text-text-muted">312 cases</td>
                  <td className="py-3 px-space-sm text-text-primary">14</td>
                  <td className="py-3 px-space-sm text-text-secondary">+32 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-verified-text font-semibold">95.5%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-raised-text"></span>
                      <span>Academic Laboratories &amp; Workshop Safety</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Dr. N. Banerjee</td>
                  <td className="py-3 px-space-sm text-text-muted">74 cases</td>
                  <td className="py-3 px-space-sm text-secondary font-semibold">05</td>
                  <td className="py-3 px-space-sm text-text-secondary">+48 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-raised-text font-semibold">93.2%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-raised-text"></span>
                      <span>Health Centre &amp; Medical First Response</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Dr. Farhan Qureshi</td>
                  <td className="py-3 px-space-sm text-text-muted">56 cases</td>
                  <td className="py-3 px-space-sm text-secondary font-semibold">04</td>
                  <td className="py-3 px-space-sm text-text-secondary">+15 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-raised-text font-semibold">92.8%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-priority-critical"></span>
                      <span>Estates &amp; Facilities (Civil &amp; MEP)</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Er. T. Sridhar</td>
                  <td className="py-3 px-space-sm text-text-muted">428 cases</td>
                  <td className="py-3 px-space-sm text-priority-critical font-bold">42</td>
                  <td className="py-3 px-space-sm text-priority-critical font-semibold">+1h 14m</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-priority-critical font-bold">90.1%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-priority-critical"></span>
                      <span>Dining &amp; Catering Facilities</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Mr. G. K. Chari</td>
                  <td className="py-3 px-space-sm text-text-muted">189 cases</td>
                  <td className="py-3 px-space-sm text-priority-critical font-bold">21</td>
                  <td className="py-3 px-space-sm text-priority-critical font-semibold">+54 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-priority-critical font-bold">88.8%</span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 px-space-md font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-verified-text"></span>
                      <span>Transport &amp; Campus Mobility</span>
                    </div>
                  </td>
                  <td className="py-3 px-space-sm text-text-secondary">Shri Ramesh Yadav</td>
                  <td className="py-3 px-space-sm text-text-muted">45 cases</td>
                  <td className="py-3 px-space-sm text-text-primary">01</td>
                  <td className="py-3 px-space-sm text-text-secondary">+08 mins</td>
                  <td className="py-3 px-space-md text-right">
                    <span className="font-mono text-status-verified-text font-semibold">97.7%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Regulatory note footer */}
          <div className="mt-space-sm p-space-sm bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-text-muted text-[16px]">info</span>
              <span className="font-micro-label text-micro-label text-text-secondary uppercase">
                All figures represent certified semester telemetry data. Compliance breaches under 90% incur mandatory deanery inquiry hearings.
              </span>
            </div>
            <span className="font-micro-label text-micro-label text-brand-300 font-mono">NODE_HASH: 0x98AF..31</span>
          </div>
        </section>
      </div>

      {/* Deferral Reason Modal */}
      {activeModal === 'deferral' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-default w-full max-w-lg p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">edit_note</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">Record Deferral Justification</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-text-muted hover:text-text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-micro-label font-micro-label uppercase text-text-muted">
                Statutory Justification &amp; Dean Rationale (#SNK-8841)
              </label>
              <textarea
                value={deferralReason}
                onChange={(e) => setDeferralReason(e.target.value)}
                placeholder="Specify root cause obstacle (e.g. specialized cryogenic refrigerant delay) and interim mitigation plan..."
                rows={4}
                className="w-full bg-surface-inset border border-border-subtle p-3 text-body-sm text-text-primary focus:outline-none focus:border-brand-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="h-9 px-4 bg-surface-2 text-text-secondary hover:text-text-primary font-label text-label"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  recordDeferral(
                    'SNK-8841',
                    deferralReason || 'Specialized cryogenic refrigerant delay and interim water tanker supply',
                    12
                  );
                  setDeferralSaved(true);
                  setActiveModal(null);
                }}
                className="h-9 px-4 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label"
              >
                Save Deferral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {activeModal === 'audit' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-default w-full max-w-xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">Audit Log: #SNK-8841</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-text-muted hover:text-text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 divide-y divide-border-subtle font-mono text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-text-muted">10:15 AM</span>
                <span className="text-priority-critical">Tier 2 SLA Breach Triggered (+42m overdue)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-text-muted">08:15 AM</span>
                <span className="text-text-secondary">Assigned to Estates MEP Central</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-text-muted">07:33 AM</span>
                <span className="text-primary">Incident Created by Physics Dept Custodian</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="h-8 px-4 bg-surface-2 hover:bg-surface-3 border border-border-default text-text-secondary font-label text-label"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Digest Modal */}
      {activeModal === 'export' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-default w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">download_done</span>
            </div>
            <div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary">Export Compliance Digest</h3>
              <p className="text-body-sm text-text-secondary mt-1">
                Semester 1 (2024-25) SLA Compliance Digest compiled with cryptographic audit hash.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="h-9 px-6 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label uppercase"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

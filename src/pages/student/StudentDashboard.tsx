import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDemoData } from '@/context/DemoDataContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, verifyResolution } = useDemoData();
  const [resolutionStatus, setResolutionStatus] = useState<'pending' | 'confirmed' | 'reopened'>('pending');

  const displayName = user?.fullName?.split(' ')[0] || 'Aditi';

  const totalFiled = complaints.length;
  const underReviewCount = complaints.filter((c) => c.status === 'under_review').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'verified').length;

  const targetVerification = complaints.find((c) => c.status === 'resolved') || complaints.find((c) => c.ticketId === 'SNK-8802');

  const handleConfirm = () => {
    if (targetVerification) {
      verifyResolution(targetVerification.ticketId, 'confirmed');
    }
    setResolutionStatus('confirmed');
  };

  const handleReopen = () => {
    if (targetVerification) {
      verifyResolution(targetVerification.ticketId, 'reopened', 'Continuing vibration and warm discharge');
    }
    setResolutionStatus('reopened');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Welcome & Status Banner */}
      <section className="relative bg-surface-1 rounded-xl p-space-lg shadow-md overflow-hidden mb-space-lg">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-brand-600/10 via-brand-500/5 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="space-y-1">
            <div className="flex items-center gap-space-xs">
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-copper-400 bg-surface-2 px-2 py-0.5 rounded">
                Terminal Alpha • Node 104
              </span>
              <span className="text-text-muted font-micro-label text-micro-label">•</span>
              <span className="text-text-muted font-micro-label text-micro-label uppercase tracking-wider">
                Synchronized 2m ago
              </span>
            </div>
            <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              Good morning, {displayName}.
            </h1>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Here’s what’s happening across your campus.{' '}
              <span className="text-copper-400 font-medium">2 unresolved signals</span> detected in your
              residence quadrant.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <Link
              to="/student/report"
              className="h-11 px-space-md bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label tracking-wide uppercase flex items-center gap-space-xs rounded transition-all shadow-md active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Report a Problem</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Typography-led Personal Complaint KPIs */}
      <section className="bg-surface-1 rounded-xl p-space-md shadow-sm mb-space-lg">
        <div className="flex items-center justify-between px-space-xs pb-space-sm">
          <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
            Personal Signal Ledger
          </span>
          <span className="font-micro-label text-micro-label uppercase tracking-wider text-brand-300">
            Illustrative preview data
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-xs">
          {/* Total */}
          <Link
            to="/student/complaints"
            className="group bg-surface-inset hover:bg-surface-2 p-space-md rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-micro-label text-micro-label uppercase tracking-wider">Total Filed</span>
              <span className="material-symbols-outlined text-[18px] text-text-muted group-hover:text-primary transition-colors">
                folder_open
              </span>
            </div>
            <div className="my-space-xs flex items-baseline gap-2">
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary tabular-nums">
                {String(totalFiled).padStart(2, '0')}
              </span>
              <span className="font-micro-label text-micro-label text-status-verified-text">+1 this week</span>
            </div>
            <div className="flex items-center justify-between text-text-muted pt-1">
              <span className="font-micro-label text-micro-label text-text-muted group-hover:text-text-secondary transition-colors">
                View repository
              </span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </Link>

          {/* Under Review */}
          <Link
            to="/student/complaints"
            className="group bg-surface-inset hover:bg-surface-2 p-space-md rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-status-under-review-text">
              <span className="font-micro-label text-micro-label uppercase tracking-wider">Under Review</span>
              <span className="material-symbols-outlined text-[18px]">manage_search</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-2">
              <span className="font-numeric-kpi text-numeric-kpi text-status-under-review-text tabular-nums">
                {String(underReviewCount).padStart(2, '0')}
              </span>
              <span className="font-micro-label text-micro-label text-text-muted">Estates triage</span>
            </div>
            <div className="flex items-center justify-between text-text-muted pt-1">
              <span className="font-micro-label text-micro-label group-hover:text-status-under-review-text transition-colors">
                Filter stage
              </span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </Link>

          {/* In Progress */}
          <Link
            to="/student/complaints"
            className="group bg-surface-inset hover:bg-surface-2 p-space-md rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-status-in-progress-text">
              <span className="font-micro-label text-micro-label uppercase tracking-wider">In Progress</span>
              <span className="material-symbols-outlined text-[18px]">engineering</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-2">
              <span className="font-numeric-kpi text-numeric-kpi text-status-in-progress-text tabular-nums">
                {String(inProgressCount).padStart(2, '0')}
              </span>
              <span className="font-micro-label text-micro-label text-copper-400">Technician active</span>
            </div>
            <div className="flex items-center justify-between text-text-muted pt-1">
              <span className="font-micro-label text-micro-label group-hover:text-status-in-progress-text transition-colors">
                View active ops
              </span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </Link>

          {/* Verified Resolved */}
          <Link
            to="/student/complaints"
            className="group bg-surface-inset hover:bg-surface-2 p-space-md rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-status-resolved-text">
              <span className="font-micro-label text-micro-label uppercase tracking-wider">
                Verified Resolved
              </span>
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-2">
              <span className="font-numeric-kpi text-numeric-kpi text-status-resolved-text tabular-nums">
                {String(resolvedCount).padStart(2, '0')}
              </span>
              <span className="font-micro-label text-micro-label text-copper-500 font-semibold">
                Sign-off pending
              </span>
            </div>
            <div className="flex items-center justify-between text-text-muted pt-1">
              <span className="font-micro-label text-micro-label group-hover:text-status-resolved-text transition-colors">
                Audit trail
              </span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Two-Column Editorial Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: Active Grievances (~65%) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-3 text-headline-3 text-text-primary">My Active Grievances</span>
              <span className="font-micro-label text-micro-label px-2 py-0.5 rounded bg-surface-2 text-brand-300">
                3 requiring eye
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                className="h-8 px-2.5 rounded bg-surface-1 hover:bg-surface-2 text-text-secondary text-body-sm font-body-sm flex items-center gap-1 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                <span>Priority</span>
              </button>
              <button
                className="h-8 px-2.5 rounded bg-surface-1 hover:bg-surface-2 text-text-secondary text-body-sm font-body-sm flex items-center gap-1 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                <span>Latest</span>
              </button>
            </div>
          </div>

          {/* ENTRY 1: In Progress */}
          <div className="bg-surface-1 hover:bg-surface-2/70 transition-all rounded-xl p-space-md shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-in-progress-border"></div>
            <div className="flex flex-col gap-space-sm pl-2">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-2">
                  <span className="h-6 px-2 rounded bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                    <span>In Progress</span>
                  </span>
                  <span className="h-6 px-2 rounded bg-surface-inset text-priority-high font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">priority_high</span>
                    <span>High Priority</span>
                  </span>
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    #GRV-2025-0891
                  </span>
                </div>
                <div className="flex items-center gap-1 text-copper-400 font-label text-label">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>ETA: Today 4:00 PM</span>
                </div>
              </div>
              <div>
                <h2 className="font-headline-4 text-headline-4 text-text-primary tracking-tight group-hover:text-primary transition-colors">
                  Water cooler non-operational
                </h2>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-text-secondary font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">category</span>
                    Infrastructure
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">location_on</span>
                    Academic Block B, Floor 2
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1 text-brand-300">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    38 students impacted
                  </span>
                </div>
              </div>
              {/* Operation Progress Tracker */}
              <div className="bg-surface-inset p-space-sm rounded-lg mt-1 flex flex-col gap-space-xs">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-text-secondary flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-status-in-progress-text animate-ping"></span>
                    Technician dispatched • Field Service Unit B4
                  </span>
                  <span className="text-text-muted font-micro-label text-micro-label uppercase">SLA on track</span>
                </div>
                <div className="w-full bg-surface-1 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-status-in-progress-text h-full rounded-full w-3/4"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center font-micro-label text-micro-label text-text-primary ring-2 ring-surface-1">
                    RK
                  </div>
                  <div className="w-6 h-6 rounded-full bg-copper-600 flex items-center justify-center font-micro-label text-micro-label text-text-primary ring-2 ring-surface-1">
                    MA
                  </div>
                  <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center font-micro-label text-micro-label text-text-muted ring-2 ring-surface-1">
                    +36
                  </div>
                  <span className="text-text-muted font-micro-label text-micro-label ml-3">Endorsed by cohort</span>
                </div>
                <Link
                  to="/student/complaints"
                  className="text-brand-300 hover:text-text-primary font-label text-label flex items-center gap-1 transition-colors"
                >
                  <span>Inspect audit trail</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ENTRY 2: Under Review */}
          <div className="bg-surface-1 hover:bg-surface-2/70 transition-all rounded-xl p-space-md shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-under-review-border"></div>
            <div className="flex flex-col gap-space-sm pl-2">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-2">
                  <span className="h-6 px-2 rounded bg-status-under-review-bg text-status-under-review-text font-micro-label text-micro-label uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                    <span>Under Review</span>
                  </span>
                  <span className="h-6 px-2 rounded bg-surface-inset text-priority-medium font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    <span>Medium Priority</span>
                  </span>
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    #GRV-2025-0874
                  </span>
                </div>
                <span className="text-text-muted font-micro-label text-micro-label uppercase tracking-wider">
                  Submitted yesterday • 17:40
                </span>
              </div>
              <div>
                <h2 className="font-headline-4 text-headline-4 text-text-primary tracking-tight group-hover:text-primary transition-colors">
                  Projector malfunction in Room 204
                </h2>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-text-secondary font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">devices</span>
                    Classroom Equipment
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">account_balance</span>
                    Science Quadrangle
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1 text-brand-300">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    14 students impacted
                  </span>
                </div>
              </div>
              <div className="bg-surface-inset p-space-sm rounded-lg flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="material-symbols-outlined text-[18px] text-text-muted">assignment_ind</span>
                  <span>Queued for AV Department Technical Lead review</span>
                </div>
                <span className="font-micro-label text-micro-label uppercase text-text-muted">
                  Pending Assignment
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-text-muted font-body-sm text-body-sm">
                  Next SLA milestone: Assignment in 3h 20m
                </span>
                <Link
                  to="/student/complaints"
                  className="text-brand-300 hover:text-text-primary font-label text-label flex items-center gap-1 transition-colors"
                >
                  <span>View details</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ENTRY 3: Verified Resolved (Sign-Off Actionable) */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-verified-border"></div>
            <div className="flex flex-col gap-space-sm pl-2">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-2">
                  <span className="h-6 px-2 rounded bg-status-verified-bg text-status-verified-text font-micro-label text-micro-label uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Verified Resolved</span>
                  </span>
                  <span className="h-6 px-2 rounded bg-copper-500/20 text-copper-400 font-micro-label text-micro-label uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                    <span>Awaiting Student Sign-Off</span>
                  </span>
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    #GRV-2025-0812
                  </span>
                </div>
                <span className="text-text-muted font-micro-label text-micro-label uppercase tracking-wider">
                  Resolved 45m ago
                </span>
              </div>
              <div>
                <h2 className="font-headline-4 text-headline-4 text-text-primary tracking-tight">
                  Library 3rd Floor Wi-Fi Deadzone
                </h2>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-text-secondary font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">wifi</span>
                    Network Infrastructure
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">local_library</span>
                    Central Library West Wing
                  </span>
                </div>
              </div>
              {/* Official Resolution Note */}
              <div className="bg-surface-inset rounded-lg p-space-md flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-micro-label text-micro-label uppercase tracking-wider text-status-resolved-text flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">fact_check</span>
                    Official Technical Resolution Statement
                  </span>
                  <span className="text-text-muted font-micro-label text-micro-label">
                    IT Network Team • Eng. S. Sen
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-primary">
                  “Access point L3 upgraded firmware to 6.4.1 and relocated antenna cluster to West Wing beam. 5GHz
                  throughput tested at 145 Mbps. Please verify connectivity.”
                </p>
              </div>
              {/* Explicit Interaction CTAs */}
              <div className="pt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Sign-off closes ticket permanently in the campus governance register.
                </p>
                {resolutionStatus === 'pending' && (
                  <div className="flex items-center gap-space-sm" id="resolution-action-group">
                    <button
                      className="h-10 px-space-md rounded bg-surface-2 hover:bg-surface-3 text-status-reopened-text font-label text-label uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      onClick={handleReopen}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">replay</span>
                      <span>Reopen Issue</span>
                    </button>
                    <button
                      className="h-10 px-space-md rounded bg-copper-500 hover:bg-copper-400 text-text-primary font-label text-label uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                      onClick={handleConfirm}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      <span>Confirm Resolution (Verified)</span>
                    </button>
                  </div>
                )}
                {resolutionStatus === 'reopened' && (
                  <div>
                    <span className="text-status-reopened-text font-micro-label uppercase tracking-wider">
                      Ticket reopening flagged for dean oversight
                    </span>
                  </div>
                )}
              </div>
              {resolutionStatus === 'confirmed' && (
                <div className="p-space-sm bg-surface-2 rounded text-status-verified-text font-body-sm text-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span>Thank you, {displayName}. The record has been permanently logged into the institutional audit ledger.</span>
                </div>
              )}
            </div>
          </div>

          {/* Campus Visual Evidence Card */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm flex flex-col md:flex-row gap-space-md items-center">
            <div className="w-full md:w-48 h-32 rounded-lg bg-surface-inset overflow-hidden flex-shrink-0 relative">
              <img
                className="w-full h-full object-cover"
                alt="Dark architectural interior photograph of a university engineering quadrangle with ambient night lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxDTEmFHp4IeSgdqcIL5hD8n22I3QhKE2MMea30-MQG8S6Y_EkY9kvGEYwVb7Vg4g-oW3mhEp0FhImPT3mCi1sjIWhTF8M3B6yzT2N7c5b-Y_3ngQZZ8aZB43TWsmpWt27_KkH7Uxh6IzBO17AnDY_vu8WQLptvKeDnR0wjo0Qo-OgKm6YGsw_EBdhlxeOIXAer3JQH2zOVME-dKPTukJyEmJXKlbhqGf4p5_Rx7aR"
              />
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 font-micro-label text-micro-label uppercase text-text-secondary">
                Quad Surveillance
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase tracking-widest text-brand-300">
                  Campus Sensor Grid
                </span>
                <span className="font-micro-label text-micro-label text-text-muted">Node 4-West</span>
              </div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary">Facilities Health Index: 94.2%</h3>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Continuous acoustic and telemetry logging in Central Library &amp; Academic Block B indicate
                normal ambient parameters following yesterday’s maintenance ticket closures.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity Feed & Pulse Snapshot (~35%) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Live Activity Feed */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-copper-400 text-[18px]">bolt</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">Live Activity Feed</h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-verified-text opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-verified-text"></span>
              </span>
            </div>
            <div className="space-y-space-md relative pl-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-surface-2">
              {/* Timeline Event 1 */}
              <div className="relative pl-space-md">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-status-in-progress-border ring-4 ring-surface-1"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    14 mins ago • Dispatch
                  </span>
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Technician assigned to Water Cooler
                  </span>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    Senior Mechanic R. Chawla accepted ticket #GRV-0891 with spare compressor kit.
                  </p>
                </div>
              </div>
              {/* Timeline Event 2 */}
              <div className="relative pl-space-md">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-copper-500 ring-4 ring-surface-1"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    1 hour ago • System Automation
                  </span>
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                    SLA reminder sent to Estates Office
                  </span>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    Level 1 automated ping issued for Room 204 projector triage window.
                  </p>
                </div>
              </div>
              {/* Timeline Event 3 */}
              <div className="relative pl-space-md">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-status-verified-text ring-4 ring-surface-1"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    3 hours ago • Community Node
                  </span>
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                    New endorsement on Library Wi-Fi
                  </span>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    Rohan Verma (EE '26) confirmed signal restoration at carrel #14.
                  </p>
                </div>
              </div>
              {/* Timeline Event 4 */}
              <div className="relative pl-space-md">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-3 ring-4 ring-surface-1"></div>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">
                    Yesterday • Governance Council
                  </span>
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Ombudsman weekly sync finalized
                  </span>
                  <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                    Bi-weekly resolution rate declared at 91.4% campus-wide.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-space-md mt-space-sm">
              <Link
                to="/student/pulse"
                className="w-full py-2 bg-surface-inset hover:bg-surface-2 text-text-secondary hover:text-text-primary font-body-sm text-body-sm rounded flex items-center justify-center gap-1 transition-colors"
              >
                <span>View historical audit log</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </div>
          </div>

          {/* Campus Pulse Snapshot */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">monitoring</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">Campus Pulse</h3>
              </div>
              <span className="font-micro-label text-micro-label uppercase text-text-muted">Last 7 Days</span>
            </div>
            {/* Intake Velocity vs Resolution Inline SVG Visual */}
            <div className="bg-surface-inset p-space-sm rounded-lg flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-text-secondary font-medium">Intake Velocity vs Resolution</span>
                <span className="font-numeric-kpi text-body-sm text-status-resolved-text">+18% Clear</span>
              </div>
              {/* SVG Sparkline Bar Chart */}
              <svg className="w-full h-24 overflow-visible" preserveAspectRatio="none" viewBox="0 0 280 80">
                {/* Gridlines */}
                <line stroke="#2B3934" strokeDasharray="2 2" strokeWidth="0.7" x1="0" x2="280" y1="20" y2="20"></line>
                <line stroke="#2B3934" strokeDasharray="2 2" strokeWidth="0.7" x1="0" x2="280" y1="50" y2="50"></line>
                {/* Bars: Intake (Dark Brand) vs Resolved (Light Teal) */}
                {/* Mon */}
                <rect fill="#245B56" height="40" rx="1" width="8" x="15" y="35"></rect>
                <rect fill="#9ad1ca" height="50" rx="1" width="8" x="27" y="25"></rect>
                {/* Tue */}
                <rect fill="#245B56" height="30" rx="1" width="8" x="55" y="45"></rect>
                <rect fill="#9ad1ca" height="45" rx="1" width="8" x="67" y="30"></rect>
                {/* Wed */}
                <rect fill="#245B56" height="55" rx="1" width="8" x="95" y="20"></rect>
                <rect fill="#9ad1ca" height="60" rx="1" width="8" x="107" y="15"></rect>
                {/* Thu */}
                <rect fill="#245B56" height="45" rx="1" width="8" x="135" y="30"></rect>
                <rect fill="#9ad1ca" height="43" rx="1" width="8" x="147" y="32"></rect>
                {/* Fri */}
                <rect fill="#245B56" height="60" rx="1" width="8" x="175" y="15"></rect>
                <rect fill="#9ad1ca" height="65" rx="1" width="8" x="187" y="10"></rect>
                {/* Sat */}
                <rect fill="#245B56" height="20" rx="1" width="8" x="215" y="55"></rect>
                <rect fill="#9ad1ca" height="35" rx="1" width="8" x="227" y="40"></rect>
                {/* Sun */}
                <rect fill="#245B56" height="15" rx="1" width="8" x="255" y="60"></rect>
                <rect fill="#9ad1ca" height="25" rx="1" width="8" x="267" y="50"></rect>
              </svg>
              <div className="flex items-center justify-between text-micro-label font-micro-label uppercase text-text-muted pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-brand-600 inline-block"></span>
                  <span>Intake (62)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>
                  <span>Resolved (73)</span>
                </div>
              </div>
            </div>
            {/* Metric Highlight: Most Reported Category */}
            <div className="flex flex-col gap-1">
              <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                Primary Friction Vector
              </span>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md font-semibold text-text-primary">
                  HVAC &amp; Living Quarters
                </span>
                <span className="font-numeric-kpi text-body-lg text-copper-400">41% Vol</span>
              </div>
              <div className="w-full bg-surface-inset h-1.5 rounded-full overflow-hidden mt-0.5">
                <div className="bg-copper-500 h-full rounded-full w-[41%]"></div>
              </div>
              <span className="font-body-sm text-body-sm text-text-muted">
                Hostel Blocks 3 &amp; 4 reported highest heat variations.
              </span>
            </div>
            {/* Community Spotlight Issue Card with Image */}
            <div className="bg-surface-inset rounded-lg p-space-sm flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="font-micro-label text-micro-label uppercase tracking-wider text-copper-400">
                  Community Spotlight
                </span>
                <span className="font-micro-label text-micro-label text-brand-300">128 Upvotes</span>
              </div>
              <div className="h-24 w-full rounded bg-surface-2 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  alt="Dramatic interior perspective of modern institutional lecture hall with ambient teal displays"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtO0qmTl0lryg1nTYL4QyZS-v6C2gqWSRPANaKJk7RuDDe_RGw7kXq-Dn_R4FOVaJXpuWX3LLwWjbWu9H0CGyGQZ0ni9-xmHoegB-dv5JiFMJBm-gMzDEZ17e0H23DaEj-1Ehtf0853-r1tEZ8HxkfWYWQPWeKJC76i159haaDhsq5tqTfV_XE_deje5dYiX9Xfcti6XOfypvbDPSMGHbLSVIurv7Py7-6GDiP_05V"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-inset via-transparent to-transparent"></div>
              </div>
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer">
                  Audi 2 Air Handling &amp; Acoustic Dampening
                </h4>
                <p className="font-body-sm text-body-sm text-text-secondary mt-0.5 line-clamp-2">
                  Dean of Infrastructure scheduled site walkthrough with student representatives this Thursday at
                  11:00 AM.
                </p>
              </div>
              <Link
                to="/student/community"
                className="font-label text-label uppercase text-brand-300 hover:text-text-primary flex items-center justify-between pt-1 transition-colors"
              >
                <span>Join discussion</span>
                <span className="material-symbols-outlined text-[16px]">forum</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemoData } from '@/context/DemoDataContext';
import { useAuth } from '@/context/AuthContext';
import type { Complaint } from '@/types/complaint';

export const MyComplaintsPage: React.FC = () => {
  const { complaints, verifyResolution, reopenComplaint, endorseComplaint } = useDemoData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlTicket = searchParams.get('ticket');

  const [selectedId, setSelectedId] = useState<string>(urlTicket || 'SNK-8802');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [endorsed, setEndorsed] = useState<boolean>(false);
  const [continuingAlert, setContinuingAlert] = useState<boolean>(false);

  useEffect(() => {
    if (urlTicket) {
      setSelectedId(urlTicket);
    }
  }, [urlTicket]);

  const mapComplaintToUI = (c: Complaint) => {
    let statusLabel: 'In Progress' | 'Under Review' | 'Resolved' | 'Verified' = 'In Progress';
    let statusClass = 'bg-status-in-progress-bg text-status-in-progress-text';
    let statusBg = 'bg-status-in-progress-bg';
    let statusText = 'text-status-in-progress-text';

    if (c.status === 'in_progress') {
      statusLabel = 'In Progress';
      statusClass = 'bg-status-in-progress-bg text-status-in-progress-text';
      statusBg = 'bg-status-in-progress-bg';
      statusText = 'text-status-in-progress-text';
    } else if (c.status === 'under_review') {
      statusLabel = 'Under Review';
      statusClass = 'bg-status-under-review-bg text-status-under-review-text';
      statusBg = 'bg-status-under-review-bg';
      statusText = 'text-status-under-review-text';
    } else if (c.status === 'resolved') {
      statusLabel = 'Resolved';
      statusClass = 'bg-status-resolved-bg text-status-resolved-text';
      statusBg = 'bg-status-resolved-bg';
      statusText = 'text-status-resolved-text';
    } else if (c.status === 'verified') {
      statusLabel = 'Verified';
      statusClass = 'bg-status-verified-bg text-status-verified-text';
      statusBg = 'bg-status-verified-bg';
      statusText = 'text-status-verified-text';
    } else if (c.status === 'reopened') {
      statusLabel = 'In Progress';
      statusClass = 'bg-status-reopened-bg text-status-reopened-text';
      statusBg = 'bg-status-reopened-bg';
      statusText = 'text-status-reopened-text';
    } else {
      statusLabel = 'Under Review';
      statusClass = 'bg-surface-2 text-copper-400';
    }

    let priorityLabel: 'High Priority' | 'Medium' | 'Normal' = 'Normal';
    let priorityClass = 'text-priority-low';
    if (c.priority === 'critical' || c.priority === 'high') {
      priorityLabel = 'High Priority';
      priorityClass = 'text-priority-high';
    } else if (c.priority === 'medium') {
      priorityLabel = 'Medium';
      priorityClass = 'text-priority-medium';
    }

    const evidenceImgs = (c.evidence || []).map((e) => e.fileUrl);

    return {
      raw: c,
      id: c.ticketId,
      title: c.title,
      location: c.locationZone,
      subLocation: c.specificDemarcation || c.locationZone,
      geotag: c.geotag || 'Lat: 28.5449° N, Long: 77.1926° E',
      status: statusLabel,
      statusClass,
      statusBg,
      statusText,
      priority: priorityLabel,
      priorityClass,
      category: c.category,
      subCategory: c.subcategory,
      custodian: c.assignedDepartmentName || 'Estates & Facilities',
      desk: c.assignedDepartmentName || 'Zone Maintenance',
      technician: c.assignedTechnicianName || 'Team Delta • Assigned',
      badge: c.assignedTechnicianBadge || '#TECH-4409',
      slaRemaining: c.isBreached ? 'Breached (+02h)' : '04h 12m',
      slaPercent: c.isBreached ? 100 : 68,
      endorsements: c.endorsementsCount,
      followers: c.followersCount,
      updated: 'Updated recently',
      description: c.description,
      evidenceImgs:
        evidenceImgs.length > 0
          ? evidenceImgs
          : [
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAdO4Nvfr47l-HhpTpbBO7ldydBPjo1-sot0741LSPW_thkos9_b1tJhjMz1BfxyvR2WZphr5XKpMCdwA2RezLDAR8RW8N3D_RqmW0DXS7adSeOTpopNShB44pPbjAo5r4X7NtTeGrX9z2BabwUfZEuWzanT1_m-Wnc0oIuz7sBVuVQBzPe0ldM5fJLy292VuyXgXy6IWkvkx4CH8-5j50joKTZ9xFCjhVyoPxSpMiL',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAI1Lt-HczKY9boDxlnjBQIXIm51p5uwamvmRrUmaqRBDWFLiqE0ktauzMtfnvhgAkgG2nvlpyGgIEbnV-lIDVDMR5QVUXdkzYZpkZXnLWvKfSERf_jzaPdCPj-2QexVmzm3Y3B39avwpoPYhZeHji_XPREHQBDPlPH8EcY61H0Ffub_x8JiV_n9Mc1M6oAUm4QrUb7rT2l79J9CzJDuGYn3RRLqAy1PrGWUonQYBcu',
            ],
    };
  };

  const uiComplaints = complaints.map(mapComplaintToUI);

  const selectedComplaint =
    uiComplaints.find((c) => c.id === selectedId) || uiComplaints[0];

  const filteredComplaints = uiComplaints.filter((c) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'in-progress' && c.raw.status !== 'in_progress') return false;
      if (statusFilter === 'under-review' && c.raw.status !== 'under_review' && c.raw.status !== 'raised') return false;
      if (statusFilter === 'resolved' && c.raw.status !== 'resolved') return false;
      if (statusFilter === 'verified' && c.raw.status !== 'verified') return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Ambient Glow Canvas Decor */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 left-12 w-80 h-80 bg-copper-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header & Filter Strip */}
        <div className="flex flex-col gap-space-md mb-space-lg">
          {/* Title & Micro Metadata Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs text-text-muted mb-1">
                <span className="font-micro-label text-micro-label tracking-widest uppercase text-copper-400">
                  Ledger Index 2025.Q1
                </span>
                <span className="text-surface-2">•</span>
                <span className="font-micro-label text-micro-label tracking-wider uppercase text-text-muted">
                  Grievance Intake Node
                </span>
              </div>
              <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
                Active Docket &amp; Redressal Stream
              </h1>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                Real-time verification chain, institutional SLA countdowns, and student quorum verification.
              </p>
            </div>
            {/* Metric pill summary */}
            <div className="flex items-center gap-space-sm bg-surface-1 p-1.5 rounded-lg">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-2">
                <span className="material-symbols-outlined text-[16px] text-priority-high">timelapse</span>
                <span className="font-micro-label text-micro-label text-text-muted uppercase">Mean SLA</span>
                <span className="font-numeric-kpi text-label text-text-primary font-bold">11.4h</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-2">
                <span className="material-symbols-outlined text-[16px] text-status-verified-text">verified</span>
                <span className="font-micro-label text-micro-label text-text-muted uppercase">Student Gate</span>
                <span className="font-numeric-kpi text-label text-status-verified-text font-bold">98.2%</span>
              </div>
            </div>
          </div>

          {/* Search, Status Filter Pills & Sort Dropdown */}
          <div className="bg-surface-1 rounded-lg p-space-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md shadow-sm">
            {/* Status Tabs Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0" id="status-filters">
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'all'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                <span>All</span>
                <span className="px-1.5 py-0.2 rounded bg-brand-800 text-brand-100 font-micro-label text-micro-label font-bold">
                  {complaints.length}
                </span>
              </button>
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'raised'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('raised')}
              >
                <span>Raised</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-inset text-text-muted font-micro-label text-micro-label">
                  {complaints.filter((c) => c.status === 'raised').length}
                </span>
              </button>
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'under-review'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('under-review')}
              >
                <span>Under Review</span>
                <span className="px-1.5 py-0.2 rounded bg-status-under-review-bg text-status-under-review-text font-micro-label text-micro-label font-bold">
                  {complaints.filter((c) => c.status === 'under_review').length}
                </span>
              </button>
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'in-progress'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('in-progress')}
              >
                <span>In Progress</span>
                <span className="px-1.5 py-0.2 rounded bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label font-bold">
                  {complaints.filter((c) => c.status === 'in_progress').length}
                </span>
              </button>
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'resolved'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('resolved')}
              >
                <span>Resolved</span>
                <span className="px-1.5 py-0.2 rounded bg-status-resolved-bg text-status-resolved-text font-micro-label text-micro-label font-bold">
                  {complaints.filter((c) => c.status === 'resolved').length}
                </span>
              </button>
              <button
                className={`status-tab flex items-center gap-1.5 px-3 py-1.5 rounded font-label text-label transition-all ${
                  statusFilter === 'verified'
                    ? 'bg-brand-600 text-text-primary shadow-inner'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
                onClick={() => setStatusFilter('verified')}
              >
                <span>Verified</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-inset text-text-muted font-micro-label text-micro-label">
                  {complaints.filter((c) => c.status === 'verified').length}
                </span>
              </button>
            </div>
            {/* Search + Sort Controls */}
            <div className="flex items-center gap-space-sm flex-1 xl:max-w-md justify-end">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
                  filter_list
                </span>
                <input
                  className="w-full h-9 pl-9 pr-3 bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm rounded focus:outline-none focus:ring-1 focus:ring-brand-400 transition-all"
                  id="complaintSearch"
                  placeholder="Filter by title, ID, or building..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative flex-shrink-0">
                <select className="h-9 px-3 pr-8 bg-surface-2 hover:bg-surface-3 text-text-primary font-body-sm text-body-sm rounded cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-400 transition-colors">
                  <option value="newest">Newest First</option>
                  <option value="sla">Urgent SLA First</option>
                  <option value="endorsements">Most Endorsed</option>
                  <option value="stage">Lifecycle Stage</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[16px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric Split View Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column (~42% -> 5 cols on lg:grid-cols-12) */}
          <div className="lg:col-span-5 flex flex-col gap-space-sm" id="docket-list">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                Assigned Redressal Queue
              </span>
              <span className="font-micro-label text-micro-label uppercase text-brand-300">Synchronized (Live)</span>
            </div>

            {/* List of Complaint Cards */}
            {filteredComplaints.map((c) => {
              const isSelected = c.id === selectedId;
              return (
                <article
                  key={c.id}
                  className={`complaint-card group relative p-space-md rounded-lg cursor-pointer transition-all duration-150 ${
                    isSelected ? 'bg-surface-2 shadow-md' : 'bg-surface-1 hover:bg-surface-2'
                  }`}
                  onClick={() => setSelectedId(c.id)}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-copper-400 rounded-r"></div>
                  )}
                  <div className={`flex flex-col gap-2 ${isSelected ? 'pl-2' : ''}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-numeric-kpi text-label font-bold ${
                            isSelected ? 'text-copper-400' : 'text-text-muted group-hover:text-copper-400'
                          }`}
                        >
                          #{c.id}
                        </span>
                        <span className="text-surface-3">•</span>
                        <span className="font-micro-label text-micro-label text-text-muted uppercase">
                          {c.location}
                        </span>
                      </div>
                      {/* Status Chip */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-micro-label text-micro-label uppercase font-bold ${c.statusClass}`}
                      >
                        {c.status === 'In Progress' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-status-in-progress-text animate-pulse"></span>
                        )}
                        {c.status === 'Under Review' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-status-under-review-text"></span>
                        )}
                        {c.status === 'Resolved' && (
                          <span className="material-symbols-outlined text-[12px]">done_all</span>
                        )}
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-headline-4 text-headline-4 text-text-primary tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-text-secondary line-clamp-2">
                      {c.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 mt-1">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-inset text-priority-high font-micro-label text-micro-label uppercase font-semibold">
                          <span className="material-symbols-outlined text-[13px]">
                            {c.priority === 'High Priority' ? 'warning' : c.priority === 'Medium' ? 'tune' : 'info'}
                          </span>
                          {c.priority}
                        </span>
                        <span className="flex items-center gap-1 text-text-secondary font-label text-label">
                          <span className="material-symbols-outlined text-[15px] text-brand-300">how_to_vote</span>
                          <span className="font-numeric-kpi text-label font-bold text-text-primary">
                            {c.endorsements}
                          </span>{' '}
                          Endorsements
                        </span>
                      </div>
                      <span className="font-micro-label text-micro-label text-copper-400 font-medium">
                        {c.updated}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Batch Redressal Notice Banner */}
            <div className="p-space-md rounded-lg bg-surface-inset flex items-start gap-space-sm mt-2">
              <span className="material-symbols-outlined text-brand-300 text-[20px] mt-0.5">policy</span>
              <div className="flex flex-col">
                <span className="font-label text-label text-text-primary uppercase tracking-wider">
                  Deanery Redressal Ordinance
                </span>
                <span className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  All complaints exceeding 25 endorsements trigger expedited custodian escalation protocols under
                  Clause 7B.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (~58% -> 7 cols on lg:grid-cols-12): Detailed Deep-Dive Inspection Panel */}
          <div className="lg:col-span-7 flex flex-col gap-space-md" id="inspection-panel">
            {/* Main Docket Terminal Dossier */}
            <section className="bg-surface-1 rounded-lg p-space-lg flex flex-col gap-space-lg shadow-xl relative overflow-hidden">
              {/* Subtle Accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper-500 via-brand-500 to-copper-400"></div>

              {/* Dossier Header */}
              <div className="flex flex-col gap-space-sm">
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-numeric-kpi text-headline-3 text-copper-400 font-bold">
                      #{selectedComplaint.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-micro-label text-micro-label uppercase font-bold flex items-center gap-1 ${selectedComplaint.statusClass}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-status-in-progress-text animate-ping"></span>
                      {selectedComplaint.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-inset text-priority-high font-micro-label text-micro-label uppercase font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">priority_high</span>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  {/* Quick action links */}
                  <div className="flex items-center gap-space-xs">
                    <button
                      className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-2 transition-colors"
                      title="Print Dossier Log"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                    </button>
                    <button
                      className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-2 transition-colors"
                      title="Share Internal Permlink"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                    <button
                      className="px-2.5 py-1 text-copper-400 hover:text-copper-300 font-micro-label text-micro-label uppercase font-semibold rounded bg-surface-2 hover:bg-surface-3 transition-colors flex items-center gap-1"
                      title="Escalate to Dean"
                    >
                      <span className="material-symbols-outlined text-[14px]">shield</span>
                      Audit Trail
                    </button>
                  </div>
                </div>
                <h2 className="font-headline-2 text-headline-2 text-text-primary tracking-tight">
                  {selectedComplaint.title}
                </h2>
                <div className="flex items-center gap-space-xs text-text-muted font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-text-muted">location_on</span>
                  <span>{selectedComplaint.subLocation}</span>
                  <span className="text-surface-3">•</span>
                  <span className="text-brand-300">Geotag Verified [{selectedComplaint.geotag}]</span>
                </div>
              </div>

              {/* Key Attributes Grid (4-box Bento) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                <div className="bg-surface-2 p-space-sm rounded flex flex-col justify-between">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                    Classification
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-copper-400 text-[18px]">plumbing</span>
                    <span className="font-label text-label font-bold text-text-primary truncate">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted mt-1">
                    Subcategory: {selectedComplaint.subCategory}
                  </span>
                </div>
                <div className="bg-surface-2 p-space-sm rounded flex flex-col justify-between">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                    Custodian Dept
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-brand-300 text-[18px]">corporate_fare</span>
                    <span className="font-label text-label font-bold text-text-primary truncate">
                      {selectedComplaint.custodian}
                    </span>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted mt-1">
                    Desk: {selectedComplaint.desk}
                  </span>
                </div>
                <div className="bg-surface-2 p-space-sm rounded flex flex-col justify-between">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                    Assigned Tech
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="material-symbols-outlined text-brand-400 text-[18px]">badge</span>
                    <span className="font-label text-label font-bold text-text-primary truncate">
                      {selectedComplaint.technician}
                    </span>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted mt-1">
                    Badge ID {selectedComplaint.badge}
                  </span>
                </div>
                {/* SLA Countdown Box with Visual Dial Indicator */}
                <div className="bg-surface-2 p-space-sm rounded flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                      SLA Escalation
                    </span>
                    <span className="w-2 h-2 rounded-full bg-priority-high animate-ping"></span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-numeric-kpi text-numeric-kpi text-priority-high font-bold tracking-tight">
                      04<span className="text-headline-4 font-normal text-text-muted">h</span> 12
                      <span className="text-headline-4 font-normal text-text-muted">m</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-inset h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-priority-high h-full w-[68%]"
                      title="68% SLA elapsed"
                    ></div>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted mt-1">
                    Escalates to Dean Student Affairs
                  </span>
                </div>
              </div>

              {/* Verifiable Lifecycle Timeline Tracker */}
              <div className="flex flex-col gap-space-md pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-copper-400 text-[18px]">route</span>
                    <h4 className="font-headline-4 text-headline-4 text-text-primary tracking-tight">
                      Verifiable Lifecycle Chain
                    </h4>
                  </div>
                  <span className="font-micro-label text-micro-label uppercase tracking-widest text-text-muted">
                    5-Stage Redressal Protocol
                  </span>
                </div>
                {/* Step Sequence */}
                <div className="relative pl-6 flex flex-col gap-space-md">
                  {/* Continuous Hairline Vertical Backbone */}
                  <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-surface-3"></div>
                  {/* Step 1: REPORTED */}
                  <div className="relative flex flex-col gap-1 group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-700 flex items-center justify-center ring-4 ring-surface-1">
                      <span className="material-symbols-outlined text-[13px] text-text-primary">check</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-label text-label font-bold text-text-primary uppercase tracking-wider">
                        1. Reported • Logged to Ledger
                      </span>
                      <span className="font-micro-label text-micro-label text-brand-300">Oct 24, 08:30 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Student <strong className="text-text-primary font-semibold">Aditi Sharma (Roll #22BCS041)</strong>{' '}
                      submitted via Student Node with raw photographic proof. Auto-validated by MAC-address WiFi
                      proximity sensor.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-micro-label font-micro-label uppercase bg-surface-inset px-2 py-0.5 rounded text-text-muted">
                        <span className="material-symbols-outlined text-[12px] text-brand-300">verified_user</span>
                        SHA-256: 8f9b...17c2
                      </span>
                    </div>
                  </div>
                  {/* Step 2: UNDER REVIEW */}
                  <div className="relative flex flex-col gap-1 group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-700 flex items-center justify-center ring-4 ring-surface-1">
                      <span className="material-symbols-outlined text-[13px] text-text-primary">check</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-label text-label font-bold text-text-primary uppercase tracking-wider">
                        2. Under Review • Triaged
                      </span>
                      <span className="font-micro-label text-micro-label text-brand-300">Oct 24, 09:15 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Automated grievance clustering aggregated with 3 auxiliary notices from Block B occupants.
                      Institutional SLA locked at 12 hours under Category B rules.
                    </p>
                  </div>
                  {/* Step 3: IN PROGRESS (CURRENT ACTIVE STAGE) */}
                  <div className="relative flex flex-col gap-2 p-space-md bg-surface-2 rounded-lg">
                    <div className="absolute -left-8 top-4 w-5 h-5 rounded-full bg-copper-500 flex items-center justify-center ring-4 ring-surface-1 shadow-md">
                      <span className="material-symbols-outlined text-[13px] text-text-primary animate-spin">
                        sync
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-label font-bold text-copper-400 uppercase tracking-wider">
                          3. In Progress (Active Work Order)
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-copper-500/20 text-copper-400 font-micro-label text-micro-label uppercase font-bold">
                          Current Stage
                        </span>
                      </div>
                      <span className="font-micro-label text-micro-label text-copper-400 font-medium">
                        Oct 24, 11:00 AM
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-primary">
                      Work order #WO-9918 dispatched to Estates Desk. Technician{' '}
                      <strong className="text-text-primary">R. Verma (Ext. 408)</strong> checked out spare condenser
                      fan unit &amp; copper solder kit from Central Inventory at 11:24 AM.
                    </p>
                    {/* Technician live log snippet */}
                    <div className="bg-surface-inset p-space-sm rounded flex items-center justify-between text-body-sm font-body-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px] text-copper-400">handyman</span>
                        <span>
                          Technician update:{' '}
                          <em>"On site at Block B Fl 2. De-energized unit, inspecting compressor thermostat coil."</em>
                        </span>
                      </div>
                      <span className="font-micro-label text-micro-label text-text-muted flex-shrink-0 ml-2">
                        11:48 AM
                      </span>
                    </div>
                  </div>
                  {/* Step 4: RESOLVED (PENDING) */}
                  <div className="relative flex flex-col gap-1 opacity-70">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-3 flex items-center justify-center ring-4 ring-surface-1">
                      <span className="material-symbols-outlined text-[13px] text-text-muted">schedule</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-label text-label font-bold text-text-muted uppercase tracking-wider">
                        4. Resolved • Technician Sign-off
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted">
                        Awaiting Dispatch Completion
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted">
                      Requires certified after-repair photograph, thermal water outlet reading (≤ 15°C), and technician
                      digital ledger signature before advancing to student gate.
                    </p>
                  </div>
                  {/* Step 5: VERIFIED (PENDING STUDENT GATE) */}
                  <div className="relative flex flex-col gap-1 opacity-60">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-3 flex items-center justify-center ring-4 ring-surface-1">
                      <span className="material-symbols-outlined text-[13px] text-text-muted">lock</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-label text-label font-bold text-text-muted uppercase tracking-wider">
                        5. Verified • Student Quorum Sign-off
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted">Final Lock</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted">
                      Strict student audit gate: Case can NOT close until complainant or 3 endorsing students certify
                      operational status on-site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Evidence & Photographic Inspection Section */}
              <div className="flex flex-col gap-space-sm pt-2">
                <span className="font-micro-label text-micro-label uppercase tracking-wider text-text-muted">
                  Docket Evidence &amp; Visual Telemetry
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {/* Submitted Photo Thumbnail 1 */}
                  <div className="relative group rounded overflow-hidden bg-surface-2 aspect-video cursor-pointer">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Dark moody documentary photograph of an institutional stainless steel commercial water cooler unit"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdO4Nvfr47l-HhpTpbBO7ldydBPjo1-sot0741LSPW_thkos9_b1tJhjMz1BfxyvR2WZphr5XKpMCdwA2RezLDAR8RW8N3D_RqmW0DXS7adSeOTpopNShB44pPbjAo5r4X7NtTeGrX9z2BabwUfZEuWzanT1_m-Wnc0oIuz7sBVuVQBzPe0ldM5fJLy292VuyXgXy6IWkvkx4CH8-5j50joKTZ9xFCjhVyoPxSpMiL"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent flex items-end p-2">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-micro-label text-micro-label text-text-primary uppercase font-bold">
                          Intake Evidence 01
                        </span>
                        <span className="material-symbols-outlined text-copper-400 text-[16px]">visibility</span>
                      </div>
                    </div>
                  </div>
                  {/* Submitted Photo Thumbnail 2 */}
                  <div className="relative group rounded overflow-hidden bg-surface-2 aspect-video cursor-pointer">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Close up architectural detail photograph of water cooler copper tubing and electrical wiring box"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI1Lt-HczKY9boDxlnjBQIXIm51p5uwamvmRrUmaqRBDWFLiqE0ktauzMtfnvhgAkgG2nvlpyGgIEbnV-lIDVDMR5QVUXdkzYZpkZXnLWvKfSERf_jzaPdCPj-2QexVmzm3Y3B39avwpoPYhZeHji_XPREHQBDPlPH8EcY61H0Ffub_x8JiV_n9Mc1M6oAUm4QrUb7rT2l79J9CzJDuGYn3RRLqAy1PrGWUonQYBcu"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent flex items-end p-2">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-micro-label text-micro-label text-text-primary uppercase font-bold">
                          Compressor Panel
                        </span>
                        <span className="material-symbols-outlined text-copper-400 text-[16px]">visibility</span>
                      </div>
                    </div>
                  </div>
                  {/* Map Location Tile with Data-Location */}
                  <div
                    className="relative group rounded overflow-hidden bg-surface-2 aspect-video bg-cover bg-center cursor-pointer"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxp4lGQuqz5KdhqRtI3cOZ3-lEfzwWShOGmPmXXCSGfbjFOlVZz1Ga_FbD_UkjA7tTRD0IycHkYsNAqs7uHhuDH3uOVQtXiSieek5ds0qDDM5p2Y8E2KZk9mTfSLp4bTY7Tm7alWMfXhyVjxcHwiPVcObvQEmPuZXU3nRZaGkCNga7mLll8aB1xfcUlGh3xnEplUa-6jkYcScoFEG-CyKszCtJz0w0EoAsi-l8zbcR')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/30 to-transparent flex items-end p-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-copper-400 text-[15px]">pin_drop</span>
                          <span className="font-micro-label text-micro-label text-text-primary uppercase font-bold">
                            CAD Level 2 Map
                          </span>
                        </div>
                        <span className="font-micro-label text-micro-label text-brand-300">Grid B-218</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Verification Gate Box */}
              <div className="bg-surface-inset p-space-md rounded-lg flex flex-col gap-space-sm relative">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-xs">
                    <div className="w-7 h-7 rounded bg-brand-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-brand-300 text-[18px]">verified</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h5 className="font-headline-4 text-headline-4 text-text-primary">
                          Student Governance Verification Gate
                        </h5>
                        <span className="px-2 py-0.2 rounded bg-surface-2 text-brand-300 font-micro-label text-micro-label uppercase font-bold">
                          Binding Audit
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                        Administrative redressal status is divided into two distinct checkpoints:{' '}
                        <span className="text-status-resolved-text font-semibold">"Resolved"</span> indicates
                        internal maintenance completion.{' '}
                        <span className="text-status-verified-text font-semibold">"Verified"</span> requires
                        student sign-off to legally release custodian funds.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Action Buttons for Verification */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2 mt-1">
                  <div className="flex items-center gap-2 text-text-muted font-micro-label text-micro-label uppercase">
                    <span className="material-symbols-outlined text-priority-medium text-[16px]">
                      {selectedComplaint.raw.status === 'resolved'
                        ? 'verified'
                        : selectedComplaint.raw.status === 'verified'
                        ? 'task_alt'
                        : 'hourglass_top'}
                    </span>
                    <span>
                      {selectedComplaint.raw.status === 'resolved'
                        ? 'Technician signed off — awaiting student verification'
                        : selectedComplaint.raw.status === 'verified'
                        ? 'Student sign-off logged — permanently verified'
                        : `Gate locked until Technician registers job completion`}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm w-full sm:w-auto">
                    {/* Confirmation CTA */}
                    <button
                      className={`flex-1 sm:flex-initial h-10 px-space-md font-label text-label uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all ${
                        selectedComplaint.raw.status === 'resolved'
                          ? 'bg-brand-600 hover:bg-brand-500 text-text-primary shadow-md active:scale-95 cursor-pointer'
                          : selectedComplaint.raw.status === 'verified'
                          ? 'bg-status-verified-bg text-status-verified-text cursor-default'
                          : 'bg-surface-2 text-text-disabled font-label uppercase tracking-wider rounded cursor-not-allowed opacity-60'
                      }`}
                      disabled={selectedComplaint.raw.status !== 'resolved'}
                      onClick={() => verifyResolution(selectedComplaint.raw.ticketId, 'confirmed')}
                      title={
                        selectedComplaint.raw.status === 'resolved'
                          ? 'Confirm that problem is resolved'
                          : selectedComplaint.raw.status === 'verified'
                          ? 'Already verified by student'
                          : 'Technician must complete work first'
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {selectedComplaint.raw.status === 'verified' ? 'done_all' : 'check_circle'}
                      </span>
                      <span>
                        {selectedComplaint.raw.status === 'verified'
                          ? 'Resolution Verified'
                          : 'Confirm Resolution'}
                      </span>
                    </button>
                    {/* Escalation / Continuing Issue CTA */}
                    <button
                      className="flex-1 sm:flex-initial h-10 px-space-md bg-status-critical-bg text-status-critical-text hover:bg-opacity-90 font-label text-label uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5"
                      onClick={() => {
                        reopenComplaint(
                          selectedComplaint.raw.ticketId,
                          'Student rejected resolution: Continuing malfunction observed'
                        );
                        setContinuingAlert(true);
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">report_problem</span>
                      <span>Report Continuing Issue</span>
                    </button>
                  </div>
                </div>
                {continuingAlert && (
                  <div className="p-2.5 rounded bg-status-critical-bg border border-status-critical-border text-status-critical-text font-body-sm flex items-center justify-between">
                    <span>
                      Continuing defect logged. An emergency alert has been forwarded to the Zone Maintenance Supervisor with higher audit precedence.
                    </span>
                    <button
                      onClick={() => setContinuingAlert(false)}
                      className="text-text-muted hover:text-text-primary px-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Community Support & Follow Action Bar */}
              <div className="bg-surface-2 p-space-md rounded-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md w-full md:w-auto">
                  {/* Endorsement Avatars Cluster */}
                  <div className="flex items-center -space-x-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-text-primary font-micro-label text-micro-label font-bold ring-2 ring-surface-2">
                      AS
                    </div>
                    <div className="w-8 h-8 rounded-full bg-copper-600 flex items-center justify-center text-text-primary font-micro-label text-micro-label font-bold ring-2 ring-surface-2">
                      MK
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-primary font-micro-label text-micro-label font-bold ring-2 ring-surface-2">
                      PR
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-copper-400 font-micro-label text-micro-label font-bold ring-2 ring-surface-2">
                      +35
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      {selectedComplaint.endorsements} students affected •{' '}
                      {selectedComplaint.followers + (isFollowing ? 1 : 0)} students following updates
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted uppercase">
                      Community Threshold Met • Prioritized in Dean Weekly Audit
                    </span>
                  </div>
                </div>
                {/* Follow / Endorse Toggle */}
                <div className="flex items-center gap-space-sm w-full md:w-auto justify-end">
                  <button
                    className={`h-10 px-space-md font-label text-label uppercase tracking-wider rounded transition-all flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-surface-3 text-brand-300'
                        : 'bg-brand-600 hover:bg-brand-500 text-text-primary shadow-sm'
                    }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isFollowing ? 'bookmark_added' : 'bookmark_add'}
                    </span>
                    <span>{isFollowing ? 'Following (55)' : 'Follow Issue'}</span>
                  </button>
                  <button
                    className={`h-10 px-space-md font-label text-label uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
                      endorsed
                        ? 'bg-copper-500 text-text-primary'
                        : 'bg-surface-1 hover:bg-surface-3 text-copper-400'
                    }`}
                    onClick={() => {
                      endorseComplaint(selectedComplaint.raw.ticketId, user?.id || 'usr_student_01');
                      setEndorsed(!endorsed);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {endorsed ? 'verified' : 'how_to_vote'}
                    </span>
                    <span>{endorsed ? 'Endorsed' : 'Endorse (+1)'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Secondary Analytical Telemetry Panel: Facility Health History */}
            <section className="bg-surface-1 rounded-lg p-space-md flex flex-col gap-space-sm shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-300 text-[18px]">monitoring</span>
                  <span className="font-headline-4 text-headline-4 text-text-primary">
                    Academic Block B • Mechanical Reliability Vector
                  </span>
                </div>
                <span className="font-micro-label text-micro-label uppercase text-text-muted">Trailing 90 Days</span>
              </div>
              {/* Inline Telemetry SVG Graph */}
              <div className="w-full bg-surface-inset p-space-sm rounded flex flex-col gap-2">
                <div className="flex items-center justify-between text-micro-label font-micro-label uppercase text-text-muted">
                  <span>Facility Operational Uptime: 93.4%</span>
                  <span className="text-copper-400">Past Recurrences: 2 (July, September)</span>
                </div>
                <div className="h-12 w-full flex items-end">
                  <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 50">
                    {/* Grid Guide Lines */}
                    <line
                      className="text-surface-2"
                      stroke="currentColor"
                      strokeDasharray="2 2"
                      x1="0"
                      x2="500"
                      y1="25"
                      y2="25"
                    ></line>
                    {/* Area Gradient Fill */}
                    <defs>
                      <linearGradient id="telemetryGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3E7567" stopOpacity="0.35"></stop>
                        <stop offset="100%" stopColor="#3E7567" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,40 L 40,36 L 80,38 L 120,20 L 160,24 L 200,42 L 240,15 L 280,18 L 320,32 L 360,10 L 400,12 L 440,35 L 480,30 L 500,28 L 500,50 L 0,50 Z"
                      fill="url(#telemetryGrad)"
                    ></path>
                    {/* Line Path */}
                    <path
                      d="M 0,40 L 40,36 L 80,38 L 120,20 L 160,24 L 200,42 L 240,15 L 280,18 L 320,32 L 360,10 L 400,12 L 440,35 L 480,30 L 500,28"
                      fill="none"
                      stroke="#9ad1ca"
                      strokeWidth="2"
                    ></path>
                    {/* Critical Anomaly Node Point */}
                    <circle className="fill-priority-high" cx="200" cy="42" r="3.5"></circle>
                    <circle className="fill-copper-400 animate-pulse" cx="440" cy="35" r="4"></circle>
                  </svg>
                </div>
                <div className="flex items-center justify-between text-micro-label font-micro-label text-text-muted">
                  <span>90 Days Ago</span>
                  <span>45 Days Ago</span>
                  <span className="text-copper-400 font-semibold">Incident Registered Today</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

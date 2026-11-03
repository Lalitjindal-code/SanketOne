import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemoData } from '@/context/DemoDataContext';
import { useAuth } from '@/context/AuthContext';
import type { Complaint, ComplaintPriority } from '@/types/complaint';

interface AdminComplaintRow {
  raw: Complaint;
  id: string;
  title: string;
  location: string;
  dept: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'IN PROGRESS' | 'RAISED' | 'UNDER REVIEW' | 'RESOLVED' | 'REOPENED';
  slaTime: string;
  slaTarget: string;
  isUrgentSla?: boolean;
  isMetSla?: boolean;
  communityCount: number;
}

export const ComplaintManagementPage: React.FC = () => {
  const {
    complaints,
    updateComplaintStatus,
    assignDepartment,
    updatePriority,
    submitResolutionEvidence,
    addComment,
  } = useDemoData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlTicket = searchParams.get('ticket');

  const [selectedRowId, setSelectedRowId] = useState<string>(urlTicket || 'SNK-8802');
  const [selectedTickets, setSelectedTickets] = useState<string[]>(['SNK-8802', 'SNK-8841', 'SNK-9014']);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [resolutionSummary, setResolutionSummary] = useState<string>(
    'Replaced faulty condenser thermal sensor and re-pressurized refrigerant line. Water outflow temperature certified at 12°C. Sanitary nozzle sterilized.'
  );
  const [submittedResolution, setSubmittedResolution] = useState<boolean>(false);
  const [newInternalNote, setNewInternalNote] = useState<string>('');
  const [showReassignModal, setShowReassignModal] = useState<boolean>(false);

  useEffect(() => {
    if (urlTicket) {
      setSelectedRowId(urlTicket);
    }
  }, [urlTicket]);

  const mapComplaintToAdminRow = (c: Complaint): AdminComplaintRow => {
    let priorityLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (c.priority === 'critical') priorityLabel = 'CRITICAL';
    else if (c.priority === 'high') priorityLabel = 'HIGH';
    else if (c.priority === 'low') priorityLabel = 'LOW';

    let statusLabel: 'IN PROGRESS' | 'RAISED' | 'UNDER REVIEW' | 'RESOLVED' | 'REOPENED' = 'IN PROGRESS';
    if (c.status === 'in_progress') statusLabel = 'IN PROGRESS';
    else if (c.status === 'under_review') statusLabel = 'UNDER REVIEW';
    else if (c.status === 'resolved' || c.status === 'verified') statusLabel = 'RESOLVED';
    else if (c.status === 'reopened') statusLabel = 'REOPENED';
    else if (c.status === 'raised') statusLabel = 'RAISED';

    const isUrgentSla = c.priority === 'critical' || c.isBreached;
    const isMetSla = c.status === 'resolved' || c.status === 'verified';
    const slaTime = c.isBreached ? '+02h 45m BREACH' : isMetSla ? 'MET SLA' : '04h 12m';

    return {
      raw: c,
      id: c.ticketId,
      title: c.title,
      location: `${c.locationZone} • ${c.specificDemarcation || ''}`,
      dept: c.assignedDepartmentName || 'Pending Allocation',
      priority: priorityLabel,
      status: statusLabel,
      slaTime,
      slaTarget: c.isBreached ? 'CRITICAL ESCALATION' : isMetSla ? '-45m delta' : 'Target: Today',
      isUrgentSla,
      isMetSla,
      communityCount: c.followersCount || c.endorsementsCount || 12,
    };
  };

  const adminRows = complaints.map(mapComplaintToAdminRow);

  const selectedRow = adminRows.find((r) => r.id === selectedRowId) || adminRows[0];
  const selectedComplaint = selectedRow.raw;

  const toggleSelectTicket = (id: string) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const isBulkActive = selectedTickets.length > 0;

  const filteredRows = adminRows.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.dept.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalActiveCount = complaints.filter((c) => c.status !== 'verified' && c.status !== 'archived').length;
  const criticalHazardsCount = complaints.filter((c) => c.priority === 'critical').length;
  const verificationCount = complaints.filter((c) => c.status === 'resolved').length;

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;
    addComment(
      selectedComplaint.ticketId,
      user?.fullName || 'Dr. Sunita Menon',
      'admin',
      newInternalNote,
      true
    );
    setNewInternalNote('');
  };

  const handleSubmitResolution = () => {
    submitResolutionEvidence(selectedComplaint.ticketId, resolutionSummary);
    setSubmittedResolution(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Operational Header & Live Counter Bar */}
      <div className="px-space-lg py-space-md bg-surface-1 flex flex-col gap-space-sm border-b border-border-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-micro-label text-micro-label uppercase text-copper-400 tracking-widest font-semibold">
                OPERATIONAL LEDGER
              </span>
              <span className="font-micro-label text-micro-label text-text-disabled">//</span>
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest">
                INTAKE &amp; DISPATCH MANAGEMENT
              </span>
            </div>
            <div className="flex items-baseline gap-space-md mt-1">
              <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
                Complaint Management
              </h1>
              <span className="font-label text-label text-brand-300 bg-surface-2 px-2.5 py-1 uppercase tracking-wider">
                CIVIC ESCALATION DESK
              </span>
            </div>
            <p className="font-body-md text-body-md text-text-secondary mt-1">
              Review, prioritize, assign, and resolve campus issues across all physical quadrants.
            </p>
          </div>
          <div className="flex items-center gap-space-md flex-shrink-0">
            {/* Live Operations Metric Cluster */}
            <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-2 rounded">
              <div className="flex flex-col pr-space-md">
                <span className="font-micro-label text-micro-label uppercase text-text-muted">Total Active</span>
                <span className="font-numeric-kpi text-headline-4 text-text-primary">
                  {String(totalActiveCount).padStart(2, '0')}
                </span>
              </div>
              <div className="w-1.5 h-7 bg-surface-3"></div>
              <div className="flex flex-col px-space-md">
                <span className="font-micro-label text-micro-label uppercase text-priority-critical">Hazards</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-priority-critical animate-ping"></span>
                  <span className="font-numeric-kpi text-headline-4 text-priority-critical">
                    {String(criticalHazardsCount).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <div className="w-1.5 h-7 bg-surface-3"></div>
              <div className="flex flex-col pl-space-md">
                <span className="font-micro-label text-micro-label uppercase text-status-under-review-text">
                  Verification
                </span>
                <span className="font-numeric-kpi text-headline-4 text-text-secondary">
                  {String(verificationCount).padStart(2, '0')}
                </span>
              </div>
            </div>
            <button
              className="h-11 px-space-md bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label tracking-wide uppercase flex items-center gap-2 transition-colors rounded"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Ledger Snapshot</span>
            </button>
          </div>
        </div>

        {/* Bulk Floating Operations Strip */}
        {isBulkActive && (
          <div className="w-full bg-surface-2 px-space-md py-2.5 flex items-center justify-between shadow-sm rounded" id="bulk-action-bar">
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-copper-400"></span>
                <span className="font-label text-label text-text-primary uppercase tracking-wider font-semibold">
                  TICKETS SELECTED: <span className="text-copper-400">0{selectedTickets.length}</span>
                </span>
              </div>
              <span className="font-micro-label text-micro-label text-text-muted">
                {selectedTickets.map((t) => `#${t}`).join(' • ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 px-space-sm bg-surface-1 hover:bg-surface-3 text-text-primary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-brand-300">domain_add</span>
                <span>Assign Dept</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
              <button
                className="h-8 px-space-sm bg-surface-1 hover:bg-surface-3 text-text-primary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-priority-high">flag</span>
                <span>Change Priority</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
              <button
                className="h-8 px-space-sm bg-surface-1 hover:bg-surface-3 text-text-primary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">published_with_changes</span>
                <span>Batch Status</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
              <div className="h-5 w-px bg-surface-3 mx-1"></div>
              <button
                className="h-8 px-space-sm bg-surface-inset hover:bg-surface-container-high text-text-secondary hover:text-text-primary font-label text-label flex items-center gap-1.5 transition-colors rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Audit CSV</span>
              </button>
              <button
                className="h-8 w-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors rounded"
                title="Deselect All"
                type="button"
                onClick={() => setSelectedTickets([])}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Multi-Parameter Filter Toolbar */}
      <div className="px-space-lg py-space-sm bg-surface-container-lowest flex flex-col gap-space-sm border-b border-border-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          {/* Search and Department/Zone Facets */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
                filter_alt
              </span>
              <input
                className="w-full h-8 pl-8 pr-3 bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm focus:outline-none rounded"
                placeholder="Filter by ticket #ID, keyword, or student note..."
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                className="h-8 px-2.5 bg-surface-1 hover:bg-surface-2 text-text-secondary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="font-micro-label text-micro-label text-text-muted uppercase">DEPT:</span>
                <span>Estates &amp; Facilities</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
              <button
                className="h-8 px-2.5 bg-surface-1 hover:bg-surface-2 text-text-secondary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="font-micro-label text-micro-label text-text-muted uppercase">ZONE:</span>
                <span>All Quadrants</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
              <button
                className="h-8 px-2.5 bg-surface-1 hover:bg-surface-2 text-text-secondary font-label text-label flex items-center gap-1 transition-colors rounded"
                type="button"
              >
                <span className="font-micro-label text-micro-label text-text-muted uppercase">PRIORITY:</span>
                <span className="text-priority-high font-semibold">Critical &amp; High</span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="h-8 px-2 bg-surface-container hover:bg-surface-2 text-text-muted hover:text-text-primary font-label text-label flex items-center gap-1 transition-colors rounded"
              type="button"
              onClick={() => {
                setFilterQuery('');
                setStatusFilter('ALL');
              }}
            >
              <span className="material-symbols-outlined text-[15px]">clear_all</span>
              <span>Clear Filters</span>
            </button>
            <button
              className="h-8 px-2 bg-brand-700 hover:bg-brand-600 text-text-primary font-label text-label flex items-center gap-1 transition-colors rounded"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">bookmark</span>
              <span>Save Preset</span>
            </button>
          </div>
        </div>
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-text-secondary">
          {[
            { id: 'ALL', count: 28, bg: 'bg-surface-1', text: 'text-text-primary' },
            { id: 'RAISED', count: 4, bg: 'bg-status-raised-bg', text: 'text-status-raised-text' },
            { id: 'UNDER REVIEW', count: 5, bg: 'bg-status-under-review-bg', text: 'text-status-under-review-text' },
            { id: 'IN PROGRESS', count: 12, bg: 'bg-status-in-progress-bg', text: 'text-status-in-progress-text' },
            { id: 'RESOLVED', count: 5, bg: 'bg-status-resolved-bg', text: 'text-status-resolved-text' },
            { id: 'VERIFIED CLOSED', count: 38, bg: 'bg-status-verified-bg', text: 'text-status-verified-text' },
            { id: 'REOPENED', count: 2, bg: 'bg-status-reopened-bg', text: 'text-status-reopened-text' },
          ].map((pill) => {
            const active = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                className={`px-2.5 py-1 font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1.5 rounded ${
                  active
                    ? pill.id === 'IN PROGRESS'
                      ? 'bg-surface-2 text-primary'
                      : 'bg-surface-3 text-text-primary'
                    : 'bg-surface-1 hover:bg-surface-2 text-text-secondary transition-colors'
                }`}
                type="button"
                onClick={() => setStatusFilter(pill.id)}
              >
                {active && pill.id === 'IN PROGRESS' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
                <span>{pill.id}</span>
                <span className={`px-1 py-0.2 rounded ${pill.bg} ${pill.text} font-semibold`}>
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Master-Detail Split Operations Workspace */}
      <div className="px-space-lg py-space-md grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT SIDE: Master Complaints Ledger (approx 58% = 7 cols) */}
        <div className="xl:col-span-7 flex flex-col bg-surface-1 overflow-hidden rounded border border-border-subtle">
          {/* Table Header & Sorter Bar */}
          <div className="bg-background-raised px-space-md py-3 flex items-center justify-between border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="font-label text-label text-text-primary uppercase tracking-wider font-semibold">
                Active Dispatch Ledger
              </span>
              <span className="px-1.5 py-0.5 bg-surface-2 font-micro-label text-micro-label text-brand-300 rounded">
                LIVE FEED
              </span>
            </div>
            <div className="flex items-center gap-space-md text-text-muted">
              <span className="font-micro-label text-micro-label uppercase">SORTED BY: SLA ASCENDING</span>
              <div className="flex items-center gap-1">
                <button
                  className="w-6 h-6 flex items-center justify-center bg-surface-2 text-text-primary rounded"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">view_agenda</span>
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center hover:bg-surface-2 text-text-muted transition-colors rounded"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">view_compact</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-text-muted font-micro-label text-micro-label uppercase tracking-wider h-10 select-none border-b border-border-subtle">
                  <th className="px-3 py-2 w-10 text-center">
                    <input
                      checked={selectedTickets.length === filteredRows.length && filteredRows.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTickets(filteredRows.map((r) => r.id));
                        } else {
                          setSelectedTickets([]);
                        }
                      }}
                      className="w-3.5 h-3.5 bg-surface-inset accent-brand-500 cursor-pointer"
                      type="checkbox"
                    />
                  </th>
                  <th className="px-3 py-2 font-semibold">TICKET ID</th>
                  <th className="px-3 py-2 font-semibold">ISSUE &amp; GEO QUADRANT</th>
                  <th className="px-3 py-2 font-semibold">PRIORITY</th>
                  <th className="px-3 py-2 font-semibold">STATUS</th>
                  <th className="px-3 py-2 font-semibold text-right">SLA TARGET</th>
                  <th className="px-3 py-2 font-semibold text-center">COMMUNITY</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-border-subtle text-text-primary">
                {filteredRows.map((row) => {
                  const isRowActive = row.id === selectedRowId;
                  const isChecked = selectedTickets.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-surface-3 transition-colors cursor-pointer ${
                        isRowActive ? 'bg-surface-2' : 'bg-surface-1'
                      }`}
                      onClick={() => setSelectedRowId(row.id)}
                    >
                      <td
                        className={`px-3 py-3 text-center ${isRowActive ? 'bg-surface-3' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectTicket(row.id);
                        }}
                      >
                        <input
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 bg-surface-inset accent-brand-500 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="px-3 py-3 font-semibold text-primary">
                        <div className="flex items-center gap-1.5">
                          {isRowActive && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
                          {row.priority === 'CRITICAL' && !isRowActive && (
                            <span className="w-1.5 h-1.5 bg-priority-critical rounded-full"></span>
                          )}
                          {row.status === 'REOPENED' && !isRowActive && (
                            <span className="w-1.5 h-1.5 bg-status-reopened-text rounded-full"></span>
                          )}
                          <span className="font-label text-label">#{row.id}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 min-w-0">
                        <div className="flex flex-col">
                          <span className="font-label text-label text-text-primary font-semibold truncate group-hover:text-primary transition-colors">
                            {row.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-micro-label text-micro-label text-text-muted">{row.location}</span>
                            <span className="font-micro-label text-micro-label text-copper-400">{row.dept}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {row.priority === 'HIGH' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-container text-secondary font-micro-label text-micro-label uppercase font-semibold rounded">
                            <span className="material-symbols-outlined text-[13px]">emergency</span>
                            <span>HIGH</span>
                          </span>
                        )}
                        {row.priority === 'CRITICAL' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-critical-bg text-priority-critical font-micro-label text-micro-label uppercase font-bold animate-pulse rounded">
                            <span className="material-symbols-outlined text-[13px]">warning</span>
                            <span>CRITICAL</span>
                          </span>
                        )}
                        {row.priority === 'MEDIUM' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-high text-priority-medium font-micro-label text-micro-label uppercase font-semibold rounded">
                            <span className="material-symbols-outlined text-[13px]">radio_button_checked</span>
                            <span>MEDIUM</span>
                          </span>
                        )}
                        {row.priority === 'LOW' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-high text-priority-low font-micro-label text-micro-label uppercase rounded">
                            <span className="material-symbols-outlined text-[13px]">check</span>
                            <span>LOW</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {row.status === 'IN PROGRESS' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label uppercase rounded">
                            <span className="material-symbols-outlined text-[13px]">progress_activity</span>
                            <span>IN PROGRESS</span>
                          </span>
                        )}
                        {row.status === 'RAISED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-raised-bg text-status-raised-text font-micro-label text-micro-label uppercase rounded">
                            <span className="material-symbols-outlined text-[13px]">outbox</span>
                            <span>RAISED</span>
                          </span>
                        )}
                        {row.status === 'UNDER REVIEW' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-under-review-bg text-status-under-review-text font-micro-label text-micro-label uppercase rounded">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span>UNDER REVIEW</span>
                          </span>
                        )}
                        {row.status === 'RESOLVED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-resolved-bg text-status-resolved-text font-micro-label text-micro-label uppercase rounded">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>RESOLVED</span>
                          </span>
                        )}
                        {row.status === 'REOPENED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-reopened-bg text-status-reopened-text font-micro-label text-micro-label uppercase font-semibold rounded">
                            <span className="material-symbols-outlined text-[13px]">refresh</span>
                            <span>REOPENED</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap font-numeric-kpi">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-semibold text-label ${
                              row.isUrgentSla
                                ? 'text-priority-critical font-bold'
                                : row.isMetSla
                                ? 'text-status-resolved-text'
                                : 'text-priority-high'
                            }`}
                          >
                            {row.slaTime}
                          </span>
                          <span
                            className={`font-micro-label text-micro-label uppercase ${
                              row.isUrgentSla ? 'text-priority-critical' : 'text-text-muted'
                            }`}
                          >
                            {row.slaTarget}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 font-numeric-kpi text-body-sm text-text-secondary">
                          <span className="material-symbols-outlined text-[15px] text-brand-300">group</span>
                          <span>{row.communityCount}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination / Registry Status Footer */}
          <div className="px-space-md py-3 bg-surface-container-low flex items-center justify-between font-label text-label text-text-muted border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-text-primary">1–6</strong> of{' '}
                <strong className="text-text-primary">28</strong> entries
              </span>
              <span className="text-text-disabled">•</span>
              <span className="font-micro-label text-micro-label uppercase text-brand-300">
                INTELLIGENCE SYNC: REALTIME
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 px-2 bg-surface-1 text-text-disabled cursor-not-allowed rounded" type="button">
                Previous
              </button>
              <button
                className="h-7 w-7 bg-brand-600 text-text-primary font-semibold flex items-center justify-center rounded"
                type="button"
              >
                1
              </button>
              <button
                className="h-7 w-7 bg-surface-1 hover:bg-surface-2 text-text-secondary flex items-center justify-center transition-colors rounded"
                type="button"
              >
                2
              </button>
              <button
                className="h-7 w-7 bg-surface-1 hover:bg-surface-2 text-text-secondary flex items-center justify-center transition-colors rounded"
                type="button"
              >
                3
              </button>
              <button
                className="h-7 px-2 bg-surface-1 hover:bg-surface-2 text-text-primary transition-colors rounded"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Active Complaint Inspection & Resolution Workbench (approx 42% = 5 cols) */}
        <div className="xl:col-span-5 flex flex-col bg-surface-1 rounded border border-border-subtle overflow-hidden">
          {/* Workbench Header */}
          <div className="p-space-md bg-surface-2 flex flex-col gap-space-sm border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary-container text-on-primary-container font-label text-label font-bold tracking-wider rounded">
                  #{selectedComplaint.ticketId}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label uppercase font-semibold rounded">
                  <span className="material-symbols-outlined text-[13px]">autorenew</span>
                  <span>{selectedComplaint.status.toUpperCase().replace('_', ' ')}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-container text-secondary font-micro-label text-micro-label uppercase font-semibold rounded">
                  <span className="material-symbols-outlined text-[13px]">priority_high</span>
                  <span>{selectedComplaint.priority.toUpperCase()}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="h-7 px-2 bg-surface-3 hover:bg-surface-bright text-text-primary font-micro-label text-micro-label uppercase tracking-wider flex items-center gap-1 transition-colors rounded"
                  type="button"
                >
                  <span>Change Status</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_drop_down</span>
                </button>
                <button
                  className="w-7 h-7 bg-surface-3 hover:bg-surface-bright text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors rounded"
                  title="Print Dossier"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="font-headline-3 text-headline-3 text-text-primary leading-tight">
                {selectedComplaint.title}
              </h2>
              <span className="font-micro-label text-micro-label uppercase text-text-muted mt-0.5">
                CATEGORY: {selectedComplaint.category.toUpperCase()} • {selectedComplaint.subcategory.toUpperCase()}
              </span>
            </div>
            {/* SLA Urgent Counter Banner */}
            <div className="bg-surface-inset p-space-sm flex items-center justify-between rounded">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-copper-400 text-[18px]">timer</span>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-copper-400 font-semibold tracking-wider">
                    CIVIC SLA WINDOW
                  </span>
                  <span className="font-label text-label text-text-primary">
                    04h 12m Remaining until Deanery Escalation
                  </span>
                </div>
              </div>
              <div className="h-2 w-28 bg-surface-3 relative overflow-hidden rounded-full">
                <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-copper-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Student Intake Telemetry & Evidence */}
          <div className="p-space-md flex flex-col gap-space-md bg-surface-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest font-semibold">
                  CADASTRE &amp; GEO AUDIT
                </span>
                <span className="font-micro-label text-micro-label text-brand-300 uppercase">CALIBRATED GPS</span>
              </div>
              <div className="p-2.5 bg-surface-container-low flex flex-col gap-2 rounded">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                  <div className="flex flex-col">
                    <span className="font-label text-label text-text-primary font-semibold">
                      {selectedComplaint.locationZone} {selectedComplaint.specificDemarcation ? `• ${selectedComplaint.specificDemarcation}` : ''}
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted">
                      Exact Coordinates: [{selectedComplaint.geotag || '28.5449° N, 77.1926° E'}] • Station Unit #WC-02B
                    </span>
                  </div>
                </div>
                {/* Photogrammetric Evidence Preview & Whistleblower Guard */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="relative bg-surface-inset p-1 flex flex-col gap-1 rounded">
                    <div className="relative h-28 bg-surface-3 overflow-hidden rounded">
                      <img
                        className="w-full h-full object-cover opacity-85"
                        alt="Stainless steel dual-tap drinking water cooling dispenser station"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcZxegulGNsSZ220dM2AXvs-AAeQV6oQUjviSt0d6rBTdun2q5I9ViIRVsktpi4U6AmrL6dOqF0pqePcY-3Ltd6LZGSB8xXcFSIJgyQV5vCECutvdFXfBycXACwbq1C9tNG_4Qa8YOw9t217s8o6OaYA9xOszJpK9UYdawS5LocoXvfDSS7aVrqYeQfDHH3HRf2NUnNeo_kRXg5lDE6pEFndGsmFerMn02PzHFr-qj"
                      />
                      <span className="absolute bottom-1 right-1 bg-surface-container-lowest/90 px-1 py-0.5 font-micro-label text-[9px] text-text-primary font-mono rounded">
                        08:30 AM TODAY
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="font-micro-label text-micro-label text-text-secondary truncate">
                        Dispenser Leakage Photo
                      </span>
                      <span className="material-symbols-outlined text-brand-300 text-[14px]">zoom_in</span>
                    </div>
                  </div>
                  {/* Student Anonymity / Community Support Metrics */}
                  <div className="bg-surface-inset p-2.5 flex flex-col justify-between rounded">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-brand-300">
                        <span className="material-symbols-outlined text-[15px]">verified_user</span>
                        <span className="font-micro-label text-micro-label uppercase font-semibold">
                          PRIVACY GUARD V2
                        </span>
                      </div>
                      <p className="font-micro-label text-[11px] text-text-muted leading-relaxed">
                        Student identity cryptographically masked per Campus Charter Article 14.{' '}
                        <span className="font-mono text-text-secondary">UID: #STU-992a***</span>
                      </p>
                    </div>
                    <div className="pt-2 bg-surface-container/40 p-2 rounded">
                      <span className="font-micro-label text-micro-label uppercase text-text-muted block">
                        PUBLIC IMPACT METRIC
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col">
                          <span className="font-numeric-kpi text-headline-4 text-text-primary">
                            {selectedComplaint.affectedCountEst}
                          </span>
                          <span className="font-micro-label text-[10px] text-text-secondary">Directly Affected</span>
                        </div>
                        <div className="h-6 w-px bg-surface-3"></div>
                        <div className="flex flex-col">
                          <span className="font-numeric-kpi text-headline-4 text-copper-400">
                            {selectedComplaint.endorsementsCount}
                          </span>
                          <span className="font-micro-label text-[10px] text-text-secondary">Endorsements</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Dispatch & Custodian Assignment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest font-semibold">
                  DISPATCH ASSIGNMENT
                </span>
                <button
                  className="font-micro-label text-micro-label text-brand-300 hover:underline uppercase"
                  type="button"
                  onClick={() => setShowReassignModal(true)}
                >
                  REASSIGN WORKFLOW
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-surface-container-low flex flex-col rounded">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">Assigned Custodian</span>
                  <span className="font-label text-label text-text-primary font-semibold mt-1">
                    {selectedComplaint.assignedDepartmentName || 'Estates & Facilities'}
                  </span>
                  <span className="font-micro-label text-micro-label text-brand-300 mt-0.5">
                    Zone Dispatch Desk
                  </span>
                </div>
                <div className="p-2.5 bg-surface-container-low flex flex-col rounded">
                  <span className="font-micro-label text-micro-label uppercase text-text-muted">Field Technician</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-status-resolved-border"></span>
                    <span className="font-label text-label text-text-primary font-semibold truncate">
                      {selectedComplaint.assignedTechnicianName || 'Team Delta • Assigned'}
                    </span>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted font-mono mt-0.5">
                    Badge {selectedComplaint.assignedTechnicianBadge || '#TECH-4409'} (On-site)
                  </span>
                </div>
              </div>
            </div>

            {/* Admin-Only Internal Thread */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-copper-400">lock</span>
                  <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-widest font-semibold">
                    INTERNAL NOTES THREAD (ADMIN RESTRICTED)
                  </span>
                </div>
                <span className="font-micro-label text-micro-label text-text-disabled">NON-PUBLIC</span>
              </div>
              <div className="p-3 bg-surface-inset flex flex-col gap-2.5 rounded">
                <div className="flex items-start gap-2 text-body-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label text-label text-text-primary font-semibold">
                        Lead Dispatch Office
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted">Today • 09:45 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                      Chiller compressor replacement parts checked out from Central Store. Requisition voucher #RQ-881
                      signed by Shift Supervisor.
                    </p>
                  </div>
                </div>
                <div className="h-px bg-surface-3"></div>
                <div className="flex items-start gap-2 text-body-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-copper-400 mt-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label text-label text-text-primary font-semibold">
                        Technician Verma (Field)
                      </span>
                      <span className="font-micro-label text-micro-label text-text-muted">Today • 11:20 AM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                      On-site inspecting condenser coil. Thermostat unit replaced. Purging line to ensure flow rate
                      matches specifications.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleAddInternalNote} className="flex gap-2 pt-2 border-t border-surface-3">
                  <input
                    type="text"
                    placeholder="Add confidential technician note..."
                    value={newInternalNote}
                    onChange={(e) => setNewInternalNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-surface-2 text-text-primary placeholder:text-text-muted font-body-sm text-body-sm rounded focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label uppercase rounded transition-colors text-xs"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>

            {/* Verifiable Resolution Module Form */}
            <div className="p-space-md bg-surface-container-low flex flex-col gap-space-sm rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                  <span className="font-headline-4 text-headline-4 text-text-primary font-semibold">
                    Mark Issue as Resolved
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-surface-2 font-micro-label text-micro-label text-text-muted uppercase rounded">
                  STAGE 4 OF 4
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label text-text-secondary uppercase tracking-wider flex items-center justify-between">
                  <span>Resolution Operational Summary</span>
                  <span className="font-micro-label text-micro-label text-brand-300">COMPULSORY FIELD</span>
                </label>
                <textarea
                  className="w-full p-2.5 bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm focus:outline-none resize-none rounded"
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                />
              </div>
              {/* Physical Evidence Upload Dropzone */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label text-text-secondary uppercase tracking-wider">
                  Physical Repair Evidence &amp; Sensor Calibration
                </label>
                <div className="p-4 bg-surface-inset hover:bg-surface-3 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center rounded">
                  <span className="material-symbols-outlined text-[26px] text-primary">cloud_upload</span>
                  <span className="font-label text-label text-text-primary">
                    Drag post-repair photo or digital thermal certificate
                  </span>
                  <span className="font-micro-label text-micro-label text-text-muted">
                    SUPPORTS HIGH-RES JPG, PNG, OR METROLOGY LOG (MAX 15MB)
                  </span>
                </div>
              </div>
              {/* Strict Mandatory Policy Callout */}
              <div className="p-2.5 bg-surface-2 flex items-start gap-2.5 rounded">
                <span className="material-symbols-outlined text-copper-400 text-[18px] flex-shrink-0 mt-0.5">policy</span>
                <div className="flex flex-col">
                  <span className="font-micro-label text-micro-label uppercase text-copper-400 font-semibold tracking-wider">
                    MANDATORY CIVIC VERIFICATION GOVERNANCE
                  </span>
                  <p className="font-micro-label text-micro-label text-text-muted leading-relaxed mt-0.5">
                    Marking 'Resolved' dispatches an automated verification ping to the 54 student quorum endorsers.
                    Per Governance Charter 2024, the ticket{' '}
                    <strong className="text-text-primary font-semibold">CANNOT</strong> transition to Closed until a
                    60% student sign-off quorum is registered.
                  </p>
                </div>
              </div>
              {/* Action CTA Group */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  className="flex-1 h-11 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label tracking-wide uppercase flex items-center justify-center gap-2 transition-colors rounded"
                  type="button"
                  onClick={handleSubmitResolution}
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Submit Resolution for Student Sign-off</span>
                </button>
                <button
                  className="h-11 px-space-md bg-surface-inset hover:bg-surface-2 text-text-secondary hover:text-priority-critical font-label text-label tracking-wide uppercase flex items-center gap-1.5 transition-colors rounded"
                  title="Flag for Re-inspection"
                  type="button"
                  onClick={() =>
                    updateComplaintStatus(
                      selectedComplaint.ticketId,
                      'in_progress',
                      'Flagged for re-inspection by Administrator'
                    )
                  }
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                  <span>Re-inspect</span>
                </button>
              </div>
              {submittedResolution && (
                <div className="p-2 bg-surface-2 text-status-verified-text font-body-sm text-xs rounded flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Resolution submitted. Student verification quorum protocol initiated.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Workflow Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface-1 border border-border-subtle rounded-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-space-md bg-surface-raised border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-copper-400 text-[20px]">swap_horiz</span>
                <h3 className="font-headline-4 text-headline-4 text-text-primary">
                  Reassign Dispatch Custody: #{selectedComplaint.ticketId}
                </h3>
              </div>
              <button
                onClick={() => setShowReassignModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label text-text-secondary uppercase">Target Department</label>
                <select
                  id="reassignDept"
                  defaultValue="Estates & Facilities"
                  className="w-full h-10 px-3 bg-surface-inset text-text-primary rounded border border-border-subtle focus:outline-none focus:ring-1 focus:ring-brand-400 font-body-sm"
                >
                  <option value="Estates & Facilities">Estates & Facilities</option>
                  <option value="Estate Electrical & Heavy Lift Section">Estate Electrical & Heavy Lift Section</option>
                  <option value="HVAC & Plumbing Operations">HVAC & Plumbing Operations</option>
                  <option value="Campus Sanitation & Mess Inspection Committee">Campus Sanitation & Mess Committee</option>
                  <option value="IT & Multimedia Services">IT & Multimedia Services</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label text-text-secondary uppercase">Assign Field Technician</label>
                <select
                  id="reassignTech"
                  defaultValue="Team Delta • R. Verma"
                  className="w-full h-10 px-3 bg-surface-inset text-text-primary rounded border border-border-subtle focus:outline-none focus:ring-1 focus:ring-brand-400 font-body-sm"
                >
                  <option value="Team Delta • R. Verma">Technician R. Verma (#TECH-4409)</option>
                  <option value="Senior Mechanic R. Chawla">Senior Mechanic R. Chawla (#TECH-1082)</option>
                  <option value="Technician Das">Technician Das (#TECH-2190)</option>
                  <option value="Dispatched External Contractor">External Certified Contractor</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label text-text-secondary uppercase">Priority Recalibration</label>
                <select
                  id="reassignPriority"
                  defaultValue={selectedComplaint.priority}
                  className="w-full h-10 px-3 bg-surface-inset text-text-primary rounded border border-border-subtle focus:outline-none focus:ring-1 focus:ring-brand-400 font-body-sm"
                >
                  <option value="critical">Critical (Tier 1 • 4hr SLA)</option>
                  <option value="high">High (Tier 2 • 12hr SLA)</option>
                  <option value="medium">Medium (Tier 2 • 24hr SLA)</option>
                  <option value="low">Low (Tier 3 • 48hr SLA)</option>
                </select>
              </div>
            </div>
            <div className="p-space-md bg-surface-inset border-t border-border-subtle flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text-secondary rounded font-label text-label uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const dept = (document.getElementById('reassignDept') as HTMLSelectElement)?.value || 'Estates & Facilities';
                  const tech = (document.getElementById('reassignTech') as HTMLSelectElement)?.value || 'Team Delta • R. Verma';
                  const prio = ((document.getElementById('reassignPriority') as HTMLSelectElement)?.value || 'high') as ComplaintPriority;
                  assignDepartment(selectedComplaint.ticketId, 'dept_assigned', dept, tech, '#TECH-REASSIGN');
                  updatePriority(selectedComplaint.ticketId, prio, `Reassigned to ${dept}`);
                  setShowReassignModal(false);
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-text-primary rounded font-label text-label uppercase transition-colors"
              >
                Confirm Custody Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

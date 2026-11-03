import React, { useState } from 'react';
import { useDemoData } from '@/context/DemoDataContext';
import { useAuth } from '@/context/AuthContext';

interface SignalCard {
  id: string;
  category: 'infrastructure' | 'living' | 'academic' | 'network' | 'sanitation';
  categoryLabel: string;
  nodeId: string;
  priorityText: string;
  priorityBg: string;
  priorityTextClass: string;
  status: string;
  statusBg: string;
  statusTextClass: string;
  statusIcon: string;
  slaText?: string;
  assignedDept?: string;
  title: string;
  description: string;
  location: string;
  escalationNote?: string;
  photoUrl?: string;
  photoTimestamp?: string;
  affectedCount: number;
  initialEndorsements: number;
  isResolved?: boolean;
  resolutionNote?: string;
}

const SIGNALS: SignalCard[] = [
  {
    id: 'card-1',
    category: 'infrastructure',
    categoryLabel: '#CAMPUS-WIDE',
    nodeId: '#INF-8841',
    priorityText: 'CRITICAL INFRASTRUCTURE',
    priorityBg: 'bg-status-critical-bg',
    priorityTextClass: 'text-status-critical-text font-bold',
    status: 'IN PROGRESS',
    statusBg: 'bg-status-in-progress-bg',
    statusTextClass: 'text-status-in-progress-text',
    statusIcon: 'sync',
    slaText: 'SLA: 01h 45m left',
    title: 'Building 3 HVAC Recurring Chiller Failure',
    description:
      'Multiple AC chillers tripping continuously during peak afternoon lectures. Ambient interior temperature exceeding 34°C in lecture halls. Sub-station breaker B3 has tripped 4 times since 09:00 AM.',
    location: 'Academic Complex Block 3 (Auditorium & Classrooms 301-312)',
    escalationNote: 'Escalated: Dean Student Welfare',
    affectedCount: 142,
    initialEndorsements: 89,
  },
  {
    id: 'card-2',
    category: 'living',
    categoryLabel: '#HOSTEL BLOCK 4',
    nodeId: '#LIV-9014',
    priorityText: 'HIGH PRIORITY',
    priorityBg: 'bg-status-raised-bg',
    priorityTextClass: 'text-status-raised-text font-bold',
    status: 'UNDER REVIEW',
    statusBg: 'bg-status-under-review-bg',
    statusTextClass: 'text-status-under-review-text',
    statusIcon: 'troubleshoot',
    assignedDept: 'Assigned: Estates Plumbing',
    title: 'Hot Water Supply Manifold Leak & Low Pressure',
    description:
      'Main copper manifold joint leaking continuously onto basement floor, cutting hot water delivery to floors 2 and 3 during early morning hours. Water pooling near electrical cable conduits.',
    location: 'Boys Hostel Block IV, Ground Floor Boiler Utility Compartment (Sub-Sector B)',
    photoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnfwb56pkgZuelPMnSRZD8_29vGSF29TgaQCaO9RTERFFm7mObY6K9MzxX56uZe_svQ0thlgA6Ysg1w0-2PZUfiGl-86jZK7PYOw8fKbTteo0PzIYQ-CLWeR27NZbVzxB9UBHTkxJoGf1xM6ljtgiZu7yM_tmbqb8waRSm1QvGmxA-Uq7Idtn64Rj4bR4AL2Pu6ZPQSagwAjgjAsHKuP5WIIOFdnUzF9B55H6nMJ7i',
    photoTimestamp: 'Validated Photo Timestamp: 07:15 AM Today',
    affectedCount: 54,
    initialEndorsements: 41,
  },
  {
    id: 'card-3',
    category: 'sanitation',
    categoryLabel: '#CENTRAL LIBRARY',
    nodeId: '#SAN-4412',
    priorityText: 'MEDIUM PRIORITY',
    priorityBg: 'bg-surface-2',
    priorityTextClass: 'text-text-secondary',
    status: 'IN PROGRESS',
    statusBg: 'bg-status-in-progress-bg',
    statusTextClass: 'text-status-in-progress-text',
    statusIcon: 'build',
    title: 'Restroom 2nd Floor Exhaust Fan Failure & Drainage Odor',
    description:
      'Heavy ventilation outage affecting North reading gallery quiet rooms. Work order issued to facilities sanitation vendor #8829.',
    location: 'Central Library, 2nd Floor North Wing',
    affectedCount: 29,
    initialEndorsements: 17,
  },
  {
    id: 'card-4',
    category: 'academic',
    categoryLabel: '#SCIENCE LABS',
    nodeId: '#LAB-3011',
    priorityText: 'VERIFIED RESOLVED',
    priorityBg: 'bg-status-resolved-bg',
    priorityTextClass: 'text-status-resolved-text font-bold',
    status: 'RESOLVED',
    statusBg: 'bg-status-verified-bg',
    statusTextClass: 'text-status-verified-text',
    statusIcon: 'check_circle',
    assignedDept: 'Sign-Off Pending',
    title: 'Chemical Fume Hood Sensor Calibration (Lab 402)',
    description:
      'Airflow differential velocity sensor was producing false evacuation sirens during organic synthesis practicals.',
    location: 'Science Complex, Lab 402',
    isResolved: true,
    resolutionNote:
      'Resolution Verified: HEPA filter and differential pressure transducer replaced by vendor LabEquip Ltd. 100% compliant under NFPA 45 campus inspection standards.',
    affectedCount: 18,
    initialEndorsements: 24,
  },
];

export const CommunityBoardPage: React.FC = () => {
  const { endorseComplaint } = useDemoData();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('impact');
  const [endorsements, setEndorsements] = useState<Record<string, { count: number; active: boolean }>>({
    'card-1': { count: 89, active: false },
    'card-2': { count: 41, active: false },
    'card-3': { count: 17, active: false },
    'card-4': { count: 24, active: false },
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const toggleEndorsement = (id: string, ticketId?: string) => {
    if (ticketId) {
      endorseComplaint(ticketId.replace('#', '').replace('INF-', 'SNK-'), user?.id || 'usr_student_01');
    }
    setEndorsements((prev) => {
      const current = prev[id] || { count: 0, active: false };
      return {
        ...prev,
        [id]: {
          count: current.active ? current.count - 1 : current.count + 1,
          active: !current.active,
        },
      };
    });
  };

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2600);
  };

  const filteredSignals = SIGNALS.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.nodeId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Editorial Header & Operational Overview */}
      <section className="relative w-full mb-space-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-copper-400"></span>
              <span className="font-micro-label text-micro-label uppercase text-brand-300 tracking-widest">
                Public Ledger • Real-Time Aggregator
              </span>
              <span className="text-text-disabled">•</span>
              <span className="font-micro-label text-micro-label uppercase text-text-muted">Node Synchronized</span>
            </div>
            <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              Your campus. Shared responsibility.
            </h1>
            <p className="font-body-lg text-body-lg text-text-secondary mt-space-sm max-w-2xl leading-relaxed">
              Explore verified public signals, endorse recurring issues affecting your hostel or department, and
              track institutional accountability in real time.
            </p>
          </div>
          {/* Quick Metrics Ribbon */}
          <div className="flex items-stretch gap-space-sm bg-surface-1 p-space-sm rounded-lg shadow-sm">
            <div className="px-space-md py-space-xs flex flex-col justify-center">
              <span className="font-micro-label text-micro-label uppercase text-text-muted">Live Signals</span>
              <span className="font-numeric-kpi text-numeric-kpi text-text-primary">47</span>
            </div>
            <div className="w-px bg-surface-2 self-stretch"></div>
            <div className="px-space-md py-space-xs flex flex-col justify-center">
              <span className="font-micro-label text-micro-label uppercase text-copper-400">Endorsed Impact</span>
              <span className="font-numeric-kpi text-numeric-kpi text-copper-400">1,208</span>
            </div>
            <div className="w-px bg-surface-2 self-stretch"></div>
            <div className="px-space-md py-space-xs flex flex-col justify-center">
              <span className="font-micro-label text-micro-label uppercase text-status-verified-text">Resolved 7D</span>
              <span className="font-numeric-kpi text-numeric-kpi text-status-verified-text">38</span>
            </div>
          </div>
        </div>
        {/* Privacy Banner */}
        <div className="mt-space-lg bg-surface-container-low p-space-md rounded-lg flex items-start sm:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center flex-shrink-0 text-brand-300">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-snug">
              <strong className="font-semibold text-text-primary">Student privacy protected:</strong> Submissions on
              the community board show anonymous student endorsements, validated geotags, and aggregated counts. No
              personal phone numbers or identifiers are made public.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 font-micro-label text-micro-label uppercase text-copper-400 bg-status-raised-bg px-2.5 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Cryptographic Hash Signed</span>
          </div>
        </div>
      </section>

      {/* Interactive Control Bar & Search Array */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-md py-space-sm mb-space-lg shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-1" id="category-filter-group">
            {[
              { id: 'all', label: 'All Categories', count: 47 },
              { id: 'infrastructure', label: 'Infrastructure', count: 19 },
              { id: 'living', label: 'Living Quarters', count: 12 },
              { id: 'academic', label: 'Academic Labs', count: 8 },
              { id: 'network', label: 'Network', count: 5 },
              { id: 'sanitation', label: 'Sanitation', count: 3 },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`cat-pill px-3 py-1.5 rounded font-label text-label uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    active
                      ? 'bg-brand-600 text-text-primary'
                      : 'bg-surface-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`font-micro-label text-micro-label px-1 py-0.2 rounded ${
                      active ? 'bg-brand-800 text-text-primary' : 'bg-surface-2 text-text-muted'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
                filter_list
              </span>
              <input
                className="w-full h-9 pl-9 pr-space-md bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm rounded focus:outline-none focus:bg-surface-1 transition-all"
                id="signal-search"
                placeholder="Filter signal tags..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex items-center bg-surface-1 rounded px-space-sm h-9">
              <span className="font-micro-label text-micro-label uppercase text-text-muted mr-1.5">Sort:</span>
              <select
                className="bg-transparent text-text-primary font-label text-label focus:outline-none cursor-pointer pr-4 appearance-none"
                id="sort-selector"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option className="bg-surface-1 text-text-primary" value="impact">
                  Highest Community Impact
                </option>
                <option className="bg-surface-1 text-text-primary" value="recent">
                  Most Recent Signal
                </option>
                <option className="bg-surface-1 text-text-primary" value="sla">
                  Critical SLA Imminent
                </option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-text-muted pointer-events-none absolute right-2">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Grid: Grievance Stream (8 cols) & Campus Pulse Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: High-Fidelity Signal Cards (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md" id="grievance-feed">
          {filteredSignals.map((card) => {
            const endState = endorsements[card.id] || { count: card.initialEndorsements, active: false };
            return (
              <article
                key={card.id}
                className="grievance-card group bg-surface-1 hover:bg-surface-2 rounded-lg p-space-lg transition-all duration-150 shadow-md"
              >
                {/* Top Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-surface-2">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-surface-3 font-micro-label text-micro-label uppercase text-brand-300">
                      {card.categoryLabel}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${card.priorityBg} font-micro-label text-micro-label uppercase ${card.priorityTextClass}`}>
                      {card.priorityText}
                    </span>
                    <span className="font-micro-label text-micro-label uppercase text-text-muted">
                      • Node ID: {card.nodeId}
                    </span>
                  </div>
                  {/* Status SLA Pill */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${card.statusBg} ${card.statusTextClass}`}>
                    <span
                      className={`material-symbols-outlined text-[14px] ${card.statusIcon === 'sync' ? 'animate-spin' : ''}`}
                      style={card.statusIcon === 'sync' ? { animationDuration: '4s' } : undefined}
                    >
                      {card.statusIcon}
                    </span>
                    <span className="font-micro-label text-micro-label uppercase tracking-widest font-semibold">
                      {card.status}
                    </span>
                    {card.slaText && (
                      <>
                        <span className="text-surface-2">•</span>
                        <span className="font-micro-label text-micro-label uppercase text-copper-400 font-bold">
                          {card.slaText}
                        </span>
                      </>
                    )}
                    {card.assignedDept && (
                      <>
                        <span className="text-surface-2">•</span>
                        <span className="font-micro-label text-micro-label uppercase text-text-secondary">
                          {card.assignedDept}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Issue Title & Spatial Description */}
                <div className="mb-space-md">
                  <h2
                    className={`font-headline-3 text-headline-3 text-text-primary tracking-tight group-hover:text-primary transition-colors ${
                      card.isResolved ? 'line-through decoration-text-disabled text-opacity-80' : ''
                    }`}
                  >
                    {card.title}
                  </h2>
                  <p className="font-body-md text-body-md text-text-secondary mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Optional Photo Evidence */}
                {card.photoUrl && (
                  <div className="mb-space-md rounded overflow-hidden relative">
                    <div className="relative w-full h-44 bg-surface-inset flex items-center justify-center">
                      <img
                        className="w-full h-full object-cover opacity-85"
                        alt="Plumbing manifold and bronze valves"
                        src={card.photoUrl}
                      />
                      <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-copper-400">photo_camera</span>
                        <span className="font-micro-label text-micro-label uppercase text-text-primary">
                          {card.photoTimestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Resolution Note */}
                {card.resolutionNote && (
                  <div className="bg-status-verified-bg/40 p-space-sm rounded my-space-sm flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-[18px] text-status-verified-text flex-shrink-0 mt-0.5">
                      verified
                    </span>
                    <div className="text-text-primary font-body-sm text-body-sm">
                      <span className="font-semibold text-status-verified-text">Resolution Verified:</span>{' '}
                      HEPA filter and differential pressure transducer replaced by vendor LabEquip Ltd. 100% compliant under NFPA 45 campus inspection standards.
                    </div>
                  </div>
                )}

                {/* Location Grid */}
                {!card.photoUrl && !card.isResolved && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mb-space-md bg-surface-inset p-space-sm rounded">
                    <div className="md:col-span-2 flex items-center gap-space-sm">
                      <div className="w-7 h-7 rounded bg-surface-2 flex items-center justify-center flex-shrink-0 text-brand-300">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-micro-label text-micro-label uppercase text-text-muted block">
                          Incident Location
                        </span>
                        <span className="font-body-sm text-body-sm font-medium text-text-primary truncate block">
                          {card.location}
                        </span>
                      </div>
                    </div>
                    {card.escalationNote && (
                      <div className="flex items-center justify-start md:justify-end gap-1.5 text-text-secondary">
                        <span className="material-symbols-outlined text-[16px] text-status-raised-text">
                          crisis_alert
                        </span>
                        <span className="font-micro-label text-micro-label uppercase text-status-raised-text">
                          {card.escalationNote}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {card.photoUrl && (
                  <div className="flex items-center gap-space-sm mb-space-md bg-surface-inset p-space-sm rounded">
                    <span className="material-symbols-outlined text-[16px] text-brand-300">location_on</span>
                    <span className="font-body-sm text-body-sm text-text-secondary">{card.location}</span>
                  </div>
                )}

                {/* Metric Bars: Community Impact Spectrum */}
                <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs mb-space-md text-text-secondary">
                  <div className="flex items-center gap-space-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-text-muted">groups</span>
                      <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                        {card.affectedCount}
                      </span>
                      <span className="font-micro-label text-micro-label uppercase text-text-muted">
                        affected students
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-copper-400">thumb_up</span>
                      <span className="font-body-sm text-body-sm font-semibold text-copper-400">
                        {endState.count}
                      </span>
                      <span className="font-micro-label text-micro-label uppercase text-text-muted">
                        endorsements
                      </span>
                    </div>
                  </div>
                  <span className="font-micro-label text-micro-label text-text-muted">
                    {card.isResolved ? 'Resolved in 14h 12m (3h ahead of SLA)' : 'Broadcasted 42 mins ago via IoT Sentinel'}
                  </span>
                </div>

                {/* Bottom Action Strip */}
                <div className="flex items-center justify-between pt-space-sm border-t border-surface-2">
                  <div className="flex items-center gap-space-sm">
                    {!card.isResolved ? (
                      <>
                        <button
                          className={`endorse-btn h-10 px-space-md text-text-primary rounded font-label text-label uppercase tracking-wider flex items-center gap-space-xs transition-all shadow-sm ${
                            endState.active
                              ? 'bg-copper-400'
                              : 'bg-copper-500 hover:bg-copper-400'
                          }`}
                          onClick={() => toggleEndorsement(card.id, card.nodeId)}
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                          <span>+1 Me Too (Endorse Issue)</span>
                          <span className="bg-copper-600 px-1.5 py-0.5 rounded text-micro-label">
                            {endState.count}
                          </span>
                        </button>
                        {card.id === 'card-1' && (
                          <button
                            className="modal-open-btn h-10 px-space-md bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary rounded font-label text-label uppercase tracking-wider flex items-center gap-space-xs transition-colors"
                            onClick={() => setModalOpen(true)}
                          >
                            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                            <span>View Custody Log</span>
                          </button>
                        )}
                        {card.id === 'card-2' && (
                          <button
                            className="share-signal-btn h-9 px-3 bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary rounded font-label text-label uppercase tracking-wider flex items-center gap-1 transition-colors"
                            onClick={handleShare}
                          >
                            <span className="material-symbols-outlined text-[16px]">link</span>
                            <span>Share Signal</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary rounded font-micro-label text-micro-label uppercase tracking-wider transition-colors">
                        Confirm Verification (Student Rep)
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-text-muted hover:text-text-primary cursor-pointer transition-colors p-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Sidebar: Campus Pulse Widget (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Widget 1: Campus Resolution Velocity Indicator */}
          <div className="bg-surface-1 rounded-lg p-space-lg shadow-md">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-micro-label text-micro-label uppercase text-brand-300 tracking-wider">
                Campus Pulse Metric
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-muted">speed</span>
            </div>
            <h3 className="font-headline-4 text-headline-4 text-text-primary">Resolution Velocity</h3>
            <p className="font-body-sm text-body-sm text-text-secondary mt-1">
              78.4% of high-severity public signals resolved strictly within SLA window this month.
            </p>
            {/* KPI Breakdown Bar Graphic (Inline SVG) */}
            <div className="mt-space-md">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-numeric-kpi text-numeric-kpi text-brand-300">78.4%</span>
                <span className="font-micro-label text-micro-label uppercase text-status-verified-text flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +4.2% vs Feb
                </span>
              </div>
              {/* Stacked Custom Progress Ribbon */}
              <div className="w-full h-3 bg-surface-inset rounded overflow-hidden flex">
                <div className="h-full bg-brand-500" style={{ width: '78.4%' }} title="Within SLA"></div>
                <div className="h-full bg-copper-500" style={{ width: '14.1%' }} title="Escalated / Extended"></div>
                <div className="h-full bg-error-container" style={{ width: '7.5%' }} title="Breached"></div>
              </div>
              <div className="flex justify-between font-micro-label text-micro-label text-text-muted uppercase mt-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span> Within SLA (78%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-copper-500"></span> Extended (14%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error-container"></span> Breached (8%)
                </span>
              </div>
            </div>
            {/* Weekly Velocity Histogram */}
            <div className="mt-space-lg pt-space-md border-t border-surface-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-micro-label text-micro-label uppercase text-text-muted">
                  4-Week Resolution Volume
                </span>
                <span className="font-micro-label text-micro-label uppercase text-brand-300">Target: 30 / wk</span>
              </div>
              <svg className="w-full h-16 text-brand-500" fill="none" preserveAspectRatio="none" viewBox="0 0 240 60">
                <line stroke="#2B3934" strokeWidth="1" x1="0" x2="240" y1="50" y2="50"></line>
                <line stroke="#2B3934" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="240" y1="25" y2="25"></line>
                <rect fill="#245B56" height="26" rx="2" width="28" x="15" y="24"></rect>
                <rect fill="#245B56" height="34" rx="2" width="28" x="75" y="16"></rect>
                <rect fill="#3E7567" height="40" rx="2" width="28" x="135" y="10"></rect>
                <rect fill="#638F7E" height="44" rx="2" width="28" x="195" y="6"></rect>
                <text fill="#82938A" fontFamily="Inter" fontSize="7" textAnchor="middle" x="29" y="58">
                  W07
                </text>
                <text fill="#82938A" fontFamily="Inter" fontSize="7" textAnchor="middle" x="89" y="58">
                  W08
                </text>
                <text fill="#82938A" fontFamily="Inter" fontSize="7" textAnchor="middle" x="149" y="58">
                  W09
                </text>
                <text fill="#F1F4EF" fontFamily="Inter" fontSize="7" textAnchor="middle" x="209" y="58">
                  CURRENT
                </text>
              </svg>
            </div>
          </div>

          {/* Widget 2: Recurring Hotspot Radar */}
          <div className="bg-surface-1 rounded-lg p-space-lg shadow-md">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-micro-label text-micro-label uppercase text-copper-400 tracking-wider">
                Infrastructure Alert
              </span>
              <span className="material-symbols-outlined text-[16px] text-copper-400">radar</span>
            </div>
            <h3 className="font-headline-4 text-headline-4 text-text-primary">Recurring Hotspot Radar</h3>
            <p className="font-body-sm text-body-sm text-text-secondary mt-1">
              Algorithmic clustering of complaints indicates chronic mechanical and structural fatigue.
            </p>
            {/* Hotspot Spotlight Card */}
            <div className="mt-space-md p-space-md bg-surface-inset rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label text-label font-semibold text-text-primary">Block 3 HVAC Core</span>
                <span className="font-micro-label text-micro-label uppercase text-copper-400 font-bold bg-status-raised-bg px-2 py-0.5 rounded">
                  Repeated Flag #5
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary leading-snug">
                Flagged for complete capital replacement in FY25 Budget review. 11 intermittent repair calls logged over
                45 days.
              </p>
              <div className="mt-space-sm pt-space-xs flex items-center justify-between text-text-muted">
                <span className="font-micro-label text-micro-label uppercase">Est. Outage Risk: HIGH</span>
                <a className="font-label text-label text-brand-300 hover:text-text-primary flex items-center gap-0.5" href="#">
                  <span>View Audit</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
            {/* Secondary Hotspot Minimal */}
            <div className="mt-space-sm p-space-sm bg-surface-inset rounded flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-status-raised-text"></span>
                <span className="font-body-sm text-body-sm text-text-primary">Hostel IV Pressure Pumps</span>
              </div>
              <span className="font-micro-label text-micro-label text-text-muted uppercase">3 reports / 7d</span>
            </div>
          </div>

          {/* Widget 3: Recent Campus Wins Ledger */}
          <div className="bg-surface-1 rounded-lg p-space-lg shadow-md">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-micro-label text-micro-label uppercase text-status-verified-text tracking-wider">
                Accountability Log
              </span>
              <span className="material-symbols-outlined text-[16px] text-status-verified-text">task_alt</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-headline-4 text-headline-4 text-text-primary">Recent Campus Wins</h3>
              <span className="font-micro-label text-micro-label text-brand-300 uppercase font-semibold">
                14 resolved this week
              </span>
            </div>
            {/* Ledger Entries */}
            <div className="mt-space-md flex flex-col gap-space-sm">
              <div className="p-space-sm rounded bg-surface-inset hover:bg-surface-2 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label text-label font-medium text-text-primary truncate max-w-[200px]">
                    WiFi AP-412 Roaming Drop
                  </span>
                  <span className="font-micro-label text-micro-label text-status-verified-text uppercase font-bold">
                    Closed
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Firmware upgraded &amp; backhaul switch port repatched in Computer Science wing.
                </p>
                <span className="font-micro-label text-micro-label text-text-disabled mt-1 block">
                  Verified by 64 students
                </span>
              </div>
              <div className="p-space-sm rounded bg-surface-inset hover:bg-surface-2 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label text-label font-medium text-text-primary truncate max-w-[200px]">
                    Auditorium Projector Dimming
                  </span>
                  <span className="font-micro-label text-micro-label text-status-verified-text uppercase font-bold">
                    Closed
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Laser module replaced prior to Dean’s Colloquium.
                </p>
                <span className="font-micro-label text-micro-label text-text-disabled mt-1 block">
                  Verified by Department Council
                </span>
              </div>
              <div className="p-space-sm rounded bg-surface-inset hover:bg-surface-2 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label text-label font-medium text-text-primary truncate max-w-[200px]">
                    Mess Hall Filter Cartridge Replacement
                  </span>
                  <span className="font-micro-label text-micro-label text-status-verified-text uppercase font-bold">
                    Closed
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Reverse osmosis unit sanitized; TDS reading calibrated to 72 ppm.
                </p>
                <span className="font-micro-label text-micro-label text-text-disabled mt-1 block">
                  Verified by Mess Committee
                </span>
              </div>
            </div>
            <a
              className="mt-space-md block text-center font-label text-label uppercase text-brand-300 hover:text-text-primary py-2 rounded bg-surface-2 transition-colors"
              href="#"
            >
              View 7-Day Redressal Archive
            </a>
          </div>

          {/* Campus Map Signal Heatmap Miniature */}
          <div className="bg-surface-1 rounded-lg p-space-md shadow-md">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-micro-label text-micro-label uppercase text-text-muted tracking-wider">
                Spatial Signal Distribution
              </span>
              <span className="material-symbols-outlined text-[15px] text-text-muted">map</span>
            </div>
            <div className="w-full h-36 rounded overflow-hidden relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCngFxKH1zO3Mqm8NEI_X9G-y7Ks3KcWBaTkIUiKbam-PR71c6t_WkFZudyPHwQRfFmYXxSjb0dcVjqG_09C74yCVX9OfKF6q_rRL7wZBVmFImqNla42aehrMIxKSOulIC0CugarMhe73zH_7VmIm_50kmVbVTs5qqkRabJil2LBFgEo0nPygUlUtY8DI_paHgMGyJO_Q2IlEsG5vePf8kUZYiAEOAgt3SJD-7A9Ei1')",
                }}
              ></div>
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center p-space-xs text-center pointer-events-none">
                <div className="bg-surface-container-lowest/90 px-space-sm py-1 rounded">
                  <span className="font-micro-label text-micro-label uppercase text-text-primary font-semibold">
                    Active Geotag Radius: 1.8 km²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Interactive Custody Log Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-space-md animate-fade-in">
          <div className="bg-surface-1 max-w-xl w-full rounded-lg shadow-xl p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-copper-400">history_edu</span>
                <h4 className="font-headline-4 text-headline-4 text-text-primary">Custody &amp; Chain-of-Action Log</h4>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="font-body-sm text-body-sm text-text-secondary">
              Signal <strong className="text-text-primary">#INF-8841: Building 3 HVAC Recurring Failure</strong>.
              Immutable institutional dispatch track:
            </div>
            {/* Timeline steps */}
            <div className="flex flex-col gap-space-md pl-2 border-l border-surface-2 ml-2 my-space-xs">
              <div className="relative pl-space-md">
                <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-status-verified-text"></div>
                <span className="font-micro-label text-micro-label uppercase text-text-muted">13:42 • Today</span>
                <p className="font-body-sm text-body-sm font-semibold text-text-primary">
                  Escalated to Dean of Student Welfare
                </p>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Automated trigger reached after 75 student endorsements within 60 minutes.
                </p>
              </div>
              <div className="relative pl-space-md">
                <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-brand-400"></div>
                <span className="font-micro-label text-micro-label uppercase text-text-muted">11:15 • Today</span>
                <p className="font-body-sm text-body-sm font-semibold text-text-primary">
                  HVAC Maintenance Dispatch Acknowledged
                </p>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Technician assigned: Estates Engineering Crew Lead R. Verma.
                </p>
              </div>
              <div className="relative pl-space-md">
                <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-surface-3"></div>
                <span className="font-micro-label text-micro-label uppercase text-text-muted">09:04 • Today</span>
                <p className="font-body-sm text-body-sm font-semibold text-text-primary">Public Signal Initiated</p>
                <p className="font-body-sm text-body-sm text-text-muted text-xs">
                  Geotag verified via Academic B3 Access Point AP-09.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-space-sm border-t border-surface-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-space-md py-2 bg-surface-2 hover:bg-surface-3 text-text-primary font-label text-label uppercase rounded transition-colors"
              >
                Dismiss Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-2 text-text-primary px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-status-verified-text">check_circle</span>
          <span className="font-body-sm text-body-sm">
            Signal link copied to clipboard. Encrypted reference hash appended.
          </span>
        </div>
      )}
    </div>
  );
};

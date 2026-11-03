import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoData } from '@/context/DemoDataContext';
import { useAuth } from '@/context/AuthContext';
import type { ComplaintPriority } from '@/types/complaint';

export const ProblemReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitComplaint, endorseComplaint } = useDemoData();
  const { user } = useAuth();

  // Interactive Form State
  const [title, setTitle] = useState('Elevator B stuck between floors 3 and 4 with audible motor grinding');
  const [category, setCategory] = useState('Campus Infrastructure');
  const [impactTier, setImpactTier] = useState('Active Threat • Immediate Action');
  const [building, setBuilding] = useState('Engineering Quad - Block C (Mahanadi Hall)');
  const [room, setRoom] = useState('East Elevator Shaft');
  const [description, setDescription] = useState(
    'Elevator B made a violent metallic screech around 13:40 IST while descending. It shuddered to an abrupt stop roughly halfway between Floor 3 (Fluid Mechanics Lab) and Floor 4. Indicator lamps flickered and emergency intercom produces buzzing interference. No trapped passengers currently inside, but outer doors remain unlatched on Level 3, creating an open fall hazard.'
  );
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showSimilarBanner, setShowSimilarBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      name: 'DSC_4091_shaft_gap.jpg',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXO4Qmqh3YZw102q4FPZj11UvSUjKqgmwKa4Dit-HDxT2AYpVqqKk6sPsCR7MahR-sdKJBt7yEllNobgYhpEVVqUyLOrKGResaTlxKeVGp6HkuVB1FdIrBtwd2wOPa_GtetAtEPezy0pWRh4tehA2nQaNzMRNDEP7xvyMPTS7jpMkxREvs5IVxwu1djMXlre1vcqPrV-9Xea3X4SLL98DHWHS2RWtLwJup0mfKGujn',
      size: 1420000,
      type: 'image' as const,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAcceptCategory = () => {
    setCategory('Campus Infrastructure');
    showToast('Applied AI suggested category: Infrastructure & Safety');
  };

  const handleSaveDraft = () => {
    showToast('Draft saved to local offline storage (Encrypted).');
  };

  const handleEndorseSimilar = () => {
    endorseComplaint('SNK-9812', user?.id || 'usr_student_01');
    showToast('Endorsed active docket #SNK-9812 (+1 vote registered in collective dossier)');
  };

  const handleReviewSubmit = () => {
    let priority: ComplaintPriority = 'medium';
    if (impactTier.includes('Active Threat')) priority = 'critical';
    else if (impactTier.includes('Impaired')) priority = 'high';
    else if (impactTier.includes('Minor')) priority = 'low';

    const newComplaint = submitComplaint({
      title: title || 'Reported Issue',
      category: category || 'Campus Infrastructure',
      locationZone: building,
      specificDemarcation: room,
      description: description || 'No detailed description provided.',
      priority,
      isAnonymous,
      evidenceFiles: uploadedFiles,
    });

    showToast(`Docket #${newComplaint.ticketId} registered in civic registry!`);
    setTimeout(() => {
      navigate(`/student/complaints?ticket=${newComplaint.ticketId}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Progress & Context Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div>
          <div className="flex items-center gap-space-xs text-copper-400 mb-space-xs">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-micro-label text-micro-label uppercase tracking-widest text-copper-400">
              Institutional Custody Protocol • Step 02/03
            </span>
          </div>
          <h1 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
            Something needs attention?
          </h1>
          <p className="font-body-md text-body-md text-text-muted mt-1 max-w-2xl">
            Tell us what's happening. We'll help get it to the right people with verifiable custody and immutable
            escalation tracking.
          </p>
        </div>
        {/* Stepper Pipeline Indicators */}
        <div className="bg-surface-1 p-2 rounded-lg flex items-center gap-1 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-3 text-text-primary">
            <span className="w-5 h-5 rounded-full bg-brand-500 font-label text-label flex items-center justify-center text-text-primary">
              1
            </span>
            <span className="font-label text-label tracking-wide uppercase">Issue Details</span>
          </div>
          <div className="w-4 h-px bg-surface-variant"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-2 text-primary">
            <span className="w-5 h-5 rounded-full bg-brand-600 font-label text-label flex items-center justify-center text-text-primary">
              2
            </span>
            <span className="font-label text-label tracking-wide uppercase text-text-primary">
              Evidence &amp; Geo
            </span>
          </div>
          <div className="w-4 h-px bg-surface-variant"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded text-text-disabled">
            <span className="w-5 h-5 rounded-full bg-surface-inset font-label text-label flex items-center justify-center text-text-disabled">
              3
            </span>
            <span className="font-label text-label tracking-wide uppercase">Review</span>
          </div>
        </div>
      </div>

      {/* CRITICAL UX: Smart Similar Issue Detection Banner */}
      {showSimilarBanner && (
        <div className="mb-space-lg rounded-xl bg-status-raised-bg text-text-primary p-space-md shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-sm max-w-3xl">
              <div className="p-2 rounded-lg bg-status-raised-border text-copper-400 shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-micro-label text-micro-label uppercase px-2 py-0.5 rounded bg-copper-500 text-text-primary font-bold">
                    Similar Active Report Detected
                  </span>
                  <span className="font-label text-label text-copper-400">
                    Filed 2 hours ago • Engineering Quad Zone
                  </span>
                </div>
                <p className="font-body-md text-body-md text-text-primary font-semibold">
                  #SNK-9812: East Lift Grinding &amp; Stoppage (44 students affected • Status: Under Review)
                </p>
                <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                  An identical mechanical safety concern is already queued with Academic Maintenance Dispatch.
                  Co-signing accelerates the escalation tier automatically without cluttering the administrative
                  roster.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0 w-full lg:w-auto">
              <button
                className="flex-1 lg:flex-none h-11 px-space-md bg-copper-500 hover:bg-copper-400 text-text-primary font-label text-label uppercase rounded-lg transition-all flex items-center justify-center gap-space-xs shadow-sm"
                type="button"
                onClick={handleEndorseSimilar}
              >
                <span className="material-symbols-outlined text-[18px]">group_add</span>
                <span>View &amp; Add Voice (+1)</span>
              </button>
              <button
                className="flex-1 lg:flex-none h-11 px-space-md bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary font-label text-label uppercase rounded-lg transition-all flex items-center justify-center gap-space-xs"
                type="button"
                onClick={() => setShowSimilarBanner(false)}
              >
                <span>Continue New Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Workspace: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Form Core Details (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Card Section 1: Classification & Core Symptom */}
          <div className="bg-surface-1 rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div>
                <span className="font-micro-label text-micro-label uppercase text-brand-300 tracking-wider">
                  Telemetry Core
                </span>
                <h2 className="font-headline-3 text-headline-3 text-text-primary">1. Problem Specification</h2>
              </div>
              <span className="font-micro-label text-micro-label uppercase px-2 py-1 rounded bg-surface-inset text-copper-400">
                Priority: High Hazard
              </span>
            </div>
            {/* Issue Title */}
            <div className="flex flex-col gap-1.5">
              <label
                className="font-label text-label uppercase text-text-secondary flex justify-between"
                htmlFor="issue-title"
              >
                <span>Issue Headline / Title</span>
                <span className="text-text-muted">Auto-indexed for rapid dispatch</span>
              </label>
              <div className="relative">
                <input
                  className="w-full h-12 px-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container transition-all"
                  id="issue-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-brand-400 text-[20px]">
                  check_circle
                </span>
              </div>
            </div>
            {/* Smart Classification Assistance Callout */}
            <div className="bg-surface-2 rounded-lg p-space-sm flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded bg-brand-700/60 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div className="min-w-0">
                  <p className="font-body-sm text-body-sm text-text-primary font-medium truncate">
                    Suggested Category: <span className="text-primary font-semibold">Infrastructure &amp; Safety</span>
                  </p>
                  <p className="font-micro-label text-micro-label text-brand-300">
                    Confidence Score 96% • Natural Language Inference
                  </p>
                </div>
              </div>
              <button
                className="h-8 px-space-sm bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label uppercase rounded transition-colors shrink-0"
                type="button"
                onClick={handleAcceptCategory}
              >
                Accept
              </button>
            </div>
            {/* Category & Urgency Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label uppercase text-text-secondary" htmlFor="category-select">
                  Official Domain
                </label>
                <div className="relative">
                  <select
                    className="w-full h-11 px-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg appearance-none cursor-pointer focus:outline-none"
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Campus Infrastructure</option>
                    <option>Hostel &amp; Residential Utilities</option>
                    <option>Academic Facilities &amp; Labs</option>
                    <option>Sanitation &amp; Health Logistics</option>
                    <option>Network &amp; Digital Terminals</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label uppercase text-text-secondary" htmlFor="impact-tier">
                  Impact Velocity
                </label>
                <div className="relative">
                  <select
                    className="w-full h-11 px-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg appearance-none cursor-pointer focus:outline-none"
                    id="impact-tier"
                    value={impactTier}
                    onChange={(e) => setImpactTier(e.target.value)}
                  >
                    <option>Active Threat • Immediate Action</option>
                    <option>Severe Disruption • 12h SLA</option>
                    <option>Standard Operational Defect • 48h</option>
                    <option>Informational Log</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            {/* Campus Location Hierarchical Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label uppercase text-text-secondary" htmlFor="campus-building">
                  Building / Quad
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-copper-400 text-[18px]">
                    apartment
                  </span>
                  <input
                    className="w-full h-11 pl-9 pr-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg focus:outline-none"
                    id="campus-building"
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-label uppercase text-text-secondary" htmlFor="campus-room">
                  Specific Demarcation
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-copper-400 text-[18px]">
                    room_preferences
                  </span>
                  <input
                    className="w-full h-11 pl-9 pr-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg focus:outline-none"
                    id="campus-room"
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Detailed Description Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="font-label text-label uppercase text-text-secondary"
                  htmlFor="issue-description"
                >
                  Technical Description &amp; Incident Trace
                </label>
                <span className="font-micro-label text-micro-label text-text-muted" id="char-counter">
                  {description.length} / 1,500 chars
                </span>
              </div>
              <textarea
                className="w-full p-space-md bg-surface-inset text-text-primary font-body-md text-body-md rounded-lg focus:outline-none resize-none"
                id="issue-description"
                placeholder="Document observed conditions, noises, duration, affected individuals, or environmental triggers..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex items-center justify-between text-text-muted">
                <span className="font-micro-label text-micro-label">
                  Be specific about symptoms, duration, and safety hazards to bypass manual verification triage.
                </span>
                <span className="font-micro-label text-micro-label text-brand-300 uppercase">Audit Verified</span>
              </div>
            </div>
          </div>
          {/* Institutional Custody & Redressal Routing Box */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">shield_person</span>
              <div>
                <span className="font-label text-label uppercase text-text-primary">
                  Confidential Whistleblower Protection
                </span>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Personal identity is masked from field technicians. Department dean receives aggregated
                  telemetry only.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-inset peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>

        {/* Right Column: Evidence, Verification & Interactive Dropzone (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Card Section 2: Evidence & Sensory Records */}
          <div className="bg-surface-1 rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div>
                <span className="font-micro-label text-micro-label uppercase text-brand-300 tracking-wider">
                  Cryptographic Custody
                </span>
                <h2 className="font-headline-3 text-headline-3 text-text-primary">2. Evidence &amp; Proof</h2>
              </div>
              <span className="font-micro-label text-micro-label uppercase px-2 py-0.5 rounded bg-surface-2 text-text-secondary">
                2 Files Attached
              </span>
            </div>
            {/* File Upload Dropzone */}
            <div className="p-space-lg rounded-xl bg-surface-inset flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-surface-container transition-all">
              <div className="w-12 h-12 rounded-full bg-surface-2 group-hover:bg-brand-600/30 flex items-center justify-center text-primary mb-space-sm transition-colors">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <span className="font-label text-label uppercase text-text-primary font-semibold">
                Drop JPEG, PNG or MP4 proof
              </span>
              <span className="font-micro-label text-micro-label text-text-muted mt-1 max-w-xs">
                Max 25MB. Geotag and timestamp will auto-verify against institutional AP:{' '}
                <code className="text-copper-400">AP-ENGC-304</code>
              </span>
              <div className="mt-space-md flex items-center gap-space-xs">
                <button
                  className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-text-primary font-label text-label uppercase rounded transition-colors"
                  type="button"
                >
                  Browse Files
                </button>
                <button
                  className="h-8 px-space-sm bg-surface-2 hover:bg-surface-3 text-copper-400 font-label text-label uppercase rounded transition-colors flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span> Record Voice Memo
                </button>
              </div>
            </div>
            {/* Uploaded Evidence Mosaic */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-micro-label text-micro-label uppercase text-text-muted">
                Validated Media Streams
              </span>
              {/* Evidence Item 1: Photo preview with verified tag */}
              <div className="p-2.5 rounded-lg bg-surface-2 flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-14 h-14 rounded overflow-hidden shrink-0 relative bg-surface-inset">
                    <img
                      className="w-full h-full object-cover"
                      alt="Close up dramatic industrial photograph of an elevator door stuck between floors"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXO4Qmqh3YZw102q4FPZj11UvSUjKqgmwKa4Dit-HDxT2AYpVqqKk6sPsCR7MahR-sdKJBt7yEllNobgYhpEVVqUyLOrKGResaTlxKeVGp6HkuVB1FdIrBtwd2wOPa_GtetAtEPezy0pWRh4tehA2nQaNzMRNDEP7xvyMPTS7jpMkxREvs5IVxwu1djMXlre1vcqPrV-9Xea3X4SLL98DHWHS2RWtLwJup0mfKGujn"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-background-raised/80 flex items-center justify-center">
                      <span className="font-micro-label text-[9px] uppercase text-brand-300">RAW_JPG</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                        DSC_4091_shaft_gap.jpg
                      </span>
                      <span className="material-symbols-outlined text-status-verified-text text-[16px]">
                        verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-micro-label text-micro-label text-text-muted">4.2 MB • 13:42 IST</span>
                      <span className="font-micro-label text-micro-label px-1.5 py-0.2 rounded bg-status-verified-bg text-status-verified-text uppercase font-semibold">
                        Geotag Confirmed
                      </span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-muted block truncate mt-0.5">
                      Location: Academic Block C • Accuracy: 1.4m
                    </span>
                  </div>
                </div>
                <button
                  className="text-text-muted hover:text-error transition-colors p-1.5 rounded hover:bg-surface-3"
                  type="button"
                  onClick={() => setUploadedFiles([])}
                  title="Remove uploaded evidence"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              {/* Evidence Item 2: Audio clip trace */}
              <div className="p-2.5 rounded-lg bg-surface-2 flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-14 h-14 rounded bg-surface-inset text-copper-400 flex flex-col items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
                    <span className="font-micro-label text-[9px] text-copper-400 uppercase mt-0.5">00:14s</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                        audio_motor_grind_ch3.m4a
                      </span>
                      <span className="material-symbols-outlined text-status-verified-text text-[16px]">
                        verified
                      </span>
                    </div>
                    {/* Inline mini waveform SVG visual */}
                    <div className="flex items-center gap-1 my-1">
                      <svg className="w-28 h-3 text-brand-400" fill="currentColor" viewBox="0 0 100 12">
                        <rect height="4" rx="1" width="3" x="0" y="4"></rect>
                        <rect height="8" rx="1" width="3" x="5" y="2"></rect>
                        <rect height="12" rx="1" width="3" x="10" y="0"></rect>
                        <rect height="6" rx="1" width="3" x="15" y="3"></rect>
                        <rect height="10" rx="1" width="3" x="20" y="1"></rect>
                        <rect height="2" rx="1" width="3" x="25" y="5"></rect>
                        <rect height="8" rx="1" width="3" x="30" y="2"></rect>
                        <rect height="12" rx="1" width="3" x="35" y="0"></rect>
                        <rect height="10" rx="1" width="3" x="40" y="1"></rect>
                        <rect height="4" rx="1" width="3" x="45" y="4"></rect>
                        <rect height="8" rx="1" width="3" x="50" y="2"></rect>
                        <rect height="6" rx="1" width="3" x="55" y="3"></rect>
                        <rect height="12" rx="1" width="3" x="60" y="0"></rect>
                        <rect height="8" rx="1" width="3" x="65" y="2"></rect>
                        <rect height="4" rx="1" width="3" x="70" y="4"></rect>
                        <rect height="10" rx="1" width="3" x="75" y="1"></rect>
                        <rect height="6" rx="1" width="3" x="80" y="3"></rect>
                        <rect height="2" rx="1" width="3" x="85" y="5"></rect>
                        <rect height="8" rx="1" width="3" x="90" y="2"></rect>
                        <rect height="4" rx="1" width="3" x="95" y="4"></rect>
                      </svg>
                      <span className="font-micro-label text-micro-label text-copper-400">92dB Peak</span>
                    </div>
                    <span className="font-micro-label text-[10px] text-text-muted">
                      Acoustic signature matches gear failure pattern
                    </span>
                  </div>
                </div>
                <button
                  className="text-text-muted hover:text-error transition-colors p-1.5 rounded hover:bg-surface-3"
                  type="button"
                  onClick={() => setUploadedFiles([])}
                  title="Remove uploaded evidence"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
            {/* Campus Cadastral Geolocation Card */}
            <div className="rounded-lg overflow-hidden bg-surface-inset">
              <div className="p-space-sm flex items-center justify-between bg-surface-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                  <span className="font-micro-label text-micro-label uppercase text-text-primary">
                    Cadastral Grid Match
                  </span>
                </div>
                <span className="font-micro-label text-micro-label text-brand-300">
                  Lat: 20.2961° N • Long: 85.8245° E
                </span>
              </div>
              <div
                className="w-full h-36 bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4fCmpV0gZRiV1b9WCzl87lqyjqQjVv1RKD2lPF0RBhHMpL1mPl_7ZZZPCMauKCYTuuNXDNL-t-9WC710qVSs8i0WCZ5RcCMIN6d5Z2gx2gb5bdN4Kn9BK6FbBlPQj0Zt6ffImBHeP2TySNZ7BzLuuZyWHqiO-FEol6Z-GBe558lA54lazIu0siM5tolp_BoU_U50scnPHN03Vr-BCo53iIad0Ye4dYB9cyKG61TNN')",
                }}
              >
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center p-space-sm">
                  <div className="bg-surface-1/90 px-space-md py-2 rounded-lg shadow-xl text-center">
                    <span className="font-label text-label uppercase text-copper-400 font-bold block">
                      Engineering Quad: Core C
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted">
                      Elevator Bank #2 • East Structural Column
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Escalation Protocol Info */}
          <div className="bg-surface-1 rounded-xl p-space-md shadow-sm">
            <div className="flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-copper-400 text-[20px] shrink-0 mt-0.5">policy</span>
              <div>
                <h4 className="font-label text-label uppercase text-text-primary">Mandatory Escalation SLA</h4>
                <p className="font-body-sm text-body-sm text-text-muted mt-1">
                  Safety hazards automatically trigger Level-1 facility locks within 45 minutes if not
                  acknowledged by Chief Warden or Campus Estate Officer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Global Submission Sticky Tray */}
      <div className="sticky bottom-4 mt-space-xl p-space-md rounded-xl bg-surface-1 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-space-md z-20">
        <div className="flex items-center gap-space-md w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-surface-inset flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label text-label uppercase text-text-primary">Custody Routing Validated</span>
              <span className="w-1.5 h-1.5 rounded-full bg-status-verified-text animate-pulse"></span>
            </div>
            <p className="font-micro-label text-micro-label text-text-muted">
              Submission auto-notifies: Head of Electrical Engineering • Campus Safety Office • Student Council
              Rep
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm w-full md:w-auto justify-end">
          <button
            className="h-12 px-space-lg bg-surface-2 hover:bg-surface-3 text-text-primary font-label text-label uppercase rounded-lg transition-colors flex items-center gap-space-xs"
            type="button"
            onClick={handleSaveDraft}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
            <span>Save Draft</span>
          </button>
          <button
            className="h-12 px-space-xl bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label uppercase rounded-lg transition-all flex items-center gap-space-xs shadow-md group"
            type="button"
            onClick={handleReviewSubmit}
          >
            <span>Review &amp; Submit Complaint</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Micro Interaction Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 bg-surface-2 text-text-primary px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm z-50 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <span className="font-body-sm text-body-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

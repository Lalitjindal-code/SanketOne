import React from 'react';
import { Link } from 'react-router-dom';
import { SignalCore } from '@/components/three/SignalCore';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Eye,
  Clock,
  UserCheck,
  Zap,
  ShieldCheck,
  History,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-background text-text-primary">
      {/* SECTION 02 — HERO: THE SIGNATURE MOMENT */}
      <section className="relative w-full py-16 lg:py-24 border-b border-border-subtle bg-background overflow-hidden">
        {/* Architectural background grain grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#F1F4EF 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-surface-1 border border-border-subtle w-fit mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest">
                  Campus Intelligence Platform • One Signal. One Solution.
                </span>
              </div>

              <h1 className="font-display text-[40px] lg:text-[72px] leading-[46px] lg:leading-[78px] tracking-tight font-semibold text-text-primary">
                Your campus.
                <br />
                Your voice.
                <br />
                <span className="text-brand-400">Real change.</span>
              </h1>

              <p className="font-body-lg text-body-lg text-text-secondary mt-6 max-w-xl leading-relaxed">
                One place to report campus problems, bring people together, and make sure every issue has a transparent, irreversible path toward resolution.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/student/report"
                  className="px-6 py-3.5 rounded bg-brand-600 hover:bg-brand-500 border border-brand-500 text-text-primary font-label text-label transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Explore the Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-6 py-3.5 rounded bg-surface-1 hover:bg-surface-2 border border-border-default text-text-primary font-label text-label transition-all"
                >
                  See How It Works
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-border-subtle flex items-center gap-3 text-text-muted">
                <div className="w-7 h-7 rounded bg-surface-1 border border-border-default flex items-center justify-center text-brand-400">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                </div>
                <span className="font-body-sm text-body-sm text-text-secondary">
                  Built around student voices. Designed for campus administrative accountability.
                </span>
              </div>
            </div>

            {/* Right Column: Interactive 3D Installation & Architectural Annotations */}
            <div className="lg:col-span-6 relative w-full h-[540px] flex items-center justify-center">
              <div className="w-full h-full rounded bg-surface-inset border border-border-subtle relative overflow-hidden">
                {/* 3D WebGL Canvas Component */}
                <SignalCore className="w-full h-[540px] bg-transparent block" />

                {/* Annotation 01 */}
                <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-background-raised/90 backdrop-blur-md border border-border-default p-3.5 rounded shadow-lg z-20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-wider">
                      01 — Signal Received
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                  <p className="font-body-sm text-body-sm text-text-primary leading-snug">
                    Academic Block B, Floor 2 water filtration unserviceable. Geotag confirmed.
                  </p>
                </div>

                {/* Annotation 02 */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 max-w-xs hidden sm:block bg-background-raised/90 backdrop-blur-md border border-border-default p-3.5 rounded shadow-lg z-20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-micro-label text-micro-label text-copper-400 uppercase tracking-wider">
                      02 — Shared Impact
                    </span>
                    <span className="font-micro-label text-micro-label text-text-muted">T+14m</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-primary leading-snug">
                    42 students affected in 4 hours. Automated density cluster triggered.
                  </p>
                </div>

                {/* Annotation 03 */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-background-raised/90 backdrop-blur-md border border-border-default p-3.5 rounded shadow-lg z-20">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-micro-label text-micro-label text-status-resolved-text uppercase tracking-wider">
                      03 — Action Tracked
                    </span>
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-status-in-progress-bg text-status-in-progress-text font-micro-label text-micro-label">
                      DISPATCHED
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-primary leading-snug">
                    Facilities Estates Dept dispatched. Work order assigned to technician team delta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — THE PROBLEM: EDITORIAL DATA INSTALLATION */}
      <section className="w-full py-20 border-b border-border-subtle bg-background">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest block mb-2">
              The Problem
            </span>
            <h2 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              Campus problems shouldn't disappear into silence.
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-4 leading-relaxed">
              Campus issues often get scattered across messages, conversations, and informal reports. Without visibility and clear institutional custodianship, even critical recurring problems remain unresolved.
            </p>
          </div>

          {/* Architectural Matrix Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border-subtle rounded overflow-hidden bg-surface-1">
            {/* 01 Scattered Reporting */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col justify-between hover:bg-surface-2 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-numeric-kpi text-numeric-kpi text-text-muted font-bold tracking-tighter">01</span>
                  <span className="font-mono text-xs text-text-muted">[SCATTERED]</span>
                </div>
                {/* Broken loop illustration */}
                <div className="w-full h-24 mb-6 bg-surface-inset border border-border-subtle rounded p-3 flex flex-col justify-center">
                  <svg className="w-full h-12" fill="none" viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="24" fill="#82938A" r="5" />
                    <circle cx="80" cy="12" fill="#82938A" r="5" />
                    <circle cx="140" cy="36" fill="#82938A" r="5" />
                    <circle cx="185" cy="24" r="5" stroke="#F07870" strokeDasharray="2 2" strokeWidth="2" />
                    <line stroke="#3A4A43" strokeDasharray="3 3" strokeWidth="1.5" x1="25" x2="75" y1="23" y2="13" />
                    <line stroke="#3A4A43" strokeDasharray="3 3" strokeWidth="1.5" x1="85" x2="135" y1="14" y2="34" />
                    <line stroke="#F07870" strokeDasharray="3 3" strokeWidth="1.5" x1="145" x2="180" y1="35" y2="25" />
                  </svg>
                  <div className="flex justify-between font-micro-label text-micro-label text-text-muted">
                    <span>Dorm Chat</span>
                    <span>Unopened Email</span>
                    <span>Lost Trace</span>
                  </div>
                </div>
                <h3 className="font-headline-3 text-headline-3 text-text-primary mb-3">Scattered Reporting</h3>
                <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                  Reports exist in ad-hoc WhatsApp groups, direct emails, and corridor talk with zero audit trail or public accountability.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle font-micro-label text-micro-label text-error uppercase">
                Symptom: 81% Signal Loss in 48h
              </div>
            </div>

            {/* 02 No Clear Accountability */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col justify-between hover:bg-surface-2 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-numeric-kpi text-numeric-kpi text-text-muted font-bold tracking-tighter">02</span>
                  <span className="font-mono text-xs text-text-muted">[BOUNCE]</span>
                </div>
                {/* Department bounce diagram */}
                <div className="w-full h-24 mb-6 bg-surface-inset border border-border-subtle rounded p-3 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-text-muted font-micro-label text-micro-label">
                    <span className="px-2 py-1 bg-surface-2 rounded border border-border-subtle">ESTATES</span>
                    <span className="text-[#D99A58]">➔➔</span>
                    <span className="px-2 py-1 bg-surface-2 rounded border border-border-subtle">WARDEN</span>
                    <span className="text-[#D99A58]">➔➔</span>
                    <span className="px-2 py-1 bg-surface-2 rounded border border-border-subtle">ACADEMIC</span>
                  </div>
                  <div className="mt-3 text-center font-micro-label text-micro-label text-priority-high uppercase tracking-wider">
                    × Indefinite Deferrals & No Single Owner
                  </div>
                </div>
                <h3 className="font-headline-3 text-headline-3 text-text-primary mb-3">No Clear Accountability</h3>
                <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                  Tickets lack institutional custodianship; departments pass responsibility back and forth without time-bounded operational SLAs.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle font-micro-label text-micro-label text-copper-400 uppercase">
                Symptom: Indefinite Department Ping-Pong
              </div>
            </div>

            {/* 03 Invisible Patterns */}
            <div className="p-8 flex flex-col justify-between hover:bg-surface-2 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-numeric-kpi text-numeric-kpi text-text-muted font-bold tracking-tighter">03</span>
                  <span className="font-mono text-xs text-text-muted">[SYSTEMIC]</span>
                </div>
                {/* Isolated vs Systemic Pattern */}
                <div className="w-full h-24 mb-6 bg-surface-inset border border-border-subtle rounded p-3 flex items-center justify-around">
                  <div className="text-center">
                    <div className="font-numeric-kpi text-[20px] text-text-muted">14x</div>
                    <div className="font-micro-label text-micro-label text-text-muted">Siloed Tickets</div>
                  </div>
                  <div className="h-8 w-px bg-border-subtle" />
                  <div className="text-center">
                    <div className="font-numeric-kpi text-[20px] text-priority-critical">1 ROOT</div>
                    <div className="font-micro-label text-micro-label text-priority-critical">Manifold Collapse</div>
                  </div>
                </div>
                <h3 className="font-headline-3 text-headline-3 text-text-primary mb-3">Invisible Patterns</h3>
                <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                  14 individual chiller breakdowns across 4 blocks are treated as isolated events rather than a systemic sub-line manifold collapse.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle font-micro-label text-micro-label text-brand-300 uppercase">
                Symptom: Blind Maintenance Spending
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — HOW SANKETONE WORKS (THE 5-STAGE CONNECTED PROGRESSION) */}
      <section className="w-full py-20 border-b border-border-subtle bg-background-raised">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-14">
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest block mb-2">
              From Report to Resolution
            </span>
            <h2 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              From a single signal to a visible solution.
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-3">
              A systematic five-phase lifecycle that converts raw campus observation into verifiable infrastructure restoration.
            </p>
          </div>

          {/* 5-Stage Connected Track */}
          <div className="relative">
            {/* Connecting Hairline Vector */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-border-default z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {/* Step 01 */}
              <div className="bg-surface-1 border border-border-subtle rounded p-6 flex flex-col justify-between group hover:border-brand-500 transition-colors">
                <div>
                  <div className="w-14 h-14 rounded bg-background border border-border-default flex items-center justify-center text-brand-400 mb-6 group-hover:border-brand-400 transition-colors font-mono font-bold text-sm">
                    01
                  </div>
                  <div className="font-micro-label text-micro-label text-brand-300 uppercase tracking-wider mb-1">
                    Stage 01
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">REPORT</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Students describe the issue, pin precise campus geolocation, and attach photographic proof in under 45 seconds.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-subtle font-micro-label text-micro-label text-text-muted">
                  GPS Verified Metadata
                </div>
              </div>

              {/* Step 02 */}
              <div className="bg-surface-1 border border-border-subtle rounded p-6 flex flex-col justify-between group hover:border-brand-500 transition-colors">
                <div>
                  <div className="w-14 h-14 rounded bg-background border border-border-default flex items-center justify-center text-brand-400 mb-6 group-hover:border-brand-400 transition-colors font-mono font-bold text-sm">
                    02
                  </div>
                  <div className="font-micro-label text-micro-label text-brand-300 uppercase tracking-wider mb-1">
                    Stage 02
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">CONNECT</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Clustering engine aggregates similar signals, flags multi-block duplicates, and scores real density impact.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-subtle font-micro-label text-micro-label text-text-muted">
                  Vector Clustering Engine
                </div>
              </div>

              {/* Step 03 */}
              <div className="bg-surface-1 border border-border-subtle rounded p-6 flex flex-col justify-between group hover:border-brand-500 transition-colors">
                <div>
                  <div className="w-14 h-14 rounded bg-background border border-border-default flex items-center justify-center text-copper-400 mb-6 group-hover:border-copper-400 transition-colors font-mono font-bold text-sm">
                    03
                  </div>
                  <div className="font-micro-label text-micro-label text-copper-400 uppercase tracking-wider mb-1">
                    Stage 03
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">PRIORITIZE</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    System severity scoring, affected student weight, and SLA deadlines assign priority and department ownership automatically.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-subtle font-micro-label text-micro-label text-text-muted">
                  Automated SLA Dispatch
                </div>
              </div>

              {/* Step 04 */}
              <div className="bg-surface-1 border border-border-subtle rounded p-6 flex flex-col justify-between group hover:border-brand-500 transition-colors">
                <div>
                  <div className="w-14 h-14 rounded bg-background border border-border-default flex items-center justify-center text-brand-400 mb-6 group-hover:border-brand-400 transition-colors font-mono font-bold text-sm">
                    04
                  </div>
                  <div className="font-micro-label text-micro-label text-brand-300 uppercase tracking-wider mb-1">
                    Stage 04
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">TRACK</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Subscribers receive chronological transparent updates as parts are procured, permits approved, and work crews arrive.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-subtle font-micro-label text-micro-label text-text-muted">
                  Live Progress Feed
                </div>
              </div>

              {/* Step 05 */}
              <div className="bg-surface-1 border border-status-verified-border rounded p-6 flex flex-col justify-between group hover:border-status-verified-border transition-colors">
                <div>
                  <div className="w-14 h-14 rounded bg-status-verified-bg border border-status-verified-border flex items-center justify-center text-status-verified-text mb-6">
                    <CheckCircle2 className="w-6 h-6 text-status-verified-text" />
                  </div>
                  <div className="font-micro-label text-micro-label text-status-verified-text uppercase tracking-wider mb-1">
                    Stage 05
                  </div>
                  <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">VERIFY</h3>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                    Critical distinction: Affected students physically authenticate resolution on ground before closure is permanently sealed.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-subtle font-micro-label text-micro-label text-status-verified-text">
                  Student Ledger Sign-off
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 — PRODUCT EXPERIENCE: TWO PERSPECTIVES, ONE SOURCE OF TRUTH */}
      <section className="w-full py-20 border-b border-border-subtle bg-background">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-12">
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest block mb-2">
              Inside SanketOne
            </span>
            <h2 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              One platform. Two perspectives. One better campus.
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-3">
              Students experience effortless submission and uncompromised transparency. Administrators command high-density triage, predictive analytics, and verifiable SLA tracking.
            </p>
          </div>

          {/* Side-by-Side Dual Portal Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PERSPECTIVE A: Student Portal */}
            <div className="bg-surface-1 border border-border-subtle rounded flex flex-col overflow-hidden">
              {/* Window Bar */}
              <div className="px-4 py-3 bg-surface-inset border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="font-micro-label text-micro-label text-text-muted ml-2">sanketone.internal/student</span>
                </div>
                <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
                  Student View
                </span>
              </div>

              {/* Inside Student View */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Session Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
                    <div>
                      <h4 className="font-headline-4 text-headline-4 text-text-primary">Good morning, Aditi.</h4>
                      <p className="font-body-sm text-body-sm text-text-secondary">Your campus, in focus.</p>
                    </div>
                    <Link
                      to="/student/report"
                      className="px-3.5 py-2 rounded bg-brand-600 hover:bg-brand-500 border border-brand-500 text-text-primary font-label text-label flex items-center gap-1.5 transition-colors self-start"
                    >
                      <span>+ Raise a Complaint</span>
                    </Link>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">Reported</div>
                      <div className="font-numeric-kpi text-[22px] text-text-primary mt-1">4</div>
                    </div>
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">In Progress</div>
                      <div className="font-numeric-kpi text-[22px] text-status-in-progress-text mt-1">2</div>
                    </div>
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">Verified Closed</div>
                      <div className="font-numeric-kpi text-[22px] text-status-verified-text mt-1">12</div>
                    </div>
                  </div>

                  {/* Issue Docket */}
                  <div className="space-y-3">
                    <div className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">
                      Active Community Docket
                    </div>

                    {/* Issue Item 1 */}
                    <div className="p-3.5 bg-surface-2 border border-border-subtle rounded hover:border-border-default transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-headline-4 text-[15px] text-text-primary font-medium">
                            Water cooler non-operational
                          </div>
                          <div className="font-body-sm text-[12px] text-text-muted mt-0.5">
                            Academic Block B, Floor 2 • Assigned to Estates Dept
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-status-in-progress-bg text-status-in-progress-text border border-status-in-progress-border font-micro-label text-micro-label">
                          IN PROGRESS
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-text-secondary font-micro-label text-micro-label">
                        <span className="text-brand-300">• 38 students affected</span>
                        <span>ETA: Today 4:00 PM</span>
                      </div>
                    </div>

                    {/* Issue Item 2 */}
                    <div className="p-3.5 bg-surface-2 border border-border-subtle rounded hover:border-border-default transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-headline-4 text-[15px] text-text-primary font-medium">
                            Projector malfunction in Room 204
                          </div>
                          <div className="font-body-sm text-[12px] text-text-muted mt-0.5">
                            Science Quadrangle • Assigned to AV Technical Support
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-status-under-review-bg text-status-under-review-text border border-status-under-review-border font-micro-label text-micro-label">
                          UNDER REVIEW
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-text-secondary font-micro-label text-micro-label">
                        <span>• 14 students affected</span>
                        <span>Triage queue #2</span>
                      </div>
                    </div>

                    {/* Issue Item 3 */}
                    <div className="p-3.5 bg-surface-2 border border-border-subtle rounded hover:border-border-default transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-headline-4 text-[15px] text-text-primary font-medium">
                            Library 3rd Floor Wi-Fi Deadzone
                          </div>
                          <div className="font-body-sm text-[12px] text-text-muted mt-0.5">
                            Central Library Wing • Routing to IT Network Ops
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-status-raised-bg text-status-raised-text border border-status-raised-border font-micro-label text-micro-label">
                          RAISED
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-text-secondary font-micro-label text-micro-label">
                        <span className="text-copper-400 font-medium">• 61 students clustered</span>
                        <span>Clustering active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-border-subtle text-right font-micro-label text-micro-label text-text-muted">
                  Illustrative preview data • Interactive demo
                </div>
              </div>
            </div>

            {/* PERSPECTIVE B: Administrator Operations Console */}
            <div className="bg-surface-1 border border-border-subtle rounded flex flex-col overflow-hidden">
              {/* Window Bar */}
              <div className="px-4 py-3 bg-surface-inset border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <span className="font-micro-label text-micro-label text-text-muted ml-2">sanketone.internal/governance</span>
                </div>
                <span className="font-micro-label text-micro-label text-copper-400 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>

              {/* Inside Governance View */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Operations Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                    <div>
                      <h4 className="font-headline-4 text-headline-4 text-text-primary">Institutional Governance</h4>
                      <p className="font-body-sm text-body-sm text-text-secondary">Administrative Dispatch & SLA Enforcement</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-brand-700/60 border border-brand-500 font-micro-label text-micro-label text-brand-100">
                        ALL DEPARTMENTS
                      </span>
                    </div>
                  </div>

                  {/* Admin Metrics */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">Open Grievances</div>
                      <div className="font-numeric-kpi text-[22px] text-text-primary mt-1">28</div>
                      <div className="font-micro-label text-micro-label text-status-resolved-text mt-0.5">-6 vs last week</div>
                    </div>
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">Critical SLA (&lt;4h)</div>
                      <div className="font-numeric-kpi text-[22px] text-priority-critical mt-1">3</div>
                      <div className="font-micro-label text-micro-label text-priority-critical mt-0.5">Escalated to Deans</div>
                    </div>
                    <div className="p-3 bg-surface-inset border border-border-subtle rounded">
                      <div className="font-micro-label text-micro-label text-text-muted uppercase">Mean Resolve</div>
                      <div className="font-numeric-kpi text-[22px] text-copper-400 mt-1">1.8d</div>
                      <div className="font-micro-label text-micro-label text-text-muted mt-0.5">84.2% within target</div>
                    </div>
                  </div>

                  {/* Triage Table */}
                  <div className="overflow-x-auto border border-border-subtle rounded">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead className="bg-background-raised border-b border-border-subtle font-micro-label text-micro-label text-text-muted uppercase">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold">Ticket ID</th>
                          <th className="px-3 py-2.5 font-semibold">Department</th>
                          <th className="px-3 py-2.5 font-semibold">Severity</th>
                          <th className="px-3 py-2.5 font-semibold">SLA Counter</th>
                          <th className="px-3 py-2.5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle bg-surface-1">
                        <tr className="hover:bg-surface-2 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[11px] text-text-primary">SNK-9021</td>
                          <td className="px-3 py-2.5 text-text-secondary">Estates / HVAC</td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-status-critical-bg text-priority-critical border border-status-critical-border font-micro-label text-micro-label">
                              CRITICAL
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-priority-critical text-[11px]">01h 14m left</td>
                          <td className="px-3 py-2.5 text-right">
                            <Link to="/admin/complaints" className="text-brand-300 hover:text-text-primary font-micro-label text-micro-label uppercase font-semibold">
                              Dispatch
                            </Link>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-2 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[11px] text-text-primary">SNK-8944</td>
                          <td className="px-3 py-2.5 text-text-secondary">Campus Safety</td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-status-raised-bg text-priority-high border border-status-raised-border font-micro-label text-micro-label">
                              HIGH
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-text-secondary text-[11px]">06h 40m left</td>
                          <td className="px-3 py-2.5 text-right">
                            <Link to="/admin/complaints" className="text-brand-300 hover:text-text-primary font-micro-label text-micro-label uppercase font-semibold">
                              Assign
                            </Link>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-2 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-[11px] text-text-primary">SNK-8812</td>
                          <td className="px-3 py-2.5 text-text-secondary">IT Infrastructure</td>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-surface-2 text-priority-medium border border-border-default font-micro-label text-micro-label">
                              MEDIUM
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-text-muted text-[11px]">22h 18m left</td>
                          <td className="px-3 py-2.5 text-right">
                            <Link to="/admin/complaints" className="text-brand-300 hover:text-text-primary font-micro-label text-micro-label uppercase font-semibold">
                              Review
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-border-subtle text-right font-micro-label text-micro-label text-text-muted">
                  Illustrative preview data • Real-time audit log
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06 — CAMPUS PULSE: INTELLIGENCE & PATTERN RECOGNITION */}
      <section className="w-full py-20 border-b border-border-subtle bg-background-raised">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest block mb-2">
              Campus Intelligence
            </span>
            <h2 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              Understand the health of your campus.
            </h2>
            <p className="font-body-md text-body-md text-text-secondary mt-3">
              When individual reports become visible patterns, institutions can make better decisions about recurring problems and preventative maintenance priorities.
            </p>
          </div>

          {/* Sophisticated Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weekly Intake vs Resolution Velocity */}
            <div className="lg:col-span-7 bg-surface-1 border border-border-subtle rounded p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-headline-4 text-headline-4 text-text-primary">
                      Weekly Intake vs. Resolution Velocity
                    </h3>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Trailing 6 calendar weeks across all campus sectors
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-micro-label text-micro-label">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-border-strong rounded-sm" /> Reported
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-brand-400 rounded-sm" /> Verified Resolved
                    </span>
                  </div>
                </div>

                {/* Multi-bar Chart Visual */}
                <div className="h-56 w-full pt-6 flex items-end justify-between gap-3 sm:gap-6 border-b border-border-subtle pb-4">
                  {/* Week 1 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '65%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '52%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-text-muted">WK 04</span>
                  </div>
                  {/* Week 2 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '78%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '68%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-text-muted">WK 05</span>
                  </div>
                  {/* Week 3 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '90%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '82%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-text-muted">WK 06</span>
                  </div>
                  {/* Week 4 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '55%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '60%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-text-muted">WK 07</span>
                  </div>
                  {/* Week 5 */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '70%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '74%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-text-muted">WK 08</span>
                  </div>
                  {/* Week 6 (Current) */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      <div className="w-1/2 bg-border-strong rounded-t-sm" style={{ height: '48%' }} />
                      <div className="w-1/2 bg-brand-400 rounded-t-sm" style={{ height: '50%' }} />
                    </div>
                    <span className="font-micro-label text-micro-label text-brand-300 font-semibold">CURRENT</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-text-muted font-micro-label text-micro-label">
                <span>Verified resolution speed up +18.4% month-over-month</span>
                <span>Illustrative preview data</span>
              </div>
            </div>

            {/* Right Side: Category Breakdown & Hotspot Detection */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Category Breakdown */}
              <div className="bg-surface-1 border border-border-subtle rounded p-6">
                <h3 className="font-headline-4 text-headline-4 text-text-primary mb-1">Grievance Distribution</h3>
                <p className="font-body-sm text-body-sm text-text-secondary mb-4">Volume segmented by infrastructure category</p>
                <div className="space-y-3 font-body-sm text-body-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-primary">Campus Infrastructure</span>
                      <span className="font-mono text-text-muted">42%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-inset rounded-full overflow-hidden">
                      <div className="h-full bg-brand-400 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-primary">Academics & IT Labs</span>
                      <span className="font-mono text-text-muted">28%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-inset rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-primary">Hostel & Living Quarters</span>
                      <span className="font-mono text-text-muted">18%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-inset rounded-full overflow-hidden">
                      <div className="h-full bg-copper-400 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-primary">Sanitation & Environment</span>
                      <span className="font-mono text-text-muted">12%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-inset rounded-full overflow-hidden">
                      <div className="h-full bg-brand-300 rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Hotspot Card */}
              <div className="bg-surface-1 border border-copper-500/40 rounded p-6 bg-gradient-to-br from-surface-1 to-status-raised-bg/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-copper-400" />
                  <span className="font-micro-label text-micro-label text-copper-400 uppercase tracking-widest font-semibold">
                    Recurring Hotspot Detected
                  </span>
                </div>
                <h4 className="font-headline-4 text-headline-4 text-text-primary">Building 3 HVAC Recurring Failure</h4>
                <p className="font-body-sm text-body-sm text-text-secondary mt-2 leading-relaxed">
                  Multiple isolated chiller reports identified as a single systemic manifold line failure. Flagged for institutional root-cause overhaul rather than repeated patch fixes.
                </p>
                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between font-micro-label text-micro-label text-text-muted">
                  <span>Root Cause Probability: 94.2%</span>
                  <span className="text-copper-400 font-semibold uppercase">Capital Work Proposed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — ACCOUNTABILITY & VERIFICATION STANDARD */}
      <section className="w-full py-20 border-b border-border-subtle bg-background">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-14">
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest block mb-2">
              The Verification Standard
            </span>
            <h2 className="font-headline-1 text-headline-1 text-text-primary tracking-tight">
              A complaint deserves more than a status update.
            </h2>
            <p className="font-body-lg text-body-lg text-text-secondary mt-3">
              Reporting is the beginning. Verification is the difference.
            </p>
          </div>

          {/* Lifecycle Visualization */}
          <div className="p-6 md:p-8 bg-surface-1 border border-border-subtle rounded mb-12">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-label text-label">
              <div className="flex-1 p-3 bg-surface-inset border border-border-subtle rounded text-center">
                <span className="font-micro-label text-micro-label text-text-muted block">01</span>
                <span className="text-text-primary font-semibold">REPORTED</span>
              </div>
              <span className="hidden md:block text-text-muted">➔</span>
              <div className="flex-1 p-3 bg-surface-inset border border-border-subtle rounded text-center">
                <span className="font-micro-label text-micro-label text-text-muted block">02</span>
                <span className="text-status-under-review-text font-semibold">UNDER REVIEW</span>
              </div>
              <span className="hidden md:block text-text-muted">➔</span>
              <div className="flex-1 p-3 bg-surface-inset border border-border-subtle rounded text-center">
                <span className="font-micro-label text-micro-label text-text-muted block">03</span>
                <span className="text-status-in-progress-text font-semibold">IN PROGRESS</span>
              </div>
              <span className="hidden md:block text-text-muted">➔</span>
              <div className="flex-1 p-3 bg-surface-inset border border-border-subtle rounded text-center">
                <span className="font-micro-label text-micro-label text-text-muted block">04</span>
                <span className="text-text-secondary font-semibold">
                  RESOLVED <span className="text-text-muted text-[10px] block font-normal">(Staff Flag)</span>
                </span>
              </div>
              <span className="hidden md:block text-brand-400">➔</span>
              <div className="flex-1 p-3 bg-status-verified-bg border border-status-verified-border rounded text-center">
                <span className="font-micro-label text-micro-label text-status-verified-text block">05</span>
                <span className="text-status-verified-text font-bold">
                  VERIFIED <span className="text-[10px] block font-normal text-status-verified-text">(Student Sign-off)</span>
                </span>
              </div>
            </div>

            {/* The Essential Separation Callout */}
            <div className="mt-6 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-brand-400 shrink-0" />
                <p className="font-body-sm text-body-sm text-text-secondary">
                  <strong className="text-text-primary">The Integrity Guardrail:</strong> Internal staff cannot mark an issue "Closed". It remains in <span className="text-status-resolved-text font-mono">RESOLVED</span> pending active confirmation from the original student constituency.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-background border border-border-subtle font-micro-label text-micro-label text-brand-300 uppercase shrink-0">
                Non-Bypassable Rule
              </span>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-surface-1 border border-border-subtle rounded">
              <div className="w-10 h-10 rounded bg-background border border-border-default flex items-center justify-center text-brand-400 mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">Public Ledger Visibility</h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Every submission produces an immutable audit record visible to students, senate leaders, and department deans alike.
              </p>
            </div>
            <div className="p-6 bg-surface-1 border border-border-subtle rounded">
              <div className="w-10 h-10 rounded bg-background border border-border-default flex items-center justify-center text-copper-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">Rigid SLA Ownership</h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Bound operational service agreements prevent departmental finger-pointing. Breached targets trigger Dean escalation protocols.
              </p>
            </div>
            <div className="p-6 bg-surface-1 border border-border-subtle rounded">
              <div className="w-10 h-10 rounded bg-background border border-border-default flex items-center justify-center text-status-verified-text mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-headline-4 text-headline-4 text-text-primary mb-2">Student Verification Gate</h3>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Physical on-ground authentication ensures repairs actually function before any ticket receives final administrative archival.
              </p>
            </div>
          </div>

          {/* Governance Perspectives / Quotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-inset border border-border-subtle rounded flex flex-col justify-between">
              <p className="font-body-sm text-body-sm text-text-secondary italic leading-relaxed">
                "Before SanketOne, student council reps spent half their week copying grievance messages between WhatsApp groups and facility offices. Now we inspect a single live status board."
              </p>
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="font-headline-4 text-[14px] text-text-primary">Devika Sharma</div>
                <div className="font-micro-label text-micro-label text-text-muted">Student Senate General Secretary</div>
              </div>
            </div>
            <div className="p-6 bg-surface-inset border border-border-subtle rounded flex flex-col justify-between">
              <p className="font-body-sm text-body-sm text-text-secondary italic leading-relaxed">
                "The cluster scoring feature changed how we allocate capital budget. We resolved 63 repeated electrical micro-faults by replacing one main feeder switchboard."
              </p>
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="font-headline-4 text-[14px] text-text-primary">Prof. K. Venkatesh</div>
                <div className="font-micro-label text-micro-label text-text-muted">Dean of Student Affairs</div>
              </div>
            </div>
            <div className="p-6 bg-surface-inset border border-border-subtle rounded flex flex-col justify-between">
              <p className="font-body-sm text-body-sm text-text-secondary italic leading-relaxed">
                "The verification gate gives residents real authority. If the hot water boiler is marked fixed but it's still lukewarm, we reject the resolution with one tap."
              </p>
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <div className="font-headline-4 text-[14px] text-text-primary">Arjun Nair</div>
                <div className="font-micro-label text-micro-label text-text-muted">Hostel Block IV Representative</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 08 — FINAL CALL TO ACTION */}
      <section className="relative w-full py-24 bg-background overflow-hidden">
        {/* SVG Concentric Signal Vectors in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <svg className="w-[800px] h-[800px]" fill="none" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="100" stroke="#245B56" strokeDasharray="4 4" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="200" stroke="#3E7567" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="300" stroke="#245B56" strokeDasharray="6 6" strokeWidth="1" />
            <circle cx="400" cy="400" r="380" stroke="#2B3934" strokeWidth="1" />
            <circle cx="400" cy="400" fill="#B77936" r="12" />
          </svg>
        </div>

        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-1 border border-border-subtle mb-6">
            <span className="w-2 h-2 rounded-full bg-copper-400" />
            <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest">
              Active Civic Institutional Governance
            </span>
          </div>

          <h2 className="font-display text-[34px] lg:text-[48px] leading-[40px] lg:leading-[56px] text-text-primary tracking-tight max-w-3xl font-semibold">
            Make your campus better,
            <br />
            one signal at a time.
          </h2>

          <p className="font-body-lg text-body-lg text-text-secondary mt-5 max-w-xl leading-relaxed">
            Every meaningful institutional improvement starts when someone speaks up. Submit issues, build solidarity, and hold administration accountable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/auth?tab=signup"
              className="px-7 py-4 rounded bg-brand-600 hover:bg-brand-500 border border-brand-500 text-text-primary font-label text-label transition-all flex items-center gap-2 shadow-md"
            >
              <span>Get Started Now</span>
              <Zap className="w-4 h-4 text-primary" />
            </Link>
            <Link
              to="/student/overview"
              className="px-7 py-4 rounded bg-surface-1 hover:bg-surface-2 border border-border-default text-text-primary font-label text-label transition-all"
            >
              Explore the Platform
            </Link>
          </div>

          {/* Institutional Audit Badges */}
          <div className="mt-14 pt-8 border-t border-border-subtle flex flex-wrap items-center justify-center gap-6 text-text-muted font-micro-label text-micro-label uppercase tracking-widest">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              WCAG 2.2 AA Compliant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand-400" />
              End-to-End Logged & Audited
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-400" />
              SSO & EduID Ready
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

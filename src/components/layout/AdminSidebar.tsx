import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[250px] bg-background-raised z-50 flex flex-col justify-between select-none border-r border-border-subtle">
      <div className="flex flex-col">
        {/* Top Branding Header */}
        <div className="h-16 px-space-md flex items-center justify-between bg-surface-1 border-b border-border-subtle">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded bg-surface-2 border border-border-subtle flex items-center justify-center p-0.5 overflow-hidden">
              <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-4 text-[15px] font-semibold text-text-primary tracking-tight leading-none">
                Sanket<span className="text-primary">One</span>
              </span>
              <span className="font-micro-label text-micro-label text-text-muted uppercase leading-none mt-1">
                CIVIC REGISTRY
              </span>
            </div>
          </div>
          <span className="px-space-xs py-0.5 bg-surface-2 text-text-secondary font-micro-label text-micro-label tracking-widest uppercase">
            ADMIN CONSOLE
          </span>
        </div>

        {/* CTA: Create Announcement */}
        <div className="p-space-md">
          <button
            className="w-full h-11 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label tracking-wide uppercase flex items-center justify-center gap-space-sm transition-colors group"
            type="button"
          >
            <span className="material-symbols-outlined text-secondary text-[18px] group-hover:rotate-90 transition-transform">
              add_circle
            </span>
            <span>+ Create Announcement</span>
          </button>
        </div>

        {/* Operational Directory Header */}
        <div className="px-space-md py-space-xs">
          <span className="font-micro-label text-micro-label uppercase text-text-disabled tracking-widest px-space-xs">
            OPERATIONAL DIRECTORY
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-space-sm flex flex-col gap-1 mt-1">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Overview</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Complaints</span>
            <span className="px-1.5 py-0.5 bg-status-raised-bg text-status-raised-text font-micro-label text-micro-label rounded-[2px]">
              28
            </span>
          </NavLink>

          <NavLink
            to="/student/community"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Community Board</span>
            <span className="font-micro-label text-micro-label text-text-muted">Signals</span>
          </NavLink>

          <NavLink
            to="/admin/departments"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Departments</span>
            <span className="font-micro-label text-micro-label text-text-muted">SLA Map</span>
          </NavLink>

          <NavLink
            to="/admin/prioritization"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Analytics</span>
            <span className="font-micro-label text-micro-label text-primary">Telemetry</span>
          </NavLink>

          <NavLink
            to="/admin/sla"
            className={({ isActive }) =>
              `h-9 px-space-sm flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-surface-3 text-text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-2 hover:text-on-surface'
              }`
            }
          >
            <span className="font-label text-label">Escalations</span>
            <span className="px-1.5 py-0.5 bg-status-critical-bg text-status-critical-text font-micro-label text-micro-label rounded-[2px]">
              3
            </span>
          </NavLink>

          <NavLink
            to="/admin/overview"
            className="h-9 px-space-sm flex items-center justify-between text-on-surface-variant hover:bg-surface-2 hover:text-on-surface transition-colors"
          >
            <span className="font-label text-label">Notifications</span>
            <span className="px-1.5 py-0.5 bg-primary-container text-on-primary-container font-micro-label text-micro-label rounded-[2px]">
              5
            </span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Utility & Profile */}
      <div className="flex flex-col border-t border-border-subtle">
        <div className="px-space-md py-space-xs">
          <span className="font-micro-label text-micro-label uppercase text-text-disabled tracking-widest px-space-xs">
            UTILITY &amp; GOVERNANCE
          </span>
        </div>
        <nav className="px-space-sm flex flex-col gap-1">
          <a
            className="h-8 px-space-sm flex items-center justify-between text-on-surface-variant hover:bg-surface-2 hover:text-on-surface transition-colors"
            href="#settings"
          >
            <span className="font-label text-label">Settings</span>
            <span className="font-micro-label text-micro-label text-text-muted">v2.4.1</span>
          </a>
          <a
            className="h-8 px-space-sm flex items-center justify-between text-on-surface-variant hover:bg-surface-2 hover:text-on-surface transition-colors"
            href="#help"
          >
            <span className="font-label text-label">Help &amp; Support</span>
            <span className="font-micro-label text-micro-label text-text-muted">Manual</span>
          </a>
        </nav>
        <div className="m-space-sm p-space-sm bg-surface-1 flex items-center gap-space-sm rounded">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-status-resolved-border"></span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label text-label text-text-primary truncate font-semibold">Dr. Sunita Menon</span>
            <span className="font-micro-label text-micro-label text-text-secondary truncate">
              Dean of Student Affairs
            </span>
            <span className="font-micro-label text-[9px] text-text-muted uppercase tracking-wider mt-0.5">
              Chief Custodian
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

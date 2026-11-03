import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  PlusCircle,
  LayoutGrid,
  ClipboardList,
  MessageSquare,
  Activity,
  Bell,
  HelpCircle,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const StudentSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background-raised z-40 flex flex-col justify-between overflow-y-auto border-r border-border-subtle">
      <div className="flex flex-col">
        {/* Top Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-1 border border-border-default flex items-center justify-center p-0.5 overflow-hidden">
              <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-4 text-headline-4 text-text-primary tracking-tight">
                Sanket<span className="text-copper-400">One</span>
              </span>
              <span className="font-micro-label text-micro-label text-brand-300 uppercase tracking-widest">
                Student Node
              </span>
            </div>
          </Link>
          <div className="w-2 h-2 rounded-full bg-status-verified-text animate-pulse" />
        </div>

        {/* CTA: Report an Issue */}
        <div className="px-4 pt-4 pb-2">
          <Link
            to="/student/report"
            className="w-full h-11 px-4 bg-brand-600 hover:bg-brand-500 text-text-primary font-label text-label tracking-wide uppercase flex items-center justify-center gap-2 rounded-lg transition-all shadow-[0_1px_8px_rgba(0,0,0,0.2)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Issue</span>
          </Link>
        </div>

        {/* Section Label: Terminal Views */}
        <div className="px-4 py-1">
          <span className="font-micro-label text-micro-label uppercase text-text-muted px-1">
            Terminal Views
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 flex flex-col gap-1">
          <NavLink
            to="/student/overview"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-surface-2 text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-body-sm text-body-sm">Overview</span>
            </div>
          </NavLink>

          <NavLink
            to="/student/complaints"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-surface-2 text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-body-sm text-body-sm">My Complaints</span>
            </div>
            <span className="font-micro-label text-micro-label px-1.5 py-0.5 rounded bg-surface-2 text-brand-300">
              4
            </span>
          </NavLink>

          <NavLink
            to="/student/community"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-surface-2 text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-body-sm text-body-sm">Community Board</span>
            </div>
          </NavLink>

          <NavLink
            to="/student/pulse"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-surface-2 text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-body-sm text-body-sm">Campus Pulse</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-copper-400" />
          </NavLink>

          <NavLink
            to="/student/settings"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-surface-2 text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="font-body-sm text-body-sm">Notifications</span>
            </div>
            <span className="font-micro-label text-micro-label px-1.5 py-0.5 rounded bg-copper-500 text-text-primary font-bold">
              3
            </span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="flex flex-col border-t border-border-subtle">
        <div className="px-4 py-1">
          <span className="font-micro-label text-micro-label uppercase text-text-muted px-1">
            System Utility
          </span>
        </div>
        <nav className="px-2 flex flex-col gap-1 pb-2">
          <Link
            to="/how-it-works"
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-1 hover:text-text-primary transition-colors group"
          >
            <HelpCircle className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            <span className="font-body-sm text-body-sm">Help & Support</span>
          </Link>
          <Link
            to="/student/settings"
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-1 hover:text-text-primary transition-colors group"
          >
            <Settings className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            <span className="font-body-sm text-body-sm">Settings</span>
          </Link>
        </nav>

        {/* User Card */}
        <div className="p-2 m-2 bg-surface-1 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded bg-brand-700 text-text-primary font-label text-label flex items-center justify-center font-bold">
                {user?.avatarInitials || 'AS'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-verified-text bg-clip-padding" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                {user?.fullName || 'Aditi Sharma'}
              </span>
              <span className="font-micro-label text-micro-label text-text-muted truncate">
                {user?.rollNumber ? `CS • Sem 6 (#${user.rollNumber})` : 'CS • Sem 6'}
              </span>
            </div>
          </div>
          <Link to="/student/settings" className="text-text-muted hover:text-text-primary transition-colors p-1">
            <MoreVertical className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

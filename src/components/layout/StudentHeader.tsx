import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '@/context/DemoDataContext';

interface StudentHeaderProps {
  onOpenNotifications?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ onOpenNotifications }) => {
  const { unreadNotificationCount } = useDemoData();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl z-30 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
            search
          </span>
          <input
            className="w-full h-9 pl-9 pr-space-md bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 transition-all"
            placeholder="Search complaints, locations, or tags..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="hidden md:flex items-center gap-space-xs px-2.5 py-1 rounded bg-surface-1">
          <span className="material-symbols-outlined text-copper-400 text-[16px]">schedule</span>
          <span className="font-micro-label text-micro-label uppercase text-text-secondary tracking-wider">
            Spring 2025 • Active Session
          </span>
        </div>
        <div className="h-4 w-px bg-surface-2 hidden md:block"></div>
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-copper-500 animate-pulse"></span>
          )}
        </button>
        <Link to="/student/settings" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </Link>
      </div>
    </header>
  );
};

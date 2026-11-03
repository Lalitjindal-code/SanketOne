import React from 'react';
import { useDemoData } from '@/context/DemoDataContext';

interface AdminHeaderProps {
  onOpenNotifications?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenNotifications }) => {
  const { unreadNotificationCount } = useDemoData();

  return (
    <header className="fixed top-0 left-[250px] right-0 h-16 bg-surface-container-low/95 backdrop-blur-md z-40 flex items-center justify-between px-space-lg select-none border-b border-border-subtle">
      <div className="flex items-center gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-widest">
              ADMINISTRATIVE OPS
            </span>
            <span className="font-micro-label text-micro-label text-text-disabled">//</span>
            <span className="font-micro-label text-micro-label text-primary uppercase tracking-widest">
              NODE 01 — CENTRAL REGISTRY
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-micro-label text-[9px] text-text-disabled tracking-wide uppercase">STATUS:</span>
            <span className="font-micro-label text-[9px] text-brand-300 tracking-wide uppercase">
              SYSTEM HEALTH: 99.4% • ALL DISPATCH CHANNELS SYNCHRONIZED
            </span>
          </div>
        </div>
        <div className="h-7 w-[1px] bg-surface-3"></div>
        <div className="relative w-80 lg:w-96">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[17px]">
            search
          </span>
          <input
            className="w-full h-8 pl-8 pr-3 bg-surface-inset text-text-primary placeholder:text-text-muted font-body-sm text-body-sm focus:outline-none rounded"
            placeholder="Search complaints by #ID, keyword, building, or custodian..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <button
          className="h-8 px-space-sm bg-surface-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 font-label text-label rounded"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
          <span>Trailing 30 Days</span>
          <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
        </button>
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-2 transition-colors relative rounded"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            )}
          </button>
        </div>
        <div className="h-7 w-[1px] bg-surface-3"></div>
        <div className="flex items-center gap-space-sm pl-1">
          <div className="flex flex-col text-right">
            <span className="font-label text-label text-text-primary font-semibold leading-tight">Dr. Menon</span>
            <span className="font-micro-label text-micro-label text-text-secondary leading-tight">Dean Affairs</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

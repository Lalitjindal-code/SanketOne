import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';
import { DemoPersonaSwitcher } from './DemoPersonaSwitcher';
import { NotificationsDrawer } from '@/components/common/NotificationsDrawer';

export const StudentLayout: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-background font-body-md text-text-primary selection:bg-brand-600 selection:text-text-primary min-h-screen">
      {/* Fixed Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        <StudentHeader onOpenNotifications={() => setShowNotifications(true)} />

        <main className="w-full pt-16 bg-background flex-1 px-space-lg py-space-lg">
          <Outlet />
        </main>

        <footer className="w-full bg-background-raised py-space-md px-space-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-sm text-text-muted">
            <div className="flex items-center gap-space-xs">
              <span className="font-micro-label text-micro-label uppercase text-brand-300">
                SanketOne Governance Framework
              </span>
              <span className="text-surface-2">•</span>
              <span className="font-body-sm text-body-sm text-text-muted">
                Autonomous Campus Redressal Engine
              </span>
            </div>
            <div className="flex items-center gap-space-md font-body-sm text-body-sm">
              <a className="hover:text-text-primary transition-colors" href="/how-it-works">
                Ombudsman Protocol
              </a>
              <a className="hover:text-text-primary transition-colors" href="/how-it-works">
                Escalation Matrix
              </a>
              <span className="font-micro-label text-micro-label uppercase text-copper-400">
                Confidential &amp; Verified
              </span>
            </div>
          </div>
        </footer>
      </div>

      <NotificationsDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <DemoPersonaSwitcher />
    </div>
  );
};

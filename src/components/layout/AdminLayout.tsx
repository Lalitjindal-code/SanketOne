import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DemoPersonaSwitcher } from './DemoPersonaSwitcher';
import { NotificationsDrawer } from '@/components/common/NotificationsDrawer';

export const AdminLayout: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Container Area */}
      <div className="pl-[250px]">
        <AdminHeader onOpenNotifications={() => setShowNotifications(true)} />

        <main className="w-full pt-16 bg-background min-h-screen">
          <Outlet />
        </main>
      </div>

      <NotificationsDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <DemoPersonaSwitcher />
    </div>
  );
};

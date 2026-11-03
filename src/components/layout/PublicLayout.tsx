import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { DemoPersonaSwitcher } from './DemoPersonaSwitcher';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111817] flex flex-col selection:bg-[#245B56] selection:text-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <DemoPersonaSwitcher />
    </div>
  );
};


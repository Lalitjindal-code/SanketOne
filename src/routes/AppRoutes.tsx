import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';

// Auth Pages
import { AuthPage } from '@/pages/auth/AuthPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { ProblemReportPage } from '@/pages/student/ProblemReportPage';
import { MyComplaintsPage } from '@/pages/student/MyComplaintsPage';
import { CommunityBoardPage } from '@/pages/student/CommunityBoardPage';
import { CampusPulsePage } from '@/pages/student/CampusPulsePage';
import { StudentSettingsPage } from '@/pages/student/StudentSettingsPage';

// Admin Pages
import { CampusOverviewPage } from '@/pages/admin/CampusOverviewPage';
import { ComplaintManagementPage } from '@/pages/admin/ComplaintManagementPage';
import { SmartPrioritizationPage } from '@/pages/admin/SmartPrioritizationPage';
import { SlaEscalationsPage } from '@/pages/admin/SlaEscalationsPage';
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

// System Pages
import { NotFoundPage } from '@/pages/system/NotFoundPage';
import { UnauthorizedPage } from '@/pages/system/UnauthorizedPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/overview" replace />} />
        <Route path="overview" element={<StudentDashboard />} />
        <Route path="report" element={<ProblemReportPage />} />
        <Route path="complaints" element={<MyComplaintsPage />} />
        <Route path="complaints/:id" element={<MyComplaintsPage />} />
        <Route path="community" element={<CommunityBoardPage />} />
        <Route path="pulse" element={<CampusPulsePage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
      </Route>

      {/* Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<CampusOverviewPage />} />
        <Route path="complaints" element={<ComplaintManagementPage />} />
        <Route path="complaints/:id" element={<ComplaintManagementPage />} />
        <Route path="prioritization" element={<SmartPrioritizationPage />} />
        <Route path="sla" element={<SlaEscalationsPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* System Error & Access Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};


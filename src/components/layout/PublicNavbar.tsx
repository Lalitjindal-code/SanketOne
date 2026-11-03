import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const { user, role } = useAuth();

  const navLinks = [
    { label: 'Platform', to: '/' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Campus Pulse', to: '/student/pulse' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border-subtle">
      <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-1 border border-border-default/80 flex items-center justify-center p-0.5 group-hover:border-primary/50 transition-colors overflow-hidden">
            <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-4 text-headline-4 text-text-primary tracking-tight leading-none group-hover:text-primary transition-colors">
              Sanket<span className="text-primary">One</span>
            </span>
            <span className="font-micro-label text-micro-label text-text-muted uppercase tracking-widest mt-0.5">
              One Signal. One Solution.
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-inset border border-border-subtle px-2 py-1.5 rounded">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded transition-all ${
                  isActive
                    ? 'bg-brand-600 text-text-primary font-semibold'
                    : 'font-label text-label text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="flex items-center gap-4">
          <Link
            to="/auth"
            className="hidden sm:inline-block font-label text-label text-text-secondary hover:text-text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/auth?tab=signup"
            className="bg-brand-600 text-text-primary hover:bg-brand-500 border border-border-default px-4 py-2 font-label text-label font-medium rounded transition-all"
          >
            Get Started
          </Link>
          <Link
            to={role === 'admin' ? '/admin/overview' : '/student/overview'}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 text-on-primary font-bold text-xs hover:ring-2 hover:ring-brand-400 transition-all"
            title={role === 'admin' ? 'Admin Operations Console' : 'Student Portal'}
          >
            {user?.avatarInitials || (role === 'admin' ? 'SM' : 'AS')}
          </Link>
        </div>
      </div>
    </header>
  );
};

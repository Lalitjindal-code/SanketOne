import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-background border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-1 border border-border-default/80 flex items-center justify-center p-0.5 overflow-hidden">
                  <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-headline-3 text-headline-3 text-text-primary tracking-tight">Sanket<span className="text-primary">One</span></span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary max-w-sm">
                Institutional integrity infrastructure and systematic grievance resolution engineered for universities, academic faculties, and civic governance bodies.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center px-2 py-1 rounded bg-background-raised border border-border-subtle font-micro-label text-micro-label text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-1.5" />
                WCAG 2.2 AA COMPLIANT
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-background-raised border border-border-subtle font-micro-label text-micro-label text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-1.5" />
                END-TO-END AUDIT CERTIFIED
              </span>
            </div>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">Platform</div>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              <li className="leading-none"><Link to="/student/overview" className="text-text-secondary hover:text-text-primary transition-colors">Student Portal</Link></li>
              <li className="leading-none"><Link to="/admin/overview" className="text-text-secondary hover:text-text-primary transition-colors">Admin Portal</Link></li>
              <li className="leading-none"><Link to="/how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">How It Works</Link></li>
              <li className="leading-none"><Link to="/student/pulse" className="text-text-secondary hover:text-text-primary transition-colors">Campus Pulse</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">Company</div>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              <li className="leading-none"><Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors">About</Link></li>
              <li className="leading-none"><span className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">Contact</span></li>
              <li className="leading-none"><span className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">Editorial Standards</span></li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="md:col-span-3 space-y-4">
            <div className="font-micro-label text-micro-label text-text-muted uppercase tracking-wider">Account</div>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              <li className="leading-none"><Link to="/auth" className="text-text-secondary hover:text-text-primary transition-colors">Log In</Link></li>
              <li className="leading-none"><Link to="/auth?tab=signup" className="text-text-secondary hover:text-text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-text-muted">
          <div>Copyright © 2026 SanketOne Technologies. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-text-primary transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

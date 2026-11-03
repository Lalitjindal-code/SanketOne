import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SignalCore } from '@/components/three/SignalCore';
import { useAuth } from '@/context/AuthContext';
import { validateStudentEmailDomain } from '@/lib/authService';
import {
  User,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { UserRole } from '@/types/user';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'signin' | 'signup' | 'forgot' | 'demo') || 'signin';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'demo'>(initialTab);
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRoll, setSignUpRoll] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpAgree, setSignUpAgree] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, resetPassword, switchDemoPersona } = useAuth();
  const navigate = useNavigate();

  // Dynamic password strength calculation
  const getPasswordStrength = (val: string): { score: number; label: string; color: string } => {
    if (!val) return { score: 0, label: 'Empty', color: 'bg-border' };
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(signUpPassword);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);
    setIsSubmitting(true);
    try {
      await login(signInEmail, signInPassword, activeRole);
      navigate(activeRole === 'admin' ? '/admin/overview' : '/student/overview');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let msg = error.message || 'Invalid credentials. In Demo mode, you can use the Demo Sandbox tab.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        msg = 'Invalid campus email or password. Please verify your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        msg = 'No registered campus account found with this email. Please register as a student.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Access is temporarily restricted. Please reset password.';
      }
      setAlertType('error');
      setAlertMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);
    if (!signUpAgree) {
      setAlertType('error');
      setAlertMessage('Please accept the Campus Community Integrity Code.');
      return;
    }

    // Domain validation check
    const domainCheck = validateStudentEmailDomain(signUpEmail);
    if (!domainCheck.valid) {
      setAlertType('error');
      setAlertMessage(domainCheck.reason || 'Unauthorized email domain.');
      return;
    }

    if (signUpPassword.length < 8) {
      setAlertType('error');
      setAlertMessage('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        email: signUpEmail,
        password: signUpPassword,
        fullName: signUpName,
        rollNumber: signUpRoll,
      });
      navigate('/student/overview');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let msg = error.message || 'Account registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'An account with this institutional email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 8 characters with letters and numbers.';
      }
      setAlertType('error');
      setAlertMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);
    if (!forgotEmail) return;

    setIsSubmitting(true);
    try {
      await resetPassword(forgotEmail);
      setForgotSent(true);
      setAlertType('success');
      setAlertMessage(`Recovery transmission dispatched to ${forgotEmail}`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setAlertType('error');
      setAlertMessage(error.message || 'Failed to dispatch recovery link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchDemo = (personaRole: UserRole) => {
    switchDemoPersona(personaRole);
    navigate(personaRole === 'admin' ? '/admin/overview' : '/student/overview');
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-x-hidden bg-canvas text-text-primary font-body antialiased selection:bg-teal-brand selection:text-text-primary">
      {/* BEGIN: BrandShowcaseLeftColumn */}
      <section className="lg:w-[48%] xl:w-[46%] w-full bg-surface-raised border-b lg:border-b-0 lg:border-r border-border-subtle p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Atmospheric Background Radial Gradient */}
        <div aria-hidden="true" className="absolute -top-32 -left-32 w-96 h-96 bg-teal-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-80 h-80 bg-copper/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Identifier */}
        <header className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group" title="SanketOne Home">
            {/* Custom Brand Logo Mark */}
            <div className="w-10 h-10 rounded-lg bg-surface-1 border border-border flex items-center justify-center p-1 group-hover:border-primary transition-colors duration-200 overflow-hidden">
              <img src="/logo-icon.png" alt="SanketOne Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-text-primary block leading-none">
                Sanket<span className="text-primary">One</span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted mt-1 block">Campus Intelligence Platform</span>
            </div>
          </Link>
        </header>

        {/* Center Editorial Narrative & 3D Interactive Core */}
        <div className="my-8 lg:my-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-1 border border-border-subtle text-xs font-mono text-sage mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
            VERIFIABLE RESOLUTION PIPELINE
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
            Every voice has the power to change a campus.
          </h1>

          <p className="mt-4 text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg">
            Connect directly with your campus community, register verified infrastructure signals, and follow every operational issue through an immutable lifecycle to resolution.
          </p>

          {/* 3D Interactive Canvas Container with Architectural Framing */}
          <div className="w-full relative mt-6 rounded-lg border border-border-subtle bg-canvas/70 overflow-hidden backdrop-blur-sm">
            {/* Header Bar with telemetry indicator */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-surface-raised/90 text-[11px] font-mono text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-brand" />
                CORE_SIGNAL_MESH // v2.4
              </span>
              <span className="text-sage text-[10px]">ROTATIONAL ORBIT ACTIVE</span>
            </div>

            {/* Three.js Canvas Element */}
            <div className="w-full h-[280px] sm:h-[320px] relative">
              <SignalCore className="w-full h-full" isCompact />
            </div>

            {/* Micro Telemetry Footer */}
            <div className="px-3.5 py-1.5 border-t border-border-subtle bg-surface-raised/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>NODES: 6 ACTIVE PROBES</span>
              <span className="text-copper">0 INDEFINITE DEFERRALS</span>
            </div>
          </div>
        </div>

        {/* Bottom Brand Institutional Assurance */}
        <footer className="relative z-10 pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-muted">
          <div>
            <span className="font-mono text-text-secondary font-medium">One Signal. One Solution.</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>WCAG 2.2 AA</span>
            <span>•</span>
            <span>SSO & EduID Ready</span>
            <span>•</span>
            <span>Audited Logs</span>
          </div>
        </footer>
      </section>

      {/* BEGIN: AuthenticationRightColumn */}
      <section className="lg:w-[52%] xl:w-[54%] w-full bg-canvas flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        {/* Auth Card Shell */}
        <div className="w-full max-w-[460px] bg-surface-raised border border-border rounded-lg p-6 sm:p-8 shadow-2xl relative">
          {/* Top Role Mode Selector */}
          <div className="mb-6">
            <div className="p-1 bg-inset border border-border-subtle rounded-md grid grid-cols-2 gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveRole('student')}
                className={`py-2 px-3 rounded transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === 'student'
                    ? 'bg-surface-2 text-text-primary shadow-sm border border-border'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <User className="w-3.5 h-3.5 text-sage" />
                <span>Student Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('admin')}
                className={`py-2 px-3 rounded transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === 'admin'
                    ? 'bg-surface-2 text-text-primary shadow-sm border border-border'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-copper" />
                <span>Governance Ops</span>
              </button>
            </div>
            <p className="text-[11px] text-text-muted mt-2 px-1 flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${activeRole === 'student' ? 'bg-sage' : 'bg-copper'}`} />
              <span>
                {activeRole === 'student'
                  ? 'Institutional access for enrolled students & campus residents.'
                  : 'Estates Maintenance & Deanery Governance console (Strict 2FA).'}
              </span>
            </p>
          </div>

          {/* Auth Navigation Tabs */}
          <nav className="flex border-b border-border-subtle pb-2 mb-6 gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`pb-2 -mb-2.5 transition-colors font-semibold ${
                activeTab === 'signin'
                  ? 'text-text-primary border-b-2 border-sage'
                  : 'text-text-muted hover:text-text-secondary border-b-2 border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`pb-2 -mb-2.5 transition-colors font-semibold ${
                activeTab === 'signup'
                  ? 'text-text-primary border-b-2 border-sage'
                  : 'text-text-muted hover:text-text-secondary border-b-2 border-transparent'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`pb-2 -mb-2.5 transition-colors font-semibold flex items-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'text-copper border-b-2 border-copper'
                  : 'text-text-muted hover:text-copper border-b-2 border-transparent'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-copper" />
              Demo Sandbox
            </button>
          </nav>

          {/* Alert Toast */}
          {alertMessage && (
            <div
              className={`mb-4 p-3 rounded bg-surface-1 border ${
                alertType === 'error'
                  ? 'border-red-500/60 text-red-300'
                  : 'border-teal-brand text-sage'
              } text-xs flex items-start gap-2`}
            >
              {alertType === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-sage mt-0.5" />
              )}
              <span>{alertMessage}</span>
            </div>
          )}

          {/* STATE A: SIGN IN FORM */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-heading font-semibold text-text-primary">Welcome back.</h2>
                <p className="text-xs text-text-secondary mt-1">Authenticate with your campus credentials to view active signals.</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="signin-email">
                    Campus Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="signin-email"
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder={activeRole === 'admin' ? 'dean.affairs@campus.edu' : 'student.id@campus.edu'}
                      className="w-full bg-inset border border-border rounded py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-text-secondary" htmlFor="signin-password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-xs text-sage hover:text-sage-light transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signin-password"
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-inset border border-border rounded py-2 pl-9 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-inset border-border text-teal-brand focus:ring-teal-brand"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-xs text-text-secondary cursor-pointer select-none">
                    Remember credentials on this browser for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded bg-teal-brand hover:bg-teal-hover text-text-primary text-sm font-medium tracking-wide transition-all shadow-glow-teal flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to SanketOne</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SSO Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-border-subtle w-full" />
                <span className="bg-surface-raised px-3 text-[11px] font-mono text-text-muted uppercase">
                  Institutional SSO
                </span>
                <div className="border-t border-border-subtle w-full" />
              </div>

              <button
                type="button"
                onClick={() => alert('EduID Federation authentication ready for campus domain validation.')}
                className="w-full py-2 px-3 rounded bg-surface-1 hover:bg-surface-2 border border-border text-xs text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4 text-sage" />
                <span>Log in with Campus EduID Federation</span>
              </button>

              <div className="pt-2 text-center text-xs text-text-muted">
                New to SanketOne?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-sage hover:text-text-primary ml-1 underline underline-offset-2"
                >
                  Join your campus community
                </button>
              </div>
            </div>
          )}

          {/* STATE B: SIGN UP FORM */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-heading font-semibold text-text-primary">Join your campus community.</h2>
                <p className="text-xs text-text-secondary mt-1">Register verified student credentials to submit and confirm tickets.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Aditi Sharma"
                    className="w-full bg-inset border border-border rounded py-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="signup-email">
                    Official Institutional Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="student.name@campus.edu"
                    className="w-full bg-inset border border-border rounded py-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage"
                  />
                  <p className="text-[10px] text-text-muted mt-1">Configurable domain validation: will enforce official campus domains</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="signup-roll">
                    Student Enrollment / Roll No.
                  </label>
                  <input
                    id="signup-roll"
                    type="text"
                    required
                    value={signUpRoll}
                    onChange={(e) => setSignUpRoll(e.target.value)}
                    placeholder="2023-CS-0418"
                    className="w-full bg-inset border border-border rounded py-2 px-3 text-sm text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-inset border border-border rounded py-2 px-3 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="mt-2">
                    <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full w-1/3 transition-all ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-border'}`} />
                      <div className={`h-full w-1/3 transition-all ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-border'}`} />
                      <div className={`h-full w-1/3 transition-all ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-border'}`} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mt-1">
                      <span>Password strength: {pwdStrength.label}</span>
                      <span>Minimum 8 chars</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start pt-1">
                  <input
                    id="signup-agree"
                    type="checkbox"
                    required
                    checked={signUpAgree}
                    onChange={(e) => setSignUpAgree(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded bg-inset border-border text-teal-brand focus:ring-teal-brand"
                  />
                  <label htmlFor="signup-agree" className="ml-2 text-xs text-text-secondary select-none">
                    I agree to the <span className="text-sage underline underline-offset-2 cursor-pointer">Campus Community Integrity Code</span> and understand that false signals are permanently logged.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded bg-teal-brand hover:bg-teal-hover text-text-primary text-sm font-medium tracking-wide transition-all shadow-glow-teal flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Student Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="p-3 bg-inset rounded border border-border-subtle text-[11px] text-text-muted mt-2">
                <span className="text-copper font-medium">Administrative Notice:</span> Institutional staff and estates triage officer credentials must be provisioned via the Dean of Student Affairs console.
              </div>

              <div className="text-center text-xs text-text-muted pt-1">
                Already have an active account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-sage hover:text-text-primary ml-1 underline underline-offset-2"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* STATE C: FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-heading font-semibold text-text-primary">Reset your password.</h2>
                <p className="text-xs text-text-secondary mt-1">Enter your registered campus email to receive recovery instructions.</p>
              </div>

              {forgotSent ? (
                <div className="p-4 bg-inset border border-border rounded-lg text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-semibold text-white">Recovery Signal Dispatched</div>
                  <p className="text-[11px] text-text-secondary">
                    Check your inbox at <span className="text-text-primary font-mono">{forgotEmail}</span> for cryptographic password reset instructions.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false);
                      setActiveTab('signin');
                    }}
                    className="text-xs text-sage hover:underline pt-2 inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Sign In</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="forgot-email">
                      Registered Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your.name@campus.edu"
                        className="w-full bg-inset border border-border rounded py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded bg-teal-brand hover:bg-teal-hover text-text-primary text-sm font-medium tracking-wide transition-all shadow-glow-teal flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Transmitting Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Recovery Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Return to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STATE D: DEMO SANDBOX ACCESS */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="mb-4">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-copper/15 border border-copper/30 text-[10px] font-mono text-copper mb-2">
                  EVALUATION SUITE
                </div>
                <h2 className="text-xl font-heading font-semibold text-text-primary">Instant Sandbox Access.</h2>
                <p className="text-xs text-text-secondary mt-1">Direct single-click portal authentication pre-populated with live mock signals.</p>
              </div>

              <div className="space-y-3">
                {/* Student Demo Card */}
                <button
                  type="button"
                  onClick={() => handleLaunchDemo('student')}
                  className="w-full text-left p-3.5 rounded bg-surface-1 hover:bg-surface-2 border border-border hover:border-sage transition-all group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded bg-canvas border border-border-subtle flex items-center justify-center shrink-0 group-hover:border-sage text-sage">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-sage">Student Resident Persona</span>
                      <span className="text-[10px] font-mono text-sage">SANDBOX READY</span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">Aditi Sharma • Hostel IV, Room 204</div>
                    <div className="text-[10px] text-text-muted mt-1 font-mono">Includes: Water cooler non-operational signal & Wi-Fi ticket history.</div>
                  </div>
                </button>

                {/* Admin Ops Demo Card */}
                <button
                  type="button"
                  onClick={() => handleLaunchDemo('admin')}
                  className="w-full text-left p-3.5 rounded bg-surface-1 hover:bg-surface-2 border border-border hover:border-copper transition-all group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded bg-canvas border border-border-subtle flex items-center justify-center shrink-0 group-hover:border-copper text-copper">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-copper">Administrative Triage Persona</span>
                      <span className="text-[10px] font-mono text-copper">GOVERNANCE OPS</span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">Deanery & Estates Maintenance Desk</div>
                    <div className="text-[10px] text-text-muted mt-1 font-mono">Includes: 28 open grievances, SLA breach watches, HVAC root alert.</div>
                  </div>
                </button>
              </div>

              <div className="p-3 bg-inset rounded border border-border-subtle text-[11px] text-text-muted text-center">
                Zero registration required. Evaluates live mock cluster algorithms safely.
              </div>
            </div>
          )}
        </div>

        {/* Security Assurance */}
        <aside aria-label="Security Assurance" className="mt-6 text-center text-xs text-text-muted max-w-sm">
          Protected by institutional zero-trust token signing. Activity is archived per campus bylaws.
        </aside>
      </section>
    </main>
  );
};

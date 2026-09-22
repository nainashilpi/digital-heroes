import React, { useState } from 'react';
import { 
  Trophy, 
  Heart, 
  User, 
  ShieldCheck, 
  LogOut, 
  CreditCard, 
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';
import { TEST_CREDENTIALS } from '../lib/supabase';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeView: 'home' | 'charities' | 'dashboard' | 'admin';
  setActiveView: (view: 'home' | 'charities' | 'dashboard' | 'admin') => void;
  onOpenSubscribe: () => void;
  onOpenDonate: () => void;
  onOpenAuth: () => void;
  onSwitchRole: (role: 'subscriber' | 'admin' | 'public') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onOpenSubscribe,
  onOpenDonate,
  onOpenAuth,
  onSwitchRole,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0b1319]/95 backdrop-blur-md border-b border-[#1c2936]">
      {/* Top Notification / Role Switcher Strip */}
      <div className="bg-[#121e28] text-xs py-1.5 px-4 border-b border-[#1d2d3c] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1b332b] text-[#5eead4] font-medium text-[11px] border border-[#234e40]">
            <Sparkles className="w-3 h-3 text-[#5eead4]" />
            PRD Edition 2026
          </span>
          <span className="hidden sm:inline text-slate-400">
            Digital Heroes • Level 1 Trainee Assignment Platform
          </span>
        </div>

        {/* Quick Test Role Switcher (Mandatory §15 Test Credentials) */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden md:inline">Test Role:</span>
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#182735] hover:bg-[#203446] text-slate-200 border border-[#2b4155] transition text-xs font-medium cursor-pointer"
            >
              {currentUser?.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">Admin: {currentUser.fullName}</span>
                </>
              ) : currentUser?.role === 'subscriber' ? (
                <>
                  <User className="w-3.5 h-3.5 text-[#5eead4]" />
                  <span className="text-emerald-300">Subscriber: {currentUser.fullName}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">Public Visitor</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-[#14202c] border border-[#263a4d] rounded-lg shadow-2xl py-1 z-50 text-xs"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] text-slate-400 font-semibold tracking-wider uppercase border-b border-[#213243]">
                  Switch Role / Test Login
                </div>
                <button
                  id="switch-to-subscriber"
                  onClick={() => onSwitchRole('subscriber')}
                  className="w-full text-left px-3 py-2 hover:bg-[#1b2b3b] text-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-100">Registered Subscriber</div>
                      <div className="text-[10px] text-slate-400">{TEST_CREDENTIALS.subscriber.email}</div>
                    </div>
                  </div>
                  {currentUser?.role === 'subscriber' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </button>

                <button
                  id="switch-to-admin"
                  onClick={() => onSwitchRole('admin')}
                  className="w-full text-left px-3 py-2 hover:bg-[#1b2b3b] text-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-amber-200">Platform Administrator</div>
                      <div className="text-[10px] text-slate-400">{TEST_CREDENTIALS.admin.email}</div>
                    </div>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  )}
                </button>

                <button
                  id="switch-to-public"
                  onClick={() => onSwitchRole('public')}
                  className="w-full text-left px-3 py-2 hover:bg-[#1b2b3b] text-slate-200 flex items-center justify-between border-t border-[#213243]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">🌐</span>
                    <div>
                      <div className="font-medium text-slate-300">Public Visitor</div>
                      <div className="text-[10px] text-slate-400">Browse platform anonymously</div>
                    </div>
                  </div>
                  {!currentUser && (
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d3545] to-[#0e1b24] border border-[#314b60] flex items-center justify-center text-amber-400 shadow-inner group-hover:border-amber-400/50 transition">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  digital.<span className="text-[#e28743]">HEROES</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Golf & Charity Platform
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                id="nav-home-btn"
                onClick={() => setActiveView('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeView === 'home'
                    ? 'bg-[#182735] text-white border border-[#2d4357]'
                    : 'text-slate-300 hover:text-white hover:bg-[#131f2b]'
                }`}
              >
                The Platform
              </button>

              <button
                id="nav-charities-btn"
                onClick={() => setActiveView('charities')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'charities'
                    ? 'bg-[#182735] text-white border border-[#2d4357]'
                    : 'text-slate-300 hover:text-white hover:bg-[#131f2b]'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Charities
              </button>

              {currentUser && (
                <button
                  id="nav-dashboard-btn"
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'dashboard'
                      ? 'bg-[#182735] text-white border border-[#2d4357]'
                      : 'text-slate-300 hover:text-white hover:bg-[#131f2b]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  My Dashboard
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  id="nav-admin-btn"
                  onClick={() => setActiveView('admin')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin'
                      ? 'bg-amber-950/40 text-amber-200 border border-amber-600/40'
                      : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin Controls
                </button>
              )}
            </nav>
          </div>

          {/* Action CTAs & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-donate-btn"
              onClick={onOpenDonate}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-[#162432] hover:bg-[#1e3042] border border-[#2a3f53] transition cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Direct Donation
            </button>

            {!currentUser ? (
              <>
                <button
                  id="nav-login-btn"
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#162330] transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="nav-subscribe-btn"
                  onClick={onOpenSubscribe}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#0b1319] bg-[#e28743] hover:bg-[#f09756] transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Subscribe Now
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-[#1f2e3d]">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-2 group cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full ring-2 ring-[#294054] overflow-hidden bg-slate-700">
                    <img 
                      src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.fullName}`} 
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      {currentUser.subscription?.plan ? `${currentUser.subscription.plan.toUpperCase()} ACTIVE` : 'Active'}
                    </div>
                  </div>
                </button>

                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#172533] transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-[#15222e] border border-[#273a4b]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e171f] border-b border-[#213446] px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-[#1a2836]"
          >
            The Platform
          </button>
          <button
            onClick={() => { setActiveView('charities'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-[#1a2836] flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Charities
          </button>
          {currentUser && (
            <button
              onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-[#1a2836] flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              My Dashboard
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-amber-300 hover:bg-[#1a2836] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Controls
            </button>
          )}

          <div className="pt-2 border-t border-[#1d2d3c] flex flex-col gap-2">
            <button
              onClick={() => { onOpenDonate(); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg text-sm font-medium bg-[#162432] text-slate-200 border border-[#2a3f53]"
            >
              Make Direct Donation
            </button>
            {!currentUser ? (
              <button
                onClick={() => { onOpenSubscribe(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg text-sm font-semibold bg-[#e28743] text-[#0b1319]"
              >
                Subscribe Now ($19/mo)
              </button>
            ) : (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/20"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

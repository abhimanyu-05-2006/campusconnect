import React from 'react';
import {
  GraduationCap,
  Building2,
  CalendarDays,
  Briefcase,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Users,
  ChevronDown,
  Globe,
  Check,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { useCampus, AppView } from '../context/CampusContext';
import { UserRole } from '../types/database.types';
import { CampusConnectLogo } from './CampusConnectLogo';

export const HeaderNav: React.FC = () => {
  const {
    colleges,
    currentCollege,
    setCurrentCollege,
    currentProfile,
    switchRole,
    currentView,
    setCurrentView,
    goBack,
    canGoBack,
    resetToSeedData
  } = useCampus();

  const roles: { role: UserRole; label: string; badge: string; color: string }[] = [
    { role: 'student', label: 'Student', badge: 'Free User', color: 'bg-blue-600' },
    { role: 'college_admin', label: 'College Admin', badge: 'Annual B2B', color: 'bg-emerald-600' },
    { role: 'club_organizer', label: 'Organizer', badge: 'Club Lead', color: 'bg-indigo-600' },
    { role: 'company_sponsor', label: 'Sponsor', badge: 'Campaigns', color: 'bg-amber-600' },
    { role: 'platform_super_admin', label: 'Super Admin', badge: 'Internal Ops', color: 'bg-purple-600' }
  ];

  const navLinks: { view: AppView; label: string; icon: React.ReactNode; rolesAllowed?: UserRole[] }[] = [
    { view: 'landing', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { view: 'student_dashboard', label: 'Student Hub', icon: <GraduationCap className="w-4 h-4" /> },
    { view: 'college_admin', label: 'College Admin', icon: <Building2 className="w-4 h-4" /> },
    { view: 'organizer', label: 'Organizer Desk', icon: <CalendarDays className="w-4 h-4" /> },
    { view: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { view: 'super_admin', label: 'Platform Ops', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Multi-Tenant Context & Role Bar */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        {/* Left: Active College Tenant Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Active Tenant:</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
            <select
              value={currentCollege.id}
              onChange={(e) => {
                const found = colleges.find((c) => c.id === e.target.value);
                if (found) setCurrentCollege(found);
              }}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              {colleges.map((col) => (
                <option key={col.id} value={col.id} className="bg-slate-900 text-white">
                  {col.name} ({col.city})
                </option>
              ))}
            </select>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.2 rounded border border-blue-400/30">
              @{currentCollege.email_domain}
            </span>
          </div>
        </div>

        {/* Center: Instant 1-Click Role Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-medium mr-1 text-[11px] hidden md:inline">
            Switch Persona:
          </span>
          {roles.map((r) => {
            const isActive = currentProfile.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? `${r.color} text-white shadow-sm ring-2 ring-white/20 font-semibold`
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{r.label}</span>
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Right: Demo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetToSeedData}
            title="Reset database to Bhopal AI/ML Hackathon 2026 seed scenario"
            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back Button & CampusConnect Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Global Back Button */}
            {canGoBack && currentView !== 'landing' && (
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 shadow-xs transition group"
                title="Go back to previous screen"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Official Logo & Tenant Identity */}
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left group"
              title="CampusConnect Home"
            >
              <CampusConnectLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-blue-600 transition">
                    CampusConnect
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[160px] sm:max-w-none">
                  {currentCollege.name}
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((tab) => {
              const active = currentView === tab.view;
              return (
                <button
                  key={tab.view}
                  onClick={() => setCurrentView(tab.view)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Pill & Login Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Domain Login</span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <img
                src={
                  currentProfile.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={currentProfile.full_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentProfile.full_name}</p>
                <p className="text-[10px] font-medium text-slate-500 capitalize mt-0.5">
                  {currentProfile.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs">
          {navLinks.map((tab) => {
            const active = currentView === tab.view;
            return (
              <button
                key={tab.view}
                onClick={() => setCurrentView(tab.view)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

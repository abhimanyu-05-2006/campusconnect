import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  QrCode,
  Award,
  Users,
  Building2,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  FileCheck,
  Star
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const LandingPage: React.FC = () => {
  const { currentCollege, setCurrentView, switchRole, events } = useCampus();

  const handleStartRole = (role: any, view: any) => {
    switchRole(role);
    setCurrentView(view);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* CampusConnect Official Logo Badge */}
            <div className="flex justify-center mb-6">
              <CampusConnectLogo size="lg" showText textColor="text-slate-950" />
            </div>

            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Next-Gen Campus OS for Engineering Institutions & Universities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              One Campus.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800">
                Every Event.
              </span>{' '}
              Every Opportunity.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              CampusConnect is the production multi-tenant SaaS uniting university administration,
              student clubs, attendees, and corporate sponsors under strict PostgreSQL Row Level
              Security.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => handleStartRole('student', 'student_dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition transform active:scale-95"
              >
                <span>Launch Student Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStartRole('college_admin', 'college_admin')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Dean / Admin Panel</span>
              </button>
              <button
                onClick={() => handleStartRole('club_organizer', 'organizer')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 transition"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Organizer & QR Scanner</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="mt-10 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl font-black text-slate-900">100% RLS</div>
                <div className="text-xs text-slate-500 font-medium">Tenant Data Isolation</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl font-black text-slate-900">&lt;200ms</div>
                <div className="text-xs text-slate-500 font-medium">QR Attendance Check-in</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl font-black text-slate-900">SHA-256</div>
                <div className="text-xs text-slate-500 font-medium">Cryptographic Credentials</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xl font-black text-emerald-600">₹ INR Ready</div>
                <div className="text-xs text-slate-500 font-medium">Annual University Billing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scenario Highlight */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Mock Scenario Active: {currentCollege.name}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Bhopal AI/ML Hackathon 2026 + Cloud Masterclass
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Experience the full workflow: Dean approves event clearances, GDSC limits capacity,
                  students form squads and claim digital QR passes, and organizers scan badges at the gate
                  with immediate certificate issuance.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentView('student_dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition"
                >
                  View Live Hackathon
                </button>
                <button
                  onClick={() => setCurrentView('organizer')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                >
                  Test QR Gate Scanner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Distinct Roles Architecture */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            Built for Campus Ecosystems
          </h2>
          <p className="text-3xl font-extrabold text-slate-950 mt-1">
            Five Purpose-Built Personas in One Unified Architecture
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Every user group accesses a dedicated portal tailored with explicit access boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Student */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Role 1</div>
              <h4 className="text-base font-bold text-slate-900 mt-1">Students</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                One-click registrations, teammate finder, dynamic QR admission passes, and verifiable digital
                certificates.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('student', 'student_dashboard')}
              className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              Enter Hub &rarr;
            </button>
          </div>

          {/* 2. College Admin */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Role 2</div>
              <h4 className="text-base font-bold text-slate-900 mt-1">College Admin</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Centralized Dean console, event approval/rejection workflows with reasons, and official campus
                notices.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('college_admin', 'college_admin')}
              className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              Dean Desk &rarr;
            </button>
          </div>

          {/* 3. Club Organizer */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Role 3</div>
              <h4 className="text-base font-bold text-slate-900 mt-1">Club Organizers</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Seat limits, multi-step event builder, live QR scanner check-in, CSV exports, and credential
                issuance.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('club_organizer', 'organizer')}
              className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Organizer Desk &rarr;
            </button>
          </div>

          {/* 4. Company Sponsor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Role 4</div>
              <h4 className="text-base font-bold text-slate-900 mt-1">Corporate Sponsors</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Publish verified internships, target high-performing hackathon participants, and fund campus
                events.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('company_sponsor', 'opportunities')}
              className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-800 inline-flex items-center gap-1"
            >
              Sponsor Board &rarr;
            </button>
          </div>

          {/* 5. Platform Super Admin */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Role 5</div>
              <h4 className="text-base font-bold text-slate-900 mt-1">Super Admin</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Global tenant onboarding, INR subscription management, usage metering, and security audit logs.
              </p>
            </div>
            <button
              onClick={() => handleStartRole('platform_super_admin', 'super_admin')}
              className="mt-4 text-xs font-bold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1"
            >
              Platform Ops &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Institutional B2B Pricing in INR */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Transparent Institutional Billing
            </span>
            <h2 className="text-3xl font-black text-slate-950 mt-1">
              Annual Subscription Plans (INR)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              B2B SaaS pricing tailored for engineering colleges, technical autonomous institutes, and state
              universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tier 1: Starter */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Departmental Starter</h3>
                <p className="text-xs text-slate-500 mt-1">For single technical colleges & academies</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-slate-950">₹49,999</span>
                  <span className="text-xs text-slate-500 font-medium"> / year + GST</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Up to 1,500 enrolled students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>50 monthly club events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Basic QR code verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Official notice board</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('super_admin')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition"
              >
                Inspect Plan
              </button>
            </div>

            {/* Tier 2: Growth (Recommended) */}
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                Most Popular for Colleges
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campus Growth</h3>
                <p className="text-xs text-slate-500 mt-1">Autonomous institutions & regional campuses</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-slate-950">₹99,000</span>
                  <span className="text-xs text-slate-500 font-medium"> / year + GST</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-900">Up to 4,000 enrolled students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Unlimited club & cultural fests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Live QR gate check-in & duplicate guard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Cryptographic PDF certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Sponsor internships integration</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('super_admin')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition"
              >
                Inspect Plan
              </button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">University Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">Multi-campus engineering universities (e.g. BITS)</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-slate-950">₹1,89,000</span>
                  <span className="text-xs text-slate-500 font-medium"> / year + GST</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-900">Up to 15,000 enrolled students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Custom domain & white-label branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct ERP / Student Information System sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated SLA & Priority 24/7 technical lead</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('super_admin')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition"
              >
                Inspect Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

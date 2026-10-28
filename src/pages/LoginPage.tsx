import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  CalendarCheck,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { UserRole } from '../types/database.types';
import { resolveTenantFromEmail } from '../middleware';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const LoginPage: React.FC = () => {
  const { switchRole, setCurrentCollege, colleges, profiles, addToast, goBack } = useCampus();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@bits.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [detectedTenant, setDetectedTenant] = useState<string | null>('Bhopal Institute of Technology & Science (bits.edu.in)');

  const roleStreams: {
    role: UserRole;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    defaultEmail: string;
    targetView: string;
    sampleName: string;
    badge: string;
  }[] = [
    {
      role: 'student',
      title: 'Student Portal',
      subtitle: 'Enrolled undergraduate and postgraduate students',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      defaultEmail: 'aarav.sharma@bits.edu.in',
      targetView: 'student_dashboard',
      sampleName: 'Aarav Sharma (CSE)',
      badge: 'Student Pass'
    },
    {
      role: 'college_admin',
      title: 'College Administration',
      subtitle: 'Deans, Principals, HODs, and Examination Authorities',
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      defaultEmail: 'dean.affairs@bits.edu.in',
      targetView: 'college_admin',
      sampleName: 'Dr. Rajesh Verma (Dean)',
      badge: 'Admin Console'
    },
    {
      role: 'club_organizer',
      title: 'Club Organizer Desk',
      subtitle: 'Society Leads, GDSC Officers, and Fest Conveners',
      icon: <CalendarCheck className="w-5 h-5 text-indigo-600" />,
      defaultEmail: 'priya.patel@bits.edu.in',
      targetView: 'organizer',
      sampleName: 'Priya Patel (GDSC Lead)',
      badge: 'Organizer Gate'
    },
    {
      role: 'company_sponsor',
      title: 'Company & Sponsor Partner',
      subtitle: 'Technical recruiters, hackathon partners, and hiring teams',
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
      defaultEmail: 'partnerships@apexailabs.com',
      targetView: 'opportunities',
      sampleName: 'Vikram Malhotra (Apex AI Labs)',
      badge: 'Sponsor Hub'
    },
    {
      role: 'platform_super_admin',
      title: 'CampusConnect Super Admin',
      subtitle: 'Central platform engineering and governance operations',
      icon: <ShieldAlert className="w-5 h-5 text-purple-600" />,
      defaultEmail: 'admin@campusconnect.io',
      targetView: 'super_admin',
      sampleName: 'Central Platform Ops',
      badge: 'Global Master'
    }
  ];

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const resolved = resolveTenantFromEmail(val);
    if (resolved) {
      const col = colleges.find((c) => c.id === resolved.collegeId);
      if (col) {
        setDetectedTenant(`${col.name} (${col.email_domain})`);
        setCurrentCollege(col);
      }
    } else {
      setDetectedTenant(null);
    }
  };

  const handleRoleTabClick = (stream: (typeof roleStreams)[0]) => {
    setSelectedRole(stream.role);
    setEmail(stream.defaultEmail);
    handleEmailChange(stream.defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    addToast('success', 'Domain Login Successful', `Authenticated as ${email}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top Controls: Back Button & Logo */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 shadow-xs transition group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
        <CampusConnectLogo size="sm" showText textColor="text-slate-900" />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Role Selector Streams */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Role-Aware SSO Portal
              </div>
              <CampusConnectLogo size="sm" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Select Access Stream</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Pick your institutional role or simulate different ecosystem personas.
            </p>

            <div className="space-y-2.5">
              {roleStreams.map((stream) => {
                const isSelected = selectedRole === stream.role;
                return (
                  <button
                    key={stream.role}
                    type="button"
                    onClick={() => handleRoleTabClick(stream)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-blue-600/90 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {stream.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{stream.title}</span>
                        <span className="text-[10px] font-mono opacity-80">{stream.badge}</span>
                      </div>
                      <p className="text-[11px] opacity-75 truncate">{stream.sampleName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Protected by PostgreSQL Row-Level Security policies.
          </div>
        </div>

        {/* Right Side: Credentials & Tenant Resolver */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Sign In to Campus</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Mock SSO Active
              </span>
            </div>

            {/* Tenant Resolution Banner */}
            {detectedTenant ? (
              <div className="mb-6 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold">Resolved Institutional Tenant:</span>{' '}
                  <span className="font-bold">{detectedTenant}</span>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>External domain detected. Using cross-college public scope.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    placeholder="yourname@college.edu.in"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try domains like <code className="text-blue-600 font-bold">@bits.edu.in</code> or{' '}
                  <code className="text-blue-600 font-bold">@dtu.ac.in</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password / Campus SSO PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition transform active:scale-98"
                >
                  <span>Authorize & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Mock Auth Provider</span>
            <span className="font-semibold text-blue-600">Single Sign-On Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

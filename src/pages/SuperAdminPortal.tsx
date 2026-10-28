import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  DollarSign,
  Users,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Server,
  ArrowLeft
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const SuperAdminPortal: React.FC = () => {
  const {
    colleges,
    subscriptions,
    auditLogs,
    currentProfile,
    resetToSeedData,
    addToast,
    goBack
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'colleges' | 'subscriptions' | 'audit_logs' | 'database'>('colleges');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white shadow-xs transition group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-400/30">
                <CampusConnectLogo size="xs" />
                <span>CampusConnect Global Multi-Tenant Control Plane</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Platform Operations & Governance
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Overseeing {colleges.length} institutional tenants, Supabase RLS policies, and annual INR subscriptions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetToSeedData}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Reset Demo Database</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-px text-xs font-bold">
            <button
              onClick={() => setActiveTab('colleges')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'colleges'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Tenant Institutions ({colleges.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'subscriptions'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>INR Subscription Metering</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'audit_logs'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Global Audit Logs ({auditLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'database'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>PostgreSQL & RLS Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: TENANTS */}
        {activeTab === 'colleges' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colleges.map((col) => (
                <div
                  key={col.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active Tenant
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        @{col.email_domain}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{col.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{col.legal_name}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">City</span>
                        <span className="font-semibold text-slate-800">{col.city}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">State</span>
                        <span className="font-semibold text-slate-800">{col.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tenant ID</span>
                        <span className="font-mono font-semibold text-slate-700">{col.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">RLS Isolation: Enforced</span>
                    <button
                      onClick={() => addToast('info', 'Tenant Config', `Inspecting ${col.slug} environment`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition"
                    >
                      Manage Tenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-hidden">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Active B2B Institutional Contracts (INR)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">University / College</th>
                      <th className="py-2.5 px-3">SaaS Tier</th>
                      <th className="py-2.5 px-3">Annual Price (INR)</th>
                      <th className="py-2.5 px-3">Student Quota</th>
                      <th className="py-2.5 px-3">Contract Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-bold text-slate-900">{sub.college_name}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono uppercase font-bold text-indigo-700">
                            {sub.tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ₹{Number(sub.annual_price_inr).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {sub.max_active_students.toLocaleString()} Students
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Platform Security Audit Log</h3>
              <span className="text-xs font-mono text-slate-400">Tamper-evident logs</span>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-purple-700">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium">{log.details}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Actor: <strong>{log.actor_name}</strong> ({log.actor_role})
                    </span>
                    <span>Origin: {log.ip_address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE & RLS */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Supabase PostgreSQL Multi-Tenancy Architecture
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Row Level Security policies enforce strict tenant boundaries on every table.
            </p>

            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-slate-300">
{`-- Active RLS Policy on 'events' table
CREATE POLICY "View approved college events"
    ON events FOR SELECT
    USING (
        (status = 'approved' AND (college_id = current_user_college_id() OR current_user_college_id() IS NULL))
        OR (college_id = current_user_college_id() AND current_user_role() IN ('college_admin', 'platform_super_admin'))
        OR (organizer_profile_id = auth.uid())
    );

-- Active RLS Policy on 'registrations' table (Attendance verification)
CREATE POLICY "Organizers view and verify event attendance"
    ON registrations FOR ALL
    USING (
        college_id = current_user_college_id() 
        AND current_user_role() IN ('club_organizer', 'college_admin', 'platform_super_admin')
    );`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

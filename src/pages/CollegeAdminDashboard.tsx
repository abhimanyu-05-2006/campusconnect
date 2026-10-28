import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  Users,
  CalendarCheck,
  TrendingUp,
  FileText,
  ShieldCheck,
  PlusCircle,
  BarChart3,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { NoticePriority } from '../types/database.types';
import { CollegeAnalyticsDashboard } from '../components/CollegeAnalyticsDashboard';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const CollegeAdminDashboard: React.FC = () => {
  const {
    currentCollege,
    currentProfile,
    events,
    handleApproveEvent,
    handleRejectEvent,
    handlePublishNotice,
    registrations,
    departments,
    subscriptions,
    auditLogs,
    goBack
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'approvals' | 'notices' | 'analytics' | 'subscription'>('approvals');

  // Approval modal state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [reviewReason, setReviewReason] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Notice creation state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<NoticePriority>('normal');
  const [noticeDept, setNoticeDept] = useState('');

  // Pending events
  const pendingEvents = events.filter((e) => e.status === 'pending_approval');
  const approvedEvents = events.filter((e) => e.status === 'approved');

  const currentSubscription = subscriptions.find((s) => s.college_id === currentCollege.id) || subscriptions[0];

  const openReviewModal = (eventId: string, action: 'approve' | 'reject') => {
    setSelectedEventId(eventId);
    setApprovalAction(action);
    setReviewReason(
      action === 'approve'
        ? 'Cleared by Dean of Student Affairs: Institutional event aligned with academic calendar and venue clearance.'
        : 'Requires budget & venue security revision prior to reschedule.'
    );
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    if (approvalAction === 'approve') {
      handleApproveEvent(selectedEventId, reviewReason);
    } else {
      handleRejectEvent(selectedEventId, reviewReason);
    }

    setShowReviewModal(false);
    setSelectedEventId(null);
  };

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    handlePublishNotice(noticeTitle, noticeContent, noticePriority, noticeDept || undefined);
    setNoticeTitle('');
    setNoticeContent('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* College Admin Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 shadow-xs transition group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                <CampusConnectLogo size="xs" />
                <span>Dean Office & College Administration Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentCollege.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Administrator: <span className="font-semibold text-slate-800">{currentProfile.full_name}</span> • Dean of Student Affairs
              </p>
            </div>

            {/* Subscription pill */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-sm flex items-center gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  B2B SaaS Plan
                </div>
                <div className="text-sm font-extrabold text-emerald-400">
                  CampusConnect Enterprise
                </div>
                <div className="text-[11px] text-slate-300">
                  ₹{Number(currentSubscription?.annual_price_inr || 189000).toLocaleString('en-IN')}/yr • Active
                </div>
              </div>
              <button
                onClick={() => setActiveTab('subscription')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 transition"
              >
                Billing
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-px text-xs font-bold">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 relative ${
                activeTab === 'approvals'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Event Approvals Queue ({pendingEvents.length})</span>
              {pendingEvents.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'notices'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notice Publishing Desk</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Department Attendance & Engagement</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'subscription'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>College License & Quota</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: EVENT APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pending Student Club Events</h3>
                <p className="text-xs text-slate-500">
                  Review venue availability, budget, safety protocols, and approve with clearance notices.
                </p>
              </div>
            </div>

            {pendingEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900">All student club events reviewed!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  New submissions by GDSC, ACM, and cultural societies will appear in this queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                          Pending Approval
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                          {event.category_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted by <strong>{event.organizer_name}</strong>
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{event.description}</p>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue</span>
                          <span className="font-semibold text-slate-800">{event.venue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                          <span className="font-semibold text-slate-800">
                            {new Date(event.start_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                          <span className="font-semibold text-slate-800">{event.seat_capacity} Seats</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Config</span>
                          <span className="font-semibold text-slate-800">
                            {event.is_team_event ? `Teams ${event.min_team_size}-${event.max_team_size}` : 'Individual'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => openReviewModal(event.id, 'approve')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Clearance</span>
                      </button>
                      <button
                        onClick={() => openReviewModal(event.id, 'reject')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject with Reason</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approved events history */}
            <div className="mt-10">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Approved Active Campus Events ({approvedEvents.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedEvents.map((ev) => (
                  <div key={ev.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Approved
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{ev.short_summary}</p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Seats Claimed: <strong className="text-slate-700">{ev.current_registrations}/{ev.seat_capacity}</strong> • Venue: {ev.venue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTICE PUBLISHER */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Broadcast Campus Notice</h3>
              </div>

              <form onSubmit={handleCreateNoticeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandatory Attendance QR Protocol..."
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Department (Optional)
                  </label>
                  <select
                    value={noticeDept}
                    onChange={(e) => setNoticeDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">All Campus Students (Institution-Wide)</option>
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Broadcast Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'important', 'urgent'] as NoticePriority[]).map((pri) => (
                      <button
                        key={pri}
                        type="button"
                        onClick={() => setNoticePriority(pri)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border ${
                          noticePriority === pri
                            ? pri === 'urgent'
                              ? 'bg-red-600 text-white border-red-600'
                              : pri === 'important'
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {pri}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Notice Content
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Enter official circular details, guidelines, and compliance rules..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Publish & Broadcast Circular
                </button>
              </form>
            </div>

            {/* Audit Trail */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Campus Administrative Audit Trail</h3>
                <span className="text-[11px] text-slate-400 font-mono">Real-time Security Logs</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-emerald-700">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{log.details}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Actor: {log.actor_name}</span>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS (Recharts Registration Trends, Attendance Rates & Peak Hours) */}
        {activeTab === 'analytics' && <CollegeAnalyticsDashboard />}

        {/* TAB 4: SUBSCRIPTION & QUOTA */}
        {activeTab === 'subscription' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Subscription Active
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  CampusConnect University Enterprise
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  License granted to {currentCollege.legal_name || currentCollege.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">
                  ₹{Number(currentSubscription?.annual_price_inr || 189000).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 font-medium">Annual B2B Contract</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Active Enrolled Quota</span>
                <span className="text-base font-bold text-slate-900">
                  3,420 / {currentSubscription?.max_active_students || 8000} Students
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Monthly Event Clearances</span>
                <span className="text-base font-bold text-slate-900">
                  {events.length} / {currentSubscription?.max_monthly_events || 200}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Renews On</span>
                <span className="text-base font-bold text-slate-900">
                  {new Date(currentSubscription?.current_period_end || '').toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Payment Method: Bank NEFT / Institutional Purchase Order Verified
              </span>
              <button
                onClick={() => alert('CampusConnect Enterprise billing receipt generated.')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Download Tax Invoice (GST)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {approvalAction === 'approve' ? 'Approve Event Clearance' : 'Decline Event Submission'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              State the official Dean Office clearance notes or rejection feedback.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Official Administrative Reason / Guidelines
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition ${
                    approvalAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {approvalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

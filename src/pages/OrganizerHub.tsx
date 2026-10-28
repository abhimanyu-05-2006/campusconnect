import React, { useState } from 'react';
import {
  Calendar,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Download,
  Award,
  Users,
  Search,
  PlusCircle,
  Clock,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  ScanLine,
  ArrowLeft
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { Registration } from '../types/database.types';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const OrganizerHub: React.FC = () => {
  const {
    currentCollege,
    currentProfile,
    events,
    registrations,
    handleVerifyToken,
    handleIssueCertificate,
    setCurrentView,
    addToast,
    goBack
  } = useCampus();

  const [selectedEventId, setSelectedEventId] = useState<string>('ev-1');
  const [tokenInput, setTokenInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    isDuplicate?: boolean;
    timestamp?: string;
  } | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventRegistrations = registrations.filter((r) => r.event_id === selectedEventId);
  const checkedInCount = eventRegistrations.filter((r) => r.status === 'checked_in').length;

  const handleVerifySubmit = async (tokenToUse?: string) => {
    const targetToken = tokenToUse || tokenInput;
    if (!targetToken) {
      addToast('error', 'Token Required', 'Please enter or scan a student QR token.');
      return;
    }

    setIsVerifying(true);
    const result = await handleVerifyToken(selectedEventId, targetToken);
    setIsVerifying(false);

    setLastScanResult({
      success: result.success,
      message: result.message,
      isDuplicate: result.isDuplicate,
      timestamp: new Date().toLocaleTimeString()
    });

    if (result.success) {
      setTokenInput('');
    }
  };

  const handleExportCsv = () => {
    if (eventRegistrations.length === 0) {
      addToast('error', 'No Attendees', 'No registrations to export for this event.');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Email', 'Roll Number', 'Team', 'QR Token', 'Status', 'Checked In At'];
    const rows = eventRegistrations.map((r) => [
      r.id,
      r.student_name,
      r.student_email,
      r.roll_number || 'N/A',
      r.team_name || 'Individual',
      r.qr_token,
      r.status,
      r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : 'Not Checked In'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedEvent?.slug || 'event'}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Exported', `Generated attendance report for ${selectedEvent?.title}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Banner */}
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
                <CampusConnectLogo size="xs" />
                <span>Live Attendance & Event Organizer Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentProfile.full_name} • GDSC & Club Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentCollege.name} • Event Gate Verification Station
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('organizer_new_event')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Event Selection & Live Gate Counter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Active Event Gate
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setLastScanResult(null);
              }}
              className="w-full md:w-96 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Claimed</span>
              <span className="text-xl font-black text-slate-900">{eventRegistrations.length}</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Checked In</span>
              <span className="text-xl font-black text-emerald-700">{checkedInCount}</span>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Capacity</span>
              <span className="text-xl font-black text-indigo-700">{selectedEvent?.seat_capacity}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live QR Scanner & Token Input Simulator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Live QR Gate Scanner</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider animate-pulse">
                  Ready to Scan
                </span>
              </div>

              {/* Simulated Camera Viewfinder */}
              <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-indigo-500/40 p-4 flex flex-col items-center justify-center text-center shadow-inner">
                {/* Crosshairs & Scanning laser line */}
                <div className="absolute inset-8 border-2 border-dashed border-indigo-400/50 rounded-xl pointer-events-none"></div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce"></div>

                <QrCode className="w-16 h-16 text-indigo-300 opacity-60 mb-2" />
                <p className="text-xs text-indigo-200 font-medium">Point Camera at Student Pass</p>
                <p className="text-[10px] text-slate-400 mt-1">Enforcing duplicate-check guards</p>
              </div>

              {/* Manual QR Token Verification Input */}
              <div className="mt-6 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Manual Token Verification
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. QR-BHOPAL-HACK-8819"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    onClick={() => handleVerifySubmit()}
                    disabled={isVerifying}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Verify</span>
                  </button>
                </div>

                {/* Quick Test Token Shortcuts */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                    Click Sample Pass to Simulate Scan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {eventRegistrations.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setTokenInput(r.qr_token);
                          handleVerifySubmit(r.qr_token);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition"
                      >
                        {r.student_name}: {r.qr_token.slice(0, 14)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scan Feedback Result Card */}
              {lastScanResult && (
                <div
                  className={`mt-5 p-4 rounded-xl border text-xs flex items-start gap-3 animate-fade-in ${
                    lastScanResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : lastScanResult.isDuplicate
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {lastScanResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold">
                      {lastScanResult.success
                        ? 'Check-In Confirmed'
                        : lastScanResult.isDuplicate
                        ? 'DUPLICATE ENTRY DETECTED'
                        : 'Invalid Token'}
                    </h5>
                    <p className="mt-0.5 leading-relaxed">{lastScanResult.message}</p>
                    <span className="text-[10px] opacity-75 font-mono mt-1 block">
                      Timestamp: {lastScanResult.timestamp}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Registered Attendees Table & Certificate Issuance */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Attendee Roster ({eventRegistrations.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Enrolled students for {selectedEvent?.title}
                </p>
              </div>
            </div>

            {eventRegistrations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No students registered yet for this event.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Roll No.</th>
                      <th className="py-2.5 px-3">Gate Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {eventRegistrations.map((reg) => {
                      const isCheckedIn = reg.status === 'checked_in';
                      return (
                        <tr key={reg.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{reg.student_name}</div>
                            <div className="text-[11px] text-slate-500">{reg.student_email}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700">
                            {reg.roll_number || '2023CSB042'}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isCheckedIn
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            {isCheckedIn ? (
                              <button
                                onClick={() => handleIssueCertificate(reg.id, 'Participation')}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-300 transition"
                              >
                                Issue Certificate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifySubmit(reg.qr_token)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg border border-blue-200 transition"
                              >
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

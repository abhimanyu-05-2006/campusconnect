import React, { useEffect } from 'react';
import { X, QrCode, CheckCircle2, Clock, MapPin, Calendar, ShieldCheck, Download, Share2, ArrowLeft } from 'lucide-react';
import { Registration } from '../types/database.types';
import { useCampus } from '../context/CampusContext';
import { CampusConnectLogo } from './CampusConnectLogo';

interface TicketPassModalProps {
  registration: Registration;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ registration, onClose }) => {
  const { currentCollege, addToast } = useCampus();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(registration.qr_token);
    addToast('info', 'Token Copied', `${registration.qr_token} copied to clipboard for scanner simulation.`);
  };

  const isCheckedIn = registration.status === 'checked_in';

  // Deterministic SVG QR pattern generator
  const renderQrGrid = (token: string) => {
    const size = 17;
    const cells: boolean[] = [];
    let seed = 0;
    for (let i = 0; i < token.length; i++) {
      seed = (seed * 31 + token.charCodeAt(i)) % 999999;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Corner markers (Finder patterns)
        const inTopLeft = r < 5 && c < 5;
        const inTopRight = r < 5 && c >= size - 5;
        const inBottomLeft = r >= size - 5 && c < 5;

        if (inTopLeft) {
          cells.push(r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2));
        } else if (inTopRight) {
          const colOff = c - (size - 5);
          cells.push(r === 0 || r === 4 || colOff === 0 || colOff === 4 || (r === 2 && colOff === 2));
        } else if (inBottomLeft) {
          const rowOff = r - (size - 5);
          cells.push(rowOff === 0 || rowOff === 4 || c === 0 || c === 4 || (rowOff === 2 && c === 2));
        } else {
          // pseudo random fill based on token hash
          const pseudo = Math.sin(seed + r * size + c) * 10000;
          cells.push(pseudo - Math.floor(pseudo) > 0.45);
        }
      }
    }

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full text-slate-900 fill-current">
        {cells.map((filled, idx) => {
          if (!filled) return null;
          const r = Math.floor(idx / size);
          const c = idx % size;
          return <rect key={idx} x={c} y={r} width="1" height="1" rx="0.15" />;
        })}
      </svg>
    );
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 text-center relative">
          {/* Top-Left Back Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-xs transition shadow-xs group"
            title="Go back / Wapas"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CampusConnectLogo size="sm" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
              Verified Campus Pass
            </div>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{currentCollege.name}</h3>
          <p className="text-xs text-blue-100 font-medium">Digital Access & Attendance Credentials</p>
        </div>

        {/* Event Card Body */}
        <div className="p-6">
          <div className="text-center mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Checked In at Venue
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Active Access Token
                </>
              )}
            </span>
            <h4 className="text-xl font-bold text-slate-900 mt-2 line-clamp-2">
              {registration.event_title}
            </h4>
          </div>

          {/* QR Code Container */}
          <div className="my-5 flex flex-col items-center">
            <div className="p-4 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl shadow-inner relative group">
              <div className="w-48 h-48 p-2 bg-white rounded-xl shadow-sm flex items-center justify-center">
                {renderQrGrid(registration.qr_token)}
              </div>
              <div className="absolute inset-x-0 bottom-2 text-center text-[10px] text-slate-400 font-mono tracking-widest">
                CAMPUS-GATE-VERIFIED
              </div>
            </div>

            {/* Token String Box */}
            <div className="mt-3 flex items-center gap-2">
              <code className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {registration.qr_token}
              </code>
              <button
                onClick={handleCopyToken}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
                title="Copy token to test scanner"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Attendee:</span>
              <span className="font-bold text-slate-900">{registration.student_name}</span>
            </div>
            {registration.roll_number && (
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Roll / Student ID:</span>
                <span className="font-mono font-semibold text-slate-800">{registration.roll_number}</span>
              </div>
            )}
            {registration.team_name && (
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Hackathon Team:</span>
                <span className="font-bold text-indigo-700">{registration.team_name}</span>
              </div>
            )}
            <div className="flex items-start gap-2 pt-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>{registration.event_venue}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{new Date(registration.event_start_time).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Passes</span>
            </button>
            <div className="w-full sm:flex-1 flex items-center gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

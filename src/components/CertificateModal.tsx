import React, { useEffect } from 'react';
import { X, Award, CheckCircle, ShieldCheck, Printer, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { Certificate } from '../types/database.types';
import { useCampus } from '../context/CampusContext';
import { CampusConnectLogo } from './CampusConnectLogo';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { currentCollege, addToast } = useCampus();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.verification_hash);
    addToast('info', 'Hash Copied', 'Cryptographic verification hash copied.');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition mr-1"
              title="Go back / Wapas"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <CampusConnectLogo size="xs" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Verified Credential • CampusConnect Protocol</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Frame (Formal parchment & gold aesthetic) */}
        <div className="p-8 bg-[#fdfbf7] border-8 border-double border-amber-900/20 text-center relative selection:bg-amber-100">
          {/* Subtle Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Award className="w-96 h-96 text-slate-900" />
          </div>

          {/* College Header */}
          <div className="mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-600 to-indigo-700 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-amber-700 font-serif font-black text-xl">
                B
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-black text-slate-900 tracking-wide uppercase">
              {certificate.college_name || currentCollege.name}
            </h2>
            <p className="text-xs uppercase tracking-widest text-amber-800/80 font-semibold mt-1">
              Office of Academic Affairs & Student Societies
            </p>
          </div>

          {/* Certificate Headline */}
          <div className="my-6">
            <p className="text-sm font-serif italic text-slate-600">This is to officially certify that</p>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 my-2 underline decoration-amber-400/60 underline-offset-8">
              {certificate.recipient_name}
            </h3>
            <p className="text-sm font-serif text-slate-600 max-w-lg mx-auto leading-relaxed mt-3">
              has successfully participated and earned the distinction of{' '}
              <span className="font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                {certificate.achievement_type}
              </span>{' '}
              in
            </p>
            <h4 className="text-lg md:text-xl font-bold text-slate-900 mt-2 font-serif">
              "{certificate.event_title}"
            </h4>
          </div>

          {/* Signatures & Seal Grid */}
          <div className="mt-8 pt-6 border-t border-amber-200/60 grid grid-cols-3 gap-4 items-end text-xs">
            {/* Signature 1 */}
            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm mb-1 transform -rotate-3 font-mono">
                Priya Patel
              </div>
              <div className="w-28 mx-auto border-b border-slate-400 mb-1"></div>
              <p className="font-medium text-slate-600 text-[10px]">Lead Event Organizer</p>
              <p className="text-slate-400 text-[9px]">Student Society</p>
            </div>

            {/* Official Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-50 shadow-inner flex flex-col items-center justify-center p-1 relative">
                <div className="w-12 h-12 rounded-full border border-dashed border-amber-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-amber-800 tracking-wider mt-1 uppercase">
                Official Campus Seal
              </span>
            </div>

            {/* Signature 2 */}
            <div className="text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm mb-1 transform -rotate-1 font-mono">
                Dr. Rajesh Verma
              </div>
              <div className="w-28 mx-auto border-b border-slate-400 mb-1"></div>
              <p className="font-medium text-slate-600 text-[10px]">Dean of Student Affairs</p>
              <p className="text-slate-400 text-[9px]">{currentCollege.name}</p>
            </div>
          </div>

          {/* Cryptographic Verification Footer */}
          <div className="mt-6 pt-3 border-t border-amber-200/40 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              <span className="text-slate-400">CERT NO:</span>{' '}
              <span className="font-bold text-slate-700">{certificate.certificate_number}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate max-w-xs">
              <span className="text-slate-400">HASH:</span>
              <span className="truncate">{certificate.verification_hash}</span>
              <button
                onClick={handleCopyHash}
                className="text-amber-800 hover:text-amber-950 font-sans p-0.5"
                title="Copy verification hash"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div>
              <span className="text-slate-400">ISSUED:</span>{' '}
              {new Date(certificate.issued_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Publicly verifiable with CampusConnect verification protocol</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

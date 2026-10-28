import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const CampusConnectLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textColor = 'text-slate-900'
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const imageSrc = '/assets/aistudio/Screenshot_2026-10-27_022307_c50cfd6d.png';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeClasses[size]} shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-xs border border-slate-200/70 p-0.5`}>
        {!imageError ? (
          <img
            src={imageSrc}
            alt="CampusConnect Logo"
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-fidelity Vector SVG replica of the CampusConnect emblem */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Navy Orbital Arc */}
            <path
              d="M 72 20 A 42 42 0 1 0 74 80"
              stroke="#1e1b4b"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Top Teal Orbital Node */}
            <circle cx="28" cy="24" r="8" fill="#0d9488" stroke="#1e1b4b" strokeWidth="4" />
            {/* Bottom Coral Orbital Node */}
            <circle cx="74" cy="78" r="8.5" fill="#f43f5e" stroke="#1e1b4b" strokeWidth="4.5" />
            {/* Inner Coral C Arc */}
            <path
              d="M 66 30 A 26 26 0 1 0 64 70"
              stroke="#f43f5e"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Central Yellow Core Node */}
            <circle
              cx="50"
              cy="50"
              r="7.5"
              fill="#fef08a"
              stroke="#1e1b4b"
              strokeWidth="4.5"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-base sm:text-lg ${textColor}`}>
              CampusConnect
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              SaaS
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            One Campus. Every Event.
          </span>
        </div>
      )}
    </div>
  );
};

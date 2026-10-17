import React from 'react';

export type LogoStyleId = 'official' | 'cyber-shield' | 'bank-vault' | 'golden-crest' | 'quantum-hex' | 'sentinel-badge' | 'custom';

interface ScamShieldLogoProps {
  styleId?: LogoStyleId;
  customImageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFullBrand?: boolean;
}

export const ScamShieldLogo: React.FC<ScamShieldLogoProps> = ({
  styleId = 'official',
  customImageUrl,
  className = '',
  size = 'md',
  showFullBrand = false,
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  }[size];

  if (styleId === 'custom' && customImageUrl) {
    return (
      <div className={`${sizeClasses} rounded-xl overflow-hidden shadow-md bg-white border border-slate-200 flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={customImageUrl}
          alt="Custom ScamShield Logo"
          className="w-full h-full object-contain p-1"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // If user requests full brand (including the typography, tagline, and sub-tagline)
  if (showFullBrand) {
    return (
      <div className={`flex flex-col items-center justify-center max-w-sm w-full select-none ${className}`}>
        <img
          src="/scamshield-logo.svg"
          alt="ScamShield – Stay Aware | Stay Safe"
          className="w-full h-auto drop-shadow-md"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Style 'official' (The user's exact uploaded logo emblem: Blue Shield, Padlock, Cyan-Emerald Orbit, 4 Red Warning Badges)
  if (styleId === 'official' || !styleId) {
    return (
      <div className={`${sizeClasses} shrink-0 relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 580 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <linearGradient id="offShieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="40%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#05267A" />
            </linearGradient>

            <linearGradient id="offShieldBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0084FF" />
              <stop offset="45%" stopColor="#0052CC" />
              <stop offset="100%" stopColor="#062265" />
            </linearGradient>

            <linearGradient id="offShieldLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="offOrbit" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#0088FF" />
              <stop offset="40%" stopColor="#00C9FF" />
              <stop offset="75%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            <linearGradient id="offRedRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>

            <filter id="offShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Orbit Back Arc */}
          <path
            d="M 175 280 C 130 250 160 200 210 175"
            fill="none"
            stroke="url(#offOrbit)"
            strokeWidth="15"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Main Shield Outer Layer */}
          <path
            d="M 290 40 
               C 335 40 400 62 415 120 
               C 415 220 290 305 290 305 
               C 290 305 165 220 165 120 
               C 180 62 245 40 290 40 Z"
            fill="url(#offShieldRim)"
            filter="url(#offShadow)"
          />

          {/* Main Shield Inner Body */}
          <path
            d="M 290 54 
               C 328 54 384 74 397 122 
               C 397 210 290 286 290 286 
               C 290 286 183 210 183 122 
               C 196 74 252 54 290 54 Z"
            fill="url(#offShieldBody)"
          />

          {/* Left Facet Highlight */}
          <path
            d="M 290 54 
               C 252 54 196 74 183 122 
               C 183 210 290 286 290 286 
               L 290 54 Z"
            fill="url(#offShieldLight)"
          />

          {/* Inner Accent Line */}
          <path
            d="M 290 70 
               C 320 70 368 88 378 126 
               C 378 198 290 262 290 262 
               C 290 262 202 198 202 126 
               C 212 88 260 70 290 70 Z"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="3.5"
            opacity="0.6"
          />

          {/* Center Padlock */}
          <g transform="translate(290, 168)">
            {/* Shackle */}
            <path
              d="M -26 -12 L -26 -34 C -26 -52 26 -52 26 -34 L 26 -12"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Body */}
            <rect x="-40" y="-14" width="80" height="66" rx="14" fill="#FFFFFF" />
            {/* Keyhole */}
            <circle cx="0" cy="12" r="7.5" fill="#0052CC" />
            <path d="M -3.5 14 L 3.5 14 L 5.5 32 L -5.5 32 Z" fill="#0052CC" />
          </g>

          {/* Cyan to Emerald Orbit Ribbon */}
          <path
            d="M 135 270 
               C 160 308 240 305 335 248 
               C 415 200 468 135 490 110 
               C 500 100 470 130 410 182 
               C 320 252 210 288 135 270 Z"
            fill="url(#offOrbit)"
            filter="url(#offShadow)"
          />

          {/* Badges */}
          {/* 1. Phone OTP Badge (Top Left) */}
          <g transform="translate(135, 105)" filter="url(#offShadow)">
            <circle cx="0" cy="0" r="42" fill="#0A1E4A" />
            <rect x="-18" y="-27" width="36" height="54" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <rect x="-14" y="-19" width="28" height="36" rx="3" fill="#F8FAFC" />
            <text x="0" y="-6" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="9" fill="#0F172A" textAnchor="middle">OTP</text>
            <text x="0" y="6" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12" fill="#EF4444" textAnchor="middle">***</text>
            <circle cx="0" cy="0" r="40" fill="none" stroke="url(#offRedRing)" strokeWidth="7" />
            <line x1="-28" y1="-28" x2="28" y2="28" stroke="url(#offRedRing)" strokeWidth="7" strokeLinecap="round" />
          </g>

          {/* 2. Email Badge (Bottom Left) */}
          <g transform="translate(95, 230)" filter="url(#offShadow)">
            <circle cx="0" cy="0" r="40" fill="#0A1E4A" />
            <rect x="-20" y="-14" width="40" height="28" rx="4" fill="#FFFFFF" />
            <path d="M -20 -14 L 0 3 L 20 -14" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="url(#offRedRing)" strokeWidth="6.5" />
            <line x1="-26" y1="-26" x2="26" y2="26" stroke="url(#offRedRing)" strokeWidth="6.5" strokeLinecap="round" />
          </g>

          {/* 3. Link Badge (Top Right) */}
          <g transform="translate(425, 90)" filter="url(#offShadow)">
            <circle cx="0" cy="0" r="40" fill="#0A1E4A" />
            <g transform="rotate(45)">
              <rect x="-14" y="-7" width="28" height="14" rx="7" fill="none" stroke="#FFFFFF" strokeWidth="4.5" />
              <rect x="-4" y="-7" width="28" height="14" rx="7" fill="none" stroke="#FFFFFF" strokeWidth="4.5" />
            </g>
            <circle cx="0" cy="0" r="38" fill="none" stroke="url(#offRedRing)" strokeWidth="6.5" />
            <line x1="-26" y1="-26" x2="26" y2="26" stroke="url(#offRedRing)" strokeWidth="6.5" strokeLinecap="round" />
          </g>

          {/* 4. Hacker Badge (Bottom Right) */}
          <g transform="translate(485, 240)" filter="url(#offShadow)">
            <circle cx="0" cy="0" r="40" fill="#0A1E4A" />
            <path d="M 0 -22 C -15 -22 -22 -6 -22 8 L 22 8 C 22 -6 15 -22 0 -22 Z" fill="#F8FAFC" />
            <path d="M 0 -17 C -10 -17 -15 -5 -15 6 L 15 6 C 15 -5 10 -17 0 -17 Z" fill="#0F172A" />
            <path d="M -8 -1 L -2 -1 M 2 -1 L 8 -1" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="url(#offRedRing)" strokeWidth="6.5" />
            <line x1="-26" y1="-26" x2="26" y2="26" stroke="url(#offRedRing)" strokeWidth="6.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Fallback preset options
  switch (styleId) {
    case 'bank-vault':
      return (
        <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-2 shadow-lg shadow-blue-900/30 border border-blue-500/30 flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M50 8 L85 24 L85 58 Q85 82 50 94 Q15 82 15 58 L15 24 Z" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="3.5" />
            <path d="M28 36 L50 24 L72 36 Z" fill="#93C5FD" stroke="#DBEAFE" strokeWidth="1.5" />
            <rect x="26" y="36" width="48" height="4" rx="1" fill="#DBEAFE" />
            <rect x="32" y="42" width="6" height="22" rx="1" fill="#BFDBFE" />
            <rect x="42" y="42" width="6" height="22" rx="1" fill="#93C5FD" />
            <rect x="52" y="42" width="6" height="22" rx="1" fill="#93C5FD" />
            <rect x="62" y="42" width="6" height="22" rx="1" fill="#BFDBFE" />
            <rect x="26" y="64" width="48" height="5" rx="1.5" fill="#DBEAFE" />
            <circle cx="50" cy="54" r="7" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2" />
            <path d="M47 54 L53 54 L53 58 L47 58 Z" fill="#60A5FA" />
          </svg>
        </div>
      );

    case 'golden-crest':
      return (
        <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-2 shadow-lg shadow-amber-900/30 border border-amber-500/40 flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M50 6 L86 20 L86 54 C86 78 50 94 50 94 C50 94 14 78 14 54 L14 20 Z" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
            <path d="M50 30 C56 30 60 34 60 40 L60 46 L62 46 C64.2 46 66 47.8 66 50 L66 68 C66 70.2 64.2 72 62 72 L38 72 C35.8 72 34 70.2 34 68 L34 50 C34 47.8 35.8 46 38 46 L40 46 L40 40 C40 34 44 30 50 30 Z M44 46 L56 46 L56 40 C56 36.5 53.5 34 50 34 C46.5 34 44 36.5 44 40 L44 46 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="50" cy="56" r="3" fill="#78350F" />
            <path d="M48.5 57 L51.5 57 L52.5 64 L47.5 64 Z" fill="#78350F" />
          </svg>
        </div>
      );

    case 'quantum-hex':
      return (
        <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-900 p-2 shadow-lg shadow-cyan-900/30 border border-cyan-500/40 flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#082F49" stroke="#22D3EE" strokeWidth="3.5" />
            <circle cx="50" cy="55" r="16" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
            <path d="M45 52 C45 48 47 45 50 45 C53 45 55 48 55 52 L55 54 L45 54 Z" stroke="#A5F3FC" strokeWidth="2.5" fill="none" />
            <rect x="42" y="54" width="16" height="12" rx="2.5" fill="#22D3EE" />
          </svg>
        </div>
      );

    case 'cyber-shield':
    default:
      return (
        <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-950 p-2 shadow-lg shadow-blue-500/30 border border-blue-400/40 flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M50 6 L86 18 L86 52 C86 76 50 94 50 94 C50 94 14 76 14 52 L14 18 Z" fill="#1E40AF" stroke="#93C5FD" strokeWidth="3.5" />
            <path d="M40 44 C40 37 44 32 50 32 C56 32 60 37 60 44 L60 48 L40 48 Z" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <rect x="34" y="48" width="32" height="26" rx="4" fill="#FFFFFF" />
            <circle cx="50" cy="58" r="3.5" fill="#1D4ED8" />
          </svg>
        </div>
      );
  }
};

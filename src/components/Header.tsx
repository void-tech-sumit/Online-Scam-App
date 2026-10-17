import React from 'react';
import { PhoneCall, UserCheck, AlertTriangle, Menu, X, Info, Palette, ShieldCheck } from 'lucide-react';
import { EmployeeUser } from '../types';
import { LogoStyleId, ScamShieldLogo } from './ScamShieldLogo';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  employeeUser: EmployeeUser | null;
  onOpenProjectGuide: () => void;
  logoStyle: LogoStyleId;
  customLogoUrl?: string;
  onOpenLogoSelector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  employeeUser,
  onOpenProjectGuide,
  logoStyle,
  customLogoUrl,
  onOpenLogoSelector,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Core navigation items for the desktop navigation bar
  const primaryNavItems = [
    { id: 'home', label: 'Home Dashboard' },
    { id: 'check-message', label: 'Check Message' },
    { id: 'check-link', label: 'Check Link' },
    { id: 'safety-tips', label: 'Safety Tips' },
    { id: 'report-scam', label: 'Report Scam' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Advisory Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            <span className="truncate text-slate-200">
              <strong>National Cyber Vigilance Network</strong>
              <span className="hidden sm:inline text-slate-400 font-normal"> · Banking Scam Prevention & 1930 Coordination</span>
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-slate-300 text-[11px] sm:text-xs">
            <button
              onClick={onOpenProjectGuide}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-blue-300 font-medium"
              title="Open System Architecture & Security Specifications"
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">System Specs</span>
              <span className="sm:hidden">Specs</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenLogoSelector}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-cyan-300"
              title="Click to customize or change logo"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Customize Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2.5 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <ScamShieldLogo
              styleId={logoStyle}
              customImageUrl={customLogoUrl}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-serif">ScamShield</span>
                <span className="text-[10px] sm:text-xs bg-blue-900/70 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded font-mono whitespace-nowrap">
                  Institutional Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight hidden sm:block">
                Online Scam Protection System · Bank & Citizen Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Shown on lg and above for ample breathing room) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {primaryNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Action Buttons (Employee Desk & Emergency Helpline) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {employeeUser ? (
              <div
                onClick={() => onSelectTab('employee')}
                className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-emerald-200 text-xs cursor-pointer hover:bg-emerald-900/60 transition-colors"
                title="Click to open Employee Desk"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="font-semibold text-emerald-100 truncate max-w-[110px]">{employeeUser.name}</div>
                  <div className="text-[10px] text-emerald-300">Bank Fraud Desk</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onSelectTab('employee')}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  currentTab === 'employee'
                    ? 'bg-slate-700 text-white border-blue-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Bank Staff Login</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('emergency')}
              className={`flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm cursor-pointer transition-colors whitespace-nowrap ${
                currentTab === 'emergency'
                  ? 'bg-rose-500 ring-2 ring-rose-300'
                  : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>Helpline 1930</span>
            </button>
          </div>

          {/* Mobile & Tablet Control Buttons (Below lg) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTab('emergency')}
              className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              title="National Emergency 1930"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">1930</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Public Defense Tools
            </div>
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Institutional & Emergency
            </div>
            <button
              onClick={() => handleNavClick('employee')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                currentTab === 'employee'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{employeeUser ? `Employee Desk (${employeeUser.name})` : 'Bank Staff Login'}</span>
            </button>
            <button
              onClick={() => handleNavClick('emergency')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                currentTab === 'emergency'
                  ? 'bg-rose-700 text-white font-semibold'
                  : 'text-rose-300 hover:bg-rose-950/60'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>National Cyber Helpline 1930</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-xs">
            <button
              onClick={() => {
                onOpenLogoSelector();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-cyan-300 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Change or Upload App Logo</span>
            </button>
            <button
              onClick={() => {
                onOpenProjectGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-blue-300 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 text-blue-400" />
              <span>System Specs & Architecture</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

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

  const navItems = [
    { id: 'home', label: 'Home Dashboard' },
    { id: 'check-message', label: 'Check Message' },
    { id: 'check-link', label: 'Check Link' },
    { id: 'safety-tips', label: 'Safety Tips' },
    { id: 'report-scam', label: 'Report Scam' },
    { id: 'employee', label: employeeUser ? 'Employee Desk' : 'Bank Employee' },
    { id: 'emergency', label: 'Emergency 1930' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Advisory Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🛡️ <strong>National Cyber Vigilance Network</strong> · Banking Scam Prevention & 1930 Helpline Coordination</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={onOpenProjectGuide}
              className="hover:text-white underline decoration-blue-400 underline-offset-2 flex items-center gap-1.5 cursor-pointer transition-colors text-blue-300 font-medium"
              title="Open System Architecture & Security Specifications"
            >
              <Info className="w-3.5 h-3.5" />
              <span>System Specs & Architecture</span>
            </button>
            <span className="hidden sm:inline text-slate-600">·</span>
            <button
              onClick={onOpenLogoSelector}
              className="hover:text-white underline decoration-cyan-400 underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors text-cyan-300"
              title="Click to customize or change logo"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customize Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <ScamShieldLogo
                styleId={logoStyle}
                customImageUrl={customLogoUrl}
                size="md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-white font-serif">ScamShield</span>
                  <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded font-mono">
                    Institutional Edition
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans tracking-wide">
                  Online Scam Protection System · Bank Employee & Customer Portal
                </p>
              </div>
            </div>

            {/* Quick Change Logo Button */}
            <button
              onClick={onOpenLogoSelector}
              className="hidden lg:flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700/80 transition-colors cursor-pointer"
              title="Change or upload custom logo"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>Change Logo</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
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

          {/* Right Header Badges */}
          <div className="hidden sm:flex items-center gap-3">
            {employeeUser ? (
              <div
                onClick={() => onSelectTab('employee')}
                className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-emerald-200 text-xs cursor-pointer hover:bg-emerald-900/60 transition-colors"
                title="Click to open Employee Desk"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="font-semibold text-emerald-100">{employeeUser.name}</div>
                  <div className="text-[10px] text-emerald-300">Bank Fraud Desk</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onSelectTab('employee')}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 cursor-pointer transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Bank Staff Login</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('emergency')}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Helpline 1930</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('emergency')}
              className="bg-rose-600 text-white p-2 rounded-lg text-xs"
              title="Emergency 1930"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLogoSelector();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-xs text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Change or Upload Logo</span>
            </button>
            <button
              onClick={() => {
                onOpenProjectGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-xs text-blue-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
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

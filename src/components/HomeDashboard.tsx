import React, { useState } from 'react';
import {
  ShieldAlert,
  MessageSquareWarning,
  Link2,
  BookOpen,
  FileText,
  AlertTriangle,
  ChevronRight,
  Clock,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Eye,
  Info,
  Palette,
  Users,
} from 'lucide-react';
import { ScamAlert } from '../types';
import { LogoStyleId, ScamShieldLogo } from './ScamShieldLogo';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  alerts: ScamAlert[];
  logoStyle?: LogoStyleId;
  customLogoUrl?: string;
  onOpenLogoSelector?: () => void;
  onOpenProjectGuide?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  alerts,
  logoStyle = 'official',
  customLogoUrl,
  onOpenLogoSelector,
  onOpenProjectGuide,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<ScamAlert | null>(null);
  const [quickQuizAnswer, setQuickQuizAnswer] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-300 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span>National Banking Cyber Safety Network · Public & Institutional Vigilance</span>
              </div>

              {onOpenLogoSelector && (
                <button
                  onClick={onOpenLogoSelector}
                  className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-all cursor-pointer backdrop-blur-xs"
                  title="Change or upload app logo"
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize Logo</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div
                onClick={onOpenLogoSelector}
                className="cursor-pointer group relative shrink-0"
                title="Click to change logo"
              >
                <ScamShieldLogo
                  styleId={logoStyle}
                  customImageUrl={customLogoUrl}
                  size="md"
                  className="sm:w-16 sm:h-16 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif leading-tight">
                  ScamShield – Online Scam Protection System
                </h1>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              An institutional cyber fraud prevention platform providing real-time heuristic analysis for suspicious SMS messages, deceptive banking links, and centralized vigilance reporting for account holders and bank officers.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 pt-1">
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
                ✓ Heuristic SMS & Message Scanner
              </span>
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
                ✓ Phishing URL & Domain Inspector
              </span>
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
                ✓ Bank Employee Vigilance Console
              </span>
              <span className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
                ✓ 24x7 1930 Cybercrime Coordination
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('check-message')}
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-950 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:shadow-lg"
              >
                <MessageSquareWarning className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Check Suspicious Message</span>
              </button>
              <button
                onClick={() => onNavigate('check-link')}
                className="w-full sm:w-auto bg-blue-700/80 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl border border-blue-400/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Link2 className="w-4 h-4 text-blue-200 shrink-0" />
                <span>Scan Suspicious Link</span>
              </button>
              <button
                onClick={() => onNavigate('report-scam')}
                className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900 text-blue-100 font-medium px-5 py-2.5 rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Report a Scam</span>
              </button>
            </div>
          </div>

          {/* Right Logo Display */}
          <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
            <div className="w-56 h-56 xl:w-64 xl:h-64 flex items-center justify-center p-4 bg-white/5 rounded-2xl backdrop-blur-xs border border-white/10 shadow-2xl">
              <img
                src="/scamshield-logo.svg"
                alt="ScamShield Logo"
                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Security Architecture Card */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Integrated Defense Framework: Customer Protection & Bank Officer Vigilance
              </h2>
              <p className="text-xs text-slate-500">
                Dual-role cyber defense uniting self-service citizen diagnostics with bank officer escalation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Defense Network
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Customer Portal Defense:</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Provides instant, rule-based heuristic checking for unsolicited SMS, deceptive links, APK downloads, and payment traps, paired with an emergency 1-click dial directory for 24+ major banks.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Bank Employee Vigilance Desk:</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Equips banking security personnel with a secure incident management queue (with customer PII masked for privacy), allowing officers to review case logs, assign investigative statuses, and broadcast public advisories.
            </p>
          </div>
        </div>
      </section>

      {/* Golden Hour Fraud Emergency Callout */}
      <section className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm text-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">The "Golden Hour" of Financial Cyber Fraud</h2>
                <span className="text-xs font-semibold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">Crucial Step</span>
              </div>
              <p className="text-sm text-slate-700 mt-1">
                If you accidentally shared an OTP or money was debited without consent, call <strong>1930</strong> within 2 hours.
                Indian cyber police can immediately freeze the scammer's bank account before funds are withdrawn.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('emergency')}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Guide & Numbers</span>
          </button>
        </div>
      </section>

      {/* 4 Primary Navigation Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Fraud Protection Tools</h2>
            <p className="text-xs text-slate-500">Free, instant security checks for everyday digital transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Check Message */}
          <div
            onClick={() => onNavigate('check-message')}
            className="group bg-white hover:bg-blue-50/50 p-6 rounded-xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">
                Check Message
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Paste any SMS, WhatsApp alert, or email. Scans for urgency pressure, OTP traps, and fake rewards.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Test a message</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Check Link */}
          <div
            onClick={() => onNavigate('check-link')}
            className="group bg-white hover:bg-indigo-50/50 p-6 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-700 transition-colors">
                Check Link
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Verify suspicious URLs, shortened links, misspelled bank domains, and fake KYC update portals.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span>Inspect link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Safety Tips */}
          <div
            onClick={() => onNavigate('safety-tips')}
            className="group bg-white hover:bg-emerald-50/50 p-6 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                Safety Tips & Quiz
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Learn how to spot fake customer care numbers, protect UPI PINs, and test your fraud radar with quizzes.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>Read safety guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Report Scam */}
          <div
            onClick={() => onNavigate('report-scam')}
            className="group bg-white hover:bg-rose-50/50 p-6 rounded-xl border border-slate-200 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-rose-700 transition-colors">
                Report Scam
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Submit details of suspicious calls or SMS. Receives an official case reference and employee guidance.
              </p>
            </div>
            <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <span>File a report</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Scam Alerts Ticker & Advisory List */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 text-red-700 rounded-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Active Scam Alerts & Consumer Advisories</h2>
              <p className="text-xs text-slate-500">Live bulletins issued by Bank Vigilance and Cyber Coordination Cells</p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium">Updated every 12 hours</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-blue-900">{alert.category}</span>
                  <span>{alert.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{alert.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{alert.summary}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  Source: {alert.reportedBy}
                </span>
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Section: Bank Officer Wisdom + Interactive Daily Quiz */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Bank Employee Guidance */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-6 shadow-sm border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Official Bank Vigilance Advice</span>
          </div>

          <h3 className="text-lg font-bold text-white font-serif">
            3 Things a Genuine Bank Will NEVER Ask You To Do
          </h3>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
              <span><strong>Never ask for OTP or PIN:</strong> Bank computer servers do not need you to read your 6-digit OTP or debit card PIN over the phone or SMS.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
              <span><strong>Never send APK download files:</strong> Banks will never send you direct download links for apps like `.apk` via WhatsApp or SMS.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
              <span><strong>Never ask you to install AnyDesk or TeamViewer:</strong> Bank officers never ask customers to download screen-sharing tools to process refunds.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Are you a bank staff member?</span>
            <button
              onClick={() => onNavigate('employee')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Access Employee Portal
            </button>
          </div>
        </div>

        {/* Column 2: Interactive Quick Quiz Widget */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-blue-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Daily Awareness Check</span>
              </span>
              <span>Quick Test</span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Scenario: Someone says "Scan this QR code and type your UPI PIN to receive ₹5,000 into your account." What will happen?
            </h3>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setQuickQuizAnswer('wrong')}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                  quickQuizAnswer === 'wrong'
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                A) I will receive ₹5,000 in my account because the QR code had the money.
              </button>

              <button
                onClick={() => setQuickQuizAnswer('correct')}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                  quickQuizAnswer === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                B) ₹5,000 will be DEDUCTED from my account! You NEVER enter a PIN to receive money.
              </button>
            </div>

            {quickQuizAnswer && (
              <div
                className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                  quickQuizAnswer === 'correct'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {quickQuizAnswer === 'correct' ? (
                  <p>
                    <strong>Correct!</strong> A UPI PIN is exclusively used for authorizing payments. Receiving money happens automatically without touching your PIN or scanning any code.
                  </p>
                ) : (
                  <p>
                    <strong>Caution! That is false!</strong> Entering a UPI PIN ALWAYS transfers money OUT of your bank account. This is the #1 scam technique on OLX and marketplaces.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Want more practice?</span>
            <button
              onClick={() => onNavigate('safety-tips')}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Take Full 4-Question Quiz →
            </button>
          </div>
        </div>
      </section>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedAlert.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">{selectedAlert.title}</h3>
                <p className="text-xs text-slate-500">Issued: {selectedAlert.date} · Source: {selectedAlert.reportedBy}</p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Detailed Modus Operandi (How the scam works):</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedAlert.fullDetails}
                </p>
              </div>

              <div className="bg-amber-50 border-l-3 border-amber-500 p-3 rounded-r-lg">
                <h4 className="font-bold text-amber-950 mb-1">Safety Advisory for Consumers:</h4>
                <p className="text-amber-900 leading-relaxed">{selectedAlert.advice}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

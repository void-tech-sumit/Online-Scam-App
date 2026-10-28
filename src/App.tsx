/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { MessageChecker } from './components/MessageChecker';
import { LinkChecker } from './components/LinkChecker';
import { SafetyTips } from './components/SafetyTips';
import { ReportScam } from './components/ReportScam';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { EmergencyHelp } from './components/EmergencyHelp';
import { ProjectGuideModal } from './components/ProjectGuideModal';
import { LogoSelectorModal } from './components/LogoSelectorModal';
import { LogoStyleId, ScamShieldLogo } from './components/ScamShieldLogo';
import { INITIAL_AUTHORIZED_STAFF, INITIAL_REPORTS, INITIAL_SCAM_ALERTS } from './data/mockData';
import { EmployeeUser, ReportStatus, ScamAlert, ScamReport } from './types';
import { ShieldCheck, PhoneCall, Building2, ExternalLink, Info, Heart, Palette } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [isLogoSelectorOpen, setIsLogoSelectorOpen] = useState(false);

  // Logo Customization State
  const [logoStyle, setLogoStyle] = useState<LogoStyleId>(() => {
    return (localStorage.getItem('scamshield_logo_style') as LogoStyleId) || 'official';
  });
  const [customLogoUrl, setCustomLogoUrl] = useState<string | undefined>(() => {
    return localStorage.getItem('scamshield_custom_logo_url') || undefined;
  });

  const handleSaveLogo = (newStyle: LogoStyleId, newCustomUrl?: string) => {
    setLogoStyle(newStyle);
    localStorage.setItem('scamshield_logo_style', newStyle);
    if (newCustomUrl) {
      setCustomLogoUrl(newCustomUrl);
      localStorage.setItem('scamshield_custom_logo_url', newCustomUrl);
    } else {
      setCustomLogoUrl(undefined);
      localStorage.removeItem('scamshield_custom_logo_url');
    }
  };

  // Application State
  const [reports, setReports] = useState<ScamReport[]>(INITIAL_REPORTS);
  const [alerts, setAlerts] = useState<ScamAlert[]>(INITIAL_SCAM_ALERTS);
  const [staffAccounts, setStaffAccounts] = useState<EmployeeUser[]>(INITIAL_AUTHORIZED_STAFF);
  const [employeeUser, setEmployeeUser] = useState<EmployeeUser | null>(null);
  const [adminOriginalSession, setAdminOriginalSession] = useState<EmployeeUser | null>(null);

  // Impersonation & Auth handlers
  const handleLogout = () => {
    setEmployeeUser(null);
    setAdminOriginalSession(null);
  };

  const handleStartImpersonation = (targetOfficer: EmployeeUser) => {
    // If Admin is inspecting this officer's desk
    if (!adminOriginalSession && employeeUser?.roleType === 'super_admin') {
      setAdminOriginalSession(employeeUser);
    }
    setEmployeeUser(targetOfficer);
  };

  const handleExitImpersonation = () => {
    if (adminOriginalSession) {
      setEmployeeUser(adminOriginalSession);
      setAdminOriginalSession(null);
    }
  };

  const handleUpdateStaffStatus = (staffId: string, status: 'active' | 'suspended') => {
    setStaffAccounts((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status } : s))
    );
  };

  const handleAddStaff = (newStaff: EmployeeUser) => {
    setStaffAccounts((prev) => [newStaff, ...prev]);
  };

  const handleDeletePublicAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Handler: Add new scam report from customer form
  const handleAddReport = (
    newReportData: Omit<ScamReport, 'id' | 'referenceId' | 'status' | 'submittedAt'>
  ) => {
    const newId = `rep-${Date.now()}`;
    const generatedRef = `SCS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReport: ScamReport = {
      ...newReportData,
      id: newId,
      referenceId: generatedRef,
      status: 'pending_review',
      submittedAt: formattedDate,
      employeeNotes: [],
    };

    setReports((prev) => [newReport, ...prev]);
  };

  // Handler: Employee updates case status and notes
  const handleUpdateReportStatus = (
    reportId: string,
    status: ReportStatus,
    guidance?: string,
    note?: string
  ) => {
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const updatedNotes = r.employeeNotes ? [...r.employeeNotes] : [];
        if (note) {
          updatedNotes.push(`[${timestamp}] ${note}`);
        }
        return {
          ...r,
          status,
          officialGuidance: guidance || r.officialGuidance,
          employeeNotes: updatedNotes,
          reviewedBy: employeeUser ? `${employeeUser.name} (${employeeUser.employeeId})` : 'Bank Fraud Desk',
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
      })
    );
  };

  // Handler: Employee publishes a new public scam bulletin
  const handleAddPublicAlert = (newAlert: ScamAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        employeeUser={employeeUser}
        isImpersonating={!!adminOriginalSession}
        onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
        logoStyle={logoStyle}
        customLogoUrl={customLogoUrl}
        onOpenLogoSelector={() => setIsLogoSelectorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'home' && (
          <HomeDashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            alerts={alerts}
            logoStyle={logoStyle}
            customLogoUrl={customLogoUrl}
            onOpenLogoSelector={() => setIsLogoSelectorOpen(true)}
            onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
          />
        )}

        {currentTab === 'check-message' && (
          <MessageChecker
            onNavigateToReport={() => setCurrentTab('report-scam')}
            onNavigateToEmergency={() => setCurrentTab('emergency')}
          />
        )}

        {currentTab === 'check-link' && (
          <LinkChecker
            onNavigateToReport={() => setCurrentTab('report-scam')}
            onNavigateToEmergency={() => setCurrentTab('emergency')}
          />
        )}

        {currentTab === 'safety-tips' && <SafetyTips />}

        {currentTab === 'report-scam' && (
          <ReportScam
            reports={reports}
            onSubmitReport={handleAddReport}
            onNavigateToEmergency={() => setCurrentTab('emergency')}
          />
        )}

        {currentTab === 'employee' && (
          <EmployeeDashboard
            employeeUser={employeeUser}
            onLogin={setEmployeeUser}
            onLogout={handleLogout}
            reports={reports}
            alerts={alerts}
            onUpdateReportStatus={handleUpdateReportStatus}
            onAddPublicAlert={handleAddPublicAlert}
            onDeletePublicAlert={handleDeletePublicAlert}
            staffList={staffAccounts}
            onUpdateStaffStatus={handleUpdateStaffStatus}
            onAddStaff={handleAddStaff}
            isImpersonating={!!adminOriginalSession}
            originalAdminUser={adminOriginalSession}
            onStartImpersonation={handleStartImpersonation}
            onExitImpersonation={handleExitImpersonation}
          />
        )}

        {currentTab === 'emergency' && <EmergencyHelp />}
      </main>

      {/* Project Presentation Viva Guide Modal */}
      <ProjectGuideModal
        isOpen={isProjectGuideOpen}
        onClose={() => setIsProjectGuideOpen(false)}
      />

      {/* Logo Customization Modal */}
      <LogoSelectorModal
        isOpen={isLogoSelectorOpen}
        onClose={() => setIsLogoSelectorOpen(false)}
        currentStyle={logoStyle}
        currentCustomUrl={customLogoUrl}
        onSaveLogo={handleSaveLogo}
      />

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Institutional Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <ScamShieldLogo
                  styleId={logoStyle}
                  customImageUrl={customLogoUrl}
                  size="sm"
                />
                <span className="font-bold text-lg text-white font-serif">ScamShield</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                National Online Scam Protection System. Empowering bank account holders and fraud mitigation officers with proactive threat intelligence and instant incident triage.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLogoSelectorOpen(true)}
                  className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer underline decoration-cyan-500/50"
                >
                  <Palette className="w-3 h-3" />
                  <span>Customize App Logo</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Dedicated Banking Scam Prevention & Customer Protection Portal
              </div>
            </div>

            {/* Col 2: Citizen Tools */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm">Customer Portal Tools</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setCurrentTab('check-message')} className="hover:text-white cursor-pointer">
                    Check Suspicious Message
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('check-link')} className="hover:text-white cursor-pointer">
                    Inspect Website Link
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('safety-tips')} className="hover:text-white cursor-pointer">
                    Banking Safety Rules & Quiz
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('report-scam')} className="hover:text-white cursor-pointer">
                    Report Scam to Bank Desk
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Employee Desk */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm">Bank Employee Desk</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setCurrentTab('employee')} className="hover:text-white cursor-pointer">
                    {employeeUser ? 'Fraud Investigation Console' : 'Employee Login (EMP-1042)'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsProjectGuideOpen(true)} className="hover:text-white cursor-pointer text-blue-300 font-medium">
                    System Architecture & Specs
                  </button>
                </li>
                <li>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white inline-flex items-center gap-1"
                  >
                    <span>cybercrime.gov.in</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: National Cyber Emergency Callout */}
            <div className="space-y-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <PhoneCall className="w-4 h-4" />
                <span>Cyber Fraud Emergency</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Lost funds through unauthorized transaction? Dial <strong>1930</strong> immediately to freeze scammer accounts.
              </p>
              <button
                onClick={() => setCurrentTab('emergency')}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-3 rounded-lg text-xs cursor-pointer transition-colors"
              >
                View 1930 Golden Hour Guide
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <div>
              ScamShield · Online Scam Protection System · Integrated Public Safety & Bank Vigilance
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>National Cyber Crime Helpline: 1930 · cybercrime.gov.in</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

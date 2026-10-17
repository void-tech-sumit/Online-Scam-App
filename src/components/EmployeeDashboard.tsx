import React, { useState } from 'react';
import {
  Building2,
  Lock,
  UserCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Send,
  PlusCircle,
  LogOut,
  Eye,
  Shield,
  Key,
  Info,
} from 'lucide-react';
import { EmployeeUser, ReportStatus, RiskLevel, ScamAlert, ScamReport } from '../types';

interface EmployeeDashboardProps {
  employeeUser: EmployeeUser | null;
  onLogin: (user: EmployeeUser) => void;
  onLogout: () => void;
  reports: ScamReport[];
  onUpdateReportStatus: (reportId: string, status: ReportStatus, guidance?: string, note?: string) => void;
  onAddPublicAlert: (alert: ScamAlert) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employeeUser,
  onLogin,
  onLogout,
  reports,
  onUpdateReportStatus,
  onAddPublicAlert,
}) => {
  // Login Form State
  const [empId, setEmpId] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Management State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);

  // Status Update & Guidance Form
  const [newStatus, setNewStatus] = useState<ReportStatus>('under_investigation');
  const [guidanceText, setGuidanceText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Broadcast Alert Modal
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertCategory, setAlertCategory] = useState('Banking Phishing');
  const [alertSeverity, setAlertSeverity] = useState<RiskLevel>('high');
  const [alertSummary, setAlertSummary] = useState('');
  const [alertDetails, setAlertDetails] = useState('');
  const [alertAdvice, setAlertAdvice] = useState('');

  // Demo Login Handler
  const handleDemoLogin = () => {
    onLogin({
      id: 'emp-1042',
      name: 'Priya Sharma',
      role: 'Fraud Investigation & Cyber Vigilance Officer',
      branch: 'Central Cyber Fraud Mitigation Cell',
      employeeId: 'EMP-1042',
    });
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId.trim()) {
      setLoginError('Please enter your Employee ID (e.g. EMP-1042)');
      return;
    }
    onLogin({
      id: empId.toLowerCase(),
      name: `Officer ${empId}`,
      role: 'Branch Cyber Desk Officer',
      branch: 'Main City Branch',
      employeeId: empId.toUpperCase(),
    });
  };

  const handleSelectCase = (rep: ScamReport) => {
    setSelectedReport(rep);
    setNewStatus(rep.status);
    setGuidanceText(rep.officialGuidance || '');
    setInternalNoteText('');
    setActionSuccessMessage('');
  };

  const handleSaveCaseUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    onUpdateReportStatus(
      selectedReport.id,
      newStatus,
      guidanceText.trim() || undefined,
      internalNoteText.trim() || undefined
    );

    setActionSuccessMessage('Case updated successfully. Guidance saved to customer view.');
    setTimeout(() => {
      setSelectedReport(null);
      setActionSuccessMessage('');
    }, 1200);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertSummary.trim()) return;

    onAddPublicAlert({
      id: `alert-${Date.now()}`,
      title: alertTitle.trim(),
      category: alertCategory,
      severity: alertSeverity,
      date: 'Just Now',
      summary: alertSummary.trim(),
      fullDetails: alertDetails.trim() || alertSummary.trim(),
      advice: alertAdvice.trim() || 'Do not click unverified links or share personal details.',
      reportedBy: `${employeeUser?.name || 'Bank Vigilance'} (${employeeUser?.employeeId || 'EMP'})`,
    });

    setShowAlertModal(false);
    setAlertTitle('');
    setAlertSummary('');
    setAlertDetails('');
    setAlertAdvice('');
  };

  // Masking customer phone or email for privacy
  const maskContact = (contact?: string) => {
    if (!contact) return 'Protected';
    if (contact.includes('@')) {
      const [user, domain] = contact.split('@');
      return `${user.slice(0, 2)}***@${domain}`;
    }
    if (contact.length >= 10) {
      return `${contact.slice(0, 4)} *** **${contact.slice(-2)}`;
    }
    return '***-***-****';
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.scammerDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // If NOT logged in, show Employee Authentication interface
  if (!employeeUser) {
    return (
      <div className="max-w-md mx-auto space-y-6 pb-12 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">Bank Employee Portal</h1>
            <p className="text-xs text-slate-500">
              Restricted portal for authorized Bank Fraud Mitigation Officers and Cyber Crime Desk staff.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed">
            <strong className="block font-semibold text-slate-900 mb-1">Authorized Access Protocol:</strong>
            Use verified officer credentials below, or initiate single-click authentication as Senior Vigilance Officer (EMP-1042) to access the central incident queue.
          </div>

          {/* Quick 1-click Verified Officer Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>Authenticate as Vigilance Officer (EMP-1042)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 absolute font-mono">OR CUSTOM LOGIN</span>
          </div>

          {/* Custom form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employee Identification No (EMP-ID)
              </label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="e.g. EMP-1042"
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
              {loginError && <p className="text-xs text-rose-600 mt-1">{loginError}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Password / Token
              </label>
              <input
                type="password"
                value={empPassword}
                onChange={(e) => setEmpPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Any password accepted in demo mode</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              Sign In to Fraud Investigation Desk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN EMPLOYEE DASHBOARD
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Officer Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">{employeeUser.name}</h1>
                <span className="text-xs bg-blue-950 text-blue-300 border border-blue-700 px-2 py-0.5 rounded font-mono">
                  {employeeUser.employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{employeeUser.role}</p>
              <p className="text-xs text-slate-400">{employeeUser.branch}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAlertModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast Public Alert</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Total Reports in Queue</span>
            <span className="text-2xl font-mono font-bold text-white">{reports.length}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Pending Review</span>
            <span className="text-2xl font-mono font-bold text-amber-400">
              {reports.filter((r) => r.status === 'pending_review').length}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Under Active Investigation</span>
            <span className="text-2xl font-mono font-bold text-blue-400">
              {reports.filter((r) => r.status === 'under_investigation').length}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Phishing Domains Blocked</span>
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {reports.filter((r) => r.status === 'domain_blocked' || r.status === 'resolved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Fraud Investigation Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">Customer Fraud Complaint Desk</h2>
            <p className="text-xs text-slate-500">
              Review victim reports, update investigation status, and provide official bank guidance.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search case, phone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-44 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg text-xs py-1.5 px-2 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="guidance_provided">Guidance Provided</option>
              <option value="domain_blocked">Domain Blocked</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints Table / Cards */}
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No scam reports matched the selected filter criteria.
            </div>
          ) : (
            filteredReports.map((rep) => (
              <div
                key={rep.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedReport?.id === rep.id
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {rep.referenceId}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{rep.categoryLabel}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rep.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.severity} Severity
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">{rep.date} · {rep.time}</span>
                    <button
                      onClick={() => handleSelectCase(rep)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Inspect & Guide
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 my-2">
                  <div>
                    <span className="text-slate-400">Victim: </span>
                    <span className="font-medium text-slate-800">{rep.reporterName || 'Anonymous'}</span>
                    <span className="text-slate-400 ml-1">({maskContact(rep.reporterContact)})</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Scammer Vector: </span>
                    <span className="font-mono text-slate-800 font-medium truncate inline-block max-w-[200px]">
                      {rep.scammerDetail}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Claimed Loss: </span>
                    <span className={`font-bold ${rep.amountLost > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {rep.amountLost > 0 ? `₹${rep.amountLost.toLocaleString('en-IN')}` : '₹0 (Prevented)'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-white p-2 rounded-lg border border-slate-200/80">
                  {rep.description}
                </p>

                {rep.officialGuidance && (
                  <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 p-2 rounded-lg flex items-center justify-between">
                    <div>
                      <strong>Bank Advisory: </strong> {rep.officialGuidance}
                    </div>
                    {rep.reviewedBy && (
                      <span className="text-[10px] text-emerald-700 shrink-0 ml-2">By {rep.reviewedBy}</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Case Investigation & Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedReport.referenceId}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
                  Case Investigation & Guidance Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Incident Type: {selectedReport.categoryLabel} · Platform: {selectedReport.platform}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Case Details Box */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Reported By:</span>
                  <span className="font-semibold text-slate-900">{selectedReport.reporterName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Privacy Status:</span>
                  <span className="font-mono text-slate-700 font-medium">{maskContact(selectedReport.reporterContact)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Reported Scammer Details:</span>
                  <span className="font-mono text-rose-700 font-bold">{selectedReport.scammerDetail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Reported Loss Amount:</span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.amountLost > 0 ? `₹${selectedReport.amountLost.toLocaleString('en-IN')}` : '₹0 (Prevented)'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-xs">Full Customer Description:</span>
                <p className="text-slate-800 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.evidenceText && (
                <div>
                  <span className="text-slate-400 block text-xs">Submitted Message / UTR Evidence:</span>
                  <p className="text-slate-800 font-mono mt-1 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    {selectedReport.evidenceText}
                  </p>
                </div>
              )}
            </div>

            {/* Officer Action Form */}
            <form onSubmit={handleSaveCaseUpdate} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Update Investigation Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pending_review">Pending Review</option>
                  <option value="under_investigation">Under Investigation (Dispatched to Cyber Cell)</option>
                  <option value="guidance_provided">Guidance Provided (Safe Advice Sent to Customer)</option>
                  <option value="domain_blocked">Domain / Phone Number Blocked (Flagged to Registrars)</option>
                  <option value="resolved">Resolved & Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Official Bank Guidance for Customer (Visible to Customer in App) *
                </label>
                <textarea
                  rows={3}
                  value={guidanceText}
                  onChange={(e) => setGuidanceText(e.target.value)}
                  placeholder="e.g. 'Bank confirmed this is a phishing domain. Do NOT call the sender. Immediately reset your NetBanking password. In case of fund loss, lodge complaint on 1930.'"
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Internal Vigilance Note (Internal Bank Log)
                </label>
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="e.g. 'Coordinated with Nodal telecom provider to blacklist header. Chargeback Form-C sent to customer email.'"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {actionSuccessMessage && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save & Publish Guidance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Public Scam Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Broadcast Public Scam Advisory
                </h3>
                <p className="text-xs text-slate-500">
                  This advisory will immediately appear on the Home Dashboard for all customers.
                </p>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. Critical Advisory: Fake Courier Customs Fee SMS Circulating"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    value={alertCategory}
                    onChange={(e) => setAlertCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Threat Level</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value as RiskLevel)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Brief Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={alertSummary}
                  onChange={(e) => setAlertSummary(e.target.value)}
                  placeholder="Short 2-sentence warning for home dashboard..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Safety Advice for Public</label>
                <input
                  type="text"
                  value={alertAdvice}
                  onChange={(e) => setAlertAdvice(e.target.value)}
                  placeholder="e.g. Never pay parcel release fees to personal UPI IDs."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Publish Live Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

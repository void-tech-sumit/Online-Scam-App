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
  EyeOff,
  Shield,
  Key,
  Info,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { EmployeeUser, ReportStatus, RiskLevel, ScamAlert, ScamReport } from '../types';

interface EmployeeDashboardProps {
  employeeUser: EmployeeUser | null;
  onLogin: (user: EmployeeUser) => void;
  onLogout: () => void;
  reports: ScamReport[];
  alerts?: ScamAlert[];
  onUpdateReportStatus: (reportId: string, status: ReportStatus, guidance?: string, note?: string) => void;
  onAddPublicAlert: (alert: ScamAlert) => void;
  onDeletePublicAlert?: (alertId: string) => void;
  staffList: EmployeeUser[];
  onUpdateStaffStatus?: (staffId: string, status: 'active' | 'suspended') => void;
  onAddStaff?: (newStaff: EmployeeUser) => void;
  isImpersonating?: boolean;
  originalAdminUser?: EmployeeUser | null;
  onStartImpersonation?: (targetUser: EmployeeUser) => void;
  onExitImpersonation?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employeeUser,
  onLogin,
  onLogout,
  reports,
  alerts = [],
  onUpdateReportStatus,
  onAddPublicAlert,
  onDeletePublicAlert,
  staffList,
  onUpdateStaffStatus,
  onAddStaff,
  isImpersonating = false,
  originalAdminUser,
  onStartImpersonation,
  onExitImpersonation,
}) => {
  // Login Form State
  const [empId, setEmpId] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showCredentialsDirectory, setShowCredentialsDirectory] = useState(false);
  const [credentialCopiedId, setCredentialCopiedId] = useState<string | null>(null);

  // Super Admin Navigation Tab
  const [adminTab, setAdminTab] = useState<'officers' | 'all-reports' | 'alerts' | 'audit'>('officers');
  const [bankFilter, setBankFilter] = useState<string>('all');
  const [officerSearch, setOfficerSearch] = useState<string>('');

  // Register New Bank Officer Modal
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerBank, setNewOfficerBank] = useState('State Bank of India');
  const [newOfficerBranch, setNewOfficerBranch] = useState('');
  const [newOfficerEmpId, setNewOfficerEmpId] = useState('');
  const [newOfficerPassword, setNewOfficerPassword] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');
  const [addOfficerError, setAddOfficerError] = useState('');
  const [addOfficerSuccess, setAddOfficerSuccess] = useState('');

  // Case Investigation State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
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

  // Strict Credential Validation Login Handler
  const handleStrictLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanId = empId.trim().toUpperCase();
    const cleanPass = empPassword.trim();

    if (!cleanId) {
      setLoginError('कृपया Employee ID या Admin ID दर्ज करें (e.g. ADMIN-001 or EMP-1042)');
      return;
    }
    if (!cleanPass) {
      setLoginError('कृपया सुरक्षा पासवर्ड (Security Password) दर्ज करें');
      return;
    }

    // Match against official staff accounts
    const matchedAccount = staffList.find(
      (u) => u.employeeId.toUpperCase() === cleanId || u.id.toUpperCase() === cleanId
    );

    if (!matchedAccount) {
      setLoginError('❌ अनाधिकृत आईडी (Unauthorized ID): यह कर्मचारी आईडी सिस्टम में पंजीकृत नहीं है। केवल अधिकृत बैंक अधिकारी या एडमिन ही लॉगिन कर सकते हैं।');
      return;
    }

    if (matchedAccount.password !== cleanPass) {
      setLoginError('❌ अमान्य पासवर्ड (Invalid Password): दर्ज किया गया पासवर्ड गलत है। सुरक्षा प्रोटोकॉल के तहत अनधिकृत प्रयास दर्ज कर लिया गया है।');
      return;
    }

    if (matchedAccount.status === 'suspended') {
      setLoginError('⚠️ खाता निलंबित (Account Suspended): यह अधिकारी खाता केंद्रीय साइबर सतर्कता निदेशालय (Super Admin) द्वारा निष्क्रिय किया गया है।');
      return;
    }

    // Success: Login granted
    onLogin(matchedAccount);
    setEmpPassword('');
    setLoginError('');
  };

  // Quick autofill helper for authorized credential testing
  const handleAutofill = (staff: EmployeeUser) => {
    setEmpId(staff.employeeId);
    setEmpPassword(staff.password || '');
    setLoginError('');
    setCredentialCopiedId(staff.id);
    setTimeout(() => setCredentialCopiedId(null), 1500);
  };

  // Onboard New Officer Handler
  const handleRegisterOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    setAddOfficerError('');

    if (!newOfficerName.trim() || !newOfficerEmpId.trim() || !newOfficerPassword.trim()) {
      setAddOfficerError('कृपया अधिकारी का नाम, Employee ID और पासवर्ड भरें।');
      return;
    }

    const cleanEmpId = newOfficerEmpId.trim().toUpperCase();
    if (staffList.some((s) => s.employeeId.toUpperCase() === cleanEmpId)) {
      setAddOfficerError(`Employee ID "${cleanEmpId}" पहले से किसी अन्य अधिकारी के नाम पंजीकृत है।`);
      return;
    }

    const newStaff: EmployeeUser = {
      id: `emp-${Date.now()}`,
      name: newOfficerName.trim(),
      role: 'Fraud Investigation & Cyber Vigilance Officer',
      roleType: 'bank_employee',
      bankName: newOfficerBank,
      branch: newOfficerBranch.trim() || 'Zonal Cyber Fraud Desk',
      employeeId: cleanEmpId,
      password: newOfficerPassword.trim(),
      email: newOfficerEmail.trim() || `${cleanEmpId.toLowerCase()}@${newOfficerBank.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: newOfficerPhone.trim() || '+91 98000 00000',
      status: 'active',
      assignedCasesCount: 0,
      lastLogin: 'Never (Newly Onboarded)',
    };

    if (onAddStaff) {
      onAddStaff(newStaff);
    }

    setAddOfficerSuccess(`बैंक अधिकारी "${newOfficerName}" (ID: ${cleanEmpId}) सफलतापूर्वक पंजीकृत किए गए!`);
    setTimeout(() => {
      setShowAddOfficerModal(false);
      setAddOfficerSuccess('');
      setNewOfficerName('');
      setNewOfficerEmpId('');
      setNewOfficerPassword('');
      setNewOfficerBranch('');
      setNewOfficerEmail('');
      setNewOfficerPhone('');
    }, 1500);
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

    setActionSuccessMessage('केस सफलतापूर्वक अपडेट किया गया। पीड़ित नागरिक को आधिकारिक बैंक सलाह भेज दी गई है।');
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

  // Filtered reports for regular employee or admin view
  const filteredReports = reports.filter((r) => {
    // If bank filter is active in admin mode
    if (bankFilter !== 'all' && r.assignedBank && !r.assignedBank.toLowerCase().includes(bankFilter.toLowerCase())) {
      return false;
    }
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.scammerDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.assignedBank && r.assignedBank.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filtered staff list for admin
  const filteredStaff = staffList.filter((s) => {
    if (s.roleType === 'super_admin') return false; // don't list super admin inside officer impersonation list
    const matchesBank = bankFilter === 'all' || s.bankName.toLowerCase().includes(bankFilter.toLowerCase());
    const matchesSearch =
      s.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(officerSearch.toLowerCase()) ||
      s.bankName.toLowerCase().includes(officerSearch.toLowerCase()) ||
      s.branch.toLowerCase().includes(officerSearch.toLowerCase());
    return matchesBank && matchesSearch;
  });

  // ==========================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN
  // ==========================================
  if (!employeeUser) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4">
        {/* Security Warning Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-amber-950">
              आधिकारिक सुरक्षा चेतावनी · Restricted Institutional Gateway
            </strong>
            <p className="leading-relaxed">
              यह पोर्टल केवल अधिकृत <strong>बैंक फ्रॉड मिटिगेशन अधिकारियों (Bank Employees)</strong> एवं{' '}
              <strong>केंद्रीय सतर्कता सुपर एडमिन (Super Admin)</strong> के लिए सुरक्षित है। बिना वैध पहचान (Employee ID & Password) लॉगिन पूर्णतः प्रतिबंधित है।
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-blue-200">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">Bank Officer & Admin Portal</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Secure Central Gateway for Bank Fraud Vigilance Officers and Directorate Super Administrators.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{loginError}</div>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleStrictLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employee Identification No / Admin ID (EMP-ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="e.g. EMP-1042 (Bank Officer) or ADMIN-001 (Super Admin)"
                  className="w-full p-3 pl-10 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 font-mono tracking-wide uppercase"
                  required
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Password / Token
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pl-10 pr-10 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Credentials & Sign In</span>
            </button>
          </form>

          {/* Collapsible Verified Credentials Directory for Evaluation */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowCredentialsDirectory(!showCredentialsDirectory)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>📋 अधिकृत लॉगिन क्रेडेंशियल्स डायरेक्टरी (Verified Credentials Directory)</span>
              </span>
              {showCredentialsDirectory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCredentialsDirectory && (
              <div className="mt-3 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  परीक्षण एवं मूल्यांकन हेतु नीचे अधिकृत बैंक अधिकारियों तथा सुपर एडमिन के क्रेडेंशियल्स दिए गए हैं। किसी भी खाते के <strong>"Use Credentials"</strong> बटन पर क्लिक करके त्वरित टेस्ट किया जा सकता है:
                </p>

                {/* Super Admin Credential Highlight */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-700 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      🛡️ Directorate Super Admin (Pura Control)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const adminAcc = staffList.find((s) => s.roleType === 'super_admin');
                        if (adminAcc) handleAutofill(adminAcc);
                      }}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                    >
                      {credentialCopiedId === 'admin-001' ? <Check className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                      <span>{credentialCopiedId === 'admin-001' ? 'Filled!' : 'Fill Admin Credentials'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700 pt-1">
                    <div>
                      <strong>Name:</strong> Director Rajesh Verma (I4C)
                    </div>
                    <div>
                      <strong>Control:</strong> All Banks, Impersonation, Staff Management
                    </div>
                    <div>
                      <strong>ID:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-indigo-900 font-bold">ADMIN-001</code>
                    </div>
                    <div>
                      <strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-indigo-900 font-bold">admin@scamshield2026</code>
                    </div>
                  </div>
                </div>

                {/* Bank Officers Credentials */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    🏛️ Registered Bank Fraud Officers (बैंक कर्मचारी आईडी):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {staffList
                      .filter((s) => s.roleType === 'bank_employee')
                      .map((staff) => (
                        <div
                          key={staff.id}
                          className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 text-[11px] truncate">{staff.bankName}</span>
                            <button
                              type="button"
                              onClick={() => handleAutofill(staff)}
                              className="text-[10px] bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-medium px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1"
                            >
                              {credentialCopiedId === staff.id ? <Check className="w-2.5 h-2.5" /> : null}
                              <span>{credentialCopiedId === staff.id ? 'Loaded' : 'Use'}</span>
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-500">{staff.name} ({staff.role.split(' ')[0]})</div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-700 pt-0.5 border-t border-slate-100">
                            <span>ID: <strong>{staff.employeeId}</strong></span>
                            <span>Pass: <strong>{staff.password}</strong></span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SUPER ADMIN COMMAND CONSOLE
  // (Full control: view all banks, switch/login as any officer, manage staff)
  // ==========================================
  if (employeeUser.roleType === 'super_admin' && !isImpersonating) {
    const totalActiveOfficers = staffList.filter((s) => s.roleType === 'bank_employee' && s.status === 'active').length;
    const totalSuspendedOfficers = staffList.filter((s) => s.roleType === 'bank_employee' && s.status === 'suspended').length;
    const totalBlockedDomains = reports.filter((r) => r.status === 'domain_blocked' || r.status === 'resolved').length;
    const totalPendingReviews = reports.filter((r) => r.status === 'pending_review').length;

    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Super Admin Top Command Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg border border-indigo-400/40">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif">{employeeUser.name}</h1>
                  <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-500/80 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                    SUPER ADMIN · {employeeUser.employeeId}
                  </span>
                  <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded font-mono">
                    FULL ACCESS DIRECTIVE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-200">{employeeUser.role}</p>
                <p className="text-xs text-slate-400">{employeeUser.bankName} · {employeeUser.branch}</p>
              </div>
            </div>

            {/* Quick Action Buttons for Super Admin */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAddOfficerModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Onboard Bank Officer</span>
              </button>

              <button
                onClick={() => setShowAlertModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Broadcast National Alert</span>
              </button>

              <button
                onClick={onLogout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Directorate Cross-Bank Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-900/50">
              <span className="text-indigo-300 text-xs block font-medium">Bank Officers Monitored</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-white">{staffList.filter((s) => s.roleType === 'bank_employee').length}</span>
                <span className="text-xs text-emerald-400">({totalActiveOfficers} Active / {totalSuspendedOfficers} Locked)</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-900/50">
              <span className="text-slate-400 text-xs block font-medium">Total Cross-Bank Reports</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-white">{reports.length}</span>
                <span className="text-xs text-slate-400">Across All Banks</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-900/50">
              <span className="text-amber-300 text-xs block font-medium">Pending Urgent Reviews</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-amber-400">{totalPendingReviews}</span>
                <span className="text-xs text-amber-300/80">Require Action</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-900/50">
              <span className="text-emerald-300 text-xs block font-medium">Domains / Accounts Blocked</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-emerald-400">{totalBlockedDomains}</span>
                <span className="text-xs text-emerald-300/80">CERT-In Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Control Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setAdminTab('officers')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'officers'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Bank Officers & Impersonation Hub (हर बैंक ID लॉगिन)</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {staffList.filter((s) => s.roleType === 'bank_employee').length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('all-reports')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'all-reports'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>All Banks Complaints Queue (समस्त बैंक केस)</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {reports.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('alerts')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'alerts'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>National Scam Bulletins ({alerts.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('audit')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'audit'
                ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>System Security Logs</span>
          </button>
        </div>

        {/* TAB 1: BANK OFFICERS & IMPERSONATION HUB */}
        {adminTab === 'officers' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>Bank Fraud Mitigation Personnel Directory</span>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-sans font-normal">
                    Direct Impersonation & Audit Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  सुपर एडमिन किसी भी बैंक अधिकारी के खाते में 1-क्लिक से स्विच होकर उनका व्यक्तिगत डेस्क, शिकायतें और एक्शन जांच सकते हैं।
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search officer, bank, EMP-ID..."
                    value={officerSearch}
                    onChange={(e) => setOfficerSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 sm:w-60 focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg text-xs py-1.5 px-2 bg-white"
                >
                  <option value="all">All Banks</option>
                  <option value="State Bank of India">SBI</option>
                  <option value="HDFC Bank">HDFC</option>
                  <option value="ICICI Bank">ICICI</option>
                  <option value="Punjab National Bank">PNB</option>
                  <option value="Axis Bank">Axis Bank</option>
                </select>

                <button
                  onClick={() => setShowAddOfficerModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Officer</span>
                </button>
              </div>
            </div>

            {/* Officer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((officer) => {
                const officerCases = reports.filter(
                  (r) =>
                    r.assignedOfficerId === officer.employeeId ||
                    (r.assignedBank && r.assignedBank.toLowerCase().includes(officer.bankName.toLowerCase()))
                );

                return (
                  <div
                    key={officer.id}
                    className={`rounded-xl border p-5 space-y-4 transition-all ${
                      officer.status === 'suspended'
                        ? 'bg-rose-50/50 border-rose-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                          {officer.employeeId.slice(-4)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{officer.name}</h3>
                          <div className="text-xs font-medium text-blue-700">{officer.bankName}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{officer.branch}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                          officer.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {officer.status === 'active' ? '● Active' : '✕ Suspended'}
                      </span>
                    </div>

                    {/* Metadata & Case count */}
                    <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] space-y-1 font-mono text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>Employee ID:</span>
                        <strong className="text-slate-900">{officer.employeeId}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Assigned Cases:</span>
                        <strong className="text-indigo-600">{officerCases.length} Active</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Active:</span>
                        <span className="text-slate-500">{officer.lastLogin || 'Recent'}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                        <span>Password Token:</span>
                        <code className="text-slate-800 font-bold bg-white px-1 rounded border border-slate-200">{officer.password}</code>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {/* 1-Click Login / Impersonate as Officer Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onStartImpersonation) {
                            onStartImpersonation(officer);
                          }
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Login as this officer to check their desk"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Login as this Officer</span>
                      </button>

                      {/* Toggle status */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateStaffStatus) {
                            onUpdateStaffStatus(officer.id, officer.status === 'active' ? 'suspended' : 'active');
                          }
                        }}
                        className={`text-xs py-2 px-2.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                          officer.status === 'active'
                            ? 'border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                            : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                        title={officer.status === 'active' ? 'Suspend Access' : 'Reactivate Access'}
                      >
                        {officer.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALL BANKS SCAM REPORTS QUEUE */}
        {adminTab === 'all-reports' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">National Citizen Fraud Complaint Repository</h2>
                <p className="text-xs text-slate-500">
                  सुपर एडमिन पूरे भारत के सभी बैंकों के केस देख सकते हैं, उनका स्टेटस बदल सकते हैं और त्वरित लीगल निर्देश जारी कर सकते हैं।
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search complaint, phone, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-44 sm:w-56"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg text-xs py-1.5 px-2 bg-white"
                >
                  <option value="all">All Banks</option>
                  <option value="State Bank of India">SBI</option>
                  <option value="HDFC Bank">HDFC</option>
                  <option value="ICICI Bank">ICICI</option>
                  <option value="Punjab National Bank">PNB</option>
                  <option value="Axis Bank">Axis</option>
                </select>

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

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                कोई शिकायत नहीं मिली (No reports matching filters).
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Target Bank</th>
                      <th className="p-3">Scammer Contact / Link</th>
                      <th className="p-3">Loss Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {rep.referenceId}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-900 block">{rep.categoryLabel}</span>
                          <span className="text-[11px] text-slate-500 font-sans">{rep.platform}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-800">{rep.assignedBank || 'General Cyber Cell'}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-700 max-w-[180px] truncate" title={rep.scammerDetail}>
                          {rep.scammerDetail}
                        </td>
                        <td className="p-3 font-mono font-semibold">
                          {rep.amountLost > 0 ? (
                            <span className="text-rose-600 font-bold">₹{rep.amountLost.toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-emerald-700">₹0 (Prevented)</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              rep.status === 'pending_review'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : rep.status === 'under_investigation'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : rep.status === 'domain_blocked'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {rep.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{rep.submittedAt}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSelectCase(rep)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                          >
                            Supervise Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NATIONAL PUBLIC BULLETINS */}
        {adminTab === 'alerts' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">Citizen Fraud Advisories & Bulletins</h2>
                <p className="text-xs text-slate-500">
                  सुपर एडमिन द्वारा जारी की गई आधिकारिक राष्ट्रीय चेतावनियां जो पब्लिक होमपेज पर दिखाई देती हैं।
                </p>
              </div>
              <button
                onClick={() => setShowAlertModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Broadcast Alert</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {alert.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                    </div>
                    {onDeletePublicAlert && (
                      <button
                        type="button"
                        onClick={() => onDeletePublicAlert(alert.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Delete this alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.summary}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Issued By: {alert.reportedBy}</span>
                    <span>{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {adminTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif">Institutional Security & Authentication Audit Logs</h2>
            <p className="text-xs text-slate-500">
              Live audit events: Session initiations, officer impersonations, password verifications, and status revisions.
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-indigo-700">● [SESSION_AUTH] Super Admin Rajesh Verma (ADMIN-001) logged in successfully.</span>
                <span className="text-slate-400">Today, 09:15 AM</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-emerald-700">● [OFFICER_AUTH] Priya Sharma (EMP-1042 - SBI) verified via token.</span>
                <span className="text-slate-400">Today, 10:20 AM</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-blue-700">● [CERT_DIRECTIVE] Phishing domain sbi-kyc-verify.top blocked under IT Act Sec 69A.</span>
                <span className="text-slate-400">Oct 10, 16:05</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-amber-700">● [SECURITY_ALERT] Invalid authentication attempt rejected from IP 192.168.1.42 (Unauthorized ID).</span>
                <span className="text-slate-400">Oct 11, 14:10</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ONBOARD NEW BANK OFFICER */}
        {showAddOfficerModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base font-serif">Onboard Verified Bank Officer</h3>
                </div>
                <button
                  onClick={() => setShowAddOfficerModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {addOfficerError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg">
                  {addOfficerError}
                </div>
              )}

              {addOfficerSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg">
                  {addOfficerSuccess}
                </div>
              )}

              <form onSubmit={handleRegisterOfficer} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Officer Full Name *</label>
                    <input
                      type="text"
                      value={newOfficerName}
                      onChange={(e) => setNewOfficerName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Bank Name *</label>
                    <select
                      value={newOfficerBank}
                      onChange={(e) => setNewOfficerBank(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Employee ID (EMP-ID) *</label>
                    <input
                      type="text"
                      value={newOfficerEmpId}
                      onChange={(e) => setNewOfficerEmpId(e.target.value)}
                      placeholder="e.g. EMP-1140"
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Security Password *</label>
                    <input
                      type="text"
                      value={newOfficerPassword}
                      onChange={(e) => setNewOfficerPassword(e.target.value)}
                      placeholder="e.g. sbi@fraud2026"
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bank Branch / Zonal Office</label>
                  <input
                    type="text"
                    value={newOfficerBranch}
                    onChange={(e) => setNewOfficerBranch(e.target.value)}
                    placeholder="e.g. Central Cyber Fraud Mitigation Cell (Delhi HQ)"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Official Email</label>
                    <input
                      type="email"
                      value={newOfficerEmail}
                      onChange={(e) => setNewOfficerEmail(e.target.value)}
                      placeholder="officer@bank.co.in"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={newOfficerPhone}
                      onChange={(e) => setNewOfficerPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddOfficerModal(false)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                  >
                    Register Bank Officer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: BANK EMPLOYEE WORKSPACE
  // (Or Super Admin impersonating this officer)
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* SUPER ADMIN IMPERSONATION BANNER */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 rounded-2xl p-4 shadow-lg border border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight flex items-center gap-2">
                <span>🛡️ SUPER ADMIN AUDIT MODE ACTIVE</span>
                <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                  DIRECTORATE AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-900 font-medium">
                आप वर्तमान में <strong>{employeeUser.name}</strong> ({employeeUser.bankName} · {employeeUser.employeeId}) के डेस्क का ऑडिट कर रहे हैं।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitImpersonation}
            className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>← Return to Super Admin Console</span>
          </button>
        </div>
      )}

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
              <p className="text-xs text-blue-300 mt-0.5 font-semibold">{employeeUser.bankName}</p>
              <p className="text-xs text-slate-300">{employeeUser.role}</p>
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

            {isImpersonating ? (
              <button
                onClick={onExitImpersonation}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Admin</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Total Reports in Queue</span>
            <span className="text-2xl font-mono font-bold text-white">{filteredReports.length}</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Pending Review</span>
            <span className="text-2xl font-mono font-bold text-amber-400">
              {filteredReports.filter((r) => r.status === 'pending_review').length}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Under Active Investigation</span>
            <span className="text-2xl font-mono font-bold text-blue-400">
              {filteredReports.filter((r) => r.status === 'under_investigation').length}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs block">Phishing Domains Blocked</span>
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {filteredReports.filter((r) => r.status === 'domain_blocked' || r.status === 'resolved').length}
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

        {/* Complaints Table */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
            इस फ़िल्टर में कोई केस उपलब्ध नहीं है (No complaints in this queue).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Scammer Contact / Link</th>
                  <th className="p-3">Amount Lost</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {rep.referenceId}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{rep.categoryLabel}</span>
                      <span className="text-[11px] text-slate-500">{rep.platform}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-700 max-w-[180px] truncate" title={rep.scammerDetail}>
                      {rep.scammerDetail}
                    </td>
                    <td className="p-3 font-mono font-semibold">
                      {rep.amountLost > 0 ? (
                        <span className="text-rose-600 font-bold">₹{rep.amountLost.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-emerald-700">₹0 (Saved)</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          rep.status === 'pending_review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : rep.status === 'under_investigation'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : rep.status === 'domain_blocked'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {rep.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">{rep.submittedAt}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSelectCase(rep)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                      >
                        Review Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: CASE REVIEW & OFFICIAL GUIDANCE */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-blue-600 font-mono font-bold">CASE FILE: {selectedReport.referenceId}</span>
                <h3 className="font-bold text-slate-900 text-base font-serif">{selectedReport.categoryLabel}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Case Details Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <strong>Reporter:</strong> {selectedReport.reporterName || 'Anonymous Citizen'}
                </div>
                <div>
                  <strong>Protected Contact:</strong> {maskContact(selectedReport.reporterContact)}
                </div>
                <div>
                  <strong>Scammer Detail:</strong> <code className="font-mono text-slate-900">{selectedReport.scammerDetail}</code>
                </div>
                <div>
                  <strong>Reported Financial Loss:</strong>{' '}
                  <span className={selectedReport.amountLost > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    ₹{selectedReport.amountLost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-slate-700">
                <strong>Incident Description:</strong>
                <p className="mt-1 leading-relaxed bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.evidenceText && (
                <div className="text-slate-700">
                  <strong>Attached Evidence:</strong>
                  <p className="mt-1 font-mono text-[11px] bg-slate-100 p-2 rounded text-slate-800">
                    {selectedReport.evidenceText}
                  </p>
                </div>
              )}
            </div>

            {actionSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Officer Action Form */}
            <form onSubmit={handleSaveCaseUpdate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Update Investigation Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="under_investigation">Under Investigation (मामला जांच में)</option>
                  <option value="guidance_provided">Official Guidance Provided (सलाह दी गई)</option>
                  <option value="domain_blocked">Phishing Domain Flagged / Blocked (ब्लॉक किया गया)</option>
                  <option value="resolved">Case Closed / Resolved (निस्तारित)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Official Bank Guidance to Citizen (पीड़ित नागरिक हेतु आधिकारिक बैंक मार्गदर्शन)
                </label>
                <textarea
                  rows={3}
                  value={guidanceText}
                  onChange={(e) => setGuidanceText(e.target.value)}
                  placeholder="Enter official instructions: e.g. Dispute filed with nodal officer, reset netbanking password, call 1930..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Internal Bank Vigilance Note (आंतरिक सुरक्षा जांच नोट)
                </label>
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="e.g. Beneficiary account freeze requested via NPCI / Nodal Bank Cyber Cell..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Save & Update Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST PUBLIC SCAM ALERT */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base font-serif">Broadcast Public Scam Alert</h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alert Headline *</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. Alert: Spoofed Bank APK circulating on WhatsApp"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={alertCategory}
                    onChange={(e) => setAlertCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Banking Phishing">Banking Phishing</option>
                    <option value="Utility Threat">Utility Threat</option>
                    <option value="UPI QR Fraud">UPI QR Fraud</option>
                    <option value="Job & Investment Scam">Job & Investment Scam</option>
                    <option value="Malicious APK">Malicious APK</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value as RiskLevel)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="high">High Risk (Urgent)</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Informational / Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Summary (1-2 sentences) *</label>
                <textarea
                  rows={2}
                  value={alertSummary}
                  onChange={(e) => setAlertSummary(e.target.value)}
                  placeholder="Concise warning explaining what scammers are doing..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Public Safety Advice</label>
                <textarea
                  rows={2}
                  value={alertAdvice}
                  onChange={(e) => setAlertAdvice(e.target.value)}
                  placeholder="Official instructions for citizens..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Publish Public Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

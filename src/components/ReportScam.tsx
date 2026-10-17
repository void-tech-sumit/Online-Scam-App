import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Building2,
  Info,
  Calendar,
  IndianRupee,
  Phone,
  Link,
  User,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import { ScamCategory, ScamReport } from '../types';

interface ReportScamProps {
  reports: ScamReport[];
  onSubmitReport: (newReport: Omit<ScamReport, 'id' | 'referenceId' | 'status' | 'submittedAt'>) => void;
  onNavigateToEmergency: () => void;
}

const SCAM_CATEGORIES: { id: ScamCategory; label: string }[] = [
  { id: 'phishing_sms', label: 'Phishing SMS / Fake Text Message' },
  { id: 'whatsapp_fraud', label: 'WhatsApp Threat or Lottery' },
  { id: 'fake_kyc', label: 'Fake Bank KYC / Account Block Notice' },
  { id: 'fake_customer_care', label: 'Fake Customer Support Phone Call' },
  { id: 'upi_qr_fraud', label: 'UPI / OLX QR Code Money Request' },
  { id: 'job_investment', label: 'Work From Home / Telegram Task Scam' },
  { id: 'remote_access', label: 'Asked to Install AnyDesk / QuickSupport' },
  { id: 'other', label: 'Other Fraud / Scam Incident' },
];

export const ReportScam: React.FC<ReportScamProps> = ({
  reports,
  onSubmitReport,
  onNavigateToEmergency,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'my-reports'>('form');

  // Form fields
  const [category, setCategory] = useState<ScamCategory>('phishing_sms');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [scammerDetail, setScammerDetail] = useState('');
  const [amountLost, setAmountLost] = useState<string>('0');
  const [platform, setPlatform] = useState('SMS / Mobile Text');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [evidenceText, setEvidenceText] = useState('');

  // Form Validation & Confirmation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!description.trim() || description.trim().length < 15) {
      err.description = 'Please provide a clear description of at least 15 characters.';
    }
    if (!scammerDetail.trim()) {
      err.scammerDetail = 'Please provide the scammer’s phone number, email, or website link.';
    }
    if (!date) {
      err.date = 'Please select the date of occurrence.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const categoryObj = SCAM_CATEGORIES.find((c) => c.id === category);
    const parsedAmount = parseFloat(amountLost) || 0;

    const severity = parsedAmount > 0 || category === 'fake_kyc' || category === 'remote_access' ? 'high' : 'medium';

    onSubmitReport({
      category,
      categoryLabel: categoryObj?.label || 'Fraud Report',
      date,
      time,
      scammerDetail: scammerDetail.trim(),
      amountLost: parsedAmount,
      platform,
      description: description.trim(),
      reporterName: reporterName.trim() || 'Anonymous Customer',
      reporterContact: reporterContact.trim() || undefined,
      evidenceText: evidenceText.trim() || undefined,
      severity,
    });

    const generatedRef = `SCS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedSuccess(generatedRef);

    // Reset Form
    setDescription('');
    setScammerDetail('');
    setAmountLost('0');
    setEvidenceText('');
    setReporterName('');
    setReporterContact('');
    setErrors({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Report Online Scam Incident</h1>
              <p className="text-sm text-slate-600 mt-1">
                Help bank fraud officers identify emerging scam patterns and assist affected account holders.
              </p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => {
                setActiveTab('form');
                setSubmittedSuccess(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Report Form
            </button>
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-reports'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Logged Cases</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {reports.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Disclosure Banner (Required by prompt) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Official Vigilance Protocol Disclosure:</strong> This report is logged into the ScamShield National Fraud Registry (Incident Queue). Authorized Bank Vigilance officers in the <strong>Bank Employee Portal</strong> review submitted evidence to issue customer guidance and submit malicious domains to national telecom and cybersecurity authorities. <em>This platform assists bank fraud desks and does not replace statutory police reporting.</em> For immediate financial loss escalation, dial <strong>National Cyber Crime Helpline 1930</strong> and register on the official portal <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-700">cybercrime.gov.in</a>.
        </div>
      </div>

      {submittedSuccess && activeTab === 'form' ? (
        /* Submission Success Card */
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Report Successfully Logged</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your scam incident has been assigned a unique reference ID and submitted to the bank vigilance queue.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] text-slate-500 block uppercase font-mono">Case Reference ID</span>
              <span className="text-lg font-mono font-bold text-blue-700">{submittedSuccess}</span>
            </div>
            <button
              onClick={() => copyToClipboard(submittedSuccess)}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-xs max-w-lg mx-auto text-left leading-relaxed">
            <strong className="block font-semibold mb-1">What Happens Next in the Bank System:</strong>
            1. An authorized bank vigilance officer reviews your report in the <strong>Bank Employee Portal</strong>.<br />
            2. The officer adds official guidance and initiates URL/domain blacklisting if applicable.<br />
            3. You can inspect the status and employee notes at any time under the <strong>Logged Cases</strong> tab.
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('my-reports')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              View in Logged Cases
            </button>
            <button
              onClick={() => setSubmittedSuccess(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : activeTab === 'form' ? (
        /* Report Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="scam-category" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Type of Scam / Fraud *
              </label>
              <select
                id="scam-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ScamCategory)}
                className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {SCAM_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label htmlFor="scam-platform" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Communication Medium *
              </label>
              <select
                id="scam-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="SMS / Mobile Text">SMS / Mobile Text</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Direct Phone Call (Vishing)">Direct Phone Call (Vishing)</option>
                <option value="Telegram">Telegram</option>
                <option value="Phishing Website / Link">Phishing Website / Link</option>
                <option value="OLX / Marketplaces">OLX / Marketplaces</option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="incident-date" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Date of Incident *
              </label>
              <input
                id="incident-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600"
              />
              {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label htmlFor="incident-time" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Approximate Time
              </label>
              <input
                id="incident-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Financial Loss */}
            <div>
              <label htmlFor="financial-loss" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Financial Loss (INR ₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  id="financial-loss"
                  type="number"
                  min="0"
                  step="100"
                  value={amountLost}
                  onChange={(e) => setAmountLost(e.target.value)}
                  placeholder="0 if prevented"
                  className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Enter 0 if you did not transfer money</span>
            </div>
          </div>

          {/* Scammer Details */}
          <div>
            <label htmlFor="scammer-detail" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Scammer's Phone Number, Email, or Website URL *
            </label>
            <input
              id="scammer-detail"
              type="text"
              value={scammerDetail}
              onChange={(e) => setScammerDetail(e.target.value)}
              placeholder="e.g. +91 98451 23456 or http://sbi-kyc-verify.top or scammer@upi"
              className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 font-mono placeholder:font-sans"
            />
            {errors.scammerDetail && <p className="text-xs text-rose-600 mt-1">{errors.scammerDetail}</p>}
          </div>

          {/* Story Description */}
          <div>
            <label htmlFor="incident-desc" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              What Happened? (Describe the Incident in Simple Words) *
            </label>
            <textarea
              id="incident-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how the scammer approached you, what they claimed, what they asked you to do, and what actions you took..."
              className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>

          {/* Evidence Text */}
          <div>
            <label htmlFor="evidence-text" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Suspicious Message Text or Evidence Details (Optional)
            </label>
            <textarea
              id="evidence-text"
              rows={2}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder="Copy the exact SMS, WhatsApp text, or bank transaction UTR reference here..."
              className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 font-mono text-xs placeholder:font-sans placeholder:text-slate-400"
            />
          </div>

          {/* Reporter Optional Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Reporter Contact Details (Optional - You may submit anonymously)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your Name (or leave blank)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Your Mobile or Email (or leave blank)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Note: Contact info is never shared publicly. In the Bank Employee Portal, personal details are masked according to privacy standards.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * Required fields. By submitting, you agree to demo incident logging.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report to Bank Desk</span>
            </button>
          </div>
        </form>
      ) : (
        /* Logged Cases View */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing all active logged reports in current session</span>
            <span className="font-semibold">{reports.length} total cases</span>
          </div>

          {reports.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No reports have been submitted yet.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {rep.referenceId}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{rep.categoryLabel}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rep.status === 'domain_blocked'
                          ? 'bg-purple-100 text-purple-800'
                          : rep.status === 'under_investigation'
                          ? 'bg-amber-100 text-amber-800'
                          : rep.status === 'guidance_provided'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Status: {rep.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">Occurred On:</span>
                    <span className="font-medium text-slate-800">{rep.date} at {rep.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reported Scammer:</span>
                    <span className="font-mono font-medium text-slate-800 truncate block">{rep.scammerDetail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reported Loss:</span>
                    <span className={`font-bold ${rep.amountLost > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {rep.amountLost > 0 ? `₹${rep.amountLost.toLocaleString('en-IN')}` : '₹0 (Prevented)'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rep.description}
                </p>

                {/* Bank Employee Official Guidance (if reviewed) */}
                {rep.officialGuidance ? (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded-r-xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-700" />
                        <span>Official Bank Advisory & Action Taken:</span>
                      </span>
                      {rep.reviewedBy && (
                        <span className="text-[11px] font-normal text-blue-700">By {rep.reviewedBy}</span>
                      )}
                    </div>
                    <p className="text-xs text-blue-950 leading-relaxed font-medium">
                      {rep.officialGuidance}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg">
                    Case is pending review by bank vigilance desk officers. Check back shortly for guidance.
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

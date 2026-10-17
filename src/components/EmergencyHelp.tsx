import React, { useState } from 'react';
import {
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Building2,
  Search,
  MessageSquare,
  AlertTriangle,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { BANK_EMERGENCY_CONTACTS } from '../data/mockData';

// Helper to parse multiple contact items (phone numbers) separated by slash or comma
function parsePhoneNumbers(val?: string): string[] {
  if (!val) return [];
  return val
    .split(/[\/,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Helper to parse multiple email addresses separated by slash or comma
function parseEmails(val?: string): string[] {
  if (!val) return [];
  return val
    .split(/[\/,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const EmergencyHelp: React.FC = () => {
  const [searchBank, setSearchBank] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    const cleanText = text.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = cleanText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = cleanText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredBanks = BANK_EMERGENCY_CONTACTS.filter((b) =>
    b.bankName.toLowerCase().includes(searchBank.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Primary Emergency Banner: 1930 Helpline */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-rose-700/60 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>Government of India · Ministry of Home Affairs Cyber Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
            National Cyber Crime Helpline: Dial 1930
          </h1>

          <p className="text-sm sm:text-base text-rose-100 leading-relaxed font-sans">
            If you have been cheated or money has been deducted unauthorizedly from your bank account,
            dial <strong>1930</strong> immediately. The Citizen Financial Cyber Fraud Reporting and Management
            System (CFCFRMS) connects directly to banks to freeze stolen funds in transit.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:1930"
              className="bg-white hover:bg-rose-50 text-rose-950 font-black px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>Call Helpline 1930 (Toll-Free)</span>
            </a>

            <button
              onClick={() => copyToClipboard('1930', 'helpline-1930')}
              className="bg-rose-800/80 hover:bg-rose-700 text-white font-semibold px-4 py-3 rounded-xl border border-rose-400/40 transition-colors flex items-center gap-2 text-sm cursor-pointer"
              title="Copy Helpline 1930"
            >
              {copiedText === 'helpline-1930' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied 1930</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy 1930</span>
                </>
              )}
            </button>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="bg-rose-800/80 hover:bg-rose-700 text-white font-semibold px-5 py-3 rounded-xl border border-rose-400/40 transition-colors flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit cybercrime.gov.in Portal</span>
            </a>
          </div>
        </div>
      </section>

      {/* The 4-Step Golden Hour Protocol */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              The "Golden Hour" Protocol: What to Do in the First 60 Minutes
            </h2>
            <p className="text-xs text-slate-500">
              Actions taken in the first 1 to 2 hours determine whether your lost funds can be recovered.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Freeze All Cards & UPI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immediately block your ATM/Debit card and disable NetBanking and UPI transactions using your official mobile banking app or emergency SMS code.
              </p>
            </div>
            <div className="text-[11px] text-blue-700 font-semibold bg-blue-50 p-2 rounded">
              Stops further debits instantly.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Call Cyber Helpline 1930</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain the incident to the police operator. Provide the transaction amount, time, and UTR number. The police trigger an automatic lien freeze on the recipient account.
              </p>
            </div>
            <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded">
              Lien freezes scammer account.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">File at cybercrime.gov.in</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log on to the National Cyber Crime Portal and register a formal complaint under "Financial Fraud". Keep the generated acknowledgement slip.
              </p>
            </div>
            <div className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 p-2 rounded">
              Generates legal police reference.
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Visit Your Bank Branch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit a written dispute letter with the police acknowledgement slip, bank account statement, and fraudulent SMS screenshots to your branch manager.
              </p>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded">
              Required for bank chargeback.
            </div>
          </div>
        </div>
      </section>

      {/* Indian Banks Emergency Hotlines Directory */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Official Bank Emergency Contact Directory
              </h2>
              <p className="text-xs text-slate-500">
                Direct verified toll-free numbers, card-blocking SMS formats, and fraud reporting desks.
              </p>
            </div>
          </div>

          {/* Search Bank */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter bank name..."
              value={searchBank}
              onChange={(e) => setSearchBank(e.target.value)}
              className="pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanks.map((bank, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <h3 className="font-bold text-slate-900 text-base">{bank.bankName}</h3>
                <a
                  href={bank.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Emergency Fraud Desk - Each Number Separated */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 block text-[11px] font-semibold">Emergency Fraud Line:</span>
                  <div className="space-y-1.5">
                    {parsePhoneNumbers(bank.emergencyFraudNumber).map((num, numIdx) => {
                      const copyId = `fraud-${idx}-${numIdx}`;
                      const isCopied = copiedText === copyId;
                      return (
                        <div
                          key={numIdx}
                          className="flex items-center justify-between bg-rose-50/40 hover:bg-rose-50/80 px-2.5 py-1.5 rounded-md border border-rose-100 transition-colors"
                        >
                          <span className="font-mono font-bold text-rose-700 text-xs sm:text-sm">
                            {num}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${num.replace(/\s+/g, '')}`}
                              className="p-1 text-slate-500 hover:text-rose-700 transition-colors"
                              title={`Direct dial ${num}`}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => copyToClipboard(num, copyId)}
                              className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                              title={`Copy ${num}`}
                            >
                              {isCopied ? (
                                <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-[11px]">
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Toll Free - Each Number Separated */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 block text-[11px] font-semibold">General Toll-Free:</span>
                  <div className="space-y-1.5">
                    {parsePhoneNumbers(bank.tollFree).map((num, numIdx) => {
                      const copyId = `toll-${idx}-${numIdx}`;
                      const isCopied = copiedText === copyId;
                      return (
                        <div
                          key={numIdx}
                          className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
                        >
                          <span className="font-mono font-semibold text-slate-800 text-xs sm:text-sm">
                            {num}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${num.replace(/\s+/g, '')}`}
                              className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                              title={`Direct dial ${num}`}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => copyToClipboard(num, copyId)}
                              className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                              title={`Copy ${num}`}
                            >
                              {isCopied ? (
                                <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-[11px]">
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SMS Block Code */}
                <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200/80 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-blue-900 font-semibold block text-[11px] mb-0.5">
                      Fast Card Block via SMS:
                    </span>
                    <code className="text-blue-950 font-mono text-xs font-bold block break-all">
                      {bank.smsBlockCode}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bank.smsBlockCode, `sms-${idx}`)}
                    className="p-1.5 text-blue-700 hover:text-blue-950 transition-colors cursor-pointer flex items-center gap-1 text-[11px] shrink-0 bg-blue-100/70 hover:bg-blue-200/70 rounded-md"
                    title="Copy SMS format"
                  >
                    {copiedText === `sms-${idx}` ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-800 hover:text-blue-950 text-[11px]">
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Fraud Email */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-slate-500 block text-[11px] font-semibold">Fraud Reporting Email:</span>
                  <div className="space-y-1">
                    {parseEmails(bank.fraudEmail).map((email, emailIdx) => {
                      const copyId = `email-${idx}-${emailIdx}`;
                      const isCopied = copiedText === copyId;
                      return (
                        <div
                          key={emailIdx}
                          className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-md text-[11px] border border-slate-100 transition-colors"
                        >
                          <a
                            href={`mailto:${email}`}
                            className="font-mono text-blue-600 hover:underline truncate max-w-[220px]"
                            title={`Send email to ${email}`}
                          >
                            {email}
                          </a>
                          <button
                            onClick={() => copyToClipboard(email, copyId)}
                            className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px] shrink-0"
                            title={`Copy ${email}`}
                          >
                            {isCopied ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-[11px]">
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cybercrime Evidence Collection Checklist */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-serif text-white">
          Evidence Checklist to Keep Ready Before Reporting
        </h3>
        <p className="text-xs text-slate-300">
          Gather these details beforehand to ensure faster processing by police officers and your bank manager:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-200">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">1. Bank Account Statement</span>
            Showing the exact debited amount, date, timestamp, and beneficiary account/UPI details.
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">2. Transaction UTR / Ref No</span>
            The 12-digit Unique Transaction Reference number from your bank debit SMS.
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">3. Phishing Screenshots</span>
            Screenshots of the scammer's WhatsApp chat, SMS, phone number, and fake website URL.
          </div>
        </div>
      </section>
    </div>
  );
};

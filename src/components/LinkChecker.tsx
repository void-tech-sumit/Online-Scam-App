import React, { useState, useRef } from 'react';
import {
  Link2,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Unlock,
  Globe,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Info,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_URLS } from '../data/mockData';
import { LinkAnalysisResult } from '../types';
import { analyzeLink } from '../utils/analyzer';

interface LinkCheckerProps {
  onNavigateToReport: () => void;
  onNavigateToEmergency: () => void;
}

export const LinkChecker: React.FC<LinkCheckerProps> = ({
  onNavigateToReport,
  onNavigateToEmergency,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [analysis, setAnalysis] = useState<LinkAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [validationError, setValidationError] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);

  const runScan = (urlToScan: string) => {
    if (!urlToScan.trim()) {
      setValidationError('Please enter or paste a website URL to inspect.');
      return;
    }
    setValidationError('');
    setIsScanning(true);

    // Brief realistic scanning pulse
    setTimeout(() => {
      const result = analyzeLink(urlToScan);
      setAnalysis(result);
      setIsScanning(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 280);
  };

  const handleScan = () => {
    runScan(inputUrl);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    runScan(sampleUrl);
  };

  const handleReset = () => {
    setInputUrl('');
    setAnalysis(null);
    setValidationError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Suspicious Link & URL Checker</h1>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full">
                URL Safety Inspector
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Enter any website address to inspect for warning signs like unencrypted HTTP connections, lookalike banking domains, disguised URL shorteners, and high-risk domain extensions.
            </p>
          </div>
        </div>

        {/* Preset Sample URLs */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">Test with sample links (1-click test & inspect):</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s.url)}
                className="text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <label htmlFor="url-input" className="block text-sm font-bold text-slate-900">
          Enter Website URL or Link:
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Globe className="w-5 h-5" />
          </div>
          <input
            id="url-input"
            type="text"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleScan();
              }
            }}
            placeholder="e.g. sbi-kyc-update-portal.top or http://bank-verification.xyz or https://onlinesbi.sbi"
            className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 text-sm font-mono placeholder:font-sans placeholder:text-slate-400"
          />
        </div>

        {validationError && (
          <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            ⚠️ {validationError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={!inputUrl && !analysis}
              className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">(Tip: Press Enter to scan)</span>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Inspecting Domain Security...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan Link for Fraud Signs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Critical Safety Notice (Mandatory Requirement) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Golden Safety Standard:</strong> Never claim a website is completely safe based only on a basic automated check. Even HTTPS websites can host phishing pages. Always inspect the browser address bar for official domain spellings (e.g. <code>onlinesbi.sbi</code>, <code>hdfcbank.com</code>) before entering any passwords.
        </div>
      </div>

      {/* Scan Results View Target Ref */}
      <div ref={resultRef}>
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Risk Card */}
            <div
              className={`rounded-2xl p-6 border shadow-sm ${
                analysis.riskLevel === 'high'
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : analysis.riskLevel === 'medium'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      analysis.riskLevel === 'high'
                        ? 'bg-rose-600 text-white'
                        : analysis.riskLevel === 'medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {analysis.riskLevel === 'high' ? (
                      <AlertOctagon className="w-7 h-7" />
                    ) : analysis.riskLevel === 'medium' ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs uppercase font-extrabold tracking-wider opacity-80">
                      URL Heuristic Evaluation
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">
                      {analysis.riskLevel === 'high'
                        ? 'HIGH THREAT DETECTED'
                        : analysis.riskLevel === 'medium'
                        ? 'SUSPICIOUS PATTERNS IDENTIFIED'
                        : 'BASIC HEURISTICS PASSED'}
                    </h2>
                  </div>
                </div>

                {/* Threat Meter */}
                <div className="sm:text-right">
                  <div className="text-xs font-semibold opacity-75">Link Threat Score</div>
                  <div className="text-3xl font-black font-mono">
                    {analysis.riskScore}
                    <span className="text-sm font-normal opacity-70"> / 100</span>
                  </div>
                </div>
              </div>

              {/* Analyzed Domain details */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/90 p-3 rounded-lg border border-black/10">
                  <span className="text-slate-500 block">Parsed Domain Name:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm break-all">{analysis.domain || 'N/A'}</span>
                </div>
                <div className="bg-white/90 p-3 rounded-lg border border-black/10 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Protocol Encryption:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {analysis.protocol.toUpperCase()}
                    </span>
                  </div>
                  {analysis.protocol === 'https' ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-semibold">
                      <Lock className="w-3 h-3" /> Secure HTTPS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-xs font-bold">
                      <Unlock className="w-3 h-3" /> Insecure HTTP
                    </span>
                  )}
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="mt-4 p-4 rounded-xl bg-white/95 border border-black/10 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">
                  Safety Guidance:
                </h3>
                <p className="text-sm font-semibold text-slate-900">{analysis.recommendation}</p>
              </div>
            </div>

            {/* Red Flags Breakdown */}
            {analysis.detectedFlags.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Detected Warning Signs ({analysis.detectedFlags.length} issues identified)
                  </h3>
                </div>

                <div className="space-y-3">
                  {analysis.detectedFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{flag.title}</h4>
                        <span className="text-[11px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                          {flag.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{flag.explanation}</p>
                      {flag.evidence && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1">
                          Flagged element: <code className="text-rose-600 font-bold bg-rose-50 px-1 py-0.5 rounded">{flag.evidence}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Findings */}
            {analysis.safetyFindings.length > 0 && (
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 text-emerald-950 space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Security Observations:</span>
                </h3>
                <ul className="text-xs space-y-1 list-disc list-inside text-emerald-900">
                  {analysis.safetyFindings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900 text-white rounded-xl shadow-md">
              <div>
                <div className="font-bold text-sm">Did you encounter a malicious phishing portal?</div>
                <p className="text-xs text-slate-300">File a fraud incident report to initiate bank domain blacklisting.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onNavigateToReport}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Report this Link
                </button>
                <button
                  onClick={onNavigateToEmergency}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Emergency Helplines
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

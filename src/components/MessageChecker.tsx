import React, { useState, useRef } from 'react';
import {
  MessageSquareWarning,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Info,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { SAMPLE_MESSAGES } from '../data/mockData';
import { MessageAnalysisResult } from '../types';
import { analyzeMessage } from '../utils/analyzer';

interface MessageCheckerProps {
  onNavigateToReport: () => void;
  onNavigateToEmergency: () => void;
}

export const MessageChecker: React.FC<MessageCheckerProps> = ({
  onNavigateToReport,
  onNavigateToEmergency,
}) => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<MessageAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [validationError, setValidationError] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);

  const runAnalysis = (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) {
      setValidationError('Please enter or paste a message text first.');
      return;
    }
    setValidationError('');
    setIsScanning(true);

    // Brief realistic scanning pulse
    setTimeout(() => {
      const result = analyzeMessage(textToAnalyze);
      setAnalysis(result);
      setIsScanning(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 280);
  };

  const handleAnalyze = () => {
    runAnalysis(inputText);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    runAnalysis(sampleText);
  };

  const handleReset = () => {
    setInputText('');
    setAnalysis(null);
    setValidationError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <MessageSquareWarning className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Suspicious Message Checker</h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
                Rule-Based Scanner
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Paste any suspicious SMS, WhatsApp message, or payment request.
              Our rule-based pattern matching algorithm checks for urgency pressure, OTP or PIN requests, fake prize rewards, and unverified links.
            </p>
          </div>
        </div>

        {/* Preset Sample Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">Test with sample scam patterns (1-click test & analyze):</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s.text)}
                className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="message-input" className="block text-sm font-bold text-slate-900">
            Paste Message Text Here:
          </label>
          <div className="text-xs text-slate-400">
            {inputText.length} characters · {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
          </div>
        </div>

        <textarea
          id="message-input"
          rows={5}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (validationError) setValidationError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'Dear customer, your bank account is suspended due to pending KYC. Click http://... to verify OTP immediately or power will be cut tonight...'"
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 text-sm font-mono placeholder:font-sans placeholder:text-slate-400 resize-y"
        />

        {validationError && (
          <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            ⚠️ {validationError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={!inputText && !analysis}
              className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">(Tip: Press Ctrl + Enter to analyze)</span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Threat Patterns...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Message Safety</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mandatory Accuracy Disclaimer Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Important Educational Warning:</strong> Automated heuristic results are generated to help you spot obvious red flags. They are not guaranteed to be 100% accurate. Scammers constantly alter phrasing. If you are unsure about any account status, always contact your official bank branch or call the number on the back of your ATM card.
        </div>
      </div>

      {/* Analysis Results View Target Ref */}
      <div ref={resultRef}>
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Risk Result Card */}
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
                      <CheckCircle className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs uppercase font-extrabold tracking-wider opacity-80">
                      Calculated Security Evaluation
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">
                      {analysis.riskLevel === 'high'
                        ? 'HIGH RISK DETECTED'
                        : analysis.riskLevel === 'medium'
                        ? 'MEDIUM RISK - CAUTION ADVISED'
                        : 'LOW RISK DETECTED'}
                    </h2>
                  </div>
                </div>

                {/* Threat Score Meter */}
                <div className="sm:text-right">
                  <div className="text-xs font-semibold opacity-75">Threat Probability Score</div>
                  <div className="text-3xl font-black font-mono">
                    {analysis.riskScore}
                    <span className="text-sm font-normal opacity-70"> / 100</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm font-medium leading-relaxed">{analysis.summary}</p>

              {/* Actionable Recommendation */}
              <div className="mt-4 p-4 rounded-xl bg-white/90 border border-black/10 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">
                  Recommended Immediate Action:
                </h3>
                <p className="text-sm font-semibold text-slate-900">{analysis.recommendedAction}</p>
              </div>
            </div>

            {/* Red Flags Discovered */}
            {analysis.detectedFlags.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Why this message may be fraudulent ({analysis.detectedFlags.length} Red Flags identified)
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
                          Category: {flag.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{flag.explanation}</p>
                      {flag.evidence && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1">
                          Triggered by: <span className="text-rose-600 font-semibold">{flag.evidence}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlighted Keywords Found */}
            {analysis.highlightedKeywords.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  Suspicious Keywords & Patterns Isolated:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.highlightedKeywords.map((word, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded"
                    >
                      "{word}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safe Points (if legitimate format detected) */}
            {analysis.safePoints.length > 0 && (
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 text-emerald-950 space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Legitimate Characteristics Observed:</span>
                </h3>
                <ul className="text-xs space-y-1 list-disc list-inside text-emerald-900">
                  {analysis.safePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900 text-white rounded-xl shadow-md">
              <div>
                <div className="font-bold text-sm">Did you already click the link or share details?</div>
                <p className="text-xs text-slate-300">Take immediate action to safeguard your bank account balance.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onNavigateToReport}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Report this Scam
                </button>
                <button
                  onClick={onNavigateToEmergency}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Emergency 1930 Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

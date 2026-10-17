import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Check,
  Lock,
  Phone,
  QrCode,
  Smartphone,
  MailCheck,
} from 'lucide-react';
import { QUIZ_QUESTIONS, SAFETY_TIPS_DATA } from '../data/mockData';

export const SafetyTips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'quiz'>('guides');
  const [selectedTipId, setSelectedTipId] = useState<string>(SAFETY_TIPS_DATA[0].id);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const activeTip = SAFETY_TIPS_DATA.find((t) => t.id === selectedTipId) || SAFETY_TIPS_DATA[0];

  const handleSelectAnswer = (qId: number, optId: string) => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const chosen = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (chosen === correctOpt?.id) {
        correct++;
      }
    });
    return correct;
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
  };

  const getTipIcon = (id: string) => {
    switch (id) {
      case 'tip-otp':
        return <Lock className="w-5 h-5 text-blue-600" />;
      case 'tip-call':
        return <Phone className="w-5 h-5 text-amber-600" />;
      case 'tip-upi':
        return <QrCode className="w-5 h-5 text-purple-600" />;
      case 'tip-remote':
        return <Smartphone className="w-5 h-5 text-rose-600" />;
      case 'tip-sender-id':
        return <MailCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Bank Fraud Prevention & Safety Knowledge</h1>
              <p className="text-sm text-slate-600 mt-1">
                Master the fundamental rules of digital banking safety and test your scam detection reflexes.
              </p>
            </div>
          </div>

          {/* Segmented Controls for Mode */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety Guides
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Your Reflexes Quiz
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'guides' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Navigation: Topics */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Core Security Modules
            </h2>
            {SAFETY_TIPS_DATA.map((tip) => {
              const isSelected = tip.id === selectedTipId;
              return (
                <button
                  key={tip.id}
                  onClick={() => setSelectedTipId(tip.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {getTipIcon(tip.id)}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {tip.title}
                    </h3>
                    <p
                      className={`text-[11px] mt-1 line-clamp-1 ${
                        isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {tip.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content: Detailed Module Guide */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Verified Banking Guideline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
                {activeTip.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {activeTip.summary}
              </p>
            </div>

            {/* Crucial Rules Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Fundamental Security Principles</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {activeTip.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2"></span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dos and Don'ts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Do's */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DO (Safe Habits)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {activeTip.doList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>DON'T (High Risk Traps)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {activeTip.dontList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real Scam Script vs Real Bank Advice */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Real-World Simulation
              </h3>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs sm:text-sm">
                <span className="font-bold text-amber-900 block text-xs uppercase">
                  Typical Fraudster Dialogue / Script:
                </span>
                <p className="italic text-amber-950 font-serif">
                  {activeTip.scamScriptExample}
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-slate-800 text-xs">
                  <strong className="text-slate-900 font-semibold">Official Bank Response: </strong>
                  {activeTip.realBankAdvice}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Interactive Banking Scam Detection Quiz
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Read each real-world case carefully and select the safest response.
              </p>
            </div>
            {submittedQuiz && (
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg">
                  Score: {calculateScore()} / {QUIZ_QUESTIONS.length} Correct
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-8">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const chosen = userAnswers[q.id];
              return (
                <div key={q.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {q.scenario}
                    </h3>
                  </div>

                  <div className="space-y-2.5 pl-0 sm:pl-10">
                    {q.options.map((opt) => {
                      const isSelected = chosen === opt.id;
                      let optionClasses = 'border-slate-200 bg-white text-slate-800 hover:border-blue-400';

                      if (submittedQuiz) {
                        if (opt.isCorrect) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                        } else if (isSelected && !opt.isCorrect) {
                          optionClasses = 'border-rose-500 bg-rose-50 text-rose-950 line-through';
                        } else {
                          optionClasses = 'border-slate-200 opacity-60';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-blue-600 bg-blue-50 text-blue-950 font-medium ring-1 ring-blue-600';
                      }

                      return (
                        <div key={opt.id}>
                          <button
                            onClick={() => handleSelectAnswer(q.id, opt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${optionClasses}`}
                          >
                            {opt.text}
                          </button>
                          {submittedQuiz && (isSelected || opt.isCorrect) && (
                            <p
                              className={`text-xs mt-1.5 p-2.5 rounded-lg ${
                                opt.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Quiz Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {Object.keys(userAnswers).length} of {QUIZ_QUESTIONS.length} answered
            </span>

            {!submittedQuiz ? (
              <button
                onClick={() => setSubmittedQuiz(true)}
                disabled={Object.keys(userAnswers).length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Submit Answers & Check Results
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

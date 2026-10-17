import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  HelpCircle,
  Code2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ScamShieldLogo } from './ScamShieldLogo';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const vivaQuestions = [
    {
      q: '1. System Purpose & Core Objectives',
      a: 'Operational Mandate: Cyber fraudsters heavily target bank customers using social engineering, deceptive SMS links, fake KYC update threats, and unauthorized payment collection requests. Many individuals lack immediate verification channels prior to clicking or approving transactions.\n\nSolution Architecture: ScamShield provides a unified cyber defense platform with two synchronized tiers: (1) Customer Self-Defense Tools to instantly inspect text messages and URLs for known fraud markers, and (2) Bank Employee Fraud Vigilance Console allowing authorized security personnel to review reported incidents, update case statuses, and broadcast active consumer advisories.',
    },
    {
      q: '2. Detection Engine: Heuristic Rule-Based Pattern Matching',
      a: 'The message and link inspection engine utilizes a client-side heuristic pattern-matching engine written in TypeScript. It evaluates inputs across 5 primary threat vectors:\n• Urgency & Coercion: Analyzes words like "account blocked immediately", "electricity disconnected tonight", "suspended in 24 hours".\n• Credential & OTP Harvesting: Flags direct demands for OTP, ATM PIN, CVV, or NetBanking login passwords.\n• Financial Lures: Identifies counterfeit lotteries, task rewards, or instant cashback promises.\n• Malicious APK & Remote Access: Detects .apk links, TeamViewer, AnyDesk, or screen-mirroring app installation requests.\n• High-Risk Contact Routing: Flags unverified personal 10-digit mobile numbers posing as institutional bank helplines.\n\nEach vector computes weighted risk coefficients producing categorized Low, Medium, or High Risk assessments with actionable advice.',
    },
    {
      q: '3. Dual-Tier User Model: Customer Self-Protection & Bank Officer Desk',
      a: 'Financial cybersecurity requires dual coordination:\n• Account Holders: Require immediate, zero-friction diagnostic tools before interacting with suspicious content, plus one-touch access to 24+ verified bank hotlines and the 1930 Cyber Helpline.\n• Bank Fraud Officers: Require a centralized investigation queue to triage customer-reported incidents, analyze emerging scams, apply internal status notes, and publish live public warnings to protect the wider banking community.\n• Customer PII Protection: All customer phone numbers and email addresses are automatically masked in the employee console to maintain strict privacy governance.',
    },
    {
      q: '4. National Protocol: The "Golden Hour" of Financial Fraud',
      a: 'The "Golden Hour" represents the first 1 to 2 hours immediately following an unauthorized bank debit. By immediately dialing India\'s National Cyber Crime Helpline (1930) or reporting through cybercrime.gov.in, the Indian Cyber Crime Coordination Centre (I4C) coordinates directly with beneficiary banks and payment aggregators to place temporary lien freezes on fraudster accounts before funds are withdrawn through ATMs or cryptocurrency exchanges.',
    },
    {
      q: '5. Phishing Link & Domain Heuristics',
      a: 'The URL diagnostic engine examines several high-probability risk signals:\n1. Transport Security: Warns if plain, unencrypted HTTP is utilized.\n2. Brand Typosquatting: Analyzes domain tokens for deceptive combinations of legitimate bank brands (e.g., SBI, HDFC, ICICI, Axis) with bait keywords like "kyc-update", "reward-points", or "login-portal".\n3. High-Abuse Domain TLDs: Flags domain extensions disproportionately used in phishing (.xyz, .top, .live, .tk, .cc).\n4. Obfuscated Redirects: Identifies shortened URLs (bit.ly, tinyurl) used to obscure final destinations.',
    },
    {
      q: '6. Technology Stack & Implementation Standards',
      a: '• Frontend Architecture: React 19 SPA with TypeScript for compile-time safety and component modularity.\n• Design System: Tailwind CSS for clean, responsive layout across mobile and desktop viewports.\n• Vector Assets: Lucide React iconography aligned with banking security conventions.\n• State & Persistence: LocalStorage persistence for user reports and employee advisories.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>System Architecture & Technical Specifications</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                ScamShield – Online Scam Protection System
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Institutional Cyber Safety · <strong>Bank Employee & Customer Ecosystem</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Overview Card */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
          <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Project Summary & Motivation</span>
          </h3>
          <p className="text-xs text-blue-900 leading-relaxed">
            This project was developed to address the rising wave of digital banking fraud in India, where everyday account holders are targeted with phishing SMS, WhatsApp investment tasks, and fake electricity bill disconnection notices. ScamShield bridges the gap between bank customers and bank employees by offering real-time screening tools for customers and a case management dashboard for bank staff.
          </p>
        </div>

        {/* 2 Main User Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Role 1: Bank Customer Portal</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Test incoming SMS & WhatsApp messages for fraud red flags.</li>
              <li>Inspect website URLs for spoofing, shorteners & HTTP risks.</li>
              <li>Learn banking safety rules (never share OTP, PIN, or CVV).</li>
              <li>Submit structured scam reports with auto-generated case IDs.</li>
              <li>Access verified bank emergency helpline numbers and 1930.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Role 2: Bank Employee Portal</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Demo authentication desk for authorized bank fraud officers.</li>
              <li>Review customer scam reports with masked privacy protection.</li>
              <li>Update case status: Pending, Under Investigation, or Resolved.</li>
              <li>Add customized official safety guidance notes for customers.</li>
              <li>Publish real-time public scam alerts directly to the dashboard.</li>
            </ul>
          </div>
        </div>

        {/* Modules Implemented */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <span>Implemented Project Modules & Tech Stack</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="block text-slate-900 font-semibold mb-0.5">1. Rule-Based Message Analyzer</strong>
              Pattern-matching scanner that evaluates urgency syntax, OTP harvesting, fake lottery prizes, and suspicious mobile caller IDs.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="block text-slate-900 font-semibold mb-0.5">2. Suspicious Link Detector</strong>
              Parses URLs, checks SSL protocol, flags high-abuse TLDs (.xyz, .top), URL shorteners, and fake banking subdomains.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="block text-slate-900 font-semibold mb-0.5">3. Incident Report System</strong>
              Form with client validation, auto-generated reference numbers (e.g. SCS-2026-XXXX), and mock database storage.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="block text-slate-900 font-semibold mb-0.5">4. National 1930 & Bank Directory</strong>
              Consolidates India's Cyber Crime Helpline 1930, Golden Hour instructions, card blocking SMS codes, and verified bank hotlines.
            </div>
          </div>
        </div>

        {/* Technical Stack Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-100 text-slate-800 font-mono px-3 py-1 rounded-md border border-slate-200 font-semibold">
            React 19 (Component Architecture)
          </span>
          <span className="bg-slate-100 text-slate-800 font-mono px-3 py-1 rounded-md border border-slate-200 font-semibold">
            TypeScript (Type Safety)
          </span>
          <span className="bg-slate-100 text-slate-800 font-mono px-3 py-1 rounded-md border border-slate-200 font-semibold">
            Tailwind CSS (Responsive UI)
          </span>
          <span className="bg-slate-100 text-slate-800 font-mono px-3 py-1 rounded-md border border-slate-200 font-semibold">
            Lucide Icons
          </span>
        </div>

        {/* System Architecture FAQ Accordion */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Technical Architecture & Security Verification FAQ</span>
          </h3>

          <div className="space-y-2">
            {vivaQuestions.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-3.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="pr-2">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-3.5 text-xs text-slate-700 bg-white border-t border-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-400 font-sans">
            ScamShield System Specifications · ISO/IEC 27001 & RBI Cyber Vigilance Aligned
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-md"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};

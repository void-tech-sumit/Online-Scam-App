export type RiskLevel = 'low' | 'medium' | 'high';

export interface RedFlag {
  id: string;
  category: 'urgency' | 'credentials' | 'financial' | 'suspicious_link' | 'impersonation' | 'apk_software';
  title: string;
  explanation: string;
  evidence?: string;
}

export interface MessageAnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  summary: string;
  detectedFlags: RedFlag[];
  highlightedKeywords: string[];
  safePoints: string[];
  recommendedAction: string;
  disclaimer: string;
}

export interface LinkAnalysisResult {
  url: string;
  normalizedUrl: string;
  protocol: 'https' | 'http' | 'unknown';
  domain: string;
  riskLevel: RiskLevel;
  riskScore: number;
  isIpAddress: boolean;
  hasSuspiciousTld: boolean;
  isShortener: boolean;
  hasTypoSquattingOrSpoofing: boolean;
  detectedFlags: RedFlag[];
  safetyFindings: string[];
  recommendation: string;
  disclaimer: string;
}

export type ScamCategory =
  | 'phishing_sms'
  | 'whatsapp_fraud'
  | 'fake_kyc'
  | 'fake_customer_care'
  | 'lottery_reward'
  | 'job_investment'
  | 'upi_qr_fraud'
  | 'remote_access'
  | 'other';

export type ReportStatus =
  | 'pending_review'
  | 'under_investigation'
  | 'guidance_provided'
  | 'domain_blocked'
  | 'resolved';

export interface ScamReport {
  id: string;
  referenceId: string;
  category: ScamCategory;
  categoryLabel: string;
  date: string;
  time: string;
  scammerDetail: string; // phone, email, or URL
  amountLost: number;
  platform: string;
  description: string;
  reporterName?: string;
  reporterContact?: string;
  evidenceText?: string;
  status: ReportStatus;
  severity: RiskLevel;
  submittedAt: string;
  employeeNotes?: string[];
  officialGuidance?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ScamAlert {
  id: string;
  title: string;
  category: string;
  severity: RiskLevel;
  date: string;
  summary: string;
  fullDetails: string;
  advice: string;
  reportedBy: string; // e.g. "ScamShield Cyber Cell & Bank Vigilance"
}

export interface SafetyTipItem {
  id: string;
  title: string;
  summary: string;
  rules: string[];
  doList: string[];
  dontList: string[];
  scamScriptExample: string;
  realBankAdvice: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface BankContact {
  bankName: string;
  tollFree: string;
  emergencyFraudNumber: string;
  smsBlockCode: string;
  officialWebsite: string;
  fraudEmail: string;
}

export interface EmployeeUser {
  id: string;
  name: string;
  role: string;
  branch: string;
  employeeId: string;
}

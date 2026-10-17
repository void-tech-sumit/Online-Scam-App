import { LinkAnalysisResult, MessageAnalysisResult, RedFlag, RiskLevel } from '../types';

export function analyzeMessage(rawMessage: string): MessageAnalysisResult {
  const message = rawMessage.trim();
  if (!message) {
    return {
      riskLevel: 'low',
      riskScore: 0,
      summary: 'Please enter or paste a message into the text area above to analyze its safety.',
      detectedFlags: [
        {
          id: 'no-input',
          category: 'urgency',
          title: 'No Message Content Provided',
          explanation: 'Paste an SMS, WhatsApp alert, or email body to evaluate suspicious patterns.',
        },
      ],
      highlightedKeywords: [],
      safePoints: [],
      recommendedAction: 'Paste an SMS or WhatsApp notification to run the security triage.',
      disclaimer: 'Automated heuristic results are for educational awareness and scam detection assistance. Automated results are not guaranteed to be 100% accurate. Always verify directly with your official bank branch or customer service.',
    };
  }

  const lower = message.toLowerCase();
  const detectedFlags: RedFlag[] = [];
  const highlightedKeywords: string[] = [];
  let score = 0;

  // 1. Sensitive Credentials & Identity / OTP / PIN Demands
  const credentialPatterns = [
    { key: 'otp', regex: /\b(otp|one[\s-]?time[\s-]?password)\b/i, title: 'OTP (One-Time Password) Solicitation' },
    { key: 'pin', regex: /\b(pin|atm[\s-]?pin|upi[\s-]?pin|mpin)\b/i, title: 'PIN Demanded (ATM/UPI PIN)' },
    { key: 'cvv', regex: /\b(cvv|cvv2|security[\s-]?code)\b/i, title: 'Card CVV Security Number Demanded' },
    { key: 'password', regex: /\b(password|netbanking[\s-]?password|login[\s-]?password)\b/i, title: 'NetBanking Password Demanded' },
    { key: 'kyc', regex: /\b(kyc|e-kyc|ekyc|pan[\s-]?card|aadhaar|aadhar|cif)\b/i, title: 'Sensitive KYC / PAN / Aadhaar Information Demanded' },
    { key: 'card details', regex: /\b(card[\s-]?number|expiry[\s-]?date|debit[\s-]?card|credit[\s-]?card)\b/i, title: 'Card Details Requested' },
  ];

  const foundCreds: string[] = [];
  for (const item of credentialPatterns) {
    if (item.regex.test(lower)) {
      foundCreds.push(item.key);
      highlightedKeywords.push(item.key);
      score += 25;
      detectedFlags.push({
        id: `cred-${item.key}`,
        category: 'credentials',
        title: item.title,
        explanation: `Genuine banking institutions NEVER solicit private authentication credentials (${item.key.toUpperCase()}) over SMS, WhatsApp, or phone calls.`,
        evidence: item.key,
      });
    }
  }

  // 2. Coercive Urgency & Threat Pressure Tactics
  const urgencyKeywords = [
    'immediately', 'urgent', 'urgently', 'blocked', 'block', 'suspended', 'freeze', 'frozen',
    'deactivated', 'terminated', 'disconnected', 'cut tonight', 'power cut', 'electricity cut',
    'within 24 hours', 'within 2 hours', 'within 1 hour', 'today', 'tonight', 'last warning',
    'penalty', 'fine of', 'legal action', 'arrest', 'warrant', 'fir registered', 'court order',
    'band ho jayega', 'turant', 'expiring today', 'will expire', 'account closed', 'last date',
  ];
  const foundUrgency = urgencyKeywords.filter((k) => lower.includes(k));
  if (foundUrgency.length > 0) {
    score += Math.min(foundUrgency.length * 15, 35);
    highlightedKeywords.push(...foundUrgency);
    detectedFlags.push({
      id: 'urgency-threat',
      category: 'urgency',
      title: 'High-Pressure Urgency or Coercion Tactics',
      explanation: `The message uses panic-inducing words (${foundUrgency.slice(0, 3).join(', ')}) designed to prevent rational verification before you act.`,
      evidence: foundUrgency.join(', '),
    });
  }

  // 3. Unsolicited Rewards, Fake Lottery, or Advance Fee Lures
  const financialLures = [
    'congratulations', 'congrats', 'won', 'winner', 'lottery', 'kbc', 'lucky draw',
    'reward points', 'cashback', 'bonus of', 'earn daily', 'part-time', 'part time job',
    'youtube like', 'hotel review', 'telegram task', 'processing fee', 'registration fee',
    'deposit rs', 'deposit inr', 'invest rs', 'double your money', 'sanctioned loan', 'pre-approved loan',
  ];
  const foundLures = financialLures.filter((k) => lower.includes(k));
  if (foundLures.length > 0) {
    score += Math.min(foundLures.length * 20, 40);
    highlightedKeywords.push(...foundLures);
    detectedFlags.push({
      id: 'financial-lure',
      category: 'financial',
      title: 'Unsolicited Reward, Lottery, or Upfront Fee Lure',
      explanation: `Promises unexpected winnings, lottery payouts, or easy task earnings (${foundLures.slice(0, 2).join(', ')}). Real prizes never require you to pay an advance fee or deposit money to claim funds.`,
      evidence: foundLures.join(', '),
    });
  }

  // 4. Malicious APK or Remote Screen Control Apps
  const maliciousSoftware = [
    '.apk', 'apk', 'install app', 'download app', 'anydesk', 'quicksupport', 'teamviewer',
    'rustdesk', 'screen share', 'remote access', 'airmirror',
  ];
  const foundSoftware = maliciousSoftware.filter((k) => lower.includes(k));
  if (foundSoftware.length > 0) {
    score += 45;
    highlightedKeywords.push(...foundSoftware);
    detectedFlags.push({
      id: 'malicious-software',
      category: 'apk_software',
      title: 'Malicious APK or Remote Desktop Installation Vector',
      explanation: `Urges downloading an APK package or installing remote access software (${foundSoftware.join(', ')}). This gives cyber criminals direct visibility and control over your device and incoming OTPs.`,
      evidence: foundSoftware.join(', '),
    });
  }

  // 5. UPI / QR Code Exploits
  const upiExploits = [
    'scan qr', 'scan this qr', 'enter pin to receive', 'receive money', 'scan to receive',
    'collect request', 'approve request',
  ];
  const foundUpi = upiExploits.filter((k) => lower.includes(k));
  if (foundUpi.length > 0) {
    score += 45;
    highlightedKeywords.push(...foundUpi);
    detectedFlags.push({
      id: 'upi-qr-fraud',
      category: 'financial',
      title: 'UPI QR Code / PIN Inversion Scam',
      explanation: 'Under UPI standards, scanning a QR code or entering a PIN is EXCLUSIVELY for SENDING money. You never scan a QR code or enter a PIN to receive money.',
      evidence: foundUpi.join(', '),
    });
  }

  // 6. Institutional Impersonation (Banks, Utility, Government)
  const institutions = [
    'sbi', 'hdfc', 'icici', 'pnb', 'axis', 'bob', 'kotak', 'rbi', 'reserve bank',
    'electricity office', 'power officer', 'electricity bill', 'bescom', 'msedcl', 'tneb', 'bses',
    'customs officer', 'income tax', 'telecom department', 'courier officer', 'fedex', 'indpost', 'speed post',
    'e-challan', 'echallan', 'traffic police', 'customer care',
  ];
  const foundInst = institutions.filter((k) => lower.includes(k));
  if (foundInst.length > 0 && (foundUrgency.length > 0 || foundCreds.length > 0 || foundSoftware.length > 0)) {
    score += 20;
    highlightedKeywords.push(...foundInst);
    detectedFlags.push({
      id: 'institutional-impersonation',
      category: 'impersonation',
      title: 'Institutional Impersonation Combined with Pressure',
      explanation: `The sender claims to represent an authoritative entity (${foundInst.join(', ')}) combined with urgency or credential demands.`,
      evidence: foundInst.join(', '),
    });
  }

  // 7. Embedded Links or Web Portals
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(top|xyz|tk|ml|icu|work|click|site|online|live|cc|pw)[^\s]*)/gi;
  const urlsInMsg = message.match(urlRegex);
  if (urlsInMsg && urlsInMsg.length > 0) {
    score += 25;
    highlightedKeywords.push(...urlsInMsg);
    detectedFlags.push({
      id: 'embedded-link',
      category: 'suspicious_link',
      title: 'Embedded Web Link / Unofficial Portal Address',
      explanation: `Contains external web links (${urlsInMsg.slice(0, 2).join(', ')}). Fraudsters host copycat phishing forms on unverified links to capture passwords and card numbers.`,
      evidence: urlsInMsg.join(', '),
    });
  }

  // 8. Personal 10-Digit Mobile Numbers Acting as Support
  const phoneRegex = /\b(\+?91[\s-]?)?[6789]\d{9}\b/g;
  const phoneNumbers = message.match(phoneRegex);
  if (phoneNumbers && (foundInst.length > 0 || foundUrgency.length > 0)) {
    score += 20;
    highlightedKeywords.push(...phoneNumbers);
    detectedFlags.push({
      id: 'personal-mobile-number',
      category: 'impersonation',
      title: 'Personal 10-Digit Mobile Number Posing as Official Desk',
      explanation: `Directs you to call or message a standard 10-digit mobile number (${phoneNumbers.slice(0, 2).join(', ')}). Commercial banks and government utilities use registered toll-free lines or official alphanumeric SMS headers, never personal mobile numbers.`,
      evidence: phoneNumbers.join(', '),
    });
  }

  // 9. Legitimate Transactional Alert Dampening
  const safePoints: string[] = [];
  if (
    lower.includes('debited from a/c') ||
    lower.includes('credited to a/c') ||
    lower.includes('available bal') ||
    lower.includes('avl bal')
  ) {
    if (foundCreds.length === 0 && foundSoftware.length === 0 && !urlsInMsg) {
      safePoints.push('Standard transactional notification format (Debit/Credit alert).');
      safePoints.push('Does not solicit any OTP, PIN, password, or sensitive action.');
      safePoints.push('Contains no unofficial external clickable links.');
      score = Math.max(0, score - 40);
    }
  }

  // Risk Level Classification
  let riskLevel: RiskLevel = 'low';
  if (score >= 45 || foundCreds.length >= 2 || foundSoftware.length > 0 || foundUpi.length > 0) {
    riskLevel = 'high';
  } else if (score >= 20) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  let summary = '';
  let recommendedAction = '';

  if (riskLevel === 'high') {
    summary = `CRITICAL THREAT DETECTED: This message matches prominent digital fraud vectors (Calculated Threat Score: ${Math.min(score, 100)}/100).`;
    recommendedAction = 'DO NOT click any link. DO NOT call any phone numbers provided. NEVER disclose any OTP or PIN. If funds have been transferred, call Helpline 1930 immediately.';
  } else if (riskLevel === 'medium') {
    summary = `SUSPICIOUS PATTERNS IDENTIFIED: This message contains indicators frequently observed in unsolicited schemes or social engineering lures (Threat Score: ${score}/100).`;
    recommendedAction = 'Exercise heightened caution. Verify the claim independently by opening your official bank app or dialing the number printed on the back of your physical card.';
  } else {
    summary = `LOW HEURISTIC RISK DETECTED: No immediate high-pressure scam triggers, credential demands, or malicious APK vectors were isolated (Threat Score: ${score}/100).`;
    recommendedAction = 'Standard vigilance is always advised. Real banks will never request personal authentication credentials over unsolicited messages.';
  }

  const uniqueKeywords = Array.from(new Set(highlightedKeywords.map((k) => k.trim())));

  return {
    riskLevel,
    riskScore: Math.min(score, 100),
    summary,
    detectedFlags,
    highlightedKeywords: uniqueKeywords,
    safePoints,
    recommendedAction,
    disclaimer: 'Automated heuristic results are for educational awareness and scam detection assistance. Automated results are not guaranteed to be 100% accurate. Always verify directly with your official bank branch or customer service.',
  };
}

export function analyzeLink(rawUrl: string): LinkAnalysisResult {
  const input = rawUrl.trim();
  if (!input) {
    return {
      url: '',
      normalizedUrl: '',
      protocol: 'unknown',
      domain: '',
      riskLevel: 'low',
      riskScore: 0,
      isIpAddress: false,
      hasSuspiciousTld: false,
      isShortener: false,
      hasTypoSquattingOrSpoofing: false,
      detectedFlags: [
        {
          id: 'no-url-input',
          category: 'suspicious_link',
          title: 'No URL Provided',
          explanation: 'Please enter a website link to evaluate its domain structure and security posture.',
        },
      ],
      safetyFindings: [],
      recommendation: 'Enter a valid web link or domain into the field above to run heuristic inspection.',
      disclaimer: 'Never claim a website is completely safe based only on a basic check. Even HTTPS sites can host scams. Always inspect the browser address bar for official domain spellings.',
    };
  }

  // Prepend http if protocol is missing for standard URL parsing
  let normalized = input;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'http://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      url: input,
      normalizedUrl: normalized,
      protocol: 'unknown',
      domain: input,
      riskLevel: 'high',
      riskScore: 85,
      isIpAddress: false,
      hasSuspiciousTld: false,
      isShortener: false,
      hasTypoSquattingOrSpoofing: false,
      detectedFlags: [
        {
          id: 'malformed-url',
          category: 'suspicious_link',
          title: 'Malformed or Obfuscated Web Address',
          explanation: 'The entered string cannot be resolved into a standard internet domain address. Cyber criminals frequently use malformed or encoded addresses in phishing redirects.',
        },
      ],
      safetyFindings: [],
      recommendation: 'Do NOT visit this address. It deviates from standard RFC internet domain syntax.',
      disclaimer: 'Automated heuristic results are for educational awareness. Never claim a website is completely safe based only on a basic check.',
    };
  }

  const detectedFlags: RedFlag[] = [];
  const safetyFindings: string[] = [];
  let score = 0;

  const protocol: 'https' | 'http' | 'unknown' =
    parsed.protocol === 'https:' ? 'https' : parsed.protocol === 'http:' ? 'http' : 'unknown';
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();

  // 1. Insecure HTTP Protocol
  if (protocol === 'http') {
    score += 30;
    detectedFlags.push({
      id: 'insecure-http',
      category: 'suspicious_link',
      title: 'Insecure Connection (Plain HTTP / No SSL Encryption)',
      explanation: 'The link transmits data over plain unencrypted HTTP. Legitimate financial institutions, payment gateways, and banking portals NEVER use unencrypted HTTP.',
      evidence: 'http://',
    });
  } else if (protocol === 'https') {
    safetyFindings.push('Uses HTTPS encryption in transit (Note: Phishing websites can also obtain free HTTPS certificates).');
  }

  // 2. Direct Numerical IP Address Host
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpAddress = ipRegex.test(hostname);
  if (isIpAddress) {
    score += 50;
    detectedFlags.push({
      id: 'raw-ip-host',
      category: 'suspicious_link',
      title: 'Direct Numerical IP Address Instead of Registered Domain',
      explanation: 'The address points directly to a raw server IP address. Legitimate organizations deploy branded registered domain names.',
      evidence: hostname,
    });
  }

  // 3. High-Abuse / Disposable TLDs
  const suspiciousTlds = [
    '.top', '.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.work',
    '.click', '.buzz', '.pw', '.rest', '.online', '.site', '.monster', '.loan',
    '.vip', '.live', '.cc', '.space', '.club', '.shop', '.pro', '.fit',
  ];
  const matchedTld = suspiciousTlds.find((tld) => hostname.endsWith(tld));
  const hasSuspiciousTld = !!matchedTld;
  if (hasSuspiciousTld) {
    score += 35;
    detectedFlags.push({
      id: 'suspicious-tld',
      category: 'suspicious_link',
      title: `High-Risk Disposable Domain Extension (${matchedTld})`,
      explanation: `The domain uses an extension (${matchedTld}) frequently used by cyber criminals due to low-cost or disposable registration policies.`,
      evidence: matchedTld,
    });
  }

  // 4. URL Shortener / Masking Services
  const shorteners = [
    'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy', 'buff.ly', 'ow.ly', 'goo.gl', 'wa.me', 't.me',
  ];
  const isShortener = shorteners.some((s) => hostname === s || hostname.endsWith('.' + s));
  if (isShortener) {
    score += 30;
    detectedFlags.push({
      id: 'url-shortener',
      category: 'suspicious_link',
      title: 'Masked URL / Link Shortener Service',
      explanation: `This link is processed through a masking service (${hostname}) that obscures the actual destination server until clicked.`,
      evidence: hostname,
    });
  }

  // 5. Brand Impersonation & Typo-Squatting
  const targetBrands = [
    { brand: 'sbi', official: ['onlinesbi.sbi', 'sbi.co.in'] },
    { brand: 'hdfc', official: ['hdfcbank.com'] },
    { brand: 'icici', official: ['icicibank.com'] },
    { brand: 'axis', official: ['axisbank.com'] },
    { brand: 'pnb', official: ['pnbindia.in'] },
    { brand: 'bob', official: ['bankofbaroda.in'] },
    { brand: 'kotak', official: ['kotak.com'] },
    { brand: 'canara', official: ['canarabank.com'] },
    { brand: 'rbi', official: ['rbi.org.in'] },
    { brand: 'paytm', official: ['paytm.com'] },
    { brand: 'phonepe', official: ['phonepe.com'] },
    { brand: 'bhim', official: ['bhimupi.org.in', 'npci.org.in'] },
    { brand: 'yono', official: ['onlinesbi.sbi', 'sbi.co.in'] },
  ];

  let hasTypoSquattingOrSpoofing = false;
  for (const b of targetBrands) {
    if (hostname.includes(b.brand)) {
      const isOfficialDomain = b.official.some((off) => hostname === off || hostname.endsWith('.' + off));
      if (!isOfficialDomain) {
        hasTypoSquattingOrSpoofing = true;
        score += 50;
        detectedFlags.push({
          id: `spoof-${b.brand}`,
          category: 'impersonation',
          title: `Brand Impersonation (${b.brand.toUpperCase()}) Spoofing`,
          explanation: `The domain mimics official ${b.brand.toUpperCase()} banking branding but is registered on an unverified host (${hostname}). Official banks use strictly controlled parent domains.`,
          evidence: hostname,
        });
        break;
      }
    }
  }

  // 6. Dangerous Executables & APK Links
  if (pathname.includes('.apk') || pathname.includes('.exe')) {
    score += 45;
    detectedFlags.push({
      id: 'direct-payload-apk',
      category: 'apk_software',
      title: 'Direct Android APK / Executable Download Target',
      explanation: 'The URL targets an installable application package (.apk). Android banking malware is predominantly distributed via direct file downloads outside verified app stores.',
      evidence: pathname,
    });
  } else if (pathname.includes('otp') || pathname.includes('verify') || pathname.includes('pan-update') || pathname.includes('kyc')) {
    score += 25;
    detectedFlags.push({
      id: 'phishing-path-tokens',
      category: 'suspicious_link',
      title: 'Credential Harvesting Indicators in URL Path',
      explanation: `The URL path contains explicit authentication or verification cues (${pathname}).`,
      evidence: pathname,
    });
  }

  // 7. Verified Official Institution Domains
  const verifiedDomains = [
    'onlinesbi.sbi', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
    'pnbindia.in', 'bankofbaroda.in', 'kotak.com', 'canarabank.com', 'rbi.org.in',
    'cybercrime.gov.in', 'npci.org.in', 'incometax.gov.in', 'uidai.gov.in',
  ];
  const isRecognizedOfficial = verifiedDomains.some((d) => hostname === d || hostname.endsWith('.' + d));
  if (isRecognizedOfficial && protocol === 'https') {
    score = Math.max(0, score - 60);
    safetyFindings.push(`Domain matches recognized official infrastructure (${hostname}).`);
    safetyFindings.push('Secure HTTPS transport encryption verified.');
  }

  // Risk Level
  let riskLevel: RiskLevel = 'low';
  if (score >= 45 || isIpAddress || hasTypoSquattingOrSpoofing) {
    riskLevel = 'high';
  } else if (score >= 20 || hasSuspiciousTld || isShortener) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  let recommendation = '';
  if (riskLevel === 'high') {
    recommendation = 'DO NOT VISIT THIS LINK. High probability of credential phishing or banking trojan payload. Never submit NetBanking or card details on this portal.';
  } else if (riskLevel === 'medium') {
    recommendation = 'EXERCISE CAUTION. The link exhibits suspicious architectural traits (unencrypted protocol, URL shortener, or disposable TLD). Independently type the verified institution URL into your browser instead.';
  } else {
    recommendation = 'No immediate high-risk anomalies were found during this basic heuristic check. However, always verify the exact domain spelling in your browser address bar before authenticating.';
  }

  return {
    url: input,
    normalizedUrl: normalized,
    protocol,
    domain: hostname,
    riskLevel,
    riskScore: Math.min(score, 100),
    isIpAddress,
    hasSuspiciousTld,
    isShortener,
    hasTypoSquattingOrSpoofing,
    detectedFlags,
    safetyFindings,
    recommendation,
    disclaimer: 'Never claim a website is completely safe based only on a basic check. Even HTTPS sites can host scams. Always inspect the browser address bar for official domain spellings.',
  };
}

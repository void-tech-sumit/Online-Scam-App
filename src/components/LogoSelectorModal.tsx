import React, { useState } from 'react';
import { LogoStyleId, ScamShieldLogo } from './ScamShieldLogo';
import { Check, Upload, Link, RotateCcw, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: LogoStyleId;
  currentCustomUrl?: string;
  onSaveLogo: (style: LogoStyleId, customUrl?: string) => void;
}

const PRESET_OPTIONS: { id: LogoStyleId; name: string; desc: string; tag: string }[] = [
  {
    id: 'official',
    name: 'Official ScamShield Emblem',
    desc: 'Glossy 3D blue shield with padlock, cyan-green orbit, and 4 anti-fraud badges (OTP, Link, Email, Hacker).',
    tag: 'Official Design · Verified Brand',
  },
  {
    id: 'cyber-shield',
    name: 'Cyber Shield & Core',
    desc: 'Metallic navy shield with blue defense split and high-security cyber lock.',
    tag: 'Minimalist Shield',
  },
  {
    id: 'bank-vault',
    name: 'Banking Vault & Pillars',
    desc: 'Greco-Roman bank columns embedded within an armored digital fortress.',
    tag: 'Classic Banking',
  },
  {
    id: 'golden-crest',
    name: 'Golden Vigilance Crest',
    desc: 'Prestigious gold and dark slate emblem symbolizing 24/7 fraud vigilance.',
    tag: 'Executive Authority',
  },
  {
    id: 'quantum-hex',
    name: 'Quantum Cyber Hexagon',
    desc: 'Geometric fintech cyber hexagon with glowing cyan circuit nodes.',
    tag: 'Modern Tech',
  },
  {
    id: 'sentinel-badge',
    name: 'Sentinel Check Badge',
    desc: 'Deep royal blue curved badge with bold verified security checkmark.',
    tag: 'Consumer Trust',
  },
];

export const LogoSelectorModal: React.FC<LogoSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  currentCustomUrl,
  onSaveLogo,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<LogoStyleId>(currentStyle);
  const [customUrlInput, setCustomUrlInput] = useState(currentCustomUrl || '');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomUrlInput(reader.result);
          setSelectedStyle('custom');
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedStyle === 'custom' && !customUrlInput.trim()) {
      alert('Please provide an image URL or upload an image file for custom logo.');
      return;
    }
    onSaveLogo(selectedStyle, customUrlInput.trim() || undefined);
    onClose();
  };

  const handleResetDefault = () => {
    setSelectedStyle('cyber-shield');
    setCustomUrlInput('');
    onSaveLogo('cyber-shield', undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Change ScamShield Logo
              </h2>
              <p className="text-xs text-slate-500">
                Choose a professional banking emblem style or upload your own corporate / bank logo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preset Logo Styles Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Curated Banking & Cybersecurity Logo Styles:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_OPTIONS.map((opt) => {
              const isSelected = selectedStyle === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedStyle(opt.id);
                    setPreviewError(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <ScamShieldLogo styleId={opt.id} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {opt.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-blue-700 font-semibold block">{opt.tag}</span>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Logo Upload / URL Option */}
        <div
          onClick={() => setSelectedStyle('custom')}
          className={`p-4 rounded-xl border transition-all space-y-3 ${
            selectedStyle === 'custom'
              ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Option: Upload Custom Institutional / Bank Logo
              </span>
            </div>
            {selectedStyle === 'custom' && (
              <span className="text-xs bg-blue-600 text-white font-semibold px-2 py-0.5 rounded">
                Active Selection
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* File upload input */}
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                Upload image file (PNG / JPG / SVG):
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 rounded-lg hover:bg-white bg-white text-xs text-slate-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Browse File from Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* URL input */}
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                Or paste public image URL:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    setSelectedStyle('custom');
                    setPreviewError(false);
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Custom preview */}
          {selectedStyle === 'custom' && customUrlInput && (
            <div className="flex items-center gap-3 pt-1 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Custom Preview:</span>
              <ScamShieldLogo
                styleId="custom"
                customImageUrl={customUrlInput}
                size="md"
              />
              <span className="text-xs text-emerald-700 font-semibold">Ready to apply</span>
            </div>
          )}
        </div>

        {/* Live Header Preview Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ScamShieldLogo
              styleId={selectedStyle}
              customImageUrl={customUrlInput}
              size="md"
            />
            <div>
              <div className="font-serif font-bold text-base text-white flex items-center gap-2">
                <span>ScamShield</span>
                <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                  Preview
                </span>
              </div>
              <p className="text-xs text-slate-300">Online Scam Protection System</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Header appearance</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Logo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Apply Selected Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

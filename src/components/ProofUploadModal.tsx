import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { WinnerRecord } from '../types';

interface ProofUploadModalProps {
  winnerRecord: WinnerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProof: (winnerId: string, proofUrl: string, notes?: string) => void;
}

export const ProofUploadModal: React.FC<ProofUploadModalProps> = ({
  winnerRecord,
  isOpen,
  onClose,
  onSubmitProof,
}) => {
  const [proofSource, setProofSource] = useState('Golf Genius Official App');
  const [sampleProofUrl, setSampleProofUrl] = useState(
    winnerRecord?.proofUrl || 'https://images.unsplash.com/photo-1593111774642-a146440b8a2e?auto=format&fit=crop&w=800&q=80'
  );
  const [proofNotes, setProofNotes] = useState(winnerRecord?.proofNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !winnerRecord) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitProof(winnerRecord.id, sampleProofUrl, `${proofSource}: ${proofNotes}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1800);
    }, 500);
  };

  const sampleScreenshots = [
    { label: 'Golf Genius Scorecard Export', url: 'https://images.unsplash.com/photo-1593111774642-a146440b8a2e?auto=format&fit=crop&w=800&q=80' },
    { label: 'HowDidiDo Handicap Record', url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Club Championship Score Sheet', url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101b24] border border-[#273d52] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#182836] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-bold">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            PRD §09 Winner Verification Flow
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Upload Golf Scorecard Screenshot
          </h2>
          <p className="text-xs text-slate-400">
            For prize compliance, please submit a clear screenshot from your club or official golf software verifying your winning score.
          </p>
        </div>

        {/* Draw match details */}
        <div className="p-3.5 rounded-xl bg-[#0b1319] border border-[#1b2a38] space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Draw Event:</span>
            <span className="font-semibold text-white">{winnerRecord.drawTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Prize Amount:</span>
            <span className="font-bold text-emerald-400">${winnerRecord.prizeAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Matched Numbers:</span>
            <span className="font-bold text-amber-300">[{winnerRecord.matchedNumbers.join(', ')}]</span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-950 rounded-full border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Proof Submitted for Review!</h3>
            <p className="text-xs text-slate-300">
              Our administrators will audit the score sheet and authorize the payout to your Stripe account within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Golf Platform Source:</label>
              <select
                value={proofSource}
                onChange={(e) => setProofSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
              >
                <option value="Golf Genius Official App">Golf Genius Official App</option>
                <option value="HowDidiDo Handicap System">HowDidiDo Handicap System</option>
                <option value="Club Member Portal / Scorecard">Club Member Portal / Scorecard</option>
                <option value="USGA GHIN / WHS App">USGA GHIN / WHS App</option>
              </select>
            </div>

            {/* Quick Presets / Custom Upload */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Select or Paste Score Screenshot:</label>
              <div className="grid grid-cols-1 gap-2">
                {sampleScreenshots.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSampleProofUrl(item.url)}
                    className={`p-2.5 rounded-lg text-left border transition flex items-center justify-between cursor-pointer ${
                      sampleProofUrl === item.url
                        ? 'bg-[#192b3a] border-[#5eead4] text-white'
                        : 'bg-[#0b1319] border-[#1b2b3a] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400">Click to use</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Or paste direct image URL (https://...)"
                value={sampleProofUrl}
                onChange={(e) => setSampleProofUrl(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white font-mono text-[11px]"
              />
            </div>

            {/* Image Preview */}
            {sampleProofUrl && (
              <div className="rounded-xl overflow-hidden border border-[#24374a] bg-black max-h-48 flex items-center justify-center">
                <img
                  src={sampleProofUrl}
                  alt="Proof preview"
                  className="max-h-48 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Additional Notes for Verifier:</label>
              <textarea
                rows={2}
                placeholder="e.g. Played 18 holes at Sunningdale Old on March 18, 38 pts verified by marker."
                value={proofNotes}
                onChange={(e) => setProofNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer shadow-lg shadow-[#e28743]/20 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              {isSubmitting ? 'Uploading & Notifying Admin...' : 'Submit Verification Proof'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

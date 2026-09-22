import React, { useState } from 'react';
import { Heart, Lock, CheckCircle2, X } from 'lucide-react';
import { Charity } from '../types';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  charities: Charity[];
  preselectedCharityId?: string;
  onConfirmDonation: (
    charityId: string, 
    charityName: string, 
    amount: number, 
    frequency: 'one-time' | 'monthly', 
    donorName: string, 
    donorEmail: string,
    message?: string
  ) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  charities,
  preselectedCharityId,
  onConfirmDonation,
}) => {
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    preselectedCharityId || charities[0]?.id || 'charity-1'
  );
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [25, 50, 100, 250];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const charity = charities.find(c => c.id === selectedCharityId);
    if (!charity) return;

    setIsProcessing(true);
    setTimeout(() => {
      onConfirmDonation(
        selectedCharityId,
        charity.name,
        finalAmount,
        frequency,
        donorName || 'Generous Golfer',
        donorEmail || 'supporter@digitalheroes.co.in',
        message
      );
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 500);
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-700/40 text-rose-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Independent Charity Contribution (§08.1)
          </div>
          <h2 className="text-2xl font-extrabold text-white">Direct Cause Donation</h2>
          <p className="text-xs text-slate-400">
            Make an independent one-time or recurring gift not tied to draw gameplay. 100% of net proceeds are disbursed.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-950/70 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Thank You for Your Generosity!</h3>
            <p className="text-xs text-slate-300">
              Your donation receipt and tax acknowledgment have been sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Charity dropdown */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Choose Beneficiary Charity:</label>
              <select
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
              >
                {charities.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            {/* Donation Frequency */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                  frequency === 'one-time'
                    ? 'bg-[#1a2d3d] text-white border border-[#3b5b78]'
                    : 'bg-[#0b1319] text-slate-400 border border-[#1b2b3a]'
                }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-[#1a2d3d] text-white border border-[#3b5b78]'
                    : 'bg-[#0b1319] text-slate-400 border border-[#1b2b3a]'
                }`}
              >
                Monthly Supporter
              </button>
            </div>

            {/* Preset Amount Grid */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">Select Amount (USD):</label>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                    className={`py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                      amount === val && !customAmount
                        ? 'bg-[#e28743] text-black shadow'
                        : 'bg-[#0b1319] text-slate-300 border border-[#1b2b3a] hover:border-slate-500'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount ($)"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                className="w-full mt-2 px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white font-medium"
              />
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rory M."
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0b1319] border border-[#23384a] text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Your Email</label>
                <input
                  type="email"
                  placeholder="rory@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0b1319] border border-[#23384a] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Dedication / Message (Optional)</label>
              <input
                type="text"
                placeholder="In honor of our veterans / In memory of..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0b1319] border border-[#23384a] text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-lg shadow-rose-900/30 flex items-center justify-center gap-1.5 mt-2"
            >
              <Heart className="w-4 h-4" />
              {isProcessing ? 'Processing Gift...' : `Donate $${customAmount || amount} ${frequency === 'monthly' ? '/ month' : 'Now'}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CreditCard, 
  Heart, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Trophy,
  Sparkles,
  X
} from 'lucide-react';
import { Charity, UserProfile } from '../types';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  charities: Charity[];
  currentUser: UserProfile | null;
  onConfirmSubscription: (
    plan: 'monthly' | 'yearly', 
    charityId: string, 
    charityPercentage: number,
    fullName?: string,
    email?: string
  ) => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  charities,
  currentUser,
  onConfirmSubscription,
}) => {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    currentUser?.charityId || charities[0]?.id || 'charity-1'
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(
    currentUser?.charityPercentage || 15
  );

  // New user registration fields if not logged in
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Card details (Stripe PCI compliant mock)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('921');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const price = plan === 'yearly' ? 190 : 19;
  const charityAmount = Math.round((price * (charityPercentage / 100)) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && (!fullName || !email)) {
      alert('Please provide your name and email to create your golfer account.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onConfirmSubscription(plan, selectedCharityId, charityPercentage, fullName, email);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101b24] border border-[#273d52] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#182836] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b342c] text-[#5eead4] text-xs font-bold border border-[#2b5547]">
            <Trophy className="w-3.5 h-3.5" />
            Digital Heroes Membership
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Activate Your Draw Subscription
          </h2>
          <p className="text-xs text-slate-400">
            Enjoy 5-score rolling Stableford tracking, entry into every monthly prize draw, and direct charitable impact.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Choose Membership Cadence:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlan('monthly')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  plan === 'monthly'
                    ? 'bg-[#182a39] border-[#e28743] ring-1 ring-[#e28743]'
                    : 'bg-[#0e1720] border-[#1e2f3f] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">Monthly Plan</div>
                <div className="text-xl font-extrabold text-white mt-0.5">$19 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
                <div className="text-[10px] text-slate-400 mt-1">Billed monthly. Cancel anytime.</div>
              </button>

              <button
                type="button"
                onClick={() => setPlan('yearly')}
                className={`p-3.5 rounded-xl border text-left transition relative cursor-pointer ${
                  plan === 'yearly'
                    ? 'bg-[#1e2722] border-emerald-400 ring-1 ring-emerald-400'
                    : 'bg-[#0e1720] border-[#1e2f3f] text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-black">
                  Save 17%
                </span>
                <div className="text-xs font-bold text-emerald-300">Yearly Plan</div>
                <div className="text-xl font-extrabold text-white mt-0.5">$190 <span className="text-xs font-normal text-slate-400">/ yr</span></div>
                <div className="text-[10px] text-emerald-400/80 mt-1">2 months free ($15.83/mo)</div>
              </button>
            </div>
          </div>

          {/* User details if new */}
          {!currentUser && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0b1319] border border-[#1a2938]">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Spieth"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="golfer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Charity Selection & Percentage Slider (PRD §08.1) */}
          <div className="p-4 rounded-xl bg-[#0b1319] border border-[#1a2938] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Select Your Supported Charity (Min. 10%):
              </span>
              <span className="text-xs font-bold text-[#5eead4]">{charityPercentage}%</span>
            </div>

            <select
              value={selectedCharityId}
              onChange={(e) => setSelectedCharityId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-xs text-white"
            >
              {charities.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.category}</option>
              ))}
            </select>

            <div className="space-y-1">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={charityPercentage}
                onChange={(e) => setCharityPercentage(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#1b2b3a] rounded-lg appearance-none cursor-pointer accent-[#e28743]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Required minimum)</span>
                <span>${charityAmount} directly donated each cycle</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Payment Details (Stripe PCI Mock) */}
          <div className="p-4 rounded-xl bg-[#0b1319] border border-[#1a2938] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                PCI-Compliant Card Payment
              </span>
              <span className="text-[10px] text-slate-400">Stripe Gateway</span>
            </div>

            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs font-mono"
                placeholder="Card Number"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs font-mono"
                  placeholder="MM/YY"
                />
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs font-mono"
                  placeholder="CVC"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer shadow-lg shadow-[#e28743]/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Authorizing with Stripe...' : `Pay $${price} & Join Active Draw`}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            By subscribing, you agree to monthly/yearly automatic renewals. Cancel anytime in 1-click from your dashboard.
          </p>
        </form>
      </div>
    </div>
  );
};

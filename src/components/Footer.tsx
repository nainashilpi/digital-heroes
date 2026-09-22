import React from 'react';
import { Target, Heart, Trophy, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'charities' | 'dashboard' | 'admin') => void;
  onOpenSubscribe: () => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSubscribe,
  onOpenDonate,
}) => {
  return (
    <footer className="bg-[#080e14] border-t border-[#182736] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1d3545] border border-[#314b60] flex items-center justify-center text-amber-400">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                digital.<span className="text-[#e28743]">HEROES</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A golf performance and charity draw platform built according to the Digital Heroes PRD (Level 1, 2026 Edition). Merging Stableford scoring with real social good.
            </p>
            <div className="text-[11px] text-slate-500">
              digitalheroes.co.in • Version 1.0 • March 2026
            </div>
          </div>

          {/* Col 2: Platform Mechanics */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Draw & Scoring Engine</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Stableford Format (1–45)</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Rolling 5-Score Logic</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">5-Match Rollover Jackpot (40%)</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">4-Match & 3-Match Tiers</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Algorithmic Weighted Draws</button></li>
            </ul>
          </div>

          {/* Col 3: Causes & Impact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Charitable Impact</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('charities')} className="hover:text-white transition">Charity Directory</button></li>
              <li><button onClick={() => onNavigate('charities')} className="hover:text-white transition">Minimum 10% Commitment</button></li>
              <li><button onClick={onOpenDonate} className="hover:text-white transition">Independent Direct Donations</button></li>
              <li><button onClick={() => onNavigate('charities')} className="hover:text-white transition">Charity Golf Days Calendar</button></li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Test Mode */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">Subscriber Dashboard</button></li>
              <li><button onClick={() => onNavigate('admin')} className="text-amber-400/90 hover:text-amber-300 transition">Administrator Panel (5 Surfaces)</button></li>
              <li><button onClick={onOpenSubscribe} className="text-[#e28743] hover:text-[#f09756] transition font-semibold">Join Membership ($19/mo)</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#13202c] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Digital Heroes (digitalheroes.co.in). Built strictly to PRD specifications.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Stripe PCI-DSS & Supabase Connected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

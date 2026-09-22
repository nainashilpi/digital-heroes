import React, { useState } from 'react';
import { 
  Trophy, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Coins, 
  Users, 
  Calendar,
  Gift,
  HelpCircle,
  Award
} from 'lucide-react';
import { Charity, Draw } from '../types';

interface HomeViewProps {
  charities: Charity[];
  activeDraw: Draw | undefined;
  onOpenSubscribe: () => void;
  onOpenDonate: (charityId?: string) => void;
  onNavigateCharities: () => void;
  onSelectCharityDetail: (charity: Charity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  charities,
  activeDraw,
  onOpenSubscribe,
  onOpenDonate,
  onNavigateCharities,
  onSelectCharityDetail,
}) => {
  // Interactive Prize Pool & Charity Simulator state
  const [simulatedSubscribers, setSimulatedSubscribers] = useState<number>(4200);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  // Calculation logic based on PRD §06, §07 & §08:
  // Subscription: $19/mo or $190/yr ($15.83/mo equivalent)
  const monthlyRevenue = simulatedSubscribers * 19;
  const charityPortion = monthlyRevenue * 0.15; // average 15% contribution (min 10%)
  const prizePoolBase = monthlyRevenue * 0.50; // 50% to prize pool
  const rolloverJackpot = activeDraw?.rolloverJackpotIn || 22800;
  const totalPrizePoolSim = prizePoolBase + rolloverJackpot;

  // Tier shares:
  const tier5Jackpot = (prizePoolBase * 0.40) + rolloverJackpot;
  const tier4Share = prizePoolBase * 0.35;
  const tier3Share = prizePoolBase * 0.25;

  const featuredCharities = charities.filter(c => c.featured).slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION - PRD §12 "Feel, not fairway" */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle emotional ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1b332b]/40 via-[#e28743]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14232e] border border-[#273d4f] text-xs text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#5eead4] animate-pulse" />
            <span className="font-medium text-slate-200">The Purpose-Driven Golf Platform</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#e28743] font-semibold">March 2026 Rollover Jackpot: ${(activeDraw?.rolloverJackpotIn || 22800).toLocaleString()}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Play your game. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5eead4] via-[#e28743] to-[#f59e0b]">
              Champion real causes.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            Digital Heroes connects regular weekend golf scores with high-impact charitable giving and monthly draw-based rewards. Every round you play helps fund causes you believe in.
          </p>

          {/* Action Button Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-subscribe-cta"
              onClick={onOpenSubscribe}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#0b1319] bg-[#e28743] hover:bg-[#f09756] transition shadow-lg shadow-[#e28743]/20 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              Subscribe & Enter Draw ($19/mo)
            </button>

            <button
              id="hero-explore-charities"
              onClick={onNavigateCharities}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-[#14232f] hover:bg-[#1a2d3d] border border-[#273c4e] transition flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Heart className="w-5 h-5 text-rose-400" />
              Explore Partner Charities
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-[#101b24] border border-[#1b2a38]">
              <div className="text-xs text-slate-400">Total Charity Impact</div>
              <div className="text-xl font-bold text-[#5eead4] mt-0.5">$566,000+</div>
              <div className="text-[11px] text-slate-400 mt-1">Directly transferred</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101b24] border border-[#1b2a38]">
              <div className="text-xs text-slate-400">Min. Charity Cut</div>
              <div className="text-xl font-bold text-white mt-0.5">10% Guaranteed</div>
              <div className="text-[11px] text-slate-400 mt-1">Voluntarily expandable</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101b24] border border-[#1b2a38]">
              <div className="text-xs text-slate-400">Active Draw Pool</div>
              <div className="text-xl font-bold text-[#e28743] mt-0.5">
                ${((activeDraw?.totalPrizePool || 45000) + (activeDraw?.rolloverJackpotIn || 22800)).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Includes rolled jackpot</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101b24] border border-[#1b2a38]">
              <div className="text-xs text-slate-400">Stableford Format</div>
              <div className="text-xl font-bold text-white mt-0.5">1 – 45 Points</div>
              <div className="text-[11px] text-slate-400 mt-1">Last 5 rolling scores</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (§01.1 WHAT USERS DO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#5eead4]">The Ecosystem</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Three simple steps to play with purpose
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Deliberately designed without fairways or plaid — built purely on sportsmanship, transparent mathematics, and measurable social good.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#13202b] to-[#0e171f] border border-[#213547] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#19323f] border border-[#2c4e61] flex items-center justify-center text-[#5eead4] font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Subscribe & Choose Your Cause</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Join monthly ($19) or yearly with a discounted rate. Direct at least 10% (up to 100%) of your recurring membership to veteran recovery, children’s sports, or cancer respite.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1d2d3c] text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              100% Tax-deductible contribution receipts
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#13202b] to-[#0e171f] border border-[#213547] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#262e3d] border border-[#3e4f68] flex items-center justify-center text-amber-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Log Your 5 Latest Scores</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Enter your last 5 Stableford scores (1–45) from your regular club rounds. The system automatically rolls your latest 5 entries into your unique monthly draw profile.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1d2d3c] text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Rolling 5-score replacement logic
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#13202b] to-[#0e171f] border border-[#213547] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#332219] border border-[#583928] flex items-center justify-center text-[#e28743] font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Monthly Draw & Rollover Jackpot</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Win cash prizes for matching 3, 4, or 5 numbers. If nobody hits all 5 numbers in a month, the 40% Tier 1 prize pool rolls over into the next month’s mega jackpot!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1d2d3c] text-xs text-[#e28743] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verified payout via official platform screenshot
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRIZE POOL & CHARITY SIMULATOR (§06 & §07) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#101b24] border border-[#223547] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
            {/* Left Controls */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182a38] text-xs text-[#5eead4] font-medium border border-[#284257]">
                <TrendingUp className="w-3.5 h-3.5" />
                Algorithm & Mathematics Engine (§06 & §07)
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live Draw & Impact Calculator
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                See how subscriber volume mathematically fuels both the competitive player reward tiers and direct charity disbursements.
              </p>

              {/* Slider for subscribers */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Active Member Volume</span>
                  <span className="font-bold text-[#5eead4] text-base">{simulatedSubscribers.toLocaleString()} golfers</span>
                </div>
                <input
                  id="subscribers-slider"
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={simulatedSubscribers}
                  onChange={(e) => setSimulatedSubscribers(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#1b2b3a] rounded-lg appearance-none cursor-pointer accent-[#e28743]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>500 members</span>
                  <span>5,000</span>
                  <span>10,000</span>
                  <span>15,000 members</span>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0b1319] border border-[#1b2a38]">
                  <div className="text-[11px] text-slate-400">Monthly Gross Revenue</div>
                  <div className="text-lg font-bold text-white mt-0.5">${monthlyRevenue.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0b1319] border border-[#1b2a38]">
                  <div className="text-[11px] text-rose-300 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    Charity Share (~15%)
                  </div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">${Math.round(charityPortion).toLocaleString()} / mo</div>
                </div>
              </div>
            </div>

            {/* Right Tier Allocation Table */}
            <div className="w-full lg:w-1/2 rounded-2xl bg-[#0b1319] border border-[#1f3143] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2c3d] pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Prize Pool Distribution</h3>
                  <p className="text-xs text-slate-400">Enforced strictly by PRD specifications</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Available Pool</span>
                  <div className="text-xl font-extrabold text-[#e28743]">
                    ${Math.round(totalPrizePoolSim).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tier 5 */}
              <div className="p-3.5 rounded-xl bg-[#14232f] border border-[#24394c] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e28743] text-black">
                      5-MATCH
                    </span>
                    <span className="font-bold text-white text-sm">Grand Jackpot</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    40% share + ${rolloverJackpot.toLocaleString()} rollover carried forward
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-amber-300">
                    ${Math.round(tier5Jackpot).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Rolls over if unclaimed</span>
                </div>
              </div>

              {/* Tier 4 */}
              <div className="p-3.5 rounded-xl bg-[#111d27] border border-[#1e3040] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-700 text-white">
                      4-MATCH
                    </span>
                    <span className="font-bold text-white text-sm">Major Tier</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    35% pool share split equally among winners
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">
                    ${Math.round(tier4Share).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">Guaranteed monthly</span>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-3.5 rounded-xl bg-[#111d27] border border-[#1e3040] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-700 text-white">
                      3-MATCH
                    </span>
                    <span className="font-bold text-white text-sm">Community Tier</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    25% pool share split equally among winners
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white">
                    ${Math.round(tier3Share).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">Guaranteed monthly</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSubscribe}
                  className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#e28743] to-[#d97706] hover:brightness-110 text-black transition cursor-pointer text-center"
                >
                  Join This Month's Draw Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CHARITIES SPOTLIGHT (§08.2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-rose-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Charity Directory Spotlight (§08.2)
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Causes funded by Digital Heroes
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select one at registration or switch your allocation anytime from your dashboard.
            </p>
          </div>

          <button
            onClick={onNavigateCharities}
            className="text-sm font-semibold text-[#5eead4] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all 5 registered causes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredCharities.map((charity) => (
            <div
              key={charity.id}
              className="rounded-2xl bg-[#111c26] border border-[#213547] overflow-hidden flex flex-col justify-between hover:border-[#334e66] transition group"
            >
              <div>
                {/* Banner image with overlay */}
                <div className="relative h-44 overflow-hidden bg-slate-800">
                  <img
                    src={charity.bannerUrl}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111c26] via-transparent to-black/30" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0b1319]/90 text-slate-200 border border-[#263c4f]">
                    {charity.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#5eead4] transition">
                    {charity.name}
                  </h3>
                  <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {charity.tagline}
                  </p>

                  {/* Impact metrics chips */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {charity.impactMetrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#0c151d] border border-[#1b2a38]">
                        <div className="text-[10px] text-slate-400">{m.label}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Next Event */}
                  {charity.upcomingEvents.length > 0 && (
                    <div className="pt-2 text-[11px] text-slate-400 flex items-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Next Golf Day: <strong className="text-slate-200">{charity.upcomingEvents[0].title}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => onSelectCharityDetail(charity)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#172533] hover:bg-[#1e3042] border border-[#2b4155] transition cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenDonate(charity.id)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-700/40 transition cursor-pointer flex items-center gap-1"
                >
                  <Heart className="w-3 h-3 text-rose-400" />
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING & SUBSCRIPTION (§04) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#e28743]">Transparent Membership</div>
          <h2 className="text-3xl font-extrabold text-white">
            Choose your Digital Heroes subscription
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Both plans include full Stableford score tracking, automatic entry into every monthly draw, and direct charity support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-6 flex flex-col justify-between hover:border-[#314f6b] transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Plan</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#172736] text-slate-300">Flexible</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-sm text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pay month-to-month. Cancel anytime. Automatically qualifies you for each monthly draw.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5eead4]" />
                  Enter all 3 prize tiers (3, 4, 5-match)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5eead4]" />
                  At least 10% directed to your chosen charity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5eead4]" />
                  Rolling 5-score Stableford handicap dashboard
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={onOpenSubscribe}
                className="w-full py-3 rounded-xl font-bold text-sm bg-[#182836] hover:bg-[#203446] text-white border border-[#2d445a] transition cursor-pointer"
              >
                Start Monthly ($19/mo)
              </button>
            </div>
          </div>

          {/* Yearly (Discounted Rate) */}
          <div className="rounded-2xl bg-[#13222e] border-2 border-[#e28743] p-6 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#e28743] text-black uppercase tracking-wider shadow">
              Save 17% (2 Months Free)
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e28743]">Yearly Plan</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2a221a] text-amber-300">Best Value</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$190</span>
                <span className="text-sm text-slate-400">/ year</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full 12-month access to all 12 monthly draws and rollover jackpots. Equivalent to $15.83/month.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e28743]" />
                  12 consecutive monthly draw participations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e28743]" />
                  $19+ guaranteed directed to charity upfront
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e28743]" />
                  Priority winner verification & expedited payouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e28743]" />
                  Exclusive invites to annual Charity Golf Classics
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={onOpenSubscribe}
                className="w-full py-3 rounded-xl font-bold text-sm bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer shadow-lg shadow-[#e28743]/20"
              >
                Join Yearly ($190/yr)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

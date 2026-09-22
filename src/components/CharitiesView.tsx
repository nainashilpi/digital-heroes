import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Calendar, 
  MapPin, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Filter, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Charity, UserProfile } from '../types';

interface CharitiesViewProps {
  charities: Charity[];
  currentUser: UserProfile | null;
  onSelectAsMyCharity: (charityId: string) => void;
  onOpenDonate: (charityId: string) => void;
  onOpenDetailModal: (charity: Charity) => void;
}

export const CharitiesView: React.FC<CharitiesViewProps> = ({
  charities,
  currentUser,
  onSelectAsMyCharity,
  onOpenDonate,
  onOpenDetailModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Veterans & First Responders',
    'Youth & Education',
    'Health & Medical',
    'Environment & Wildlife',
    'Community Care',
  ];

  const filteredCharities = charities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRaisedAcrossPlatform = charities.reduce((acc, c) => acc + c.totalRaised, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#122330] via-[#162c3d] to-[#0e1822] border border-[#233a4e] p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-700/40 text-rose-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            PRD §08 Charity Directory & Contribution Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Empower causes that transform lives.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every Digital Heroes subscriber directs at least 10% of their subscription to one of our verified charitable partners. You can switch your cause anytime or make direct independent donations.
          </p>

          <div className="flex flex-wrap gap-6 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Platform Giving Total: <strong className="text-emerald-400 font-bold">${totalRaisedAcrossPlatform.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#e28743]"></div>
              <span>100% Direct Disbursement Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="charity-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search charities by name, cause or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101b24] border border-[#213547] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5eead4] transition"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1e3447] text-[#5eead4] border border-[#315370]'
                  : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charity Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharities.map((charity) => {
          const isSelectedByCurrentUser = currentUser?.charityId === charity.id;

          return (
            <div
              key={charity.id}
              className={`rounded-2xl bg-[#101b24] border transition flex flex-col justify-between overflow-hidden shadow-lg ${
                isSelectedByCurrentUser
                  ? 'border-[#5eead4] ring-1 ring-[#5eead4]'
                  : 'border-[#1f3143] hover:border-[#314f6b]'
              }`}
            >
              <div>
                {/* Header Banner */}
                <div className="relative h-44 bg-slate-800 overflow-hidden">
                  <img
                    src={charity.bannerUrl}
                    alt={charity.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101b24] via-transparent to-black/40" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#0b1319]/90 text-slate-200 border border-[#273d4f]">
                    {charity.category}
                  </span>

                  {isSelectedByCurrentUser && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#1b332b] text-[#5eead4] border border-[#2e594b] flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" />
                      Your Active Cause
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {charity.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {charity.description}
                  </p>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-1">
                    {charity.impactMetrics.map((metric, i) => (
                      <div key={i} className="p-2 rounded-lg bg-[#0b1319] border border-[#1b2a38] text-center">
                        <div className="text-[10px] text-slate-400 truncate">{metric.label}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{metric.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Golf Day / Events (§08.2) */}
                  {charity.upcomingEvents.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#14232e] border border-[#23384a] text-xs space-y-1">
                      <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Upcoming Charity Golf Day
                      </div>
                      <div className="text-slate-200 font-medium text-xs">
                        {charity.upcomingEvents[0].title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {charity.upcomingEvents[0].location} • {charity.upcomingEvents[0].date}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2 border-t border-[#192837] mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                  <span>Total Raised:</span>
                  <span className="font-bold text-emerald-400">${charity.totalRaised.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenDetailModal(charity)}
                    className="py-2 rounded-lg text-xs font-medium text-slate-300 bg-[#162432] hover:bg-[#1d2f40] border border-[#273c50] transition cursor-pointer"
                  >
                    Read Profile
                  </button>

                  <button
                    onClick={() => onOpenDonate(charity.id)}
                    className="py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-700/40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Heart className="w-3 h-3 text-rose-400" />
                    Donate Now
                  </button>
                </div>

                {currentUser && (
                  <button
                    onClick={() => onSelectAsMyCharity(charity.id)}
                    disabled={isSelectedByCurrentUser}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSelectedByCurrentUser
                        ? 'bg-[#182836] text-slate-400 cursor-default'
                        : 'bg-[#1b342c] hover:bg-[#23453a] text-[#5eead4] border border-[#2a5547]'
                    }`}
                  >
                    {isSelectedByCurrentUser ? 'Currently Receiving Your Subscription Cut' : 'Set as My Subscription Charity'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

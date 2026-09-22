import React from 'react';
import { Heart, Calendar, MapPin, Globe, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { Charity, UserProfile } from '../types';

interface CharityDetailModalProps {
  charity: Charity | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSelectAsMyCharity: (charityId: string) => void;
  onOpenDonate: (charityId: string) => void;
}

export const CharityDetailModal: React.FC<CharityDetailModalProps> = ({
  charity,
  isOpen,
  onClose,
  currentUser,
  onSelectAsMyCharity,
  onOpenDonate,
}) => {
  if (!isOpen || !charity) return null;

  const isCurrentSelection = currentUser?.charityId === charity.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101b24] border border-[#273d52] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero banner */}
        <div className="relative h-60 bg-slate-800">
          <img
            src={charity.bannerUrl}
            alt={charity.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101b24] via-[#101b24]/40 to-transparent" />
          <span className="absolute bottom-4 left-6 px-3 py-1 rounded-md text-xs font-bold bg-[#0b1319]/90 text-slate-200 border border-[#273d4f]">
            {charity.category}
          </span>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {charity.name}
            </h2>
            <p className="text-sm font-medium text-[#5eead4]">
              {charity.tagline}
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <p>{charity.description}</p>
          </div>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-3 gap-3">
            {charity.impactMetrics.map((metric, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#0b1319] border border-[#1b2b3a] text-center">
                <div className="text-[11px] text-slate-400">{metric.label}</div>
                <div className="text-base font-extrabold text-white mt-0.5">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Golf Days / Events (§08.2) */}
          {charity.upcomingEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Upcoming Charity Golf Days & Community Events
              </h4>

              <div className="space-y-2">
                {charity.upcomingEvents.map((evt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0b1319] border border-[#1e2f40] flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{evt.title}</div>
                      <div className="text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {evt.location} • <span className="text-slate-300 font-semibold">{evt.date}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#182836] text-slate-300 font-medium text-[11px] self-start sm:self-auto">
                      {evt.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#1b2a38] flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-xs text-slate-400">
              Total Raised to Date: <strong className="text-emerald-400 text-sm font-bold">${charity.totalRaised.toLocaleString()}</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onOpenDonate(charity.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                Donate Now
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    onSelectAsMyCharity(charity.id);
                    onClose();
                  }}
                  disabled={isCurrentSelection}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isCurrentSelection
                      ? 'bg-[#182836] text-slate-400 cursor-default'
                      : 'bg-[#5eead4] hover:bg-[#7ef2df] text-black'
                  }`}
                >
                  {isCurrentSelection ? 'Currently Selected Cause' : 'Select for My Subscription'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

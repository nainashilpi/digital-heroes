import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Heart, 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  DollarSign, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Info
} from 'lucide-react';
import { UserProfile, GolfScore, Charity, Draw, WinnerRecord } from '../types';

interface UserDashboardViewProps {
  currentUser: UserProfile;
  scores: GolfScore[];
  charities: Charity[];
  activeDraw: Draw | undefined;
  winners: WinnerRecord[];
  onAddScore: (score: number, date: string, courseName?: string, notes?: string) => { success: boolean; message: string };
  onUpdateScore: (scoreId: string, updates: Partial<GolfScore>) => { success: boolean; message: string };
  onDeleteScore: (scoreId: string) => void;
  onUpdateCharitySettings: (charityId: string, percentage: number) => void;
  onOpenProofModal: (winnerRecord: WinnerRecord) => void;
  onOpenSubscribe: () => void;
  onCancelSubscription: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  scores,
  charities,
  activeDraw,
  winners,
  onAddScore,
  onUpdateScore,
  onDeleteScore,
  onUpdateCharitySettings,
  onOpenProofModal,
  onOpenSubscribe,
  onCancelSubscription,
}) => {
  // Score entry form state
  const [newScoreVal, setNewScoreVal] = useState<string>('36');
  const [newScoreDate, setNewScoreDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newScoreCourse, setNewScoreCourse] = useState<string>('');
  const [newScoreNotes, setNewScoreNotes] = useState<string>('');
  const [scoreFeedback, setScoreFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Edit score state
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [editScoreVal, setEditScoreVal] = useState<string>('');
  const [editScoreDate, setEditScoreDate] = useState<string>('');
  const [editScoreCourse, setEditScoreCourse] = useState<string>('');
  const [editScoreNotes, setEditScoreNotes] = useState<string>('');

  // Charity settings state
  const [charityPercentage, setCharityPercentage] = useState<number>(currentUser.charityPercentage || 15);
  const [selectedCharityId, setSelectedCharityId] = useState<string>(currentUser.charityId || 'charity-1');
  const [charitySaveSuccess, setCharitySaveSuccess] = useState(false);

  // Filter user's winnings
  const userWinnings = winners.filter(w => w.userId === currentUser.id);
  const totalWon = userWinnings.reduce((sum, w) => sum + w.prizeAmount, 0);

  // User's active 5 numbers for the draw
  const activeDrawNumbers = scores.slice(0, 5).map(s => s.score);

  const selectedCharity = charities.find(c => c.id === currentUser.charityId) || charities[0];

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScoreFeedback(null);

    const val = parseInt(newScoreVal, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setScoreFeedback({ text: 'Stableford points must be between 1 and 45.', isError: true });
      return;
    }

    if (!newScoreDate) {
      setScoreFeedback({ text: 'Please choose a valid date for this score.', isError: true });
      return;
    }

    const result = onAddScore(val, newScoreDate, newScoreCourse, newScoreNotes);
    if (!result.success) {
      setScoreFeedback({ text: result.message, isError: true });
    } else {
      setScoreFeedback({ text: result.message, isError: false });
      setNewScoreCourse('');
      setNewScoreNotes('');
      // Set date to yesterday or leave current
      setTimeout(() => setScoreFeedback(null), 5000);
    }
  };

  const handleStartEdit = (score: GolfScore) => {
    setEditingScoreId(score.id);
    setEditScoreVal(score.score.toString());
    setEditScoreDate(score.date);
    setEditScoreCourse(score.courseName || '');
    setEditScoreNotes(score.notes || '');
  };

  const handleSaveEdit = (scoreId: string) => {
    const val = parseInt(editScoreVal, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      alert('Stableford points must be between 1 and 45.');
      return;
    }

    const res = onUpdateScore(scoreId, {
      score: val,
      date: editScoreDate,
      courseName: editScoreCourse,
      notes: editScoreNotes,
    });

    if (!res.success) {
      alert(res.message);
    } else {
      setEditingScoreId(null);
    }
  };

  const handleSaveCharityConfig = () => {
    onUpdateCharitySettings(selectedCharityId, charityPercentage);
    setCharitySaveSuccess(true);
    setTimeout(() => setCharitySaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & PROFILE OVERVIEW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1b2b3b] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Golfer Portal</span>
            <span>•</span>
            <span className="text-[#5eead4] font-medium">{currentUser.homeClub || 'St. Andrews'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {currentUser.fullName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Handicap Index</div>
            <div className="text-lg font-bold text-white">{currentUser.handicap || 14.2}</div>
          </div>
          <div className="w-12 h-12 rounded-xl ring-2 ring-[#223649] overflow-hidden bg-slate-800">
            <img 
              src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.fullName}`}
              alt={currentUser.fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 2. FIVE REQUIRED DASHBOARD MODULES (§10) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MODULE 1: SUBSCRIPTION STATUS (PRD §10.1) */}
        <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#e28743]" />
                Subscription Status
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                currentUser.subscription?.status === 'active'
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-700/50'
              }`}>
                {currentUser.subscription?.status || 'inactive'}
              </span>
            </div>

            <div className="pt-1">
              <div className="text-2xl font-extrabold text-white capitalize">
                {currentUser.subscription?.plan || 'Monthly'} Membership
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Amount: <strong className="text-slate-200">${currentUser.subscription?.amount || 19}/period</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0b1319] border border-[#1a2938] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Next Renewal Date:</span>
                <span className="font-semibold text-white">
                  {currentUser.subscription?.renewalDate || '2026-04-15'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-slate-300">Stripe PCI (Card ending ••4242)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Draw Eligibility:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fully Qualified
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2">
            <button
              onClick={onOpenSubscribe}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#182a39] hover:bg-[#203649] text-white border border-[#2b445a] transition cursor-pointer"
            >
              Switch Plan
            </button>
            {currentUser.subscription?.status === 'active' ? (
              <button
                onClick={onCancelSubscription}
                className="py-2 px-3 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20 border border-rose-900/30 transition cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={onOpenSubscribe}
                className="py-2 px-3 rounded-lg text-xs font-bold text-black bg-[#e28743] hover:bg-[#f09756] transition cursor-pointer"
              >
                Reactivate
              </button>
            )}
          </div>
        </div>

        {/* MODULE 2: SELECTED CHARITY & CONTRIBUTION % (PRD §10.3 & §08.1) */}
        <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Charity Allocation
              </span>
              <span className="text-xs font-bold text-[#5eead4]">
                {charityPercentage}% of fee
              </span>
            </div>

            {/* Current Charity Pill */}
            <div className="p-3 rounded-xl bg-[#0b1319] border border-[#1a2938] flex items-center gap-3">
              <img
                src={selectedCharity.logoUrl}
                alt={selectedCharity.name}
                className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {selectedCharity.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {selectedCharity.category}
                </div>
              </div>
            </div>

            {/* Select another charity dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">Nominated Charity:</label>
              <select
                id="user-charity-picker"
                value={selectedCharityId}
                onChange={(e) => setSelectedCharityId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0e1720] border border-[#213547] text-xs text-white focus:outline-none focus:border-[#5eead4]"
              >
                {charities.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            {/* Slider for percentage (Minimum 10% per PRD §08.1) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Contribution Rate (Min 10%):</span>
                <span className="font-bold text-[#e28743]">{charityPercentage}%</span>
              </div>
              <input
                id="charity-percentage-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={charityPercentage}
                onChange={(e) => setCharityPercentage(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#1b2b3a] rounded-lg appearance-none cursor-pointer accent-[#e28743]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Default)</span>
                <span>25%</span>
                <span>50%</span>
                <span>100% (Hero)</span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              id="save-charity-settings-btn"
              onClick={handleSaveCharityConfig}
              className="w-full py-2 rounded-lg text-xs font-bold bg-[#1b342c] hover:bg-[#23453a] text-[#5eead4] border border-[#2a5547] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {charitySaveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved Successfully!
                </>
              ) : (
                'Save Charity Preferences'
              )}
            </button>
          </div>
        </div>

        {/* MODULE 3: ACTIVE PARTICIPATION & DRAW TICKET (PRD §10.4 & §06) */}
        <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Active Draw Participation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e2a36] text-amber-300">
                {activeDraw?.cadence || 'Current Month'}
              </span>
            </div>

            <div>
              <div className="text-lg font-bold text-white">
                {activeDraw?.title || 'March 2026 Monthly Draw'}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-[#5eead4]" />
                Draw Date: <strong>{activeDraw ? new Date(activeDraw.drawDate).toLocaleDateString() : 'End of Month'}</strong>
              </div>
            </div>

            {/* User's 5 Numbers Card */}
            <div className="p-3.5 rounded-xl bg-[#0b1319] border border-[#1f3143] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Your 5 Active Numbers:</span>
                <span className="text-[11px] text-amber-400 font-medium">From latest 5 scores</span>
              </div>

              {activeDrawNumbers.length > 0 ? (
                <div className="flex items-center justify-center gap-2 py-1">
                  {activeDrawNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b2b3a] to-[#121e29] border border-[#2d465e] flex items-center justify-center text-sm font-extrabold text-white shadow-inner"
                    >
                      {num}
                    </div>
                  ))}
                  {/* If user has fewer than 5 scores, show placeholder slots */}
                  {Array.from({ length: Math.max(0, 5 - activeDrawNumbers.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-10 h-10 rounded-xl border border-dashed border-[#263c50] flex items-center justify-center text-xs text-slate-400 font-semibold"
                    >
                      --
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-amber-400/80">
                  Please log at least one score below to generate your draw entry!
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 leading-tight">
              Jackpot currently includes <strong className="text-emerald-400">${(activeDraw?.rolloverJackpotIn || 22800).toLocaleString()}</strong> rollover from unclaimed previous draws!
            </div>
          </div>

          <div className="pt-3 text-xs text-slate-400 flex items-center justify-between border-t border-[#172533]">
            <span>Draw Cadence:</span>
            <span className="font-semibold text-slate-200">Monthly</span>
          </div>
        </div>
      </div>

      {/* 3. SCORE MANAGEMENT SYSTEM - PRD §05 (FULL ROLLING LOGIC & VALIDATION) */}
      <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1b2b3b] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5eead4] font-semibold uppercase tracking-wider">
              <span>PRD §05 Stableford Score Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Golf Score Tracker (Latest 5 Rolling Scores)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only your latest 5 scores are retained. A new entry replaces the oldest score automatically. Stableford scale: 1–45. Strictly one score per date.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#0e171f] border border-[#1e2f40] text-xs text-slate-300 font-semibold">
              Retained: <strong className="text-[#5eead4]">{scores.length} / 5</strong>
            </span>
          </div>
        </div>

        {/* Input Form for New Score */}
        <form onSubmit={handleScoreSubmit} className="p-4 rounded-xl bg-[#0b1319] border border-[#1b2b3a] space-y-4">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#e28743]" />
            Record a New Stableford Score Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stableford Score (1-45) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Stableford Points (1 – 45) *
              </label>
              <input
                id="score-points-input"
                type="number"
                min="1"
                max="45"
                required
                value={newScoreVal}
                onChange={(e) => setNewScoreVal(e.target.value)}
                placeholder="e.g. 36"
                className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white font-bold text-sm focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Round Date * (Unique per day)
              </label>
              <input
                id="score-date-input"
                type="date"
                required
                value={newScoreDate}
                onChange={(e) => setNewScoreDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Golf Course
              </label>
              <input
                id="score-course-input"
                type="text"
                value={newScoreCourse}
                onChange={(e) => setNewScoreCourse(e.target.value)}
                placeholder="e.g. Sunningdale Old"
                className="w-full px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs focus:outline-none focus:border-[#5eead4]"
              />
            </div>

            {/* Notes & Submit Button */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Round Notes
              </label>
              <div className="flex gap-2">
                <input
                  id="score-notes-input"
                  type="text"
                  value={newScoreNotes}
                  onChange={(e) => setNewScoreNotes(e.target.value)}
                  placeholder="e.g. 3 birdies on back 9"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#121e29] border border-[#23374a] text-white text-xs focus:outline-none focus:border-[#5eead4]"
                />
                <button
                  id="submit-score-btn"
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer whitespace-nowrap"
                >
                  Save Score
                </button>
              </div>
            </div>
          </div>

          {scoreFeedback && (
            <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              scoreFeedback.isError
                ? 'bg-rose-950/70 border border-rose-700/50 text-rose-300'
                : 'bg-emerald-950/70 border border-emerald-700/50 text-emerald-300'
            }`}>
              {scoreFeedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{scoreFeedback.text}</span>
            </div>
          )}
        </form>

        {/* List of active 5 scores (Reverse Chronological Order) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Current Retained Scores (Reverse Chronological - Most Recent First)</span>
            <span className="text-[11px] text-slate-400">Total: {scores.length} / 5 slots</span>
          </div>

          {scores.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-[#0b1319] border border-[#1b2b3a] text-slate-400 text-sm">
              No scores recorded yet. Add your first Stableford round above!
            </div>
          ) : (
            <div className="grid gap-2">
              {scores.map((score, index) => {
                const isEditing = editingScoreId === score.id;

                if (isEditing) {
                  return (
                    <div key={score.id} className="p-3 rounded-xl bg-[#14232e] border border-[#3b5873] grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={editScoreVal}
                        onChange={(e) => setEditScoreVal(e.target.value)}
                        className="px-2 py-1 rounded bg-[#0e1720] border border-slate-600 text-white font-bold text-sm"
                      />
                      <input
                        type="date"
                        value={editScoreDate}
                        onChange={(e) => setEditScoreDate(e.target.value)}
                        className="px-2 py-1 rounded bg-[#0e1720] border border-slate-600 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={editScoreCourse}
                        onChange={(e) => setEditScoreCourse(e.target.value)}
                        placeholder="Course"
                        className="px-2 py-1 rounded bg-[#0e1720] border border-slate-600 text-white text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(score.id)}
                          className="px-3 py-1 rounded text-xs font-bold bg-emerald-600 text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingScoreId(null)}
                          className="px-3 py-1 rounded text-xs bg-slate-700 text-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={score.id}
                    className="p-3 rounded-xl bg-[#0b1319] border border-[#1a2b3a] flex items-center justify-between hover:border-[#2b445c] transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Slot number badge */}
                      <span className="w-6 h-6 rounded-full bg-[#162533] text-slate-400 text-xs font-bold flex items-center justify-center border border-[#23374a]">
                        #{index + 1}
                      </span>

                      {/* Score circle */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b2e3e] to-[#254157] text-white font-extrabold text-base flex items-center justify-center border border-[#345876] shadow-sm">
                        {score.score}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <span>{score.courseName || 'Unspecified Course'}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({score.date})</span>
                        </div>
                        {score.notes && (
                          <div className="text-xs text-slate-400 mt-0.5 italic">
                            "{score.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(score)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162534] transition cursor-pointer"
                        title="Edit score"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this score?')) {
                            onDeleteScore(score.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                        title="Delete score"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. WINNINGS OVERVIEW & VERIFICATION CENTER (PRD §09 & §10.5) */}
      <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1b2b3b] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <span>PRD §09 Winner Verification & Payout States</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Your Winnings & Verification Portal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Winners must upload a screenshot of their official scores from their club or golf app (Golf Genius, HowDidiDo, etc.) to receive verified payouts.
            </p>
          </div>

          <div className="p-2.5 px-4 rounded-xl bg-[#0b1319] border border-[#1f3143] text-right">
            <div className="text-[11px] text-slate-400">Total Career Winnings</div>
            <div className="text-xl font-extrabold text-[#5eead4]">${totalWon.toLocaleString()}</div>
          </div>
        </div>

        {userWinnings.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-[#0b1319] border border-[#1b2b3a] space-y-2">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No prizes won yet</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Keep your 5 rolling scores up to date. You are automatically entered into the upcoming {activeDraw?.title || 'monthly draw'}!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userWinnings.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-xl bg-[#0b1319] border border-[#223548] flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-black">
                      {w.matchedCount}-NUMBER MATCH
                    </span>
                    <span className="text-white font-bold text-base">{w.drawTitle}</span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Prize Awarded: <strong className="text-emerald-400 text-sm font-extrabold">${w.prizeAmount.toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Winning numbers matched:</span>
                    <div className="flex gap-1">
                      {w.matchedNumbers.map((num, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-[#1e2f3d] text-amber-300 font-bold text-xs">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="text-slate-400">Proof Status:</span>
                    {w.verificationStatus === 'unsubmitted' && (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Proof Required (Screenshot)
                      </span>
                    )}
                    {w.verificationStatus === 'pending' && (
                      <span className="text-sky-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Under Admin Review
                      </span>
                    )}
                    {w.verificationStatus === 'verified' && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified by {w.verifiedBy || 'Admin'}
                      </span>
                    )}
                    {w.verificationStatus === 'rejected' && (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Rejected ({w.rejectionReason})
                      </span>
                    )}

                    <span className="text-slate-600">•</span>

                    {/* Payment State (Pending -> Paid per PRD §09) */}
                    <span className="text-slate-400">Payout State:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      w.payoutStatus === 'paid'
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                    }`}>
                      {w.payoutStatus === 'paid' ? 'Paid' : 'Pending Verification'}
                    </span>
                  </div>

                  {w.payoutReference && (
                    <div className="text-[11px] text-slate-400">
                      Transfer Ref: <code className="text-slate-300">{w.payoutReference}</code>
                    </div>
                  )}
                </div>

                {/* Upload or View Proof Action */}
                <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                  {w.verificationStatus === 'unsubmitted' || w.verificationStatus === 'rejected' ? (
                    <button
                      id={`upload-proof-${w.id}`}
                      onClick={() => onOpenProofModal(w)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Golf Screenshot Proof
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenProofModal(w)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#162534] hover:bg-[#1d3042] border border-[#2b4257] transition cursor-pointer"
                    >
                      View Submitted Proof
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

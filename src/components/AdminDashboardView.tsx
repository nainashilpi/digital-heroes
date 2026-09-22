import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Heart, 
  CheckCircle2, 
  BarChart3, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Eye, 
  Send,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  GolfScore, 
  Charity, 
  Draw, 
  WinnerRecord, 
  DirectDonation, 
  DrawLogicType 
} from '../types';

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  scores: GolfScore[];
  charities: Charity[];
  draws: Draw[];
  winners: WinnerRecord[];
  donations: DirectDonation[];
  onSimulateDraw: (drawId: string, logic: DrawLogicType) => any;
  onPublishDraw: (drawId: string, simulationData?: any) => Draw;
  onVerifyWinner: (winnerId: string, approved: boolean, reason?: string) => void;
  onMarkPayoutPaid: (winnerId: string, reference: string) => void;
  onSaveCharity: (charity: Charity) => void;
  onDeleteCharity: (id: string) => void;
  onUpdateUserSubscription: (userId: string, plan: 'monthly' | 'yearly', status: 'active' | 'cancelled') => void;
  onUpdateScore: (scoreId: string, updates: Partial<GolfScore>) => { success: boolean; message: string };
  onDeleteScore: (scoreId: string) => void;
  onResetDemoData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  users,
  scores,
  charities,
  draws,
  winners,
  donations,
  onSimulateDraw,
  onPublishDraw,
  onVerifyWinner,
  onMarkPayoutPaid,
  onSaveCharity,
  onDeleteCharity,
  onUpdateUserSubscription,
  onUpdateScore,
  onDeleteScore,
  onResetDemoData,
}) => {
  // PRD §11: 5 Control Surfaces
  const [activeTab, setActiveTab] = useState<'users' | 'draws' | 'charities' | 'winners' | 'analytics'>('draws');

  // Draw Management state
  const activeDraw = draws.find(d => d.status === 'upcoming' || d.status === 'simulated') || draws[0];
  const [selectedLogic, setSelectedLogic] = useState<DrawLogicType>('algorithmic');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // User Management state
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForScores, setSelectedUserForScores] = useState<UserProfile | null>(null);

  // Charity modal state
  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null);
  const [charityFormData, setCharityFormData] = useState<Partial<Charity>>({});

  // Winner verification inspection modal
  const [selectedWinnerForProof, setSelectedWinnerForProof] = useState<WinnerRecord | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Handle draw simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      try {
        const result = onSimulateDraw(activeDraw.id, selectedLogic);
        setSimulationResult(result);
        setIsSimulating(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err: any) {
        alert(err.message || 'Error simulating draw');
        setIsSimulating(false);
      }
    }, 400);
  };

  const handlePublishOfficial = () => {
    if (!simulationResult) {
      alert('Please run a draw simulation first before publishing official results!');
      return;
    }

    if (confirm(`Are you ready to officially publish results for "${activeDraw.title}"? This will allocate cash rewards and create winner records.`)) {
      onPublishDraw(activeDraw.id, {
        tier5: simulationResult.tier5Winners,
        tier4: simulationResult.tier4Winners,
        tier3: simulationResult.tier3Winners,
      });

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });

      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 5000);
      setSimulationResult(null);
    }
  };

  // KPI calculations for surface 05
  const activeSubscribersCount = users.filter(u => u.subscription?.status === 'active').length;
  const totalPrizePoolsHistory = draws.reduce((acc, d) => acc + d.totalPrizePool, 0);
  const totalDirectDonations = donations.reduce((acc, d) => acc + d.amount, 0);
  const totalCharityRaisedSum = charities.reduce((acc, c) => acc + c.totalRaised, 0);
  const totalWinningsDisbursed = winners.filter(w => w.payoutStatus === 'paid').reduce((acc, w) => acc + w.prizeAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1b2b3b] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>PRD §11 Administrator Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Operations & Controls
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset mock database to initial PRD seed state? All test modifications will reload.')) {
                onResetDemoData();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#142330] hover:bg-[#1b2e3e] border border-[#273c50] transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset PRD Seed Data
          </button>
        </div>
      </div>

      {/* Five Control Surfaces Navigation Tabs (PRD §11) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1b2b3a] scrollbar-none">
        <button
          id="tab-draw-management"
          onClick={() => setActiveTab('draws')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'draws'
              ? 'bg-[#e28743] text-black shadow-md'
              : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          02. Draw Management & Simulation
        </button>

        <button
          id="tab-user-management"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#e28743] text-black shadow-md'
              : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
          }`}
        >
          <Users className="w-4 h-4" />
          01. User Management
        </button>

        <button
          id="tab-charity-management"
          onClick={() => setActiveTab('charities')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'charities'
              ? 'bg-[#e28743] text-black shadow-md'
              : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
          }`}
        >
          <Heart className="w-4 h-4" />
          03. Charity Management
        </button>

        <button
          id="tab-winner-management"
          onClick={() => setActiveTab('winners')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'winners'
              ? 'bg-[#e28743] text-black shadow-md'
              : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          04. Winners & Payout Verification
        </button>

        <button
          id="tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#e28743] text-black shadow-md'
              : 'bg-[#101b24] text-slate-400 hover:text-slate-200 border border-[#1b2b3a]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          05. Reports & Analytics
        </button>
      </div>

      {/* ============================================================== */}
      {/* 02. DRAW MANAGEMENT & SIMULATION ENGINE (PRD §06 & §11.02) */}
      {/* ============================================================== */}
      {activeTab === 'draws' && (
        <div className="space-y-6">
          {publishSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Draw Officially Published!</strong> Results and winner allocations are now live on subscriber dashboards.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Draw Config & Controller */}
            <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-6 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Draw Operations</span>
                <h2 className="text-xl font-bold text-white mt-1">{activeDraw.title}</h2>
                <div className="text-xs text-slate-400 mt-1">
                  Cadence: <strong className="text-slate-200">{activeDraw.cadence}</strong> • Status: 
                  <span className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#182836] text-amber-300">
                    {activeDraw.status}
                  </span>
                </div>
              </div>

              {/* Logic Configuration (PRD §06: Random vs Algorithmic score-frequency) */}
              <div className="p-4 rounded-xl bg-[#0b1319] border border-[#1a2938] space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  Select Draw Generation Logic:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedLogic('algorithmic')}
                    className={`p-3 rounded-lg text-left border transition cursor-pointer ${
                      selectedLogic === 'algorithmic'
                        ? 'bg-[#182a39] border-[#5eead4] text-white'
                        : 'bg-[#101b24] border-[#1b2b3a] text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Algorithmic</div>
                    <div className="text-[10px] text-slate-400 mt-1">Weighted by score frequency</div>
                  </button>

                  <button
                    onClick={() => setSelectedLogic('random')}
                    className={`p-3 rounded-lg text-left border transition cursor-pointer ${
                      selectedLogic === 'random'
                        ? 'bg-[#182a39] border-[#5eead4] text-white'
                        : 'bg-[#101b24] border-[#1b2b3a] text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Random</div>
                    <div className="text-[10px] text-slate-400 mt-1">Standard lottery-style (1-45)</div>
                  </button>
                </div>
              </div>

              {/* Pool and Rollover Summary */}
              <div className="p-4 rounded-xl bg-[#0b1319] border border-[#1a2938] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Prize Pool:</span>
                  <span className="font-bold text-white">${activeDraw.totalPrizePool.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rollover from Prior Draw:</span>
                  <span className="font-bold text-emerald-400">+${activeDraw.rolloverJackpotIn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-[#192736] pt-1.5">
                  <span className="text-slate-300 font-semibold">Total Pool Available:</span>
                  <span className="font-extrabold text-[#e28743] text-sm">
                    ${(activeDraw.totalPrizePool + activeDraw.rolloverJackpotIn).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="run-simulation-btn"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1e3a4d] to-[#254b63] hover:brightness-110 text-white border border-[#3b6685] transition cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  <Play className="w-4 h-4 text-[#5eead4]" />
                  {isSimulating ? 'Computing Simulation...' : 'Run Simulation Before Publish'}
                </button>

                {simulationResult && (
                  <button
                    id="publish-draw-btn"
                    onClick={handlePublishOfficial}
                    className="w-full py-3 rounded-xl font-extrabold text-sm bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#e28743]/20"
                  >
                    <Send className="w-4 h-4" />
                    Publish Official Results Now
                  </button>
                )}
              </div>
            </div>

            {/* Simulation Preview Results */}
            <div className="lg:col-span-2 rounded-2xl bg-[#101b24] border border-[#213547] p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#1c2c3c] pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-[#5eead4] tracking-wider">Live Simulation Output</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Projected Winning Numbers & Winners</h3>
                </div>
                {simulationResult && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-600/50">
                    Simulation Ready
                  </span>
                )}
              </div>

              {simulationResult ? (
                <div className="space-y-6">
                  {/* Generated Winning Numbers */}
                  <div>
                    <div className="text-xs font-bold text-slate-300 mb-2">Simulated 5 Winning Numbers (1 – 45):</div>
                    <div className="flex items-center gap-3">
                      {simulationResult.simulatedNumbers.map((num: number, i: number) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1b2b3a] to-[#294258] border-2 border-[#5eead4] flex items-center justify-center text-xl font-extrabold text-white shadow-lg"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tier Breakdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Tier 5 */}
                    <div className="p-4 rounded-xl bg-[#0b1319] border border-[#223548] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e28743] text-black">
                          5-MATCH
                        </span>
                        <span className="text-xs font-bold text-amber-300">40% + Rollover</span>
                      </div>
                      <div className="text-xs text-slate-400">Matched Players:</div>
                      <div className="text-xl font-extrabold text-white">
                        {simulationResult.tier5Winners.length} winners
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold">
                        {simulationResult.tier5Winners.length > 0
                          ? `$${simulationResult.draw.tiers.tier5.payoutPerWinner.toLocaleString()} each`
                          : `Rollover: $${simulationResult.draw.tiers.tier5.rolloverAmount.toLocaleString()}`}
                      </div>
                    </div>

                    {/* Tier 4 */}
                    <div className="p-4 rounded-xl bg-[#0b1319] border border-[#223548] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white">
                          4-MATCH
                        </span>
                        <span className="text-xs font-bold text-slate-300">35% Pool</span>
                      </div>
                      <div className="text-xs text-slate-400">Matched Players:</div>
                      <div className="text-xl font-extrabold text-white">
                        {simulationResult.tier4Winners.length} winners
                      </div>
                      <div className="text-xs text-slate-300">
                        {simulationResult.tier4Winners.length > 0
                          ? `$${simulationResult.draw.tiers.tier4.payoutPerWinner.toLocaleString()} each`
                          : 'No winners'}
                      </div>
                    </div>

                    {/* Tier 3 */}
                    <div className="p-4 rounded-xl bg-[#0b1319] border border-[#223548] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white">
                          3-MATCH
                        </span>
                        <span className="text-xs font-bold text-slate-300">25% Pool</span>
                      </div>
                      <div className="text-xs text-slate-400">Matched Players:</div>
                      <div className="text-xl font-extrabold text-white">
                        {simulationResult.tier3Winners.length} winners
                      </div>
                      <div className="text-xs text-slate-300">
                        {simulationResult.tier3Winners.length > 0
                          ? `$${simulationResult.draw.tiers.tier3.payoutPerWinner.toLocaleString()} each`
                          : 'No winners'}
                      </div>
                    </div>
                  </div>

                  {/* List of matched players */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">Matched Users in Simulation:</div>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                      {[...simulationResult.tier5Winners, ...simulationResult.tier4Winners, ...simulationResult.tier3Winners].map((w: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#0c161e] border border-[#1a2837] flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-white">{w.name}</span>
                            <span className="text-slate-400 ml-2">Matched {w.matched.length} numbers: [{w.matched.join(', ')}]</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1b2b3b] text-amber-300">
                            {w.matched.length}-Match
                          </span>
                        </div>
                      ))}
                      {simulationResult.tier5Winners.length + simulationResult.tier4Winners.length + simulationResult.tier3Winners.length === 0 && (
                        <div className="text-slate-400 text-xs py-4 text-center">
                          No players matched 3 or more numbers in this run. Try re-simulating or using Algorithmic logic!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
                  <div className="text-base font-semibold text-slate-300">No Simulation Active</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Run Simulation Before Publish" on the left to generate candidate winning numbers, evaluate subscriber tickets, and preview payouts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 01. USER MANAGEMENT (PRD §11.01) */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-user-search"
                type="text"
                placeholder="Search registered subscribers by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#101b24] border border-[#213547] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5eead4]"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#101b24] border border-[#213547] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0b1319] border-b border-[#1b2b3b] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Subscription</th>
                    <th className="p-4">Charity Cut</th>
                    <th className="p-4">Scores</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182635] text-slate-300">
                  {users
                    .filter(u => u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((user) => {
                      const userScoreCount = scores.filter(s => s.userId === user.id).length;

                      return (
                        <tr key={user.id} className="hover:bg-[#13202c] transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                                alt={user.fullName}
                                className="w-8 h-8 rounded-full bg-slate-700 object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-white">{user.fullName}</div>
                                <div className="text-[11px] text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              user.role === 'admin'
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                user.subscription?.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                              }`} />
                              <span className="capitalize">{user.subscription?.plan || 'monthly'} ({user.subscription?.status || 'inactive'})</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-rose-400">{user.charityPercentage}%</span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedUserForScores(user)}
                              className="px-2.5 py-1 rounded bg-[#182a39] hover:bg-[#203649] text-slate-200 border border-[#294257] font-semibold text-[11px] transition cursor-pointer"
                            >
                              {userScoreCount} / 5 Scores (Inspect)
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {user.subscription?.status === 'active' ? (
                              <button
                                onClick={() => onUpdateUserSubscription(user.id, user.subscription?.plan || 'monthly', 'cancelled')}
                                className="px-2.5 py-1 rounded text-[11px] font-medium text-rose-400 hover:bg-rose-950/20 border border-rose-900/30"
                              >
                                Cancel Sub
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateUserSubscription(user.id, 'monthly', 'active')}
                                className="px-2.5 py-1 rounded text-[11px] font-bold text-emerald-400 hover:bg-emerald-950/20 border border-emerald-900/30"
                              >
                                Activate Sub
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Inspector for User Golf Scores */}
          {selectedUserForScores && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#101b24] border border-[#273d52] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-[#1b2b3a] pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Golf Scores for {selectedUserForScores.fullName}</h3>
                    <div className="text-xs text-slate-400">Strict Stableford 1-45 rolling 5 scores</div>
                  </div>
                  <button
                    onClick={() => setSelectedUserForScores(null)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {scores.filter(s => s.userId === selectedUserForScores.id).map(s => (
                    <div key={s.id} className="p-3 rounded-xl bg-[#0b1319] border border-[#1b2b3a] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#182b3b] text-white font-extrabold flex items-center justify-center border border-[#274057]">
                          {s.score}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{s.courseName}</div>
                          <div className="text-[11px] text-slate-400">{s.date}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteScore(s.id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete score"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {scores.filter(s => s.userId === selectedUserForScores.id).length === 0 && (
                    <div className="text-slate-400 text-xs py-4 text-center">No scores on record.</div>
                  )}
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedUserForScores(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#182836] text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 03. CHARITY MANAGEMENT (PRD §11.03) */}
      {/* ============================================================== */}
      {activeTab === 'charities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Registered Charitable Partners</h2>
              <p className="text-xs text-slate-400">Add, edit, or remove charities and manage upcoming events</p>
            </div>
            <button
              id="admin-add-charity-btn"
              onClick={() => {
                setEditingCharity(null);
                setCharityFormData({
                  name: '',
                  category: 'Veterans & First Responders',
                  tagline: '',
                  description: '',
                  logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&h=200&q=80',
                  bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&h=600&q=80',
                  website: 'https://charity.org',
                  featured: false,
                  impactMetrics: [
                    { label: 'Beneficiaries', value: '1,000+' },
                    { label: 'Direct Impact', value: '90%' },
                  ],
                  upcomingEvents: [],
                  totalRaised: 0,
                });
                setIsCharityModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e28743] hover:bg-[#f09756] text-black transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              Add New Charity
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <div
                key={charity.id}
                className="rounded-2xl bg-[#101b24] border border-[#213547] p-5 flex flex-col justify-between shadow-lg space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={charity.logoUrl}
                      alt={charity.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{charity.name}</h3>
                      <span className="text-[11px] text-slate-400">{charity.category}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {charity.tagline}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#0b1319] border border-[#1a2837] flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Raised:</span>
                    <span className="font-bold text-emerald-400">${charity.totalRaised.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-[#182635]">
                  <button
                    onClick={() => {
                      setEditingCharity(charity);
                      setCharityFormData(charity);
                      setIsCharityModalOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-[#162534] hover:bg-[#1d3042] text-slate-200 border border-[#273d52] transition cursor-pointer text-center"
                  >
                    Edit Content
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete charity "${charity.name}"?`)) {
                        onDeleteCharity(charity.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Charity Modal */}
          {isCharityModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#101b24] border border-[#273d52] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-[#1b2b3a] pb-3">
                  <h3 className="font-bold text-white text-base">
                    {editingCharity ? `Edit: ${editingCharity.name}` : 'Register New Charity'}
                  </h3>
                  <button onClick={() => setIsCharityModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Charity Name *</label>
                    <input
                      type="text"
                      value={charityFormData.name || ''}
                      onChange={(e) => setCharityFormData({ ...charityFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1720] border border-[#23384a] text-white"
                      placeholder="e.g. Hope For Golfers"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      value={charityFormData.category || 'Veterans & First Responders'}
                      onChange={(e) => setCharityFormData({ ...charityFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1720] border border-[#23384a] text-white"
                    >
                      <option value="Veterans & First Responders">Veterans & First Responders</option>
                      <option value="Youth & Education">Youth & Education</option>
                      <option value="Health & Medical">Health & Medical</option>
                      <option value="Environment & Wildlife">Environment & Wildlife</option>
                      <option value="Community Care">Community Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
                    <input
                      type="text"
                      value={charityFormData.tagline || ''}
                      onChange={(e) => setCharityFormData({ ...charityFormData, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1720] border border-[#23384a] text-white"
                      placeholder="Short emotional summary"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Mission Description</label>
                    <textarea
                      rows={3}
                      value={charityFormData.description || ''}
                      onChange={(e) => setCharityFormData({ ...charityFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1720] border border-[#23384a] text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="charity-featured-toggle"
                      checked={charityFormData.featured || false}
                      onChange={(e) => setCharityFormData({ ...charityFormData, featured: e.target.checked })}
                      className="rounded bg-[#0e1720] border-[#23384a]"
                    />
                    <label htmlFor="charity-featured-toggle" className="text-slate-300">Feature on homepage spotlight</label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#1a2837]">
                  <button
                    onClick={() => setIsCharityModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs bg-slate-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!charityFormData.name) {
                        alert('Charity name is required');
                        return;
                      }
                      const charityToSave: Charity = {
                        id: editingCharity ? editingCharity.id : `charity-${Date.now()}`,
                        name: charityFormData.name || '',
                        category: charityFormData.category as any || 'Veterans & First Responders',
                        tagline: charityFormData.tagline || '',
                        description: charityFormData.description || '',
                        logoUrl: charityFormData.logoUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&h=200&q=80',
                        bannerUrl: charityFormData.bannerUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&h=600&q=80',
                        website: charityFormData.website || 'https://charity.org',
                        impactMetrics: charityFormData.impactMetrics || [{ label: 'Impact', value: '100%' }],
                        totalRaised: charityFormData.totalRaised || 0,
                        featured: charityFormData.featured || false,
                        upcomingEvents: charityFormData.upcomingEvents || [],
                      };
                      onSaveCharity(charityToSave);
                      setIsCharityModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#e28743] text-black"
                  >
                    Save Charity
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 04. WINNERS & PAYOUT VERIFICATION (PRD §09 & §11.04) */}
      {/* ============================================================== */}
      {activeTab === 'winners' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Winner Verification & Payout Submissions</h2>
            <p className="text-xs text-slate-400">
              PRD §09: Inspect golf platform screenshot proofs (Golf Genius, HowDidiDo). Approve/Reject verification and mark payouts as Paid.
            </p>
          </div>

          <div className="rounded-2xl bg-[#101b24] border border-[#213547] overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0b1319] border-b border-[#1b2b3b] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Winner</th>
                  <th className="p-4">Draw</th>
                  <th className="p-4">Tier & Prize</th>
                  <th className="p-4">Verification Proof</th>
                  <th className="p-4">Payment State</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182635] text-slate-300">
                {winners.map((w) => (
                  <tr key={w.id} className="hover:bg-[#13202c] transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{w.userName}</div>
                      <div className="text-[11px] text-slate-400">{w.userEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{w.drawTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-400">${w.prizeAmount.toLocaleString()}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1d2d3c] text-amber-300">
                        {w.matchedCount}-Match
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {w.verificationStatus === 'unsubmitted' && (
                          <span className="text-amber-400 text-xs font-medium">Unsubmitted</span>
                        )}
                        {w.verificationStatus === 'pending' && (
                          <button
                            onClick={() => setSelectedWinnerForProof(w)}
                            className="px-2.5 py-1 rounded text-xs font-bold bg-sky-950/80 text-sky-300 border border-sky-600/50 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review Screenshot Proof
                          </button>
                        )}
                        {w.verificationStatus === 'verified' && (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                        {w.verificationStatus === 'rejected' && (
                          <span className="text-rose-400 font-medium">Rejected</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        w.payoutStatus === 'paid'
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
                          : 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                      }`}>
                        {w.payoutStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {w.verificationStatus === 'pending' && (
                        <button
                          onClick={() => setSelectedWinnerForProof(w)}
                          className="px-2.5 py-1 rounded text-xs font-bold bg-[#e28743] text-black"
                        >
                          Audit Proof
                        </button>
                      )}

                      {w.verificationStatus === 'verified' && w.payoutStatus !== 'paid' && (
                        <button
                          onClick={() => {
                            const ref = prompt('Enter Stripe payout / wire transaction reference:', `TRX_STRIPE_${Date.now()}`);
                            if (ref) onMarkPayoutPaid(w.id, ref);
                          }}
                          className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for proof review */}
          {selectedWinnerForProof && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#101b24] border border-[#273d52] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-[#1b2b3a] pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Golf Screenshot Verification</h3>
                    <div className="text-xs text-slate-400">{selectedWinnerForProof.userName} • Prize: ${selectedWinnerForProof.prizeAmount.toLocaleString()}</div>
                  </div>
                  <button onClick={() => setSelectedWinnerForProof(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    <strong>Claimed Winning Numbers:</strong> [{selectedWinnerForProof.matchedNumbers.join(', ')}]
                  </div>

                  {/* Screenshot preview */}
                  <div className="rounded-xl overflow-hidden border border-[#25394d] bg-black max-h-72 flex items-center justify-center">
                    <img
                      src={selectedWinnerForProof.proofUrl || 'https://images.unsplash.com/photo-1593111774642-a146440b8a2e?auto=format&fit=crop&w=800&q=80'}
                      alt="Scorecard Proof"
                      className="max-h-72 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {selectedWinnerForProof.proofNotes && (
                    <div className="p-3 rounded-lg bg-[#0b1319] border border-[#1b2a38] text-xs text-slate-300">
                      <strong>Golfer Notes:</strong> "{selectedWinnerForProof.proofNotes}"
                    </div>
                  )}

                  {/* Rejection reason input */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Rejection Remarks (if rejecting):</label>
                    <input
                      type="text"
                      value={rejectionNotes}
                      onChange={(e) => setRejectionNotes(e.target.value)}
                      placeholder="e.g. Stableford score on scorecard differs from submitted date"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0e1720] border border-[#223547] text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#1a2837]">
                  <button
                    onClick={() => {
                      onVerifyWinner(selectedWinnerForProof.id, false, rejectionNotes || 'Score verification failed.');
                      setSelectedWinnerForProof(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800"
                  >
                    Reject Submission
                  </button>

                  <button
                    onClick={() => {
                      onVerifyWinner(selectedWinnerForProof.id, true);
                      setSelectedWinnerForProof(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white"
                  >
                    Approve Verification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 05. REPORTS & ANALYTICS (PRD §11.05) */}
      {/* ============================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#101b24] border border-[#213547] space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Platform Users</div>
              <div className="text-3xl font-extrabold text-white">{users.length}</div>
              <div className="text-[11px] text-emerald-400">{activeSubscribersCount} active subscribers</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101b24] border border-[#213547] space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Prize Pools</div>
              <div className="text-3xl font-extrabold text-[#e28743]">${totalPrizePoolsHistory.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">Across all published & upcoming draws</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101b24] border border-[#213547] space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Charity Raised</div>
              <div className="text-3xl font-extrabold text-[#5eead4]">${totalCharityRaisedSum.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">Subscription shares & direct donations</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101b24] border border-[#213547] space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold">Paid Out to Winners</div>
              <div className="text-3xl font-extrabold text-amber-300">${totalWinningsDisbursed.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400">100% verified via score proof</div>
            </div>
          </div>

          {/* Historical draws table */}
          <div className="rounded-2xl bg-[#101b24] border border-[#213547] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-white text-base">Monthly Draw History & Rollover Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1b2b3b] text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Draw Cadence</th>
                    <th className="pb-3">Logic Used</th>
                    <th className="pb-3">Winning Numbers</th>
                    <th className="pb-3">Prize Pool</th>
                    <th className="pb-3">Rollover Out</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182635] text-slate-300">
                  {draws.map(d => (
                    <tr key={d.id} className="py-2.5">
                      <td className="py-3 font-semibold text-white">{d.title}</td>
                      <td className="py-3 capitalize text-slate-400">{d.logic}</td>
                      <td className="py-3">
                        {d.winningNumbers.length > 0 ? (
                          <span className="font-mono font-bold text-amber-300">
                            [{d.winningNumbers.join(', ')}]
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending Draw</span>
                        )}
                      </td>
                      <td className="py-3 font-semibold text-white">${d.totalPrizePool.toLocaleString()}</td>
                      <td className="py-3 font-bold text-emerald-400">
                        {d.rolloverJackpotOut > 0 ? `$${d.rolloverJackpotOut.toLocaleString()}` : '$0'}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#162737] text-slate-200">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

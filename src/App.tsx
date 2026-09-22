import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  GolfScore, 
  Charity, 
  Draw, 
  WinnerRecord, 
  DirectDonation, 
  DrawLogicType 
} from './types';
import { db, TEST_CREDENTIALS } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CharitiesView } from './components/CharitiesView';
import { UserDashboardView } from './components/UserDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SubscribeModal } from './components/SubscribeModal';
import { DonateModal } from './components/DonateModal';
import { ProofUploadModal } from './components/ProofUploadModal';
import { CharityDetailModal } from './components/CharityDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation view state
  const [activeView, setActiveView] = useState<'home' | 'charities' | 'dashboard' | 'admin'>('home');

  // Application Data State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => db.getCurrentUser());
  const [users, setUsers] = useState<UserProfile[]>(() => db.getAllUsers());
  const [scores, setScores] = useState<GolfScore[]>(() => 
    currentUser ? db.getUserScores(currentUser.id) : []
  );
  const [allScores, setAllScores] = useState<GolfScore[]>(() => {
    const raw = localStorage.getItem('dh_golf_scores');
    return raw ? JSON.parse(raw) : [];
  });
  const [charities, setCharities] = useState<Charity[]>(() => db.getCharities());
  const [draws, setDraws] = useState<Draw[]>(() => db.getDraws());
  const [winners, setWinners] = useState<WinnerRecord[]>(() => db.getWinners());
  const [donations, setDonations] = useState<DirectDonation[]>(() => db.getDonations());

  // Modals state
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateCharityId, setDonateCharityId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProofWinner, setSelectedProofWinner] = useState<WinnerRecord | null>(null);
  const [selectedCharityDetail, setSelectedCharityDetail] = useState<Charity | null>(null);

  // Sync state whenever custom event fires or user changes
  const reloadData = () => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    setUsers(db.getAllUsers());
    setCharities(db.getCharities());
    setDraws(db.getDraws());
    setWinners(db.getWinners());
    setDonations(db.getDonations());

    if (user) {
      setScores(db.getUserScores(user.id));
    } else {
      setScores([]);
    }

    const raw = localStorage.getItem('dh_golf_scores');
    setAllScores(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => {
    const handleStoreUpdate = () => {
      reloadData();
    };

    window.addEventListener('dh_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('dh_store_updated', handleStoreUpdate);
  }, []);

  // Update scores when user changes
  useEffect(() => {
    if (currentUser) {
      setScores(db.getUserScores(currentUser.id));
    } else {
      setScores([]);
    }
  }, [currentUser?.id]);

  // Auth / Role Switcher handlers
  const handleSwitchRole = (role: 'subscriber' | 'admin' | 'public') => {
    const targetUser = db.loginAs(role);
    setCurrentUser(targetUser);
    if (role === 'admin') {
      setActiveView('admin');
    } else if (role === 'subscriber') {
      setActiveView('dashboard');
    } else {
      setActiveView('home');
    }
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('home');
  };

  const handleCustomLogin = (email: string) => {
    const matched = db.loginAs('subscriber', email);
    if (matched) {
      setActiveView('dashboard');
    } else {
      alert(`User with email "${email}" not found. Try one-click demo login or sign up.`);
    }
  };

  const handleRegisterNew = (fullName: string, email: string) => {
    const newUser = db.registerUser(fullName, email, charities[0]?.id || 'charity-1', 10, 'monthly');
    setCurrentUser(newUser);
    setActiveView('dashboard');
  };

  // Score management handlers (PRD §05)
  const handleAddScore = (scoreVal: number, date: string, courseName?: string, notes?: string) => {
    if (!currentUser) return { success: false, message: 'You must be signed in to add scores.' };
    const result = db.addScore(currentUser.id, scoreVal, date, courseName, notes);
    if (result.success) {
      setScores(result.scores);
    }
    return result;
  };

  const handleUpdateScore = (scoreId: string, updates: Partial<GolfScore>) => {
    const res = db.updateScore(scoreId, updates);
    if (res.success && currentUser) {
      setScores(db.getUserScores(currentUser.id));
    }
    return res;
  };

  const handleDeleteScore = (scoreId: string) => {
    db.deleteScore(scoreId);
    if (currentUser) {
      setScores(db.getUserScores(currentUser.id));
    }
  };

  // Subscription handlers (PRD §04)
  const handleConfirmSubscription = (
    plan: 'monthly' | 'yearly', 
    charityId: string, 
    charityPercentage: number,
    fullName?: string,
    email?: string
  ) => {
    if (!currentUser) {
      if (fullName && email) {
        const newUser = db.registerUser(fullName, email, charityId, charityPercentage, plan);
        setCurrentUser(newUser);
        setActiveView('dashboard');
      }
    } else {
      db.updateSubscription(currentUser.id, plan, 'active');
      db.updateUserProfile(currentUser.id, {
        charityId,
        charityPercentage,
      });
      reloadData();
      setActiveView('dashboard');
    }
  };

  const handleCancelSubscription = () => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to cancel your draw subscription? You will remain qualified until the end of your billing cycle.')) {
      db.updateSubscription(currentUser.id, currentUser.subscription?.plan || 'monthly', 'cancelled');
      reloadData();
    }
  };

  const handleUpdateCharitySettings = (charityId: string, percentage: number) => {
    if (!currentUser) return;
    db.updateUserProfile(currentUser.id, {
      charityId,
      charityPercentage: Math.max(10, percentage),
    });
    reloadData();
  };

  // Donation handler (PRD §08.1)
  const handleConfirmDonation = (
    charityId: string,
    charityName: string,
    amount: number,
    frequency: 'one-time' | 'monthly',
    donorName: string,
    donorEmail: string,
    message?: string
  ) => {
    db.recordDonation({
      charityId,
      charityName,
      amount,
      frequency,
      donorName,
      donorEmail,
      message,
    });
    reloadData();
  };

  // Winner proof & payout handlers (PRD §09)
  const handleSubmitWinnerProof = (winnerId: string, proofUrl: string, notes?: string) => {
    db.submitWinnerProof(winnerId, proofUrl, notes);
    reloadData();
  };

  const handleVerifyWinner = (winnerId: string, approved: boolean, reason?: string) => {
    db.adminVerifyWinner(winnerId, approved, currentUser?.fullName || 'Sarah Chen (Admin)', reason);
    reloadData();
  };

  const handleMarkPayoutPaid = (winnerId: string, reference: string) => {
    db.adminMarkPayoutPaid(winnerId, reference);
    reloadData();
  };

  // Draw simulation and publishing (PRD §06 & §07)
  const handleSimulateDraw = (drawId: string, logic: DrawLogicType) => {
    return db.simulateDraw(drawId, logic);
  };

  const handlePublishDraw = (drawId: string, simulationData?: any) => {
    const published = db.publishDraw(drawId, simulationData);
    reloadData();
    return published;
  };

  // Charity management (PRD §11.03)
  const handleSaveCharity = (charity: Charity) => {
    db.saveCharity(charity);
    reloadData();
  };

  const handleDeleteCharity = (charityId: string) => {
    db.deleteCharity(charityId);
    reloadData();
  };

  const activeDraw = draws.find(d => d.status === 'upcoming' || d.status === 'simulated') || draws[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1319] text-slate-100 selection:bg-[#e28743] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
        onOpenDonate={() => {
          setDonateCharityId(undefined);
          setIsDonateModalOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            charities={charities}
            activeDraw={activeDraw}
            onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
            onOpenDonate={(charityId) => {
              setDonateCharityId(charityId);
              setIsDonateModalOpen(true);
            }}
            onNavigateCharities={() => setActiveView('charities')}
            onSelectCharityDetail={(charity) => setSelectedCharityDetail(charity)}
          />
        )}

        {activeView === 'charities' && (
          <CharitiesView
            charities={charities}
            currentUser={currentUser}
            onSelectAsMyCharity={(charityId) => handleUpdateCharitySettings(charityId, currentUser?.charityPercentage || 15)}
            onOpenDonate={(charityId) => {
              setDonateCharityId(charityId);
              setIsDonateModalOpen(true);
            }}
            onOpenDetailModal={(charity) => setSelectedCharityDetail(charity)}
          />
        )}

        {activeView === 'dashboard' && currentUser && (
          <UserDashboardView
            currentUser={currentUser}
            scores={scores}
            charities={charities}
            activeDraw={activeDraw}
            winners={winners}
            onAddScore={handleAddScore}
            onUpdateScore={handleUpdateScore}
            onDeleteScore={handleDeleteScore}
            onUpdateCharitySettings={handleUpdateCharitySettings}
            onOpenProofModal={(record) => setSelectedProofWinner(record)}
            onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
            onCancelSubscription={handleCancelSubscription}
          />
        )}

        {activeView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            users={users}
            scores={allScores}
            charities={charities}
            draws={draws}
            winners={winners}
            donations={donations}
            onSimulateDraw={handleSimulateDraw}
            onPublishDraw={handlePublishDraw}
            onVerifyWinner={handleVerifyWinner}
            onMarkPayoutPaid={handleMarkPayoutPaid}
            onSaveCharity={handleSaveCharity}
            onDeleteCharity={handleDeleteCharity}
            onUpdateUserSubscription={(userId, plan, status) => {
              db.updateSubscription(userId, plan, status);
              reloadData();
            }}
            onUpdateScore={handleUpdateScore}
            onDeleteScore={handleDeleteScore}
            onResetDemoData={() => {
              db.resetDemoData();
              reloadData();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => setActiveView(view)}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
        onOpenDonate={() => {
          setDonateCharityId(undefined);
          setIsDonateModalOpen(true);
        }}
      />

      {/* Modals */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        charities={charities}
        currentUser={currentUser}
        onConfirmSubscription={handleConfirmSubscription}
      />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        charities={charities}
        preselectedCharityId={donateCharityId}
        onConfirmDonation={handleConfirmDonation}
      />

      <ProofUploadModal
        isOpen={!!selectedProofWinner}
        onClose={() => setSelectedProofWinner(null)}
        winnerRecord={selectedProofWinner}
        onSubmitProof={handleSubmitWinnerProof}
      />

      <CharityDetailModal
        isOpen={!!selectedCharityDetail}
        onClose={() => setSelectedCharityDetail(null)}
        charity={selectedCharityDetail}
        currentUser={currentUser}
        onSelectAsMyCharity={(id) => handleUpdateCharitySettings(id, currentUser?.charityPercentage || 15)}
        onOpenDonate={(id) => {
          setDonateCharityId(id);
          setIsDonateModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginAsRole={(role) => handleSwitchRole(role)}
        onCustomLogin={handleCustomLogin}
        onRegisterNew={handleRegisterNew}
      />
    </div>
  );
}

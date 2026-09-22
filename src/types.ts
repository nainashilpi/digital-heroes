export type UserRole = 'public' | 'subscriber' | 'admin';

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'cancelled' | 'lapsed' | 'none';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  handicap?: number;
  homeClub?: string;
  charityId?: string;
  charityPercentage: number; // minimum 10%
  subscription?: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    renewalDate: string;
    amount: number;
    currency: string;
    startedAt: string;
  };
  createdAt: string;
}

export interface GolfScore {
  id: string;
  userId: string;
  score: number; // Stableford 1–45
  date: string; // YYYY-MM-DD (unique per user per date)
  courseName?: string;
  notes?: string;
  createdAt: string;
}

export interface Charity {
  id: string;
  name: string;
  category: 'Health & Medical' | 'Youth & Education' | 'Veterans & First Responders' | 'Environment & Wildlife' | 'Community Care';
  description: string;
  tagline: string;
  logoUrl: string;
  bannerUrl: string;
  website: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
  totalRaised: number;
  featured: boolean;
  upcomingEvents: {
    title: string;
    date: string;
    location: string;
    type: string;
  }[];
}

export type DrawLogicType = 'random' | 'algorithmic';

export interface DrawTier {
  matchCount: 3 | 4 | 5;
  poolSharePercentage: number; // 40% for 5-match, 35% for 4-match, 25% for 3-match
  allocatedAmount: number;
  winnersCount: number;
  payoutPerWinner: number;
  rolloverAmount: number; // only applicable to 5-match jackpot
}

export interface Draw {
  id: string;
  title: string;
  cadence: string; // e.g. "March 2026 Monthly Draw"
  drawDate: string;
  status: 'upcoming' | 'simulated' | 'published';
  logic: DrawLogicType;
  winningNumbers: number[]; // 5 numbers (1-45)
  totalPrizePool: number;
  rolloverJackpotIn: number; // carried over from previous draws
  rolloverJackpotOut: number; // if 5-match has 0 winners
  tiers: {
    tier5: DrawTier;
    tier4: DrawTier;
    tier3: DrawTier;
  };
  totalParticipants: number;
  publishedAt?: string;
}

export interface WinnerRecord {
  id: string;
  drawId: string;
  drawTitle: string;
  drawDate: string;
  userId: string;
  userName: string;
  userEmail: string;
  matchedCount: 3 | 4 | 5;
  matchedNumbers: number[];
  userNumbers: number[];
  prizeAmount: number;
  verificationStatus: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  proofUrl?: string;
  proofNotes?: string;
  proofSubmittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  payoutStatus: 'pending' | 'paid';
  payoutReference?: string;
  paidAt?: string;
}

export interface DirectDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  charityId: string;
  charityName: string;
  amount: number;
  frequency: 'one-time' | 'monthly';
  message?: string;
  date: string;
}

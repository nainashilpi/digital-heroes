import { createClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  GolfScore, 
  Charity, 
  Draw, 
  WinnerRecord, 
  DirectDonation, 
  DrawLogicType 
} from '../types';

// Environment variables for real Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sample-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sample-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORAGE_KEYS = {
  USER: 'dh_current_user',
  USERS_LIST: 'dh_users_list',
  SCORES: 'dh_golf_scores',
  CHARITIES: 'dh_charities',
  DRAWS: 'dh_draws',
  WINNERS: 'dh_winners',
  DONATIONS: 'dh_donations',
  SEED_VERSION: 'dh_seed_version_v1.2',
};

// Seed Charities
const INITIAL_CHARITIES: Charity[] = [
  {
    id: 'charity-1',
    name: 'Tee Off For Heroes',
    category: 'Veterans & First Responders',
    tagline: 'Supporting rehabilitative golf clinics and mental wellness for disabled veterans.',
    description: 'Tee Off For Heroes connects wounded veterans, service members, and first responders with adaptive golf equipment, peer coaching, and trauma recovery programs across 38 regional chapters.',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&h=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&h=600&q=80',
    website: 'https://teeoffforheroes.org',
    totalRaised: 148500,
    featured: true,
    impactMetrics: [
      { label: 'Veterans Supported', value: '4,250+' },
      { label: 'Adaptive Clinics', value: '180 / yr' },
      { label: 'Fund Allocation', value: '92% Direct' },
    ],
    upcomingEvents: [
      {
        title: '2026 Memorial Invitational Charity Golf Day',
        date: '2026-04-18',
        location: 'Wentworth Club, Surrey',
        type: '18-Hole Scramble & Gala Dinner',
      },
      {
        title: 'Spring Veteran Adaptive Clinic',
        date: '2026-05-10',
        location: 'Celtic Manor Resort',
        type: 'Instructional Clinic',
      },
    ],
  },
  {
    id: 'charity-2',
    name: 'Fairway Youth Initiative',
    category: 'Youth & Education',
    tagline: 'Breaking financial barriers to introduce underserved children to golf and stem academics.',
    description: 'Providing full equipment, academic tutoring, and after-school golf leadership programs to young players from economically disadvantaged communities.',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&h=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=600&q=80',
    website: 'https://fairwayyouth.org',
    totalRaised: 94200,
    featured: true,
    impactMetrics: [
      { label: 'Youth Enrolled', value: '2,800' },
      { label: 'College Scholarships', value: '64 Awarded' },
      { label: 'Equipment Kits', value: '1,500' },
    ],
    upcomingEvents: [
      {
        title: 'Junior Masters Pro-Am Cup',
        date: '2026-04-25',
        location: 'The Belfry, Sutton Coldfield',
        type: 'Junior Charity Pro-Am',
      },
    ],
  },
  {
    id: 'charity-3',
    name: 'Green Greens Conservation',
    category: 'Environment & Wildlife',
    tagline: 'Rewilding golf corridors, protecting pollinator habitats, and water stewardship.',
    description: 'Partnering with golf clubs nationwide to transform non-playing roughs into thriving biodiversity sanctuaries, native wetlands, and pesticide-free pollinator pathways.',
    logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&h=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&h=600&q=80',
    website: 'https://greengreensconservancy.org',
    totalRaised: 62400,
    featured: false,
    impactMetrics: [
      { label: 'Acres Rewilded', value: '1,420' },
      { label: 'Clubs Audited', value: '112' },
      { label: 'Bee Colonies Saved', value: '850+' },
    ],
    upcomingEvents: [
      {
        title: 'Earth Day Links Restoration Walk',
        date: '2026-04-22',
        location: 'Royal Birkdale, Southport',
        type: 'Eco Conservation Walk',
      },
    ],
  },
  {
    id: 'charity-4',
    name: 'HeartBeat Cancer Care Hub',
    category: 'Health & Medical',
    tagline: 'Delivering urgent transport and emotional respite retreats for oncology patients.',
    description: 'Funding dedicated transportation to daily chemo and radiotherapy appointments, as well as family respite days and counseling for individuals navigating cancer treatments.',
    logoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&h=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=600&q=80',
    website: 'https://heartbeatcancercare.org',
    totalRaised: 182000,
    featured: true,
    impactMetrics: [
      { label: 'Rides to Chemo', value: '18,400' },
      { label: 'Patient Grants', value: '$850k+' },
      { label: 'Care Packages', value: '3,200' },
    ],
    upcomingEvents: [
      {
        title: 'Swing for Hope Charity Classic',
        date: '2026-05-02',
        location: 'Gleneagles King\'s Course',
        type: 'Charity Golf Classic & Auction',
      },
    ],
  },
  {
    id: 'charity-5',
    name: 'Community Care Pantry Network',
    category: 'Community Care',
    tagline: 'Combating food insecurity with dignified mobile markets and hot meal programs.',
    description: 'Providing nutritious, fresh local produce and non-perishable food boxes to families and pensioners experiencing acute cost-of-living distress.',
    logoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&h=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&h=600&q=80',
    website: 'https://communitycarepantry.org',
    totalRaised: 78900,
    featured: false,
    impactMetrics: [
      { label: 'Meals Distributed', value: '240,000+' },
      { label: 'Mobile Trucks', value: '14 Active' },
      { label: 'Volunteers', value: '820' },
    ],
    upcomingEvents: [
      {
        title: 'Annual Harvest Charity Scramble',
        date: '2026-05-18',
        location: 'Sunbury Golf Centre',
        type: 'Team Scramble',
      },
    ],
  },
];

// Seed Users (including default subscriber and admin test credentials)
export const TEST_CREDENTIALS = {
  subscriber: {
    email: 'user@digitalheroes.co.in',
    name: 'Liam Vance',
    role: 'subscriber' as const,
  },
  admin: {
    email: 'admin@digitalheroes.co.in',
    name: 'Sarah Chen (Admin)',
    role: 'admin' as const,
  },
};

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-liam-vance',
    email: 'user@digitalheroes.co.in',
    fullName: 'Liam Vance',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    handicap: 12.4,
    homeClub: 'Sunningdale Golf Club',
    charityId: 'charity-1',
    charityPercentage: 15,
    subscription: {
      plan: 'monthly',
      status: 'active',
      renewalDate: '2026-04-15',
      amount: 19,
      currency: 'USD',
      startedAt: '2026-01-15',
    },
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-admin-chen',
    email: 'admin@digitalheroes.co.in',
    fullName: 'Sarah Chen',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    charityId: 'charity-4',
    charityPercentage: 20,
    subscription: {
      plan: 'yearly',
      status: 'active',
      renewalDate: '2027-01-01',
      amount: 190,
      currency: 'USD',
      startedAt: '2026-01-01',
    },
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'user-marcus-reed',
    email: 'marcus.reed@example.com',
    fullName: 'Marcus Reed',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    handicap: 8.6,
    homeClub: 'Royal St George\'s',
    charityId: 'charity-2',
    charityPercentage: 12,
    subscription: {
      plan: 'yearly',
      status: 'active',
      renewalDate: '2027-02-10',
      amount: 190,
      currency: 'USD',
      startedAt: '2026-02-10',
    },
    createdAt: '2026-02-10T11:20:00Z',
  },
  {
    id: 'user-elena-rostova',
    email: 'elena.r@example.com',
    fullName: 'Elena Rostova',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    handicap: 16.2,
    homeClub: 'Loch Lomond Golf Club',
    charityId: 'charity-1',
    charityPercentage: 25,
    subscription: {
      plan: 'monthly',
      status: 'active',
      renewalDate: '2026-04-01',
      amount: 19,
      currency: 'USD',
      startedAt: '2026-02-01',
    },
    createdAt: '2026-02-01T14:40:00Z',
  },
  {
    id: 'user-david-miller',
    email: 'd.miller@example.com',
    fullName: 'David Miller',
    role: 'subscriber',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    handicap: 19.5,
    homeClub: 'Woodhall Spa',
    charityId: 'charity-3',
    charityPercentage: 10,
    subscription: {
      plan: 'monthly',
      status: 'active',
      renewalDate: '2026-03-29',
      amount: 19,
      currency: 'USD',
      startedAt: '2026-01-29',
    },
    createdAt: '2026-01-29T16:10:00Z',
  },
];

// Initial scores for Liam Vance (user-liam-vance)
// Strict Stableford 1-45, 5 rolling scores, unique dates!
const INITIAL_SCORES: GolfScore[] = [
  {
    id: 'score-1',
    userId: 'user-liam-vance',
    score: 38,
    date: '2026-03-18',
    courseName: 'Sunningdale - Old Course',
    notes: 'Strong back nine, 4 birdies',
    createdAt: '2026-03-18T18:00:00Z',
  },
  {
    id: 'score-2',
    userId: 'user-liam-vance',
    score: 34,
    date: '2026-03-11',
    courseName: 'The Berkshire - Red',
    notes: 'Windy afternoon, consistent putting',
    createdAt: '2026-03-11T18:00:00Z',
  },
  {
    id: 'score-3',
    userId: 'user-liam-vance',
    score: 41,
    date: '2026-03-04',
    courseName: 'Walton Heath - Old',
    notes: 'Personal best of season, 36 points on 16',
    createdAt: '2026-03-04T18:00:00Z',
  },
  {
    id: 'score-4',
    userId: 'user-liam-vance',
    score: 29,
    date: '2026-02-25',
    courseName: 'Sunningdale - New Course',
    notes: 'Tough pin positions, double on 7th',
    createdAt: '2026-02-25T18:00:00Z',
  },
  {
    id: 'score-5',
    userId: 'user-liam-vance',
    score: 36,
    date: '2026-02-18',
    courseName: 'Swinley Forest',
    notes: 'Solid iron play throughout',
    createdAt: '2026-02-18T18:00:00Z',
  },
  // Marcus Reed scores
  {
    id: 'score-mr-1',
    userId: 'user-marcus-reed',
    score: 39,
    date: '2026-03-17',
    courseName: 'Royal St George\'s',
    createdAt: '2026-03-17T17:00:00Z',
  },
  {
    id: 'score-mr-2',
    userId: 'user-marcus-reed',
    score: 34,
    date: '2026-03-09',
    courseName: 'Princes Golf Club',
    createdAt: '2026-03-09T17:00:00Z',
  },
  {
    id: 'score-mr-3',
    userId: 'user-marcus-reed',
    score: 38,
    date: '2026-03-01',
    courseName: 'Royal Cinque Ports',
    createdAt: '2026-03-01T17:00:00Z',
  },
  {
    id: 'score-mr-4',
    userId: 'user-marcus-reed',
    score: 42,
    date: '2026-02-20',
    courseName: 'Rye Golf Club',
    createdAt: '2026-02-20T17:00:00Z',
  },
  {
    id: 'score-mr-5',
    userId: 'user-marcus-reed',
    score: 31,
    date: '2026-02-12',
    courseName: 'Royal St George\'s',
    createdAt: '2026-02-12T17:00:00Z',
  },
  // Elena Rostova scores
  {
    id: 'score-er-1',
    userId: 'user-elena-rostova',
    score: 34,
    date: '2026-03-19',
    courseName: 'Loch Lomond',
    createdAt: '2026-03-19T18:00:00Z',
  },
  {
    id: 'score-er-2',
    userId: 'user-elena-rostova',
    score: 38,
    date: '2026-03-12',
    courseName: 'Dundonald Links',
    createdAt: '2026-03-12T18:00:00Z',
  },
  {
    id: 'score-er-3',
    userId: 'user-elena-rostova',
    score: 36,
    date: '2026-03-05',
    courseName: 'Western Gailes',
    createdAt: '2026-03-05T18:00:00Z',
  },
  {
    id: 'score-er-4',
    userId: 'user-elena-rostova',
    score: 40,
    date: '2026-02-22',
    courseName: 'Turnberry Ailsa',
    createdAt: '2026-02-22T18:00:00Z',
  },
  {
    id: 'score-er-5',
    userId: 'user-elena-rostova',
    score: 29,
    date: '2026-02-15',
    courseName: 'Prestwick Golf Club',
    createdAt: '2026-02-15T18:00:00Z',
  },
];

// Initial Draws
// PRD §06 & §07: Monthly cadence, 5-match (40%, Rollover = Yes), 4-match (35%, Rollover = No), 3-match (25%, Rollover = No)
const INITIAL_DRAWS: Draw[] = [
  {
    id: 'draw-feb-2026',
    title: 'February 2026 Monthly Draw',
    cadence: 'February 2026',
    drawDate: '2026-02-28T20:00:00Z',
    status: 'published',
    logic: 'algorithmic',
    winningNumbers: [14, 29, 34, 38, 41],
    totalPrizePool: 32000,
    rolloverJackpotIn: 10000,
    rolloverJackpotOut: 22800, // 40% of pool ($12,800) + $10,000 rollover carried forward!
    tiers: {
      tier5: {
        matchCount: 5,
        poolSharePercentage: 40,
        allocatedAmount: 22800, // $12,800 + $10,000 rollover
        winnersCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 22800,
      },
      tier4: {
        matchCount: 4,
        poolSharePercentage: 35,
        allocatedAmount: 11200,
        winnersCount: 2,
        payoutPerWinner: 5600,
        rolloverAmount: 0,
      },
      tier3: {
        matchCount: 3,
        poolSharePercentage: 25,
        allocatedAmount: 8000,
        winnersCount: 8,
        payoutPerWinner: 1000,
        rolloverAmount: 0,
      },
    },
    totalParticipants: 3200,
    publishedAt: '2026-02-28T21:00:00Z',
  },
  {
    id: 'draw-mar-2026',
    title: 'March 2026 Spring Major Draw',
    cadence: 'March 2026',
    drawDate: '2026-03-31T20:00:00Z',
    status: 'upcoming',
    logic: 'random',
    winningNumbers: [],
    totalPrizePool: 45000,
    rolloverJackpotIn: 22800, // Unclaimed rollover from Feb!
    rolloverJackpotOut: 0,
    tiers: {
      tier5: {
        matchCount: 5,
        poolSharePercentage: 40,
        allocatedAmount: 40800, // $18,000 (40% of 45k) + $22,800 rollover
        winnersCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 40800,
      },
      tier4: {
        matchCount: 4,
        poolSharePercentage: 35,
        allocatedAmount: 15750,
        winnersCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 0,
      },
      tier3: {
        matchCount: 3,
        poolSharePercentage: 25,
        allocatedAmount: 11250,
        winnersCount: 0,
        payoutPerWinner: 0,
        rolloverAmount: 0,
      },
    },
    totalParticipants: 3950,
  },
];

// Initial Winners (Liam Vance matched 4 numbers in Feb draw!)
const INITIAL_WINNERS: WinnerRecord[] = [
  {
    id: 'winner-feb-liam',
    drawId: 'draw-feb-2026',
    drawTitle: 'February 2026 Monthly Draw',
    drawDate: '2026-02-28T20:00:00Z',
    userId: 'user-liam-vance',
    userName: 'Liam Vance',
    userEmail: 'user@digitalheroes.co.in',
    matchedCount: 4,
    matchedNumbers: [29, 34, 38, 41],
    userNumbers: [38, 34, 41, 29, 36],
    prizeAmount: 5600,
    verificationStatus: 'verified',
    proofUrl: 'https://images.unsplash.com/photo-1593111774642-a146440b8a2e?auto=format&fit=crop&w=800&q=80',
    proofNotes: 'Scorecard verified via Golf Genius Club App: Walton Heath (41 pts) and Sunningdale (38 & 34 pts)',
    proofSubmittedAt: '2026-03-01T10:14:00Z',
    verifiedAt: '2026-03-02T14:30:00Z',
    verifiedBy: 'Sarah Chen (Admin)',
    payoutStatus: 'paid',
    payoutReference: 'STRIPE_TRX_928174981',
    paidAt: '2026-03-03T09:00:00Z',
  },
  {
    id: 'winner-feb-marcus',
    drawId: 'draw-feb-2026',
    drawTitle: 'February 2026 Monthly Draw',
    drawDate: '2026-02-28T20:00:00Z',
    userId: 'user-marcus-reed',
    userName: 'Marcus Reed',
    userEmail: 'marcus.reed@example.com',
    matchedCount: 4,
    matchedNumbers: [29, 34, 38, 41], // (assuming scores)
    userNumbers: [39, 34, 38, 42, 31],
    prizeAmount: 5600,
    verificationStatus: 'pending',
    proofUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    proofNotes: 'HowDidiDo official export attached.',
    proofSubmittedAt: '2026-03-02T16:00:00Z',
    payoutStatus: 'pending',
  },
];

// Initialize storage safely with seed data
function initializeStorage() {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem(STORAGE_KEYS.SEED_VERSION);
  if (currentVersion !== 'dh_seed_version_v1.3') {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USERS[0])); // Default to Liam Vance (subscriber)
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(INITIAL_SCORES));
    localStorage.setItem(STORAGE_KEYS.CHARITIES, JSON.stringify(INITIAL_CHARITIES));
    localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(INITIAL_DRAWS));
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(INITIAL_WINNERS));
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SEED_VERSION, 'dh_seed_version_v1.3');
  }
}

initializeStorage();

function notifyStoreChange(event: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dh_store_updated', { detail: { event } }));
  }
}

// -------------------------------------------------------------
// Database & LocalStore Repository
// -------------------------------------------------------------

export const db = {
  // Current Auth Session
  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // update in users list too
      const users = this.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    notifyStoreChange('auth_changed');
  },

  getAllUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (!raw) return INITIAL_USERS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  loginAs(role: 'subscriber' | 'admin' | 'public', customEmail?: string): UserProfile | null {
    if (role === 'public') {
      this.setCurrentUser(null);
      return null;
    }

    const users = this.getAllUsers();
    let target = users.find(u => {
      if (customEmail) return u.email.toLowerCase() === customEmail.toLowerCase();
      return u.role === role;
    });

    if (!target) {
      if (role === 'admin') {
        target = INITIAL_USERS[1];
      } else {
        target = INITIAL_USERS[0];
      }
    }

    this.setCurrentUser(target);
    return target;
  },

  registerUser(fullName: string, email: string, charityId: string, charityPercentage: number = 10, plan: 'monthly' | 'yearly' = 'monthly'): UserProfile {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: 'subscriber',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=0e171f`,
      handicap: 18.0,
      homeClub: 'Digital Heroes Golf Club',
      charityId,
      charityPercentage: Math.max(10, charityPercentage),
      subscription: {
        plan,
        status: 'active',
        renewalDate: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 86400000).toISOString().split('T')[0],
        amount: plan === 'yearly' ? 190 : 19,
        currency: 'USD',
        startedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const users = this.getAllUsers();
    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  },

  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));

    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId) {
      this.setCurrentUser(updated);
    }
    notifyStoreChange('users_updated');
    return updated;
  },

  // -------------------------------------------------------------
  // SCORES (PRD §05)
  // - Retains latest 5 scores in reverse chronological order
  // - Stableford 1-45
  // - One score per date (duplicate date blocked)
  // - New score replaces oldest stored score automatically when > 5
  // -------------------------------------------------------------
  getUserScores(userId: string): GolfScore[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    const allScores: GolfScore[] = raw ? JSON.parse(raw) : INITIAL_SCORES;
    return allScores
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addScore(userId: string, scoreVal: number, date: string, courseName?: string, notes?: string): { success: boolean; message: string; scores: GolfScore[] } {
    if (scoreVal < 1 || scoreVal > 45) {
      return { success: false, message: 'Stableford score must be between 1 and 45.', scores: this.getUserScores(userId) };
    }

    if (!date) {
      return { success: false, message: 'Score entry must include a valid date.', scores: this.getUserScores(userId) };
    }

    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    let allScores: GolfScore[] = raw ? JSON.parse(raw) : INITIAL_SCORES;

    // Check for duplicate date for this user
    const existingDate = allScores.find(s => s.userId === userId && s.date === date);
    if (existingDate) {
      return {
        success: false,
        message: `Only one score is permitted per date. An entry already exists for ${date}. Please edit or delete that entry instead.`,
        scores: this.getUserScores(userId),
      };
    }

    const newScore: GolfScore = {
      id: `score-${Date.now()}`,
      userId,
      score: Math.round(scoreVal),
      date,
      courseName: courseName || 'Unspecified Golf Course',
      notes,
      createdAt: new Date().toISOString(),
    };

    // Get current user scores sorted chronologically desc
    let userScores = allScores
      .filter(s => s.userId === userId)
      .concat(newScore)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // PRD §05: "Only the latest 5 scores are retained at any time. A new score replaces the oldest stored score automatically."
    if (userScores.length > 5) {
      userScores = userScores.slice(0, 5);
    }

    // Reconstruct allScores
    const otherScores = allScores.filter(s => s.userId !== userId);
    const updatedAllScores = [...otherScores, ...userScores];
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(updatedAllScores));
    notifyStoreChange('scores_updated');

    return {
      success: true,
      message: 'Score successfully recorded! Retained in your active 5-score draw profile.',
      scores: userScores,
    };
  },

  updateScore(scoreId: string, updates: Partial<GolfScore>): { success: boolean; message: string } {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    let allScores: GolfScore[] = raw ? JSON.parse(raw) : INITIAL_SCORES;
    const index = allScores.findIndex(s => s.id === scoreId);
    if (index === -1) return { success: false, message: 'Score record not found.' };

    if (updates.score !== undefined && (updates.score < 1 || updates.score > 45)) {
      return { success: false, message: 'Stableford score must be between 1 and 45.' };
    }

    // Check duplicate date if date changed
    if (updates.date && updates.date !== allScores[index].date) {
      const duplicate = allScores.find(s => s.userId === allScores[index].userId && s.date === updates.date && s.id !== scoreId);
      if (duplicate) {
        return { success: false, message: `An entry for ${updates.date} already exists.` };
      }
    }

    allScores[index] = { ...allScores[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(allScores));
    notifyStoreChange('scores_updated');
    return { success: true, message: 'Score updated successfully.' };
  },

  deleteScore(scoreId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    let allScores: GolfScore[] = raw ? JSON.parse(raw) : INITIAL_SCORES;
    allScores = allScores.filter(s => s.id !== scoreId);
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(allScores));
    notifyStoreChange('scores_updated');
  },

  // -------------------------------------------------------------
  // CHARITIES (PRD §08)
  // -------------------------------------------------------------
  getCharities(): Charity[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHARITIES);
    if (!raw) return INITIAL_CHARITIES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CHARITIES;
    }
  },

  getCharity(id: string): Charity | undefined {
    return this.getCharities().find(c => c.id === id);
  },

  saveCharity(charity: Charity): void {
    const charities = this.getCharities();
    const index = charities.findIndex(c => c.id === charity.id);
    if (index >= 0) {
      charities[index] = charity;
    } else {
      charities.push(charity);
    }
    localStorage.setItem(STORAGE_KEYS.CHARITIES, JSON.stringify(charities));
    notifyStoreChange('charities_updated');
  },

  deleteCharity(id: string): void {
    let charities = this.getCharities();
    charities = charities.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CHARITIES, JSON.stringify(charities));
    notifyStoreChange('charities_updated');
  },

  // Direct independent donation (PRD §08.1)
  recordDonation(donation: Omit<DirectDonation, 'id' | 'date'>): DirectDonation {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    const donations: DirectDonation[] = raw ? JSON.parse(raw) : [];

    const newDonation: DirectDonation = {
      ...donation,
      id: `donation-${Date.now()}`,
      date: new Date().toISOString(),
    };

    donations.unshift(newDonation);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));

    // Update charity raised amount
    const charities = this.getCharities();
    const charity = charities.find(c => c.id === donation.charityId);
    if (charity) {
      charity.totalRaised += donation.amount;
      this.saveCharity(charity);
    }

    notifyStoreChange('donations_updated');
    return newDonation;
  },

  getDonations(): DirectDonation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return raw ? JSON.parse(raw) : [];
  },

  // -------------------------------------------------------------
  // DRAWS & REWARDS ENGINE (PRD §06 & §07)
  // - 5-match: 40% pool, Rollover = Yes
  // - 4-match: 35% pool, Rollover = No
  // - 3-match: 25% pool, Rollover = No
  // - Logic: Random OR Algorithmic (weighted by score frequency)
  // - Simulation before publish
  // -------------------------------------------------------------
  getDraws(): Draw[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAWS);
    return raw ? JSON.parse(raw) : INITIAL_DRAWS;
  },

  getActiveDraw(): Draw | undefined {
    return this.getDraws().find(d => d.status === 'upcoming' || d.status === 'simulated');
  },

  // Simulate a draw with algorithmic or random logic
  simulateDraw(drawId: string, logic: DrawLogicType): {
    simulatedNumbers: number[];
    tier5Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[];
    tier4Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[];
    tier3Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[];
    draw: Draw;
  } {
    const draws = this.getDraws();
    const draw = draws.find(d => d.id === drawId);
    if (!draw) throw new Error('Draw not found');

    const users = this.getAllUsers().filter(u => u.subscription?.status === 'active');
    const rawScores = localStorage.getItem(STORAGE_KEYS.SCORES);
    const allScores: GolfScore[] = rawScores ? JSON.parse(rawScores) : INITIAL_SCORES;

    // Collect 5 active scores per user
    const userTickets: { userId: string; name: string; email: string; scores: number[] }[] = [];
    users.forEach(user => {
      const uScores = allScores
        .filter(s => s.userId === user.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(s => s.score);

      // Only enter if they have scores
      if (uScores.length > 0) {
        userTickets.push({
          userId: user.id,
          name: user.fullName,
          email: user.email,
          scores: uScores,
        });
      }
    });

    let winningNumbers: number[] = [];

    if (logic === 'random') {
      // Pick 5 unique random numbers between 1 and 45
      const pool = Array.from({ length: 45 }, (_, i) => i + 1);
      while (winningNumbers.length < 5 && pool.length > 0) {
        const randIndex = Math.floor(Math.random() * pool.length);
        winningNumbers.push(pool.splice(randIndex, 1)[0]);
      }
      winningNumbers.sort((a, b) => a - b);
    } else {
      // Algorithmic: Weighted by score frequency across all active entries
      const frequencyMap: Record<number, number> = {};
      for (let i = 1; i <= 45; i++) frequencyMap[i] = 1; // baseline smoothing

      userTickets.forEach(t => {
        t.scores.forEach(s => {
          frequencyMap[s] = (frequencyMap[s] || 0) + 3;
        });
      });

      // Select 5 distinct numbers using weighted sampling
      const weightedList: number[] = [];
      Object.entries(frequencyMap).forEach(([num, weight]) => {
        for (let w = 0; w < weight; w++) {
          weightedList.push(parseInt(num, 10));
        }
      });

      const selected = new Set<number>();
      let attempts = 0;
      while (selected.size < 5 && attempts < 1000) {
        attempts++;
        const pick = weightedList[Math.floor(Math.random() * weightedList.length)];
        selected.add(pick);
      }

      winningNumbers = Array.from(selected).sort((a, b) => a - b);
    }

    // Evaluate winners against winningNumbers
    const tier5Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[] = [];
    const tier4Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[] = [];
    const tier3Winners: { userId: string; name: string; numbers: number[]; matched: number[] }[] = [];

    userTickets.forEach(ticket => {
      const matched = ticket.scores.filter(num => winningNumbers.includes(num));
      const matchCount = matched.length;

      if (matchCount === 5) {
        tier5Winners.push({ userId: ticket.userId, name: ticket.name, numbers: ticket.scores, matched });
      } else if (matchCount === 4) {
        tier4Winners.push({ userId: ticket.userId, name: ticket.name, numbers: ticket.scores, matched });
      } else if (matchCount === 3) {
        tier3Winners.push({ userId: ticket.userId, name: ticket.name, numbers: ticket.scores, matched });
      }
    });

    // Calculate prize allocations
    const basePrizePool = draw.totalPrizePool;
    const rolloverIn = draw.rolloverJackpotIn;

    // 5-match: 40% + rolloverIn
    const tier5Base = basePrizePool * 0.40;
    const tier5Total = tier5Base + rolloverIn;
    const tier5Count = tier5Winners.length;
    const tier5PayoutPerWinner = tier5Count > 0 ? Math.floor(tier5Total / tier5Count) : 0;
    const rolloverOut = tier5Count === 0 ? tier5Total : 0;

    // 4-match: 35%
    const tier4Total = basePrizePool * 0.35;
    const tier4Count = tier4Winners.length;
    const tier4PayoutPerWinner = tier4Count > 0 ? Math.floor(tier4Total / tier4Count) : 0;

    // 3-match: 25%
    const tier3Total = basePrizePool * 0.25;
    const tier3Count = tier3Winners.length;
    const tier3PayoutPerWinner = tier3Count > 0 ? Math.floor(tier3Total / tier3Count) : 0;

    const updatedDraw: Draw = {
      ...draw,
      status: 'simulated',
      logic,
      winningNumbers,
      rolloverJackpotOut: rolloverOut,
      totalParticipants: userTickets.length || 3950,
      tiers: {
        tier5: {
          matchCount: 5,
          poolSharePercentage: 40,
          allocatedAmount: tier5Total,
          winnersCount: tier5Count,
          payoutPerWinner: tier5PayoutPerWinner,
          rolloverAmount: rolloverOut,
        },
        tier4: {
          matchCount: 4,
          poolSharePercentage: 35,
          allocatedAmount: tier4Total,
          winnersCount: tier4Count,
          payoutPerWinner: tier4PayoutPerWinner,
          rolloverAmount: 0,
        },
        tier3: {
          matchCount: 3,
          poolSharePercentage: 25,
          allocatedAmount: tier3Total,
          winnersCount: tier3Count,
          payoutPerWinner: tier3PayoutPerWinner,
          rolloverAmount: 0,
        },
      },
    };

    const dIndex = draws.findIndex(d => d.id === drawId);
    draws[dIndex] = updatedDraw;
    localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(draws));
    notifyStoreChange('draws_updated');

    return {
      simulatedNumbers: winningNumbers,
      tier5Winners,
      tier4Winners,
      tier3Winners,
      draw: updatedDraw,
    };
  },

  // Publish a simulated draw officially
  publishDraw(drawId: string, winnersData?: {
    tier5: { userId: string; name: string; numbers: number[]; matched: number[] }[];
    tier4: { userId: string; name: string; numbers: number[]; matched: number[] }[];
    tier3: { userId: string; name: string; numbers: number[]; matched: number[] }[];
  }): Draw {
    const draws = this.getDraws();
    const draw = draws.find(d => d.id === drawId);
    if (!draw) throw new Error('Draw not found');

    draw.status = 'published';
    draw.publishedAt = new Date().toISOString();

    // Create winner records for each winner
    const rawWinners = localStorage.getItem(STORAGE_KEYS.WINNERS);
    const allWinners: WinnerRecord[] = rawWinners ? JSON.parse(rawWinners) : INITIAL_WINNERS;

    const users = this.getAllUsers();

    if (winnersData) {
      const addTierWinners = (
        list: { userId: string; name: string; numbers: number[]; matched: number[] }[], 
        tierCount: 3 | 4 | 5, 
        amount: number
      ) => {
        list.forEach(w => {
          const user = users.find(u => u.id === w.userId);
          const newWinnerRecord: WinnerRecord = {
            id: `winner-${draw.id}-${w.userId}-${Date.now()}`,
            drawId: draw.id,
            drawTitle: draw.title,
            drawDate: draw.drawDate,
            userId: w.userId,
            userName: w.name,
            userEmail: user?.email || '',
            matchedCount: tierCount,
            matchedNumbers: w.matched,
            userNumbers: w.numbers,
            prizeAmount: amount,
            verificationStatus: 'unsubmitted',
            payoutStatus: 'pending',
          };
          allWinners.unshift(newWinnerRecord);
        });
      };

      addTierWinners(winnersData.tier5, 5, draw.tiers.tier5.payoutPerWinner);
      addTierWinners(winnersData.tier4, 4, draw.tiers.tier4.payoutPerWinner);
      addTierWinners(winnersData.tier3, 3, draw.tiers.tier3.payoutPerWinner);
      localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(allWinners));
    }

    // Schedule next month draw with rollover if 5-match wasn't hit
    const nextDrawMonth = new Date(new Date(draw.drawDate).getTime() + 30 * 86400000);
    const monthName = nextDrawMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const nextDraw: Draw = {
      id: `draw-${Date.now()}`,
      title: `${monthName} Monthly Draw`,
      cadence: monthName,
      drawDate: nextDrawMonth.toISOString(),
      status: 'upcoming',
      logic: 'random',
      winningNumbers: [],
      totalPrizePool: 38000,
      rolloverJackpotIn: draw.rolloverJackpotOut, // carry forward!
      rolloverJackpotOut: 0,
      totalParticipants: draw.totalParticipants + 150,
      tiers: {
        tier5: {
          matchCount: 5,
          poolSharePercentage: 40,
          allocatedAmount: (38000 * 0.40) + draw.rolloverJackpotOut,
          winnersCount: 0,
          payoutPerWinner: 0,
          rolloverAmount: (38000 * 0.40) + draw.rolloverJackpotOut,
        },
        tier4: {
          matchCount: 4,
          poolSharePercentage: 35,
          allocatedAmount: 38000 * 0.35,
          winnersCount: 0,
          payoutPerWinner: 0,
          rolloverAmount: 0,
        },
        tier3: {
          matchCount: 3,
          poolSharePercentage: 25,
          allocatedAmount: 38000 * 0.25,
          winnersCount: 0,
          payoutPerWinner: 0,
          rolloverAmount: 0,
        },
      },
    };

    draws.unshift(nextDraw);
    localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(draws));
    notifyStoreChange('draws_updated');
    notifyStoreChange('winners_updated');

    return draw;
  },

  // -------------------------------------------------------------
  // WINNERS & VERIFICATION (PRD §09)
  // - Verification applies to winners only
  // - Proof upload: screenshot of scores from golf platform
  // - Admin review: Approve or reject submission
  // - Payment states: Pending -> Paid
  // -------------------------------------------------------------
  getWinners(userId?: string): WinnerRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WINNERS);
    const winners: WinnerRecord[] = raw ? JSON.parse(raw) : INITIAL_WINNERS;
    if (userId) {
      return winners.filter(w => w.userId === userId);
    }
    return winners;
  },

  submitWinnerProof(winnerId: string, proofUrl: string, notes?: string): WinnerRecord {
    const winners = this.getWinners();
    const index = winners.findIndex(w => w.id === winnerId);
    if (index === -1) throw new Error('Winner record not found');

    winners[index].proofUrl = proofUrl;
    winners[index].proofNotes = notes;
    winners[index].verificationStatus = 'pending';
    winners[index].proofSubmittedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
    notifyStoreChange('winners_updated');
    return winners[index];
  },

  adminVerifyWinner(winnerId: string, approved: boolean, verifiedByAdminName: string, reason?: string): WinnerRecord {
    const winners = this.getWinners();
    const index = winners.findIndex(w => w.id === winnerId);
    if (index === -1) throw new Error('Winner record not found');

    if (approved) {
      winners[index].verificationStatus = 'verified';
      winners[index].verifiedAt = new Date().toISOString();
      winners[index].verifiedBy = verifiedByAdminName;
      winners[index].rejectionReason = undefined;
    } else {
      winners[index].verificationStatus = 'rejected';
      winners[index].rejectionReason = reason || 'Scorecard screenshot does not match entered scores or date.';
    }

    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
    notifyStoreChange('winners_updated');
    return winners[index];
  },

  adminMarkPayoutPaid(winnerId: string, payoutReference: string): WinnerRecord {
    const winners = this.getWinners();
    const index = winners.findIndex(w => w.id === winnerId);
    if (index === -1) throw new Error('Winner record not found');

    winners[index].payoutStatus = 'paid';
    winners[index].payoutReference = payoutReference || `PAYOUT_${Date.now()}`;
    winners[index].paidAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
    notifyStoreChange('winners_updated');
    return winners[index];
  },

  // -------------------------------------------------------------
  // SUBSCRIPTION & STRIPE SIMULATION (PRD §04)
  // -------------------------------------------------------------
  updateSubscription(userId: string, plan: 'monthly' | 'yearly', status: 'active' | 'cancelled'): UserProfile {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const durationDays = plan === 'yearly' ? 365 : 30;
    const amount = plan === 'yearly' ? 190 : 19;

    const updatedSub = {
      plan,
      status,
      renewalDate: new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0],
      amount,
      currency: 'USD',
      startedAt: users[index].subscription?.startedAt || new Date().toISOString(),
    };

    return this.updateUserProfile(userId, { subscription: updatedSub });
  },

  // Reset entire mock dataset for fresh testing
  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.SEED_VERSION);
    initializeStorage();
    notifyStoreChange('store_reset');
  },
};

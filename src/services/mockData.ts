/**
 * Mock data and services for running the app without Supabase.
 * All data is in-memory and resets on app reload.
 */

import { DEFAULT_CATEGORIES } from '../constants/categories';
import { getPointsForAction } from '../constants/points';
import type { ComplaintStatus, Department } from '../types/complaints';
import type { ComplaintWithPhotos, ReportDraft } from '../types/complaints';
import type { LeaderboardEntry } from '../types/points';
import type { Tables } from '../types/database';

export type Profile = Tables<'profiles'>;

/** Minimal session shape used by auth store (no Supabase). */
export interface MockSession {
  user: { id: string };
}

// ─── Current user (set on "login") ───────────────────────────────────────────

let currentUserId: string | null = null;

export function setMockCurrentUserId(id: string | null) {
  currentUserId = id;
}

export function getMockCurrentUserId(): string | null {
  return currentUserId;
}

// ─── Mock users & profiles ──────────────────────────────────────────────────

const MOCK_PROFILES: Profile[] = [
  {
    id: 'mock-user-1',
    name: 'Demo User',
    phone: '+919876543210',
    ward: null,
    points: 120,
    total_reports: 8,
    avatar_url: null,
    device_id: null,
    daily_report_count: 2,
    last_report_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function ensureCurrentUser(): Profile {
  let profile = MOCK_PROFILES.find((p) => p.id === currentUserId);
  if (!profile && currentUserId) {
    profile = {
      id: currentUserId,
      name: 'Demo User',
      phone: null,
      ward: null,
      points: 0,
      total_reports: 0,
      avatar_url: null,
      device_id: null,
      daily_report_count: 0,
      last_report_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_PROFILES.push(profile);
  }
  return profile ?? MOCK_PROFILES[0];
}

// ─── Mock complaints (in-memory list) ────────────────────────────────────────

const VALID_STATUSES: ComplaintStatus[] = [
  'submitted',
  'forwarded',
  'acknowledged',
  'resolved',
  'rejected',
];

function buildComplaintWithPhotos(
  raw: {
    id: string;
    user_id: string;
    category_id: string;
    subcategory_id: string | null;
    description: string;
    latitude: number;
    longitude: number;
    address: string | null;
    status: ComplaintStatus;
    department: Department;
    points_awarded: number;
    verified: boolean;
    created_at: string;
    updated_at: string;
    contractor_info: unknown;
  },
  photos: {
    id: string;
    complaint_id: string;
    photo_url: string;
    created_at: string;
  }[],
  categoryName: string,
  categoryNameKn: string,
  subcategoryName: string | null,
  subcategoryNameKn: string | null,
): ComplaintWithPhotos {
  return {
    ...raw,
    contractor_info: raw.contractor_info as Record<string, unknown> | null,
    photos,
    category_name: categoryName,
    category_name_kn: categoryNameKn,
    subcategory_name: subcategoryName,
    subcategory_name_kn: subcategoryNameKn,
  };
}

const mockComplaints: ComplaintWithPhotos[] = [];
let nextComplaintId = 1;

// ─── Mock Auth Service ─────────────────────────────────────────────────────

export const mockAuthService = {
  async signInWithOtp(
    _phone: string,
  ): Promise<{ session: MockSession; user: { id: string } }> {
    await delay(600);
    const profile = MOCK_PROFILES[0];
    currentUserId = profile.id;
    return {
      session: { user: { id: profile.id } },
      user: { id: profile.id },
    };
  },

  async verifyOtp(
    _phone: string,
    _token: string,
  ): Promise<{ session: MockSession; user: { id: string } }> {
    await delay(500);
    const profile = MOCK_PROFILES[0];
    currentUserId = profile.id;
    return {
      session: { user: { id: profile.id } },
      user: { id: profile.id },
    };
  },

  async signOut(): Promise<void> {
    currentUserId = null;
  },

  async getSession(): Promise<MockSession | null> {
    await delay(100);
    if (!currentUserId) return null;
    return { user: { id: currentUserId } };
  },

  async getUser(userId?: string): Promise<Profile | null> {
    await delay(100);
    const id = userId ?? currentUserId;
    if (!id) return null;
    const profile = MOCK_PROFILES.find((p) => p.id === id);
    if (profile) return profile;
    if (id === currentUserId) {
      const newProfile = ensureCurrentUser();
      return newProfile;
    }
    return null;
  },

  async updateProfile(
    _userId: string,
    _updates: Partial<Profile>,
  ): Promise<Profile> {
    await delay(200);
    return ensureCurrentUser();
  },
};

// ─── Mock Complaints Service ─────────────────────────────────────────────────

function getCategoryNames(department: string) {
  const cat = DEFAULT_CATEGORIES.find((c) => c.department === department);
  return {
    name: cat?.name ?? department,
    nameKn: cat?.name_kn ?? department,
  };
}

export const mockComplaintsService = {
  async getComplaints(params: {
    limit?: number;
    offset?: number;
    status?: ComplaintStatus;
    category?: string;
    userId?: string;
  }): Promise<ComplaintWithPhotos[]> {
    await delay(300);
    let list = [...mockComplaints].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    if (params.status) list = list.filter((c) => c.status === params.status);
    if (params.category)
      list = list.filter((c) => c.category_id === params.category);
    if (params.userId) list = list.filter((c) => c.user_id === params.userId);
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;
    return list.slice(offset, offset + limit);
  },

  async getComplaintById(id: string): Promise<ComplaintWithPhotos | null> {
    await delay(200);
    const found = mockComplaints.find((c) => c.id === id);
    return found ?? null;
  },

  async createComplaint(
    draft: ReportDraft,
    userId: string,
  ): Promise<{ id: string }> {
    await delay(500);
    const id = `mock-complaint-${nextComplaintId++}`;
    const now = new Date().toISOString();
    const categoryNames = getCategoryNames(draft.categoryId);
    const photos = (draft.photos ?? []).map((uri, i) => ({
      id: `${id}-photo-${i}`,
      complaint_id: id,
      photo_url: uri,
      created_at: now,
    }));
    const raw = {
      id,
      user_id: userId,
      category_id: draft.categoryId,
      subcategory_id: draft.subcategoryId,
      description: draft.description,
      latitude: draft.latitude,
      longitude: draft.longitude,
      address: draft.address,
      status: 'submitted' as ComplaintStatus,
      department: draft.categoryId as Department,
      contractor_info: null,
      points_awarded: getPointsForAction('valid_report'),
      verified: false,
      created_at: now,
      updated_at: now,
    };
    const withPhotos = buildComplaintWithPhotos(
      raw,
      photos,
      categoryNames.name,
      categoryNames.nameKn,
      draft.subcategoryId,
      draft.subcategoryId,
    );
    mockComplaints.unshift(withPhotos);

    // Update mock user stats
    const profile = MOCK_PROFILES.find((p) => p.id === userId);
    if (profile) {
      profile.total_reports += 1;
      profile.points += getPointsForAction('valid_report');
      profile.daily_report_count = (profile.daily_report_count ?? 0) + 1;
      profile.last_report_date = new Date().toISOString().slice(0, 10);
    }

    return { id };
  },

  async checkDuplicate(
    _lat: number,
    _lng: number,
    _categoryId: string,
  ): Promise<boolean> {
    await delay(150);
    return false;
  },

  async getMyComplaints(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<ComplaintWithPhotos[]> {
    return mockComplaintsService.getComplaints({ userId, limit, offset });
  },
};

// ─── Mock Leaderboard Service ───────────────────────────────────────────────

function buildLeaderboard(): LeaderboardEntry[] {
  const profiles = [...MOCK_PROFILES].filter(
    (p) => p.points > 0 || p.total_reports > 0,
  );
  profiles.sort((a, b) => b.points - a.points);
  return profiles.map((p, index) => ({
    userId: p.id,
    name: p.name,
    avatarUrl: p.avatar_url,
    points: p.points,
    totalReports: p.total_reports,
    rank: index + 1,
  }));
}

export const mockLeaderboardService = {
  async getLeaderboard(limit = 20, _offset = 0): Promise<LeaderboardEntry[]> {
    await delay(250);
    const list = buildLeaderboard();
    return list.slice(0, limit);
  },

  async getUserRank(userId: string): Promise<LeaderboardEntry | null> {
    await delay(200);
    const list = buildLeaderboard();
    const entry = list.find((e) => e.userId === userId);
    return entry ?? null;
  },
};

// ─── Seed initial mock complaints for demo ────────────────────────────────────

function seedMockComplaints() {
  const uid = MOCK_PROFILES[0].id;
  const now = new Date().toISOString();
  const items: ComplaintWithPhotos[] = [
    buildComplaintWithPhotos(
      {
        id: 'mock-c-1',
        user_id: uid,
        category_id: 'bbmp',
        subcategory_id: 'Garbage',
        description:
          'Garbage piled up at the corner of 5th Cross, Indiranagar. Not collected for 3 days.',
        latitude: 12.9784,
        longitude: 77.6408,
        address: '5th Cross, Indiranagar, Bangalore',
        status: 'submitted',
        department: 'bbmp',
        points_awarded: 10,
        verified: false,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: now,
        contractor_info: null,
      },
      [],
      'BBMP',
      'ಬಿಬಿಎಂಪಿ',
      'Garbage',
      'ಕಸ',
    ),
    buildComplaintWithPhotos(
      {
        id: 'mock-c-2',
        user_id: uid,
        category_id: 'traffic',
        subcategory_id: 'Illegal Parking',
        description:
          'Vehicles parked on the footpath near Koramangala bus stop.',
        latitude: 12.9352,
        longitude: 77.6245,
        address: 'Koramangala Bus Stop, Bangalore',
        status: 'forwarded',
        department: 'traffic',
        points_awarded: 10,
        verified: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: now,
        contractor_info: null,
      },
      [],
      'Traffic',
      'ಸಂಚಾರ',
      'Illegal Parking',
      'ಅಕ್ರಮ ಪಾರ್ಕಿಂಗ್',
    ),
    buildComplaintWithPhotos(
      {
        id: 'mock-c-3',
        user_id: uid,
        category_id: 'road_infra',
        subcategory_id: 'Potholes',
        description:
          'Large pothole on Outer Ring Road near Marathahalli bridge.',
        latitude: 12.9594,
        longitude: 77.6974,
        address: 'Outer Ring Road, Marathahalli, Bangalore',
        status: 'resolved',
        department: 'road_infra',
        points_awarded: 15,
        verified: false,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: now,
        contractor_info: null,
      },
      [],
      'Road & Infrastructure',
      'ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
      'Potholes',
      'ಗುಂಡಿಗಳು',
    ),
  ];
  mockComplaints.push(...items);
}

seedMockComplaints();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

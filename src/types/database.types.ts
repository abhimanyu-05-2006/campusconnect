export type UserRole =
  | 'student'
  | 'college_admin'
  | 'club_organizer'
  | 'company_sponsor'
  | 'platform_super_admin';

export type EventStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type RegistrationStatus =
  | 'confirmed'
  | 'waitlisted'
  | 'checked_in'
  | 'cancelled';

export type SubscriptionTier =
  | 'starter_inr'
  | 'growth_inr'
  | 'enterprise_inr';

export type NoticePriority = 'normal' | 'important' | 'urgent';

export interface College {
  id: string;
  slug: string;
  name: string;
  legal_name?: string;
  email_domain: string;
  logo_url?: string;
  banner_url?: string;
  accent_color: string;
  city: string;
  state: string;
  country: string;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  college_id: string;
  code: string;
  name: string;
  hod_name: string;
  hod_email: string;
}

export interface Profile {
  id: string;
  college_id: string;
  department_id?: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  roll_number?: string;
  graduation_year?: number;
  bio?: string;
  skills?: string[];
  github_url?: string;
  linkedin_url?: string;
  phone?: string;
  is_verified: boolean;
}

export interface Club {
  id: string;
  college_id: string;
  lead_profile_id?: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Entrepreneurship' | 'Literary';
  description: string;
  logo_url?: string;
  instagram_handle?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface EventItem {
  id: string;
  college_id: string;
  club_id?: string;
  organizer_profile_id: string;
  organizer_name: string;
  club_name?: string;
  category_id?: string;
  category_name: string;
  title: string;
  slug: string;
  short_summary: string;
  description: string;
  poster_url: string;
  venue: string;
  is_online: boolean;
  meeting_link?: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  seat_capacity: number;
  current_registrations: number;
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  ticket_price_inr: number;
  status: EventStatus;
  approval_reason?: string;
  approved_by?: string;
  approved_at?: string;
  tags: string[];
  created_at: string;
}

export interface EventTeam {
  id: string;
  event_id: string;
  team_name: string;
  team_code: string;
  leader_profile_id: string;
  leader_name: string;
  members_count: number;
  max_size: number;
  is_recruiting: boolean;
  recruiting_roles: string[];
  members: {
    profile_id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
}

export interface Registration {
  id: string;
  event_id: string;
  event_title: string;
  event_venue: string;
  event_start_time: string;
  student_profile_id: string;
  student_name: string;
  student_email: string;
  roll_number?: string;
  college_id: string;
  team_id?: string;
  team_name?: string;
  qr_token: string;
  status: RegistrationStatus;
  checked_in_at?: string;
  checked_in_by?: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_number: string;
  event_id: string;
  recipient_profile_id: string;
  college_id: string;
  college_name: string;
  recipient_name: string;
  event_title: string;
  achievement_type: 'Winner' | 'Runner Up' | 'Participation' | 'Special Mention';
  verification_hash: string;
  issued_at: string;
  pdf_url?: string;
}

export interface Notice {
  id: string;
  college_id: string;
  publisher_profile_id: string;
  publisher_name: string;
  publisher_designation: string;
  title: string;
  content: string;
  priority: NoticePriority;
  department_code?: string;
  created_at: string;
  is_pinned: boolean;
}

export interface Opportunity {
  id: string;
  company_name: string;
  company_logo_url?: string;
  title: string;
  role_type: 'Internship' | 'Full-time' | 'Hackathon Bounty' | 'Fellowship';
  location: string;
  stipend_range: string;
  apply_url: string;
  deadline: string;
  eligible_departments: string[];
  is_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  college_id: string;
  college_name: string;
  tier: SubscriptionTier;
  annual_price_inr: number;
  status: 'active' | 'trial' | 'past_due' | 'suspended';
  current_period_end: string;
  max_active_students: number;
  max_monthly_events: number;
}

export interface AuditLog {
  id: string;
  college_id?: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: string;
  details: string;
  timestamp: string;
  ip_address: string;
}

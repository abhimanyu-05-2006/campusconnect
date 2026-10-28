-- ==============================================================================
-- CampusConnect: Multi-Tenant Campus Operations, Events & Student Networking SaaS
-- Migration: 001_complete_schema.sql
-- Architecture: PostgreSQL on Supabase with Strict Row Level Security (RLS) Multi-Tenancy
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'student',
        'college_admin',
        'club_organizer',
        'company_sponsor',
        'platform_super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM (
        'draft',
        'pending_approval',
        'approved',
        'rejected',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM (
        'confirmed',
        'waitlisted',
        'checked_in',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM (
        'starter_inr',
        'growth_inr',
        'enterprise_inr'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notice_priority AS ENUM (
        'normal',
        'important',
        'urgent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE TENANCY: COLLEGES TABLE
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    email_domain VARCHAR(128) UNIQUE NOT NULL, -- e.g., 'bits.edu.in'
    logo_url TEXT,
    banner_url TEXT,
    accent_color VARCHAR(16) DEFAULT '#2563eb',
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBSCRIPTIONS TABLE (B2B SaaS Annual Plans in INR)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'growth_inr',
    annual_price_inr NUMERIC(12, 2) NOT NULL DEFAULT 99000.00,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'trial', 'suspended'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    max_active_students INTEGER DEFAULT 5000,
    max_monthly_events INTEGER DEFAULT 150,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL, -- e.g., 'CSE', 'ECE', 'ME'
    name VARCHAR(255) NOT NULL,
    hod_name VARCHAR(255),
    hod_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, code)
);

-- 6. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    roll_number VARCHAR(64),
    graduation_year INTEGER,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    github_url TEXT,
    linkedin_url TEXT,
    phone VARCHAR(32),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLUBS & STUDENT BODIES TABLE
CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    lead_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Technical', 'Cultural', 'Sports', 'Entrepreneurship', 'Literary'
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    instagram_handle VARCHAR(128),
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EVENT CATEGORIES
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    icon VARCHAR(64) NOT NULL,
    color VARCHAR(32) DEFAULT 'blue'
);

-- 9. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
    organizer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_summary TEXT NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT,
    venue VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    seat_capacity INTEGER NOT NULL DEFAULT 100,
    current_registrations INTEGER DEFAULT 0,
    is_team_event BOOLEAN DEFAULT FALSE,
    min_team_size INTEGER DEFAULT 1,
    max_team_size INTEGER DEFAULT 4,
    ticket_price_inr NUMERIC(10, 2) DEFAULT 0.00,
    status event_status DEFAULT 'pending_approval',
    approval_reason TEXT,
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, slug)
);

-- 10. EVENT TEAMS TABLE
CREATE TABLE IF NOT EXISTS event_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    team_name VARCHAR(128) NOT NULL,
    team_code VARCHAR(32) UNIQUE NOT NULL,
    leader_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_recruiting BOOLEAN DEFAULT TRUE,
    recruiting_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, team_name)
);

-- 11. REGISTRATIONS & ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    team_id UUID REFERENCES event_teams(id) ON DELETE SET NULL,
    qr_token VARCHAR(128) UNIQUE NOT NULL, -- Cryptographic ticket token for scanning
    status registration_status DEFAULT 'confirmed',
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, student_profile_id)
);

-- 12. VERIFIED CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(64) UNIQUE NOT NULL, -- e.g., 'CC-BITS-2026-HACK-0042'
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(64) DEFAULT 'Participation', -- 'Winner', 'Runner Up', 'Participation', 'Speaker'
    verification_hash VARCHAR(128) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT
);

-- 13. OFFICIAL CAMPUS NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    publisher_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority notice_priority DEFAULT 'normal',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    attachment_url TEXT,
    expires_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SPONSOR OPPORTUNITIES & INTERNSHIPS TABLE
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    title VARCHAR(255) NOT NULL,
    role_type VARCHAR(64) NOT NULL, -- 'Internship', 'Full-time', 'Hackathon Bounty', 'Fellowship'
    location VARCHAR(128) NOT NULL,
    stipend_range VARCHAR(64),
    apply_url TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    eligible_colleges UUID[] DEFAULT '{}', -- empty means all partner colleges
    eligible_departments TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS (Platform & College Security)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenancy by college_id + Role Segregation
-- ==============================================================================

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to retrieve authenticated user's profile metadata
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_college_id()
RETURNS UUID AS $$
    SELECT college_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Colleges: Public can read active colleges; only Super Admins can insert/update
CREATE POLICY "Public read active colleges"
    ON colleges FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Super Admins manage colleges"
    ON colleges FOR ALL
    USING (current_user_role() = 'platform_super_admin');

-- Departments: Members of the same college can read; College Admin can manage
CREATE POLICY "College members can view departments"
    ON departments FOR SELECT
    USING (college_id = current_user_college_id() OR current_user_role() = 'platform_super_admin');

CREATE POLICY "College Admin manage departments"
    ON departments FOR ALL
    USING (college_id = current_user_college_id() AND current_user_role() = 'college_admin');

-- Profiles: Users can view profiles within their college or public organizers; Users can update own profile
CREATE POLICY "Users view profiles within college"
    ON profiles FOR SELECT
    USING (
        college_id = current_user_college_id() 
        OR current_user_role() = 'platform_super_admin'
        OR auth.uid() = id
    );

CREATE POLICY "Users update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Events:
-- - Students view approved events from their college or cross-college open events
-- - Club Organizers can create and edit their own events
-- - College Admins can view all pending/approved events for their college and approve/reject
CREATE POLICY "View approved college events"
    ON events FOR SELECT
    USING (
        (status = 'approved' AND (college_id = current_user_college_id() OR current_user_college_id() IS NULL))
        OR (college_id = current_user_college_id() AND current_user_role() IN ('college_admin', 'platform_super_admin'))
        OR (organizer_profile_id = auth.uid())
    );

CREATE POLICY "Organizers create events"
    ON events FOR INSERT
    WITH CHECK (
        current_user_role() IN ('club_organizer', 'college_admin')
        AND college_id = current_user_college_id()
    );

CREATE POLICY "Organizers edit own events"
    ON events FOR UPDATE
    USING (
        organizer_profile_id = auth.uid() 
        OR (college_id = current_user_college_id() AND current_user_role() = 'college_admin')
    );

-- Registrations:
-- - Students can view and create their own registrations
-- - Organizers and Admins can view registrations for their college's events and update attendance
CREATE POLICY "Students manage own registrations"
    ON registrations FOR SELECT
    USING (student_profile_id = auth.uid());

CREATE POLICY "Students insert registration"
    ON registrations FOR INSERT
    WITH CHECK (
        student_profile_id = auth.uid() 
        AND college_id = current_user_college_id()
    );

CREATE POLICY "Organizers view and verify event attendance"
    ON registrations FOR ALL
    USING (
        college_id = current_user_college_id() 
        AND current_user_role() IN ('club_organizer', 'college_admin', 'platform_super_admin')
    );

-- Certificates:
-- - Students view own certificates; Anyone can verify valid certificate by hash/number
CREATE POLICY "Students view own certificates"
    ON certificates FOR SELECT
    USING (recipient_profile_id = auth.uid() OR current_user_role() = 'platform_super_admin');

CREATE POLICY "College admins issue certificates"
    ON certificates FOR INSERT
    WITH CHECK (
        college_id = current_user_college_id() 
        AND current_user_role() IN ('club_organizer', 'college_admin')
    );

-- Notices:
-- - Students & staff view notices belonging to their college
-- - College Admins create & edit notices
CREATE POLICY "College members view notices"
    ON notices FOR SELECT
    USING (college_id = current_user_college_id() OR current_user_role() = 'platform_super_admin');

CREATE POLICY "College Admins manage notices"
    ON notices FOR ALL
    USING (college_id = current_user_college_id() AND current_user_role() = 'college_admin');

-- Opportunities:
-- - All authenticated students can view verified opportunities
CREATE POLICY "Students view opportunities"
    ON opportunities FOR SELECT
    USING (is_verified = TRUE);

-- ==============================================================================
-- 17. RICH SEED DATA: END-TO-END SCENARIO
-- Features Bhopal AI/ML Hackathon 2026, Cloud Masterclass, Cultural Fest, Coding Contest, AI Internship
-- ==============================================================================

-- Seed Colleges
INSERT INTO colleges (id, slug, name, legal_name, email_domain, city, state, accent_color)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'bits-bhopal', 'Bhopal Institute of Technology & Science', 'BITS Bhopal Autonomous Society', 'bits.edu.in', 'Bhopal', 'Madhya Pradesh', '#2563eb'),
    ('22222222-2222-2222-2222-222222222222', 'dtu-delhi', 'Delhi Technological University', 'DTU Delhi State University', 'dtu.ac.in', 'New Delhi', 'Delhi', '#059669')
ON CONFLICT (slug) DO NOTHING;

-- Seed Subscriptions (INR B2B Packages)
INSERT INTO subscriptions (college_id, tier, annual_price_inr, status, max_active_students, max_monthly_events)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'enterprise_inr', 189000.00, 'active', 8000, 200),
    ('22222222-2222-2222-2222-222222222222', 'growth_inr', 99000.00, 'active', 4000, 100)
ON CONFLICT DO NOTHING;

-- Seed Departments
INSERT INTO departments (id, college_id, code, name, hod_name, hod_email)
VALUES
    ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'CSE', 'Computer Science & Engineering', 'Dr. Alok Saxena', 'hod.cse@bits.edu.in'),
    ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'ECE', 'Electronics & Communication', 'Dr. Meera Iyer', 'hod.ece@bits.edu.in'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'MECH', 'Mechanical Engineering', 'Prof. Sanjeev Chouhan', 'hod.mech@bits.edu.in')
ON CONFLICT DO NOTHING;

-- Seed Event Categories
INSERT INTO event_categories (id, name, icon, color)
VALUES
    ('44444444-4444-4444-4444-444444444441', 'Hackathon', 'Code2', 'indigo'),
    ('44444444-4444-4444-4444-444444444442', 'Workshop', 'Cpu', 'emerald'),
    ('44444444-4444-4444-4444-444444444443', 'Cultural Fest', 'Music', 'pink'),
    ('44444444-4444-4444-4444-444444444444', 'Coding Contest', 'Terminal', 'amber'),
    ('44444444-4444-4444-4444-444444444445', 'Seminar', 'GraduationCap', 'blue'),
    ('44444444-4444-4444-4444-444444444446', 'Sports Meet', 'Trophy', 'orange')
ON CONFLICT (name) DO NOTHING;

-- Seed Clubs
INSERT INTO clubs (id, college_id, name, category, description, instagram_handle)
VALUES
    ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 'Google Developer Student Club', 'Technical', 'Campus community building web, mobile, and AI solutions.', '@gdsc_bits_bhopal'),
    ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', 'Dhwani Music Society', 'Cultural', 'Official music & performing arts collective.', '@dhwani_bits'),
    ('55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', 'ACM Student Chapter', 'Technical', 'Computing machinery and competitive programming.', '@acm_bits')
ON CONFLICT DO NOTHING;

-- Seed Opportunities (Sponsor Internships & Bounties)
INSERT INTO opportunities (company_name, title, role_type, location, stipend_range, apply_url, deadline, eligible_departments)
VALUES
    ('Apex AI Labs', 'AI Research & Engineering Intern (Summer 2026)', 'Internship', 'Bangalore / Hybrid', '₹45,000 - ₹60,000 / month', 'https://careers.apexailabs.com/campus-2026', NOW() + INTERVAL '28 days', ARRAY['CSE', 'ECE']),
    ('CloudScale Systems', 'Cloud DevOps & Kubernetes Fellow', 'Fellowship', 'Remote (India)', '₹35,000 / month', 'https://cloudscale.io/fellowships', NOW() + INTERVAL '15 days', ARRAY['CSE', 'ECE', 'MECH']),
    ('FinTech Innovations', 'Quantitative Developer Intern', 'Internship', 'Mumbai (Onsite)', '₹50,000 / month', 'https://fintechinnovations.in/jobs', NOW() + INTERVAL '40 days', ARRAY['CSE'])
ON CONFLICT DO NOTHING;

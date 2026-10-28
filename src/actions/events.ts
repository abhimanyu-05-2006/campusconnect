/**
 * Server Actions for CampusConnect Events Management
 */
import { EventItem, EventStatus } from '../types/database.types';

export interface CreateEventInput {
  college_id: string;
  club_id?: string;
  organizer_profile_id: string;
  organizer_name: string;
  club_name?: string;
  category_name: string;
  title: string;
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
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  ticket_price_inr: number;
  tags: string[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates and prepares a new event submission
 */
export async function createEventAction(input: CreateEventInput): Promise<{
  success: boolean;
  event?: EventItem;
  error?: string;
}> {
  if (!input.title || input.title.trim().length < 5) {
    return { success: false, error: 'Event title must be at least 5 characters long.' };
  }
  if (!input.venue || input.venue.trim().length < 3) {
    return { success: false, error: 'Please specify a valid physical venue or online platform link.' };
  }
  if (input.seat_capacity < 1) {
    return { success: false, error: 'Seat capacity must be at least 1.' };
  }
  if (new Date(input.end_time) <= new Date(input.start_time)) {
    return { success: false, error: 'End time must be after the start time.' };
  }

  const newEvent: EventItem = {
    id: `ev-${Date.now()}`,
    college_id: input.college_id,
    club_id: input.club_id,
    organizer_profile_id: input.organizer_profile_id,
    organizer_name: input.organizer_name,
    club_name: input.club_name || 'Independent Campus Society',
    category_name: input.category_name,
    title: input.title,
    slug: `${slugify(input.title)}-${Math.floor(1000 + Math.random() * 9000)}`,
    short_summary: input.short_summary,
    description: input.description,
    poster_url:
      input.poster_url ||
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    venue: input.venue,
    is_online: input.is_online,
    meeting_link: input.meeting_link,
    start_time: input.start_time,
    end_time: input.end_time,
    registration_deadline: input.registration_deadline,
    seat_capacity: Number(input.seat_capacity),
    current_registrations: 0,
    is_team_event: Boolean(input.is_team_event),
    min_team_size: Number(input.min_team_size || 1),
    max_team_size: Number(input.max_team_size || 1),
    ticket_price_inr: Number(input.ticket_price_inr || 0),
    status: 'pending_approval',
    tags: input.tags.length ? input.tags : ['CampusEvent'],
    created_at: new Date().toISOString()
  };

  return { success: true, event: newEvent };
}

/**
 * College administration event approval action
 */
export async function updateEventStatusAction(
  eventId: string,
  newStatus: EventStatus,
  reviewerProfileId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (newStatus === 'rejected' && (!reason || reason.trim().length < 5)) {
    return { success: false, error: 'Rejection reason must be stated clearly for organizers.' };
  }
  return { success: true };
}

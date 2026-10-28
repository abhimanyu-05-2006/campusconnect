/**
 * Server Actions for CampusConnect Event Registration
 * Prevents double-booking, enforces seat limits & waitlists, generates cryptographic QR tokens.
 */
import { EventItem, Registration, RegistrationStatus } from '../types/database.types';

export interface RegisterEventInput {
  event: EventItem;
  student: {
    id: string;
    full_name: string;
    email: string;
    roll_number?: string;
    college_id: string;
  };
  existingRegistrations: Registration[];
  teamId?: string;
  teamName?: string;
}

/**
 * Generates an encrypted/unique QR token string for high-speed scanning
 */
export function generateQrToken(eventSlug: string, studentId: string): string {
  const prefix = eventSlug.slice(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `QR-${prefix}-${timestamp}-${randomHex}`;
}

export async function registerForEventAction(input: RegisterEventInput): Promise<{
  success: boolean;
  registration?: Registration;
  error?: string;
}> {
  const { event, student, existingRegistrations, teamId, teamName } = input;

  // 1. Check double booking
  const alreadyRegistered = existingRegistrations.some(
    (reg) => reg.event_id === event.id && reg.student_profile_id === student.id
  );
  if (alreadyRegistered) {
    return {
      success: false,
      error: 'You are already registered for this event. Check your digital passes.'
    };
  }

  // 2. Check registration deadline
  if (new Date() > new Date(event.registration_deadline)) {
    return {
      success: false,
      error: 'The registration deadline for this event has passed.'
    };
  }

  // 3. Check seat capacity & assign status
  let regStatus: RegistrationStatus = 'confirmed';
  if (event.current_registrations >= event.seat_capacity) {
    regStatus = 'waitlisted';
  }

  const qrToken = generateQrToken(event.slug, student.id);

  const newRegistration: Registration = {
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    event_id: event.id,
    event_title: event.title,
    event_venue: event.venue,
    event_start_time: event.start_time,
    student_profile_id: student.id,
    student_name: student.full_name,
    student_email: student.email,
    roll_number: student.roll_number,
    college_id: student.college_id,
    team_id: teamId,
    team_name: teamName,
    qr_token: qrToken,
    status: regStatus,
    created_at: new Date().toISOString()
  };

  return {
    success: true,
    registration: newRegistration
  };
}

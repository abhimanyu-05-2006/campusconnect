/**
 * Server Actions for CampusConnect Digital Certificates
 */
import { Certificate } from '../types/database.types';

export function generateVerificationHash(certNumber: string, studentName: string): string {
  // Simple deterministic SHA-style hash for display & verification
  let hash = 0;
  const str = `${certNumber}:${studentName}:campusconnect-protocol-2026`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = 'a8f4c9103b22e1';
  return `sha256:${hexPart}${salt}${Math.abs(hash * 31).toString(16)}`;
}

export function issueCertificateAction(params: {
  eventId: string;
  eventTitle: string;
  recipientProfileId: string;
  recipientName: string;
  collegeId: string;
  collegeName: string;
  achievementType: 'Winner' | 'Runner Up' | 'Participation' | 'Special Mention';
}): Certificate {
  const number = `CC-BITS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    id: `cert-${Date.now()}`,
    certificate_number: number,
    event_id: params.eventId,
    recipient_profile_id: params.recipientProfileId,
    college_id: params.collegeId,
    college_name: params.collegeName,
    recipient_name: params.recipientName,
    event_title: params.eventTitle,
    achievement_type: params.achievementType,
    verification_hash: generateVerificationHash(number, params.recipientName),
    issued_at: new Date().toISOString()
  };
}

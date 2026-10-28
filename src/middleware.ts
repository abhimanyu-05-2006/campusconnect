/**
 * CampusConnect Multi-Tenant Middleware
 * Handles tenant detection from hostnames / email domains and enforces role-based path guards.
 */

export interface TenantContext {
  collegeId: string;
  collegeSlug: string;
  domain: string;
}

export const DOMAIN_TENANT_MAP: Record<string, TenantContext> = {
  'bits.edu.in': {
    collegeId: 'c1',
    collegeSlug: 'bits-bhopal',
    domain: 'bits.edu.in'
  },
  'bits.campusconnect.io': {
    collegeId: 'c1',
    collegeSlug: 'bits-bhopal',
    domain: 'bits.edu.in'
  },
  'dtu.ac.in': {
    collegeId: 'c2',
    collegeSlug: 'dtu-delhi',
    domain: 'dtu.ac.in'
  },
  'dtu.campusconnect.io': {
    collegeId: 'c2',
    collegeSlug: 'dtu-delhi',
    domain: 'dtu.ac.in'
  }
};

/**
 * Resolves college tenant from email address domain
 */
export function resolveTenantFromEmail(email: string): TenantContext | null {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  return DOMAIN_TENANT_MAP[domain] || null;
}

/**
 * Role-based path access control check
 */
export function checkRoleAccess(
  pathname: string,
  userRole: string | undefined
): { allowed: boolean; redirectTo?: string; reason?: string } {
  if (!userRole) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/college-admin') || pathname.startsWith('/organizer') || pathname.startsWith('/super-admin')) {
      return { allowed: false, redirectTo: '/login', reason: 'Authentication required' };
    }
    return { allowed: true };
  }

  // Super admin can inspect all areas
  if (userRole === 'platform_super_admin') {
    return { allowed: true };
  }

  // College Admin route protection
  if (pathname.startsWith('/college-admin')) {
    if (userRole !== 'college_admin') {
      return {
        allowed: false,
        redirectTo: '/dashboard',
        reason: 'Requires College Administration privileges'
      };
    }
  }

  // Club Organizer route protection
  if (pathname.startsWith('/organizer')) {
    if (userRole !== 'club_organizer' && userRole !== 'college_admin') {
      return {
        allowed: false,
        redirectTo: '/dashboard',
        reason: 'Requires Club Leader / Event Organizer permissions'
      };
    }
  }

  // Platform Super Admin protection
  if (pathname.startsWith('/super-admin')) {
    return {
      allowed: false,
      redirectTo: '/dashboard',
      reason: 'Requires CampusConnect Platform Super Admin privileges'
    };
  }

  return { allowed: true };
}

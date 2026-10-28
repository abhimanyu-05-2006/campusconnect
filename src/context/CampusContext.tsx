import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  College,
  Department,
  Profile,
  Club,
  EventItem,
  EventTeam,
  Registration,
  Certificate,
  Notice,
  Opportunity,
  Subscription,
  AuditLog,
  EventStatus,
  NoticePriority
} from '../types/database.types';
import {
  INITIAL_COLLEGES,
  INITIAL_DEPARTMENTS,
  INITIAL_PROFILES,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_EVENT_TEAMS,
  INITIAL_REGISTRATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTICES,
  INITIAL_OPPORTUNITIES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockSeed';
import { createEventAction, CreateEventInput } from '../actions/events';
import { registerForEventAction } from '../actions/registrations';
import { verifyAttendanceAction } from '../actions/attendance';
import { issueCertificateAction } from '../actions/certificates';

export type AppView =
  | 'landing'
  | 'login'
  | 'student_dashboard'
  | 'college_admin'
  | 'organizer'
  | 'organizer_new_event'
  | 'opportunities'
  | 'super_admin';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface CampusContextType {
  // Tenancy & Session
  colleges: College[];
  currentCollege: College;
  setCurrentCollege: (college: College) => void;
  profiles: Profile[];
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  switchRole: (role: Profile['role']) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  goBack: () => void;
  canGoBack: boolean;

  // Domain Data
  departments: Department[];
  clubs: Club[];
  events: EventItem[];
  eventTeams: EventTeam[];
  registrations: Registration[];
  certificates: Certificate[];
  notices: Notice[];
  opportunities: Opportunity[];
  subscriptions: Subscription[];
  auditLogs: AuditLog[];

  // Actions
  handleRegisterEvent: (eventId: string, teamId?: string, teamName?: string) => Promise<boolean>;
  handleApproveEvent: (eventId: string, reason: string) => void;
  handleRejectEvent: (eventId: string, reason: string) => void;
  handleCreateEvent: (input: CreateEventInput) => Promise<boolean>;
  handlePublishNotice: (title: string, content: string, priority: NoticePriority, departmentCode?: string) => void;
  handleVerifyToken: (eventId: string, token: string) => Promise<{ success: boolean; message: string; isDuplicate?: boolean }>;
  handleCreateTeam: (eventId: string, teamName: string, recruitingRoles: string[]) => void;
  handleJoinTeam: (teamId: string) => void;
  handlePostOpportunity: (opp: Omit<Opportunity, 'id' | 'created_at' | 'is_verified'>) => void;
  handleIssueCertificate: (regId: string, achievement: 'Winner' | 'Runner Up' | 'Participation' | 'Special Mention') => void;
  resetToSeedData: () => void;

  // Modals
  activeTicketReg: Registration | null;
  setActiveTicketReg: (reg: Registration | null) => void;
  activeCertificate: Certificate | null;
  setActiveCertificate: (cert: Certificate | null) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const STORAGE_PREFIX = 'campusconnect_v2_';

function getInitialState<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges] = useState<College[]>(INITIAL_COLLEGES);
  const [currentCollege, setCurrentCollege] = useState<College>(INITIAL_COLLEGES[0]);
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<Profile>(INITIAL_PROFILES[0]);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [currentView, _setCurrentView] = useState<AppView>('student_dashboard');
  const [history, setHistory] = useState<AppView[]>(['landing']);

  const setCurrentView = (newView: AppView) => {
    if (newView !== currentView) {
      setHistory((prev) => [...prev, currentView]);
      _setCurrentView(newView);
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      _setCurrentView(prev);
    } else {
      _setCurrentView(currentView === 'landing' ? 'student_dashboard' : 'landing');
    }
  };

  const canGoBack = history.length > 0 || currentView !== 'landing';
  const [clubs] = useState<Club[]>(INITIAL_CLUBS);

  const [events, setEvents] = useState<EventItem[]>(() =>
    getInitialState('events', INITIAL_EVENTS)
  );
  const [eventTeams, setEventTeams] = useState<EventTeam[]>(() =>
    getInitialState('teams', INITIAL_EVENT_TEAMS)
  );
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    getInitialState('registrations', INITIAL_REGISTRATIONS)
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    getInitialState('certificates', INITIAL_CERTIFICATES)
  );
  const [notices, setNotices] = useState<Notice[]>(() =>
    getInitialState('notices', INITIAL_NOTICES)
  );
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    getInitialState('opportunities', INITIAL_OPPORTUNITIES)
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    getInitialState('subscriptions', INITIAL_SUBSCRIPTIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getInitialState('audit_logs', INITIAL_AUDIT_LOGS)
  );

  // Active Modals & Toasts
  const [activeTicketReg, setActiveTicketReg] = useState<Registration | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}registrations`, JSON.stringify(registrations));
  }, [registrations]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}certificates`, JSON.stringify(certificates));
  }, [certificates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notices`, JSON.stringify(notices));
  }, [notices]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}teams`, JSON.stringify(eventTeams));
  }, [eventTeams]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}opportunities`, JSON.stringify(opportunities));
  }, [opportunities]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}subscriptions`, JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: Profile['role']) => {
    const matched = profiles.find((p) => p.role === role);
    if (matched) {
      setCurrentProfile(matched);
      // Automatically route user to their respective native portal
      if (role === 'student') setCurrentView('student_dashboard');
      else if (role === 'college_admin') setCurrentView('college_admin');
      else if (role === 'club_organizer') setCurrentView('organizer');
      else if (role === 'company_sponsor') setCurrentView('opportunities');
      else if (role === 'platform_super_admin') setCurrentView('super_admin');

      addToast('info', 'Active Persona Switched', `Logged in as ${matched.full_name} (${role.replace('_', ' ').toUpperCase()})`);
    }
  };

  const handleRegisterEvent = async (
    eventId: string,
    teamId?: string,
    teamName?: string
  ): Promise<boolean> => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return false;

    const res = await registerForEventAction({
      event: targetEvent,
      student: {
        id: currentProfile.id,
        full_name: currentProfile.full_name,
        email: currentProfile.email,
        roll_number: currentProfile.roll_number,
        college_id: currentCollege.id
      },
      existingRegistrations: registrations,
      teamId,
      teamName
    });

    if (!res.success || !res.registration) {
      addToast('error', 'Registration Failed', res.error || 'Unable to complete registration.');
      return false;
    }

    setRegistrations((prev) => [res.registration!, ...prev]);
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, current_registrations: ev.current_registrations + 1 }
          : ev
      )
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }

    addToast(
      'success',
      'Pass Confirmed!',
      `You are successfully registered for ${targetEvent.title}. QR pass issued.`
    );
    setActiveTicketReg(res.registration);
    return true;
  };

  const handleApproveEvent = (eventId: string, reason: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'approved',
              approval_reason: reason || 'Approved by Dean of Student Affairs',
              approved_by: currentProfile.id,
              approved_at: new Date().toISOString()
            }
          : e
      )
    );

    // Append to audit log
    const eventItem = events.find((e) => e.id === eventId);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        college_id: currentCollege.id,
        actor_name: currentProfile.full_name,
        actor_role: currentProfile.role,
        action: 'EVENT_APPROVED',
        resource_type: 'event',
        details: `Approved "${eventItem?.title || eventId}": ${reason}`,
        timestamp: new Date().toISOString(),
        ip_address: '14.139.241.10'
      },
      ...prev
    ]);

    addToast('success', 'Event Approved', `Official permission granted for ${eventItem?.title}`);
  };

  const handleRejectEvent = (eventId: string, reason: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'rejected',
              approval_reason: reason
            }
          : e
      )
    );

    const eventItem = events.find((e) => e.id === eventId);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        college_id: currentCollege.id,
        actor_name: currentProfile.full_name,
        actor_role: currentProfile.role,
        action: 'EVENT_REJECTED',
        resource_type: 'event',
        details: `Rejected "${eventItem?.title || eventId}". Reason: ${reason}`,
        timestamp: new Date().toISOString(),
        ip_address: '14.139.241.10'
      },
      ...prev
    ]);

    addToast('error', 'Event Rejected', `Event has been declined with notification to organizers.`);
  };

  const handleCreateEvent = async (input: CreateEventInput): Promise<boolean> => {
    const res = await createEventAction(input);
    if (!res.success || !res.event) {
      addToast('error', 'Creation Error', res.error || 'Failed to submit event.');
      return false;
    }

    setEvents((prev) => [res.event!, ...prev]);
    addToast(
      'success',
      'Event Submitted for Approval',
      `"${res.event.title}" submitted to Dean Office for clearance.`
    );
    setCurrentView('organizer');
    return true;
  };

  const handlePublishNotice = (
    title: string,
    content: string,
    priority: NoticePriority,
    departmentCode?: string
  ) => {
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      college_id: currentCollege.id,
      publisher_profile_id: currentProfile.id,
      publisher_name: currentProfile.full_name,
      publisher_designation: currentProfile.role === 'college_admin' ? 'College Administration' : 'Staff Member',
      title,
      content,
      priority,
      department_code: departmentCode,
      created_at: new Date().toISOString(),
      is_pinned: priority === 'urgent'
    };

    setNotices((prev) => [newNotice, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        college_id: currentCollege.id,
        actor_name: currentProfile.full_name,
        actor_role: currentProfile.role,
        action: 'NOTICE_PUBLISHED',
        resource_type: 'notice',
        details: `Published circular: "${title}" [${priority.toUpperCase()}]`,
        timestamp: new Date().toISOString(),
        ip_address: '14.139.241.10'
      },
      ...prev
    ]);

    addToast('success', 'Official Notice Published', 'Circular broadcasted across student portals.');
  };

  const handleVerifyToken = async (
    eventId: string,
    token: string
  ): Promise<{ success: boolean; message: string; isDuplicate?: boolean }> => {
    const res = await verifyAttendanceAction({
      token,
      eventId,
      organizerProfileId: currentProfile.id,
      organizerName: currentProfile.full_name,
      registrations
    });

    if (res.success && res.registration) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === res.registration!.id ? res.registration! : r))
      );
      if (res.auditEntry) {
        setAuditLogs((prev) => [res.auditEntry!, ...prev]);
      }
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {}
      addToast('success', 'Attendance Verified', res.message);
      return { success: true, message: res.message };
    } else {
      addToast('error', 'Token Verification Failed', res.message);
      return {
        success: false,
        message: res.message,
        isDuplicate: res.isDuplicate
      };
    }
  };

  const handleCreateTeam = (eventId: string, teamName: string, recruitingRoles: string[]) => {
    const newTeam: EventTeam = {
      id: `team-${Date.now()}`,
      event_id: eventId,
      team_name: teamName,
      team_code: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      leader_profile_id: currentProfile.id,
      leader_name: currentProfile.full_name,
      members_count: 1,
      max_size: 4,
      is_recruiting: true,
      recruiting_roles: recruitingRoles,
      members: [
        {
          profile_id: currentProfile.id,
          name: currentProfile.full_name,
          role: 'Team Lead'
        }
      ]
    };

    setEventTeams((prev) => [newTeam, ...prev]);
    addToast('success', 'Team Created', `Squad "${teamName}" formed! Invite code: ${newTeam.team_code}`);
  };

  const handleJoinTeam = (teamId: string) => {
    setEventTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          if (t.members.some((m) => m.profile_id === currentProfile.id)) {
            addToast('info', 'Already Member', 'You are already in this squad.');
            return t;
          }
          if (t.members_count >= t.max_size) {
            addToast('error', 'Squad Full', 'This team has already reached maximum capacity.');
            return t;
          }
          addToast('success', 'Joined Squad!', `Welcome to ${t.team_name}`);
          return {
            ...t,
            members_count: t.members_count + 1,
            members: [
              ...t.members,
              {
                profile_id: currentProfile.id,
                name: currentProfile.full_name,
                role: 'Contributor'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const handlePostOpportunity = (oppData: Omit<Opportunity, 'id' | 'created_at' | 'is_verified'>) => {
    const newOpp: Opportunity = {
      ...oppData,
      id: `opp-${Date.now()}`,
      is_verified: true,
      created_at: new Date().toISOString()
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    addToast('success', 'Opportunity Posted', `Published ${newOpp.title} to campus network.`);
  };

  const handleIssueCertificate = (
    regId: string,
    achievement: 'Winner' | 'Runner Up' | 'Participation' | 'Special Mention'
  ) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;

    const cert = issueCertificateAction({
      eventId: reg.event_id,
      eventTitle: reg.event_title,
      recipientProfileId: reg.student_profile_id,
      recipientName: reg.student_name,
      collegeId: currentCollege.id,
      collegeName: currentCollege.name,
      achievementType: achievement
    });

    setCertificates((prev) => [cert, ...prev]);
    setActiveCertificate(cert);
    addToast(
      'success',
      'Certificate Issued',
      `Issued verified credential ${cert.certificate_number} for ${cert.recipient_name}`
    );
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setEvents(INITIAL_EVENTS);
    setEventTeams(INITIAL_EVENT_TEAMS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotices(INITIAL_NOTICES);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentProfile(INITIAL_PROFILES[0]);
    setCurrentCollege(INITIAL_COLLEGES[0]);
    addToast('info', 'Demo Reset', 'Database restored to initial Bhopal Hackathon seed scenario.');
  };

  return (
    <CampusContext.Provider
      value={{
        colleges,
        currentCollege,
        setCurrentCollege,
        profiles,
        currentProfile,
        setCurrentProfile,
        switchRole,
        currentView,
        setCurrentView,
        goBack,
        canGoBack,
        departments,
        clubs,
        events,
        eventTeams,
        registrations,
        certificates,
        notices,
        opportunities,
        subscriptions,
        auditLogs,
        handleRegisterEvent,
        handleApproveEvent,
        handleRejectEvent,
        handleCreateEvent,
        handlePublishNotice,
        handleVerifyToken,
        handleCreateTeam,
        handleJoinTeam,
        handlePostOpportunity,
        handleIssueCertificate,
        resetToSeedData,
        activeTicketReg,
        setActiveTicketReg,
        activeCertificate,
        setActiveCertificate,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}

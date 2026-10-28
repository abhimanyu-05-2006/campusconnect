import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Bell,
  Ticket,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { EventItem, EventTeam } from '../types/database.types';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const StudentDashboard: React.FC = () => {
  const {
    currentCollege,
    currentProfile,
    events,
    registrations,
    certificates,
    notices,
    eventTeams,
    handleRegisterEvent,
    handleJoinTeam,
    handleCreateTeam,
    setActiveTicketReg,
    setActiveCertificate,
    setCurrentView,
    goBack,
    canGoBack
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'discover' | 'my_passes' | 'teams' | 'certificates' | 'notices'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Team creation modal state
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRoles, setNewTeamRoles] = useState('Frontend Engineer, Computer Vision ML');
  const [teamEventId, setTeamEventId] = useState('ev-1');

  // Filtered approved events for this college
  const approvedEvents = events.filter((e) => e.status === 'approved');

  const filteredEvents = approvedEvents.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || ev.category_name.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Registrations belonging to current student
  const myRegistrations = registrations.filter(
    (reg) => reg.student_profile_id === currentProfile.id
  );

  // Certificates for current student
  const myCertificates = certificates.filter(
    (c) => c.recipient_profile_id === currentProfile.id
  );

  const isRegistered = (eventId: string) => {
    return myRegistrations.some((r) => r.event_id === eventId);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    const roles = newTeamRoles.split(',').map((r) => r.trim()).filter(Boolean);
    handleCreateTeam(teamEventId, newTeamName, roles);
    setShowCreateTeamModal(false);
    setNewTeamName('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Welcome Hero Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 shadow-xs transition group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
                <CampusConnectLogo size="xs" />
                <span>Verified Student Identity: {currentProfile.roll_number || '2023CSB042'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {currentProfile.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentCollege.name} • Computer Science & Engineering
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[90px]">
                <div className="text-xl font-black text-blue-600">{myRegistrations.length}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Active Passes
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[90px]">
                <div className="text-xl font-black text-amber-600">{myCertificates.length}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Certificates
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[90px]">
                <div className="text-xl font-black text-emerald-600">{notices.length}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Notices
                </div>
              </div>
            </div>
          </div>

          {/* Student Tabs Navigation */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-px text-xs font-bold">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'discover'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Discover Events ({approvedEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my_passes')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 relative ${
                activeTab === 'my_passes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Passes & QR Tokens ({myRegistrations.length})</span>
              {myRegistrations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teammate Finder & Squads</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Verified Certificates ({myCertificates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`pb-3 px-3.5 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'notices'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Official Notices ({notices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: DISCOVER EVENTS */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Hackathons, Concerts, Fests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'Hackathon', label: 'Hackathons' },
                  { id: 'Concert', label: 'Concerts & Fests' },
                  { id: 'Cultural Fest', label: 'Cultural' },
                  { id: 'Workshop', label: 'Workshops' },
                  { id: 'Coding Contest', label: 'Coding' },
                  { id: 'Sports Meet', label: 'Sports' },
                  { id: 'Seminar', label: 'Seminars' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const registered = isRegistered(event.id);
                const isFull = event.current_registrations >= event.seat_capacity;

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Poster Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-xs uppercase tracking-wider shadow-xs">
                          {event.category_name}
                        </span>
                        {event.is_team_event && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-xs">
                            Team {event.min_team_size}-{event.max_team_size}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-[11px] font-medium text-slate-300">
                          {event.club_name}
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {event.short_summary}
                        </p>

                        {/* Meta Tags */}
                        <div className="mt-4 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {new Date(event.start_time).toLocaleDateString()} at{' '}
                              {new Date(event.start_time).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                            <span>Seats Claimed</span>
                            <span className={isFull ? 'text-red-600' : 'text-slate-800'}>
                              {event.current_registrations} / {event.seat_capacity}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isFull ? 'bg-red-500' : 'bg-blue-600'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (event.current_registrations / event.seat_capacity) * 100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {registered ? (
                          <button
                            onClick={() => {
                              const reg = myRegistrations.find((r) => r.event_id === event.id);
                              if (reg) setActiveTicketReg(reg);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center justify-center gap-1.5 transition"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>View Digital Pass / QR</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegisterEvent(event.id)}
                            disabled={isFull}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 ${
                              isFull
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            <Ticket className="w-4 h-4" />
                            <span>{isFull ? 'Seat Capacity Reached' : 'Claim Free Pass'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY PASSES & QR TOKENS */}
        {activeTab === 'my_passes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registered Events & Gate Access Tokens</h3>
                <p className="text-xs text-slate-500">
                  Present these dynamic passes at the venue gate for live scanner verification.
                </p>
              </div>
            </div>

            {myRegistrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No active event registrations</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse campus workshops, hackathons, and cultural nights to claim passes.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition"
                >
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRegistrations.map((reg) => {
                  const isCheckedIn = reg.status === 'checked_in';
                  return (
                    <div
                      key={reg.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-400 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              isCheckedIn
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {isCheckedIn ? 'Checked In' : 'Active Pass'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {reg.qr_token.slice(0, 15)}...
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 line-clamp-2">
                          {reg.event_title}
                        </h4>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{reg.event_venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{new Date(reg.event_start_time).toLocaleString()}</span>
                          </div>
                          {reg.team_name && (
                            <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                              <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>Squad: {reg.team_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => setActiveTicketReg(reg)}
                          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Open QR Badge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEAMMATE FINDER */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                  Bhopal AI/ML Hackathon 2026
                </span>
                <h3 className="text-xl font-bold mt-2">Hackathon Teammate Finder</h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                  Form teams of 2 to 4 members. Connect with engineers, designers, and AI researchers from
                  Computer Science, AIML, and ECE departments.
                </p>
              </div>
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-xs shadow-sm transition shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Create New Squad</span>
              </button>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventTeams.map((team) => {
                const isMember = team.members.some((m) => m.profile_id === currentProfile.id);
                const isFull = team.members_count >= team.max_size;

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-slate-900">{team.team_name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {team.team_code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Led by <span className="font-semibold text-slate-800">{team.leader_name}</span>
                      </p>

                      {/* Recruiting roles */}
                      <div className="mt-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                          Recruiting Roles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {team.recruiting_roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Current members */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
                          <span>Squad Roster ({team.members_count}/{team.max_size})</span>
                        </div>
                        <div className="space-y-1.5">
                          {team.members.map((member, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-50 rounded-lg"
                            >
                              <span className="font-medium text-slate-800">{member.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{member.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-100">
                      {isMember ? (
                        <div className="py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                          ✓ You are an active squad member
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={isFull}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            isFull
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>{isFull ? 'Squad Full (4/4)' : 'Request to Join Squad'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VERIFIED CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Verified Credentials</h3>
                <p className="text-xs text-slate-500">
                  Signed and issued with institutional cryptographic hashes for LinkedIn and resume verification.
                </p>
              </div>
            </div>

            {myCertificates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No certificates issued yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Certificates are automatically issued when event organizers verify your gate attendance
                  token.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#fcfbf9] rounded-2xl border-2 border-amber-900/20 p-6 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                          {cert.achievement_type}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {cert.certificate_number}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-slate-900">{cert.event_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Issued by <span className="font-semibold">{cert.college_name}</span>
                      </p>

                      <div className="mt-4 p-2.5 bg-white/80 rounded-lg border border-amber-200/60 text-[11px] font-mono text-slate-600 break-all">
                        <span className="text-slate-400">SHA256: </span>
                        {cert.verification_hash}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-amber-200/40 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Date: {new Date(cert.issued_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setActiveCertificate(cert)}
                        className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition"
                      >
                        Preview & Print Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: OFFICIAL NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Official College Circulars</h3>
              <p className="text-xs text-slate-500">
                Official notices signed by the Dean Office and Academic Administration.
              </p>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => {
                const isUrgent = notice.priority === 'urgent';
                const isImportant = notice.priority === 'important';

                return (
                  <div
                    key={notice.id}
                    className={`bg-white rounded-2xl p-5 border shadow-xs transition ${
                      isUrgent
                        ? 'border-red-300 bg-red-50/20'
                        : isImportant
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-red-600 text-white'
                              : isImportant
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {notice.priority}
                        </span>
                        {notice.department_code && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Dept: {notice.department_code}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Published by:{' '}
                        <strong className="text-slate-800">{notice.publisher_name}</strong> (
                        {notice.publisher_designation})
                      </span>
                      <span className="text-emerald-700 font-semibold">✓ Verified Circular</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create Team */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Hackathon Squad</h3>
            <p className="text-xs text-slate-500 mb-4">
              Form a squad for Bhopal AI/ML Hackathon 2026.
            </p>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QuantumDevs, NeuralMatrix"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Recruiting Roles (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="UI/UX Designer, Python ML Engineer, Backend Dev"
                  value={newTeamRoles}
                  onChange={(e) => setNewTeamRoles(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition"
                >
                  Create & Launch Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

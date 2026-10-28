import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Search,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { Opportunity } from '../types/database.types';
import { CampusConnectLogo } from '../components/CampusConnectLogo';

export const OpportunitiesBoard: React.FC = () => {
  const { opportunities, currentCollege, currentProfile, handlePostOpportunity, addToast, goBack } = useCampus();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('Apex AI Labs');
  const [newRoleType, setNewRoleType] = useState<Opportunity['role_type']>('Internship');
  const [newLocation, setNewLocation] = useState('Bangalore / Hybrid');
  const [newStipend, setNewStipend] = useState('₹50,000 / month');
  const [newApplyUrl, setNewApplyUrl] = useState('https://careers.apexailabs.com');
  const [newDepts, setNewDepts] = useState('CSE, AIML');

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  const filteredOpps = opportunities.filter((opp) => {
    const isExpired = new Date() > new Date(opp.deadline);
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || opp.role_type === filterType;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !isExpired) ||
      (statusFilter === 'closed' && isExpired);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    handlePostOpportunity({
      title: newTitle,
      company_name: newCompany,
      role_type: newRoleType,
      location: newLocation,
      stipend_range: newStipend,
      apply_url: newApplyUrl,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      eligible_departments: newDepts.split(',').map((s) => s.trim())
    });

    setShowPostModal(false);
    setNewTitle('');
  };

  const isSponsor = currentProfile.role === 'company_sponsor';

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header */}
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
                <CampusConnectLogo size="xs" />
                <span>Verified Campus Recruitment & Sponsor Board</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Opportunities & Hackathon Bounties
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fast-track internships, research fellowships, and entry-level engineering roles for{' '}
                {currentCollege.name}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPostModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, AI roles, stipends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active Open' },
                { id: 'closed', label: 'Closed (Demo)' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    statusFilter === s.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'Internship', 'Fellowship', 'Full-time', 'Hackathon Bounty'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterType === type
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {type === 'all' ? 'All Roles' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpps.map((opp) => {
            const isExpired = new Date() > new Date(opp.deadline);

            return (
              <div
                key={opp.id}
                className={`bg-white rounded-2xl border shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition group ${
                  isExpired ? 'border-slate-200 opacity-85' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        {opp.role_type}
                      </span>
                      {isExpired ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                          Closed / Inactive
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition">
                    {opp.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.company_name}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{opp.stipend_range}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                        {isExpired && ' (Ended)'}
                      </span>
                    </div>
                  </div>

                  {/* Eligible departments */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {opp.eligible_departments.map((dept) => (
                      <span
                        key={dept}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isExpired ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed border border-slate-200 flex items-center justify-center gap-1.5"
                    >
                      <span>Applications Closed (Demo Inactive)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToast('success', 'Application Opened', `Redirected to ${opp.company_name} campus portal.`);
                        window.open(opp.apply_url, '_blank');
                      }}
                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Apply with CampusConnect ID</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal: Post Opportunity */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post Opportunity</h3>
            <p className="text-xs text-slate-500 mb-4">
              Publish an internship or bounty for {currentCollege.name} students.
            </p>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research Intern, Junior Cloud Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Role Type
                  </label>
                  <select
                    value={newRoleType}
                    onChange={(e) => setNewRoleType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Hackathon Bounty">Hackathon Bounty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Stipend / CTC
                  </label>
                  <input
                    type="text"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Eligible Departments
                </label>
                <input
                  type="text"
                  value={newDepts}
                  onChange={(e) => setNewDepts(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Application Link
                </label>
                <input
                  type="url"
                  required
                  value={newApplyUrl}
                  onChange={(e) => setNewApplyUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

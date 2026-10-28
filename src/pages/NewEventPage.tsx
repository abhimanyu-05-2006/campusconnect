import React, { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Users,
  Image,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Tag
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CreateEventInput } from '../actions/events';

export const NewEventPage: React.FC = () => {
  const { currentCollege, currentProfile, handleCreateEvent, setCurrentView } = useCampus();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CreateEventInput>({
    college_id: currentCollege.id,
    organizer_profile_id: currentProfile.id,
    organizer_name: currentProfile.full_name,
    club_name: 'Google Developer Student Club',
    category_name: 'Hackathon',
    title: '',
    short_summary: '',
    description: '',
    poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    venue: '',
    is_online: false,
    start_time: '2026-11-18T10:00',
    end_time: '2026-11-19T18:00',
    registration_deadline: '2026-11-16T23:59',
    seat_capacity: 150,
    is_team_event: true,
    min_team_size: 2,
    max_team_size: 4,
    ticket_price_inr: 0,
    tags: ['Hackathon', 'Coding', 'Innovation']
  });

  const categories = [
    'Hackathon',
    'Workshop',
    'Cultural Fest',
    'Coding Contest',
    'Seminar',
    'Sports Meet'
  ];

  const handleInputChange = (field: keyof CreateEventInput, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleCreateEvent(formData);
    if (success) {
      setCurrentView('organizer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('organizer')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Desk</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Event Builder • Scoped to {currentCollege.name}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Create New Campus Event</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Events are scoped to your institutional tenant and submitted to the Dean Office for clearance.
            </p>

            {/* Stepper Indicator */}
            <div className="mt-6 flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= s ? 'bg-white text-indigo-700' : 'bg-white/20 text-white'
                    }`}
                  >
                    {s}
                  </div>
                  <div className="text-[11px] font-semibold hidden sm:inline">
                    {s === 1 ? 'Details' : s === 2 ? 'Schedule & Venue' : 'Capacity & Teams'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Formats */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Event Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleInputChange('category_name', cat)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          formData.category_name === cat
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central India Hackathon 2026, Cloud Native Bootcamp..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Short Summary (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief tagline for event card previews..."
                    value={formData.short_summary}
                    onChange={(e) => handleInputChange('short_summary', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Description & Objectives
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detailed syllabus, hackathon tracks, mentors, prizes, and requirements..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.poster_url}
                    onChange={(e) => handleInputChange('poster_url', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Venue & Schedule */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Campus Venue or Lab
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Auditorium, High Performance Computing Lab 3..."
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Registration Cutoff Deadline
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.registration_deadline}
                    onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Capacity & Teams */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Seat / Attendee Limit
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      required
                      value={formData.seat_capacity}
                      onChange={(e) => handleInputChange('seat_capacity', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Ticket Price (INR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.ticket_price_inr}
                      onChange={(e) => handleInputChange('ticket_price_inr', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Set 0 for free campus pass</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Team Event Format</span>
                      <span className="text-[11px] text-slate-500">Allow students to form squads</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_team_event}
                      onChange={(e) => handleInputChange('is_team_event', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  {formData.is_team_event && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Min Team Size
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={formData.max_team_size}
                          value={formData.min_team_size}
                          onChange={(e) => handleInputChange('min_team_size', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Max Team Size
                        </label>
                        <input
                          type="number"
                          min={formData.min_team_size}
                          max={10}
                          value={formData.max_team_size}
                          onChange={(e) => handleInputChange('max_team_size', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Previous Step
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && (!formData.title || !formData.description)) {
                      alert('Please fill out the title and description.');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                >
                  Continue to Next Step &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for College Admin Clearance</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

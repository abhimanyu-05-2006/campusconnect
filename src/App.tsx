/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { HeaderNav } from './components/HeaderNav';
import { ToastContainer } from './components/ToastContainer';
import { TicketPassModal } from './components/TicketPassModal';
import { CertificateModal } from './components/CertificateModal';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CollegeAdminDashboard } from './pages/CollegeAdminDashboard';
import { OrganizerHub } from './pages/OrganizerHub';
import { NewEventPage } from './pages/NewEventPage';
import { OpportunitiesBoard } from './pages/OpportunitiesBoard';
import { SuperAdminPortal } from './pages/SuperAdminPortal';

const AppContent: React.FC = () => {
  const {
    currentView,
    activeTicketReg,
    setActiveTicketReg,
    activeCertificate,
    setActiveCertificate,
    currentCollege
  } = useCampus();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'student_dashboard':
        return <StudentDashboard />;
      case 'college_admin':
        return <CollegeAdminDashboard />;
      case 'organizer':
        return <OrganizerHub />;
      case 'organizer_new_event':
        return <NewEventPage />;
      case 'opportunities':
        return <OpportunitiesBoard />;
      case 'super_admin':
        return <SuperAdminPortal />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <HeaderNav />

      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Global Modals */}
      {activeTicketReg && (
        <TicketPassModal
          registration={activeTicketReg}
          onClose={() => setActiveTicketReg(null)}
        />
      )}

      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      <ToastContainer />

      {/* Unified Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">CampusConnect</span>
            <span>— Multi-Tenant Campus Operations & Student Networking SaaS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Tenant: <strong className="text-white">{currentCollege.name}</strong></span>
            <span>•</span>
            <span>PostgreSQL RLS Protected</span>
            <span>•</span>
            <span>Annual B2B SaaS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <AppContent />
    </CampusProvider>
  );
}

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Discover } from './pages/Discover';
import { PersonalizedMatches } from './pages/PersonalizedMatches';
import { Roadmaps } from './pages/Roadmaps';
import { Assessments } from './pages/Assessments';
import { InterviewLab } from './pages/InterviewLab';
import { CareerMentor } from './pages/CareerMentor';
import { ResumeStudio } from './pages/ResumeStudio';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { NotificationCenter } from './pages/NotificationCenter';
import { LearningResources } from './pages/LearningResources';
import { ProfilePage } from './pages/ProfilePage';
import { SecuritySettings } from './pages/SecuritySettings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { InternshipImportAdmin } from './pages/InternshipImportAdmin';

// Protected Layout Component
const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 font-medium">
        Loading InternProof AI...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (

<div className="flex h-screen overflow-hidden font-sans bg-[#F3F8F4] text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/matches" element={<PersonalizedMatches />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/interview-lab" element={<InterviewLab />} />
              <Route path="/mentor" element={<CareerMentor />} />
              <Route path="/resume-studio" element={<ResumeStudio />} />
              <Route path="/applications" element={<ApplicationTracker />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/resources" element={<LearningResources />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/admin/internship-imports" element={<InternshipImportAdmin />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Map,
  HelpCircle,
  Bot,
  FileText,
  CheckSquare,
  Bell,
  BookOpen,
  User,
  Shield,
  LogOut,
  Sun,
  Moon,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  unreadNotificationsCount?: number;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  unreadNotificationsCount = 0,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const { actualTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Discover Internships', path: '/discover', icon: Compass },
    { name: 'Personalized Matches', path: '/matches', icon: Sparkles, badge: 'AI' },
    { name: 'Skill Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Skill Assessments', path: '/assessments', icon: GraduationCap },
    { name: 'Interview Lab', path: '/interview-lab', icon: HelpCircle },
    { name: 'AI Career Mentor', path: '/mentor', icon: Bot },
    { name: 'Resume Studio', path: '/resume-studio', icon: FileText },
    { name: 'Application Tracker', path: '/applications', icon: CheckSquare },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      count: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { name: 'Learning & YouTube', path: '/resources', icon: BookOpen },
    { name: 'Profile & Target Role', path: '/profile', icon: User },
    { name: 'Security & Privacy', path: '/security', icon: Shield },
    ...(user?.role === 'ADMIN' ? [{ name: 'Internship Import Admin', path: '/admin/internship-imports', icon: Shield }] : []),
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white border-r border-[#DCE8DE] select-none">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          {/* Logo container flipped from Indigo gradient to pure Solid Green */}
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            {/* Header text color changed to unified brand green */}
            <span className="font-extrabold text-lg tracking-tight text-brand-700 dark:text-brand-400">
              StudentAssist
            </span>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
              Readiness Intelligence
            </p>
          </div>
        </div>

        {/* User Pill Summary */}
        {user && (
          <div className="mx-4 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user.profile?.displayName || user.email.split('@')[0]}
              </p>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold truncate">
                {user.profile?.targetRole || 'Aspiring Software Engineer'}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" title="Online" />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 border border-brand-100'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-700 dark:hover:text-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.badge && (
                  /* Replaced Indigo AI Badge with crisp matching Green Badge values */
                  <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 font-bold rounded-full bg-rose-500 text-white">
                    {item.count}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Controls: Theme Toggle & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <span className="flex items-center gap-2.5">
            {actualTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
            <span>Theme: {actualTheme === 'dark' ? 'Dark' : 'Light'}</span>
          </span>
          <span className="text-[10px] text-slate-400">Toggle</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
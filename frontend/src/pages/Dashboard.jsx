import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin');
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      await logoutUser({ refresh });
    } catch (e) {}
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const studentCards = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      iconBg: 'bg-blue-50',
      label: 'My Profile',
      desc:  'Complete your student profile',
      badge: null,
      route: '/profile',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      iconBg: 'bg-indigo-50',
      label: 'Browse Jobs',
      desc:  'View campus job postings',
      badge: 'New',
      route: '/jobs',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0891B2" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      ),
      iconBg: 'bg-cyan-50',
      label: 'My Applications',
      desc:  'Track your job applications',
      badge: null,
      route: '/tracker',
    },
  ];

  const recruiterCards = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
      iconBg: 'bg-blue-50',
      label: 'Company Profile',
      desc:  'Set up your company info',
      badge: null,
      route: '/recruiter/profile',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      ),
      iconBg: 'bg-indigo-50',
      label: 'Post a Job',
      desc:  'Create campus job openings',
      badge: null,
      route: '/jobs/post',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0891B2" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      iconBg: 'bg-cyan-50',
      label: 'Browse Students',
      desc:  'Find the right candidates',
      badge: null,
      route: '/students/browse',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      iconBg: 'bg-emerald-50',
      label: 'Application Tracker',
      desc:  'Track student applications',
      badge: null,
      route: '/recruiter/tracker',
    },
  ];

  const cards     = user.role === 'student' ? studentCards : recruiterCards;
  const roleLabel = user.role === 'student' ? 'Student' : 'Recruiter';

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Shared Navbar ── */}
      <Navbar />

      {/* ── Main ── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Welcome banner */}
        <div className="bg-primary rounded-2xl px-8 py-7 mb-8 flex items-center
                        justify-between shadow-md overflow-hidden relative">
          {/* Decorative blob */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/10
                          rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/5
                          rounded-full translate-y-1/2" />

          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-semibold uppercase
                          tracking-widest mb-1">
              Welcome Back
            </p>
            <h2 className="text-white text-2xl font-bold mb-1.5">
              {user.full_name} 👋
            </h2>
            <p className="text-blue-100 text-sm">
              You're signed in as a{' '}
              <strong className="text-white">{roleLabel}</strong>.
              Here's your dashboard.
            </p>
          </div>

          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center
                          justify-center flex-shrink-0 relative z-10 text-4xl">
            {user.role === 'student' ? '🎓' : '🏢'}
          </div>
        </div>

        {/* Section heading */}
        <h3 className="text-xs font-bold text-textMuted uppercase
                       tracking-widest mb-4">
          Quick Access
        </h3>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => (
            <div
              key={card.label}
              onClick={() => navigate(card.route)}
              className="bg-surface border border-slate-200 rounded-2xl p-6
                         cursor-pointer shadow-sm relative transition
                         hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5
                         group"
            >
              {/* Badge */}
              {card.badge && (
                <span className="absolute top-4 right-4 bg-emerald-100
                                 text-emerald-700 text-xs font-bold px-2.5
                                 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex
                               items-center justify-center mb-4`}>
                {card.icon}
              </div>

              <h4 className="text-base font-bold text-textDark mb-1 
                             group-hover:text-primary transition">
                {card.label}
              </h4>
              <p className="text-sm text-textMuted leading-relaxed">
                {card.desc}
              </p>

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold
                              text-primary">
                Go to
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
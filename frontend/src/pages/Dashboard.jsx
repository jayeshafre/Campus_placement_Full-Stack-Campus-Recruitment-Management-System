import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

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
      iconBg: '#EFF6FF',
      label: 'My Profile',
      desc: 'Complete your student profile',
      badge: null,
      route: '/profile',
      borderColor: '#BFDBFE',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      iconBg: '#EEF2FF',
      label: 'Browse Jobs',
      desc: 'View campus job postings',
      badge: 'New',
      route: '/jobs',
      borderColor: '#C7D2FE',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0891B2" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      ),
      iconBg: '#ECFEFF',
      label: 'My Applications',
      desc: 'Track your job applications',
      badge: null,
      route: '/tracker',
      borderColor: '#A5F3FC',
    },
  ];

  const recruiterCards = [
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
      iconBg: '#EFF6FF',
      label: 'Company Profile',
      desc: 'Set up your company info',
      badge: null,
      route: '/recruiter/profile',
      borderColor: '#BFDBFE',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      ),
      iconBg: '#EEF2FF',
      label: 'Post a Job',
      desc: 'Create campus job openings',
      badge: null,
      route: '/jobs/post',
      borderColor: '#C7D2FE',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0891B2" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      iconBg: '#ECFEFF',
      label: 'Browse Students',
      desc: 'Find the right candidates',
      badge: null,
      route: '/students/browse',
      borderColor: '#A5F3FC',
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      iconBg: '#ECFDF5',
      label: 'Application Tracker',
      desc: 'Track student applications',
      badge: null,
      route: '/recruiter/tracker',
      borderColor: '#A7F3D0',
    },
  ];

  const cards = user.role === 'student' ? studentCards : recruiterCards;

  const roleColor   = user.role === 'student'   ? '#2563EB' : '#4F46E5';
  const roleBg      = user.role === 'student'   ? '#EFF6FF' : '#EEF2FF';
  const roleLabel   = user.role === 'student'   ? 'Student' : 'Recruiter';

  // Avatar initials
  const initials = user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#1E293B', letterSpacing: '-0.3px' }}>CampusPlace</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Role badge */}
          <span style={{ background: roleBg, color: roleColor, fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize', border: `1px solid ${roleColor}22` }}>
            {roleLabel}
          </span>

          {/* Avatar */}
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>
            {initials}
          </div>

          {/* Name */}
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>{user.full_name}</span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.825rem', fontWeight: '600', color: '#64748B', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Welcome banner */}
        <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)', borderRadius: '16px', padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(37,99,235,0.25)' }}>
          <div>
            <p style={{ color: '#BFDBFE', fontSize: '0.85rem', fontWeight: '500', marginBottom: '4px', letterSpacing: '0.3px' }}>
              WELCOME BACK
            </p>
            <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: '700', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {user.full_name} 👋
            </h2>
            <p style={{ color: '#C7D2FE', fontSize: '0.875rem', margin: 0 }}>
              You're signed in as a <strong style={{ color: '#FFFFFF' }}>{roleLabel}</strong>. Here's your dashboard.
            </p>
          </div>
          {/* Decorative circle */}
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '2.2rem' }}>{user.role === 'student' ? '🎓' : '🏢'}</span>
          </div>
        </div>

        {/* Section heading */}
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#64748B', marginBottom: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Quick Access
        </h3>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {cards.map((card) => (
            <div
              key={card.label}
              onClick={() => navigate(card.route)}
              style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = card.borderColor;
                e.currentTarget.style.boxShadow = `0 4px 16px rgba(37,99,235,0.10)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Badge */}
              {card.badge && (
                <span style={{ position: 'absolute', top: '14px', right: '14px', background: '#DCFCE7', color: '#16A34A', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.3px' }}>
                  {card.badge}
                </span>
              )}

              {/* Icon */}
              <div style={{ width: '46px', height: '46px', background: card.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {card.icon}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
                {card.label}
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                {card.desc}
              </p>

              {/* Arrow */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', color: '#2563EB' }}>
                Go to
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
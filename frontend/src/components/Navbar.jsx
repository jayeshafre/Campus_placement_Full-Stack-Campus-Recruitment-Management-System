import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Shared Navbar — works for all roles.
 *
 * Props:
 *  - title (string)      — optional page-specific title shown as breadcrumb
 *  - actions (ReactNode) — optional extra buttons on the right side
 */
export default function Navbar({ title, actions }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-slate-200 px-6 h-14 flex
                    justify-between items-center sticky top-0 z-50 shadow-sm font-sans">

      {/* ── Left: Brand ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center
                          justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-textDark text-base tracking-tight">
            PlacementHub
          </span>
        </button>

        {/* Role badge */}
        {user?.role && (
          <span className="text-xs bg-blue-50 text-primary font-semibold
                           px-2.5 py-0.5 rounded-full border border-blue-100 capitalize">
            {user.role === 'placement_officer' ? 'Admin' : user.role}
          </span>
        )}

        {/* Optional breadcrumb title */}
        {title && (
          <>
            <span className="text-slate-300 text-sm">/</span>
            <span className="text-sm font-semibold text-textMuted">{title}</span>
          </>
        )}
      </div>

      {/* ── Right: Nav links + user + logout ── */}
      <div className="flex items-center gap-4">

        {/* Recruiter links */}
        {user?.role === 'recruiter' && (
          <>
            <NavLink onClick={() => navigate('/jobs/post')}>Post Job</NavLink>
            <NavLink onClick={() => navigate('/jobs/manage')}>My Jobs</NavLink>
            <NavLink onClick={() => navigate('/students/browse')}>Students</NavLink>
            <NavLink onClick={() => navigate('/recruiter/profile')}>Profile</NavLink>
          </>
        )}

        {/* Student links — ⚠️ FIX: /jobs/browse → /jobs */}
        {user?.role === 'student' && (
          <>
            <NavLink onClick={() => navigate('/jobs')}>Browse Jobs</NavLink>
            <NavLink onClick={() => navigate('/my-applications')}>Applications</NavLink>
            <NavLink onClick={() => navigate('/profile')}>Profile</NavLink>
          </>
        )}

        {user?.role === 'placement_officer' && (
          <NavLink onClick={() => navigate('/admin')}>Dashboard</NavLink>
        )}

        {/* Divider */}
        <span className="h-5 w-px bg-slate-200" />

        {/* User name */}
        {user?.full_name && (
          <span className="text-sm text-textMuted hidden sm:block">
            {user.full_name}
          </span>
        )}

        {/* Dashboard shortcut */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-primary hover:text-secondary font-semibold
                     transition-colors bg-transparent border-none cursor-pointer">
          Dashboard
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm bg-slate-100
                     hover:bg-slate-200 text-textDark px-3.5 py-1.5 rounded-lg
                     font-medium transition-colors border-none cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

function NavLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-textMuted hover:text-primary font-medium
                 transition-colors bg-transparent border-none cursor-pointer">
      {children}
    </button>
  );
}
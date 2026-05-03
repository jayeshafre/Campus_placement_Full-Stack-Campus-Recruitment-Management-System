import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.user, res.data.tokens);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', sans-serif" }}>

      {/* Card */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 24px rgba(37,99,235,0.08)', padding: '2.5rem', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0' }}>

        {/* Logo / Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1E293B', letterSpacing: '-0.3px' }}>CampusPlace</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Placement Portal</div>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Welcome back</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Sign in to your account to continue</p>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@college.edu"
              style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', color: '#1E293B', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: '600', color: '#374151' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: '500', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >Forgot password?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', color: '#1E293B', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', fontWeight: '600', fontSize: '0.925rem', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.25rem', letterSpacing: '0.2px', transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
            onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.92' }}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}/>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '500' }}>NEW HERE?</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}/>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >Create account</Link>
        </p>

      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();
  const token              = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', password2: '' });
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState({ password: false, password2: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, ...formData });
      setSuccess('Password reset successful! Redirecting to sign in...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const data = err.response?.data;
      const msg  = data?.error || data?.non_field_errors?.[0] || 'Reset failed. The link may have expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputWrapStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px',
    padding: '0.65rem 2.5rem 0.65rem 0.9rem', fontSize: '0.9rem', color: '#1E293B',
    outline: 'none', boxSizing: 'border-box', background: '#F8FAFC'
  };
  const eyeBtnStyle = {
    position: 'absolute', right: '10px', background: 'none', border: 'none',
    cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex', alignItems: 'center'
  };

  // No token in URL
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 24px rgba(37,99,235,0.08)', padding: '2.5rem', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', background: '#FEF2F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.5rem' }}>Invalid Link</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This reset link is invalid or has already been used.</p>
          <Link to="/forgot-password"
            style={{ display: 'block', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', fontWeight: '600', fontSize: '0.925rem', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 24px rgba(37,99,235,0.08)', padding: '2.5rem', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0' }}>

        {/* Brand */}
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

        {/* Icon */}
        <div style={{ width: '52px', height: '52px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Set new password</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          Your new password must be at least 8 characters.
        </p>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>New Password</label>
            <div style={inputWrapStyle}>
              <input
                type={showPass.password ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 8 characters"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <button type="button" onClick={() => toggleShow('password')} style={eyeBtnStyle}>
                {showPass.password
                  ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Confirm New Password</label>
            <div style={inputWrapStyle}>
              <input
                type={showPass.password2 ? 'text' : 'password'}
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Repeat new password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <button type="button" onClick={() => toggleShow('password2')} style={eyeBtnStyle}>
                {showPass.password2
                  ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            style={{ width: '100%', background: (loading || success) ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', fontWeight: '600', fontSize: '0.925rem', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: (loading || success) ? 'not-allowed' : 'pointer', marginTop: '1.25rem', letterSpacing: '0.2px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
            onMouseEnter={e => { if (!loading && !success) e.target.style.opacity = '0.92' }}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {loading ? 'Resetting...' : success ? 'Password Reset ✓' : 'Reset Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login"
            style={{ color: '#2563EB', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
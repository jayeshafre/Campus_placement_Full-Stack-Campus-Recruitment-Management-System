import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess('Reset link sent! Check your email inbox.');
    } catch (err) {
      const data = err.response?.data;
      const msg  = data?.email?.[0] || data?.error || 'Something went wrong. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 24px rgba(37,99,235,0.08)', padding: '2.5rem', width: '100%', maxWidth: '440px', border: '1px solid #E2E8F0' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>P</span>
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1E293B', letterSpacing: '-0.3px' }}>PlacementHub</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Placement Portal</div>
          </div>
        </div>

        {/* Icon */}
        <div style={{ width: '52px', height: '52px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Forgot password?</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          No worries. Enter your registered email and we'll send you a reset link.
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
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>Email address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@college.edu"
              style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', color: '#1E293B', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <button type="submit" disabled={loading || !!success}
            style={{ width: '100%', background: (loading || success) ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', fontWeight: '600', fontSize: '0.925rem', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: (loading || success) ? 'not-allowed' : 'pointer', marginTop: '1.25rem', letterSpacing: '0.2px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
            onMouseEnter={e => { if (!loading && !success) e.target.style.opacity = '0.92' }}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {loading ? 'Sending...' : success ? 'Email Sent ✓' : 'Send Reset Link'}
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
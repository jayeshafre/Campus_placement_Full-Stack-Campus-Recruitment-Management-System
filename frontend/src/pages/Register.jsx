import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '', email: '', role: 'student', password: '', password2: '',
  });
  const [error,    setError]   = useState('');
  const [success,  setSuccess] = useState('');
  const [loading,  setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ password: false, password2: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      setSuccess('Account created! Please wait for admin approval before logging in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const data = err.response?.data;
      const msg  = data?.email?.[0] || data?.password?.[0] || data?.non_field_errors?.[0] || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  );

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px',
    padding: '0.65rem 2.5rem 0.65rem 0.9rem', fontSize: '0.9rem', color: '#1E293B',
    outline: 'none', boxSizing: 'border-box', background: '#F8FAFC', transition: 'border-color 0.2s'
  };
  const labelStyle = { display: 'block', fontSize: '0.825rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' };
  const eyeBtnStyle = { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex', alignItems: 'center' };

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

        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Create account</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Join the campus placement portal</p>

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
          {/* Full Name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Rahul Sharma"
              style={{ ...inputStyle, padding: '0.65rem 0.9rem' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>College Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="rahul@college.edu"
              style={{ ...inputStyle, padding: '0.65rem 0.9rem' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Role toggle */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Register as</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['student', 'recruiter'].map((r) => (
                <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })}
                  style={{
                    flex: 1, padding: '0.65rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid',
                    borderColor: formData.role === r ? '#2563EB' : '#E2E8F0',
                    background:  formData.role === r ? '#EFF6FF' : '#F8FAFC',
                    color:       formData.role === r ? '#2563EB' : '#64748B',
                  }}
                >
                  {r === 'student' ? '🎓 Student' : '🏢 Recruiter'}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPass.password ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="Minimum 8 characters"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <button type="button" onClick={() => setShowPass(p => ({ ...p, password: !p.password }))} style={eyeBtnStyle}>
                <EyeIcon open={showPass.password} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input type={showPass.password2 ? 'text' : 'password'} name="password2" value={formData.password2} onChange={handleChange} required placeholder="Repeat password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <button type="button" onClick={() => setShowPass(p => ({ ...p, password2: !p.password2 }))} style={eyeBtnStyle}>
                <EyeIcon open={showPass.password2} />
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', fontWeight: '600', fontSize: '0.925rem', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.25rem', letterSpacing: '0.2px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
            onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.92' }}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}/>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '500' }}>HAVE AN ACCOUNT?</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}/>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >Sign in</Link>
        </p>
      </div>
    </div>
  );
}
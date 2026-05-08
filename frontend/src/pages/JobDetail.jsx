import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetail, applyToJob, checkApplication, withdrawApplication } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const JOB_TYPE_LABELS = {
  full_time: 'Full Time', internship: 'Internship',
  part_time: 'Part Time', contract: 'Contract',
};

const STATUS_STYLES = {
  applied:      { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE',  label: '📋 Applied' },
  under_review: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A',  label: '🔍 Under Review' },
  shortlisted:  { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE',  label: '⭐ Shortlisted' },
  selected:     { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0',  label: '🎉 Selected!' },
  rejected:     { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA',  label: '❌ Rejected' },
  withdrawn:    { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0',  label: 'Withdrawn' },
};

export default function JobDetail() {
  const { job_id } = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [job,         setJob]         = useState(null);
  const [appStatus,   setAppStatus]   = useState(null);
  const [appId,       setAppId]       = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [applying,    setApplying]    = useState(false);
  const [message,     setMessage]     = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJob();
    if (user?.role === 'student') checkIfApplied();
  }, [job_id]);

  const fetchJob = async () => {
    try {
      const res = await getJobDetail(job_id);
      setJob(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Job not found.' });
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const res = await checkApplication(job_id);
      if (res.data.applied) {
        setAppStatus(res.data.application.status);
        setAppId(res.data.application.id);
      }
    } catch {}
  };

  const handleApply = async () => {
    setApplying(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await applyToJob({ job: job_id, cover_letter: coverLetter });
      setAppStatus('applied');
      setAppId(res.data.application.id);
      setShowForm(false);
      setMessage({ type: 'success', text: '✅ Application submitted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to apply.' });
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Withdraw your application? This cannot be undone.')) return;
    try {
      await withdrawApplication(appId);
      setAppStatus(null);
      setAppId(null);
      setMessage({ type: 'success', text: '✅ Application withdrawn.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Cannot withdraw.' });
    }
  };

  const cardStyle = {
    background: '#FFFFFF', borderRadius: '14px',
    border: '1px solid #E2E8F0', padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(37,99,235,0.04)', marginBottom: '1rem'
  };
  const secTitle = {
    fontSize: '0.7rem', fontWeight: '700', color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem'
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>😕</p>
        <p style={{ color: '#64748B', marginBottom: '12px' }}>Job not found.</p>
        <button onClick={() => navigate('/jobs')}
          style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>
          ← Back to Jobs
        </button>
      </div>
    </div>
  );

  const statusStyle = appStatus ? STATUS_STYLES[appStatus] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <Navbar />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Alert */}
        {message.text && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2', color: message.type === 'success' ? '#16A34A' : '#DC2626', border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}` }}>
            {message.text}
          </div>
        )}

        {/* Job Header Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>

            {/* Logo */}
            <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', background: '#EFF6FF', border: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {job.company_logo
                ? <img src={job.company_logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                : <span style={{ fontSize: '1.75rem' }}>🏢</span>}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{job.title}</h1>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>
                    {job.company_name} · {job.location}
                  </p>
                </div>

                {/* Apply / Status — students only */}
                {user?.role === 'student' && (
                  <div style={{ textAlign: 'right' }}>
                    {appStatus ? (
                      <div>
                        <span style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: '600', padding: '0.45rem 1rem', borderRadius: '10px', background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                          {statusStyle.label}
                        </span>
                        {!['selected', 'rejected'].includes(appStatus) && (
                          <button onClick={handleWithdraw}
                            style={{ display: 'block', marginTop: '8px', fontSize: '0.75rem', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto' }}
                            onMouseEnter={e => e.target.style.color = '#DC2626'}
                            onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                            Withdraw Application
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowForm(true)}
                        style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        Apply Now →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                  {JOB_TYPE_LABELS[job.job_type]}
                </span>
                {job.package_lpa && (
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                    💰 {job.package_lpa} LPA
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }}>
                  👥 {job.vacancy_count} vacanc{job.vacancy_count > 1 ? 'ies' : 'y'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
                  🎓 CGPA ≥ {job.min_cgpa}
                </span>
                {job.last_date_to_apply && (
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                    ⏰ Deadline: {new Date(job.last_date_to_apply).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Branches */}
              {job.allowed_branches && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '500' }}>Branches:</span>
                  {job.allowed_branches.split(',').map(b => (
                    <span key={b} style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.55rem', borderRadius: '20px', background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE', textTransform: 'uppercase' }}>
                      {b.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Form */}
        {showForm && !appStatus && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #BFDBFE', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 4px 16px rgba(37,99,235,0.08)' }}>
            <h3 style={{ fontWeight: '700', color: '#1E293B', fontSize: '1rem', marginBottom: '1rem' }}>
              ✍️ Apply for{' '}
              <span style={{ color: '#2563EB' }}>{job.title}</span>
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Cover Letter <span style={{ color: '#CBD5E1', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Tell the recruiter why you're a great fit for this role..."
                style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', resize: 'none', background: '#F8FAFC', color: '#1E293B', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)}
                style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', background: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleApply} disabled={applying}
                style={{ padding: '0.55rem 1.5rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', background: applying ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', border: 'none', cursor: applying ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
                {applying ? 'Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        )}

        {/* Job Details */}
        <div>

          {/* Description */}
          <div style={cardStyle}>
            <p style={secTitle}>About the Role</p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div style={cardStyle}>
              <p style={secTitle}>Responsibilities</p>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div style={cardStyle}>
              <p style={secTitle}>Requirements</p>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {job.requirements}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
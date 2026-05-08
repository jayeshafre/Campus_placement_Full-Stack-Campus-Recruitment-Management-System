import { useState, useEffect } from 'react';
import { useNavigate }       from 'react-router-dom';
import { getRecruiterStats } from '../api/auth';
import { useAuth }           from '../context/AuthContext';
import Navbar from '../components/Navbar';

const PIPELINE = [
  { key: 'applied',      label: 'Applied',      barColor: '#2563EB', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', icon: '📋' },
  { key: 'under_review', label: 'Under Review', barColor: '#D97706', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', icon: '🔍' },
  { key: 'shortlisted',  label: 'Shortlisted',  barColor: '#4F46E5', bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', icon: '⭐' },
  { key: 'selected',     label: 'Selected',     barColor: '#16A34A', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', icon: '🎉' },
  { key: 'rejected',     label: 'Rejected',     barColor: '#DC2626', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', icon: '❌' },
];

export default function RecruiterTracker() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/dashboard'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getRecruiterStats();
      setStats(res.data);
    } catch {
      setMessage('Failed to load stats.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const breakdown = stats?.status_breakdown || {};
  const total     = stats?.total_applicants || 0;

  const cardStyle = {
    background: '#FFFFFF', borderRadius: '14px',
    border: '1px solid #E2E8F0', padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(37,99,235,0.04)',
  };
  const secTitle = {
    fontSize: '0.7rem', fontWeight: '700', color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Recruitment Dashboard</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Overview of all your placement activities</p>
        </div>

        {message && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            {message}
          </div>
        )}

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Jobs',       value: stats?.total_jobs,       icon: '💼', bg: '#F8FAFC', color: '#1E293B', border: '#E2E8F0' },
            { label: 'Active Jobs',      value: stats?.active_jobs,      icon: '🟢', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
            { label: 'Total Applicants', value: stats?.total_applicants, icon: '👥', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
            { label: 'Selected',         value: stats?.selected,         icon: '🎉', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: '12px', border: `1px solid ${s.border}`, padding: '1.25rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(37,99,235,0.04)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{s.icon}</div>
              <p style={{ fontSize: '1.75rem', fontWeight: '800', color: s.color, marginBottom: '2px' }}>{s.value ?? 0}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pipeline Overview */}
        {total > 0 && (
          <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>
            <p style={secTitle}>Applicant Pipeline</p>

            {/* Segmented bar */}
            <div style={{ display: 'flex', borderRadius: '99px', overflow: 'hidden', height: '12px', marginBottom: '1rem', background: '#F1F5F9' }}>
              {PIPELINE.map(p => {
                const count = breakdown[p.key] || 0;
                const pct   = total > 0 ? (count / total) * 100 : 0;
                return pct > 0 ? (
                  <div key={p.key}
                    style={{ width: `${pct}%`, background: p.barColor, transition: 'width 0.5s' }}
                    title={`${p.label}: ${count}`}
                  />
                ) : null;
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {PIPELINE.map(p => (
                <div key={p.key} style={{ background: p.bg, borderRadius: '10px', border: `1px solid ${p.border}`, padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '800', color: p.color }}>{breakdown[p.key] || 0}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-Job Breakdown */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ ...secTitle, marginBottom: 0 }}>Per Job Breakdown</p>
            <button onClick={() => navigate('/jobs/post')}
              style={{ fontSize: '0.8rem', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 6px rgba(37,99,235,0.2)' }}>
              + Post New Job
            </button>
          </div>

          {!stats?.job_breakdown?.length ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💼</div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.25rem' }}>No jobs posted yet</p>
              <button onClick={() => navigate('/jobs/post')}
                style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
                Post Your First Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.job_breakdown.map(job => {
                const jobTotal = job.total || 0;
                return (
                  <div key={job.job_id}
                    style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '1.1rem 1.25rem', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: jobTotal > 0 ? '0.75rem' : '0' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontWeight: '700', color: '#1E293B', fontSize: '0.925rem' }}>{job.job_title}</h3>
                          <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.55rem', borderRadius: '20px',
                            background: job.is_active ? '#F0FDF4' : '#F8FAFC',
                            color:      job.is_active ? '#16A34A' : '#64748B',
                            border:     `1px solid ${job.is_active ? '#BBF7D0' : '#E2E8F0'}` }}>
                            {job.is_active ? '🟢 Active' : '⚫ Inactive'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '2px' }}>
                          {jobTotal} total applicant{jobTotal !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button onClick={() => navigate(`/jobs/applicants/${job.job_id}`)}
                        style={{ fontSize: '0.8rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                        Manage →
                      </button>
                    </div>

                    {jobTotal > 0 ? (
                      <>
                        {/* Mini pipeline bar */}
                        <div style={{ display: 'flex', borderRadius: '99px', overflow: 'hidden', height: '6px', marginBottom: '0.6rem', background: '#F1F5F9' }}>
                          {[
                            { key: 'shortlisted', color: '#4F46E5' },
                            { key: 'selected',    color: '#16A34A' },
                            { key: 'rejected',    color: '#DC2626' },
                          ].map(p => {
                            const cnt = job[p.key] || 0;
                            const pct = jobTotal > 0 ? (cnt / jobTotal) * 100 : 0;
                            return pct > 0 ? (
                              <div key={p.key} style={{ width: `${pct}%`, background: p.color }} />
                            ) : null;
                          })}
                        </div>

                        {/* Mini stats */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          {[
                            { icon: '⭐', label: 'Shortlisted', val: job.shortlisted, color: '#4F46E5' },
                            { icon: '🎉', label: 'Selected',    val: job.selected,    color: '#16A34A' },
                            { icon: '❌', label: 'Rejected',    val: job.rejected,    color: '#DC2626' },
                            { icon: '📋', label: 'Others',      val: jobTotal - job.shortlisted - job.selected - job.rejected, color: '#64748B' },
                          ].map(s => (
                            <span key={s.label} style={{ fontSize: '0.775rem', color: '#64748B' }}>
                              {s.icon} {s.label}:{' '}
                              <strong style={{ color: s.color }}>{s.val}</strong>
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No applications yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
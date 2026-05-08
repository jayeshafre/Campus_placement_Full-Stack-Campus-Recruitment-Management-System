import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications, withdrawApplication } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const STATUS_CONFIG = {
  applied:      { label: 'Applied',      tw: 'bg-blue-50    text-primary     border-blue-200',    icon: '📋' },
  under_review: { label: 'Under Review', tw: 'bg-yellow-50  text-yellow-700  border-yellow-200',  icon: '🔍' },
  shortlisted:  { label: 'Shortlisted',  tw: 'bg-indigo-50  text-secondary   border-indigo-200',  icon: '⭐' },
  selected:     { label: 'Selected',     tw: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🎉' },
  rejected:     { label: 'Rejected',     tw: 'bg-red-50     text-red-600     border-red-200',     icon: '❌' },
  withdrawn:    { label: 'Withdrawn',    tw: 'bg-slate-100  text-textMuted   border-slate-200',   icon: '↩️' },
};

const JOB_TYPE_LABELS = {
  full_time: 'Full Time', internship: 'Internship',
  part_time: 'Part Time', contract: 'Contract',
};

export default function MyApplications() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/dashboard'); return; }
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await getMyApplications();
      setApps(res.data.applications);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load applications.' });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await withdrawApplication(appId);
      setApps(apps.filter(a => a.id !== appId));
      setMessage({ type: 'success', text: '✅ Application withdrawn.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Cannot withdraw this application.' });
    }
  };

  const filtered = filter ? apps.filter(a => a.status === filter) : apps;

  const stats = {
    total:       apps.length,
    pending:     apps.filter(a => ['applied', 'under_review'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    selected:    apps.filter(a => a.status === 'selected').length,
  };

  const FILTER_TABS = [
    { key: '',             label: 'All'          },
    { key: 'applied',      label: 'Applied'      },
    { key: 'under_review', label: 'Under Review' },
    { key: 'shortlisted',  label: 'Shortlisted'  },
    { key: 'selected',     label: 'Selected'     },
    { key: 'rejected',     label: 'Rejected'     },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-textDark mb-6">My Applications</h1>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: stats.total,       tw: 'bg-background  text-textDark    border-slate-200'    },
            { label: 'Pending',       value: stats.pending,     tw: 'bg-blue-50     text-primary     border-blue-200'     },
            { label: 'Shortlisted',   value: stats.shortlisted, tw: 'bg-indigo-50   text-secondary   border-indigo-200'   },
            { label: 'Selected',      value: stats.selected,    tw: 'bg-emerald-50  text-emerald-700 border-emerald-200'  },
          ].map(s => (
            <div key={s.label}
              className={`rounded-2xl border p-4 text-center shadow-sm ${s.tw}`}>
              <p className="text-3xl font-extrabold mb-0.5">{s.value}</p>
              <p className="text-xs text-textMuted font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Flash message ── */}
        {message.text && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border
                          cursor-pointer transition ${
                filter === t.key
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-textMuted border-slate-200 hover:border-primary/40'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-slate-100
                          p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-base font-semibold text-textDark mb-1.5">
              No applications yet
            </h3>
            <p className="text-textMuted text-sm mb-6">
              Browse jobs and apply to get started!
            </p>
            <button onClick={() => navigate('/jobs')}
              className="bg-primary hover:bg-secondary text-white border-none
                         px-6 py-2.5 rounded-xl text-sm font-semibold
                         cursor-pointer shadow-sm transition">
              Browse Jobs →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(app => {
              const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG['applied'];
              const canWithdraw = !['selected', 'rejected', 'withdrawn'].includes(app.status);
              return (
                <div key={app.id}
                  className="bg-surface rounded-2xl border border-slate-100
                             px-6 py-5 shadow-sm hover:shadow-md
                             hover:border-primary/30 transition">

                  <div className="flex justify-between items-start flex-wrap gap-2.5">

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-textDark text-sm mb-0.5">
                        {app.job_title}
                      </h3>
                      <p className="text-sm text-textMuted">
                        {app.company_name} · {app.location}
                      </p>
                      {app.applied_at && (
                        <p className="text-xs text-slate-400 mt-1">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Status + withdraw */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full
                                        border whitespace-nowrap ${sc.tw}`}>
                        {sc.icon} {sc.label}
                      </span>
                      {canWithdraw && (
                        <button onClick={() => handleWithdraw(app.id)}
                          className="text-xs text-slate-400 hover:text-red-500
                                     bg-transparent border-none cursor-pointer
                                     underline transition">
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cover letter preview */}
                  {app.cover_letter && (
                    <div className="mt-3 px-3 py-2.5 bg-background rounded-xl
                                    border border-slate-100">
                      <p className="text-xs text-textMuted leading-relaxed
                                    line-clamp-2 italic">
                        "{app.cover_letter}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
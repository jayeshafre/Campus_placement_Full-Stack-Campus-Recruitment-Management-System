import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getJobApplicants,
  updateAppStatus,
  bulkUpdateStatus
} from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const STATUS_OPTIONS = [
  { value: 'applied',      label: 'Applied',      color: 'bg-blue-50 text-blue-700 border-blue-100'       },
  { value: 'under_review', label: 'Under Review', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  { value: 'shortlisted',  label: 'Shortlisted',  color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { value: 'selected',     label: 'Selected',     color: 'bg-emerald-50 text-emerald-700 border-emerald-100'},
  { value: 'rejected',     label: 'Rejected',     color: 'bg-red-50 text-red-600 border-red-100'          },
];

const STAT_ICONS = {
  applied:      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  under_review: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
  shortlisted:  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  selected:     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  rejected:     <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

export default function JobApplicants() {
  const { job_id }  = useParams();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [applicants,   setApplicants]   = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [jobTitle,     setJobTitle]     = useState('');
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected,     setSelected]     = useState([]);
  const [bulkStatus,   setBulkStatus]   = useState('shortlisted');
  const [message,      setMessage]      = useState({ type: '', text: '' });
  const [updating,     setUpdating]     = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/dashboard'); return; }
    fetchApplicants();
  }, [job_id]);

  useEffect(() => {
    if (statusFilter) {
      setFiltered(applicants.filter(a => a.status === statusFilter));
    } else {
      setFiltered(applicants);
    }
    setSelected([]);
  }, [statusFilter, applicants]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await getJobApplicants(job_id);
      setApplicants(res.data.applicants);
      setFiltered(res.data.applicants);
      setJobTitle(res.data.job_title);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load applicants.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await updateAppStatus(appId, { status: newStatus });
      setApplicants(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
      setMessage({ type: 'success', text: `Status updated to "${newStatus}".` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    } finally {
      setUpdating(null);
    }
  };

  const handleBulkUpdate = async () => {
    if (selected.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one applicant.' });
      return;
    }
    if (!window.confirm(`Update ${selected.length} applicant(s) to "${bulkStatus}"?`)) return;
    try {
      await bulkUpdateStatus({ application_ids: selected, status: bulkStatus });
      setApplicants(prev =>
        prev.map(a => selected.includes(a.id) ? { ...a, status: bulkStatus } : a)
      );
      setSelected([]);
      setMessage({ type: 'success', text: `${selected.length} applicant(s) updated to "${bulkStatus}".` });
    } catch {
      setMessage({ type: 'error', text: 'Bulk update failed.' });
    }
  };

  const toggleSelect    = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleSelectAll = ()   => setSelected(selected.length === filtered.length ? [] : filtered.map(a => a.id));

  const stats = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = applicants.filter(a => a.status === s.value).length;
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-textMuted text-sm font-medium">Loading applicants…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-1">Applicants for</p>
          <h1 className="text-2xl font-bold text-textDark">{jobTitle}</h1>
          <p className="text-textMuted text-sm mt-1">
            {applicants.length} total applicant{applicants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {STATUS_OPTIONS.map(s => (
            <button key={s.value}
              onClick={() => setStatusFilter(statusFilter === s.value ? '' : s.value)}
              className={`rounded-xl p-4 text-center border transition-all duration-150 bg-white hover:shadow-sm ${
                statusFilter === s.value
                  ? 'ring-2 ring-primary border-primary shadow-sm'
                  : 'border-slate-200 hover:border-primary'
              }`}>
              <div className="flex justify-center mb-2">
                <svg className={`w-5 h-5 ${statusFilter === s.value ? 'text-primary' : 'text-textMuted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  {STAT_ICONS[s.value]}
                </svg>
              </div>
              <p className="text-xl font-bold text-textDark">{stats[s.value] || 0}</p>
              <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full border inline-block ${s.color}`}>
                {s.label}
              </p>
            </button>
          ))}
        </div>

        {/* Flash message */}
        {message.text && (
          <div className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.type === 'success'
              ? <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              : <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            }
            {message.text}
          </div>
        )}

        {/* ── Bulk Action Bar ── */}
        {filtered.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-textDark select-none">
              <input
                type="checkbox"
                checked={selected.length === filtered.length && filtered.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-primary rounded"
              />
              Select All ({filtered.length})
            </label>

            {selected.length > 0 && (
              <>
                <span className="text-xs bg-blue-50 text-primary font-semibold px-3 py-1 rounded-full border border-blue-100">
                  {selected.length} selected
                </span>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <span className="text-xs text-textMuted font-medium">Move to:</span>
                  <select
                    value={bulkStatus}
                    onChange={e => setBulkStatus(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-textDark bg-white"
                  >
                    {STATUS_OPTIONS.slice(1).map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkUpdate}
                    className="bg-primary hover:bg-secondary text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    Apply to {selected.length}
                  </button>
                </div>
              </>
            )}

            {/* Status filter tabs */}
            <div className={`flex gap-1.5 flex-wrap ${selected.length > 0 ? '' : 'ml-auto'}`}>
              {['', ...STATUS_OPTIONS.map(s => s.value)].map(s => (
                <button key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    statusFilter === s
                      ? 'bg-primary text-white border-primary'
                      : 'bg-slate-50 text-textMuted border-slate-200 hover:border-primary hover:text-primary'
                  }`}>
                  {s === '' ? 'All' : STATUS_OPTIONS.find(o => o.value === s)?.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Applicants List ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-textDark mb-1">No applicants found</h3>
            <p className="text-textMuted text-sm">
              {statusFilter
                ? `No applicants with "${statusFilter}" status.`
                : 'No one has applied to this job yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => (
              <ApplicantRow
                key={app.id}
                app={app}
                isSelected={selected.includes(app.id)}
                onToggle={() => toggleSelect(app.id)}
                onStatusChange={handleStatusChange}
                isUpdating={updating === app.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Single Applicant Row ── */
function ApplicantRow({ app, isSelected, onToggle, onStatusChange, isUpdating }) {
  const [expanded,    setExpanded]    = useState(false);
  const [notes,       setNotes]       = useState(app.recruiter_notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const { updateAppStatus } = { updateAppStatus: require('../api/auth').updateAppStatus };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateAppStatus(app.id, { status: app.status, recruiter_notes: notes });
    } catch {}
    finally { setSavingNotes(false); }
  };

  const skills = app.skills
    ? app.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const statusConfig = {
    applied:      { color: 'bg-blue-50 text-blue-700',          label: 'Applied'      },
    under_review: { color: 'bg-yellow-50 text-yellow-700',      label: 'Under Review' },
    shortlisted:  { color: 'bg-indigo-50 text-indigo-700',      label: 'Shortlisted'  },
    selected:     { color: 'bg-emerald-50 text-emerald-700',    label: 'Selected'     },
    rejected:     { color: 'bg-red-50 text-red-600',            label: 'Rejected'     },
  };
  const sc = statusConfig[app.status] || statusConfig['applied'];

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-all duration-150 ${
      isSelected ? 'border-primary ring-1 ring-blue-100' : 'border-slate-200'
    }`}>

      {/* Main row */}
      <div className="flex items-center gap-4 p-4">

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 accent-primary flex-shrink-0 rounded cursor-pointer"
        />

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100">
          {app.student_photo
            ? <img src={app.student_photo} alt="" className="w-full h-full object-cover" />
            : <span className="font-bold text-primary text-sm">
                {app.student_name?.[0]?.toUpperCase()}
              </span>}
        </div>

        {/* Student info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-textDark text-sm">{app.student_name}</h4>
          <p className="text-xs text-textMuted">{app.student_email}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {app.branch && (
              <span className="text-xs bg-slate-100 text-textMuted font-medium px-2 py-0.5 rounded-full uppercase">
                {app.branch}
              </span>
            )}
            {app.cgpa && (
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                CGPA {app.cgpa}
              </span>
            )}
            <span className="text-xs text-textMuted">
              Applied {new Date(app.applied_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Skills preview */}
        <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
          {skills.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full font-medium border border-blue-100">
              {s}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-textMuted">+{skills.length - 3}</span>
          )}
        </div>

        {/* Status dropdown */}
        <div className="flex-shrink-0">
          {isUpdating ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <select
              value={app.status}
              onChange={e => onStatusChange(app.id, e.target.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer outline-none focus:ring-2 focus:ring-primary transition-colors ${sc.color}`}
            >
              {[
                { value: 'applied',      label: 'Applied'      },
                { value: 'under_review', label: 'Under Review' },
                { value: 'shortlisted',  label: 'Shortlisted'  },
                { value: 'selected',     label: 'Selected'     },
                { value: 'rejected',     label: 'Rejected'     },
              ].map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Resume + Expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {app.resume && (
            <a href={app.resume} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-emerald-100">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-textMuted hover:text-textDark font-medium transition-colors px-2 py-1.5"
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>

      {/* ── Expanded section ── */}
      {expanded && (
        <div className="px-14 pb-5 pt-3 border-t border-slate-100 space-y-4">

          {/* Cover letter */}
          {app.cover_letter && (
            <div>
              <p className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">Cover Letter</p>
              <p className="text-sm text-textDark bg-slate-50 rounded-lg p-3 leading-relaxed border border-slate-100 italic">
                "{app.cover_letter}"
              </p>
            </div>
          )}

          {/* All skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">All Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span key={s} className="text-xs bg-blue-50 text-primary font-medium px-2.5 py-1 rounded-full border border-blue-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter notes */}
          <div>
            <p className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">
              Private Notes <span className="normal-case font-normal">(only you can see this)</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Add notes about this candidate…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-textDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder-slate-400 transition"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-1.5 flex items-center gap-1.5 text-xs text-primary hover:text-secondary font-semibold disabled:opacity-50 transition-colors"
            >
              {savingNotes ? (
                <>
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Notes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
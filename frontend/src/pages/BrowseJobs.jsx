import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableJobs } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const JOB_TYPE_STYLES = {
  full_time:  { bg: 'bg-blue-50',   text: 'text-primary',        border: 'border-blue-100',   label: 'Full Time'   },
  internship: { bg: 'bg-amber-50',  text: 'text-amber-700',      border: 'border-amber-100',  label: 'Internship'  },
  part_time:  { bg: 'bg-indigo-50', text: 'text-secondary',      border: 'border-indigo-100', label: 'Part Time'   },
  contract:   { bg: 'bg-slate-50',  text: 'text-textMuted',      border: 'border-slate-200',  label: 'Contract'    },
};

export default function BrowseJobs() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [jobs,       setJobs]       = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [message,    setMessage]    = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/dashboard'); return; }
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company_name?.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    if (typeFilter) result = result.filter(j => j.job_type === typeFilter);
    setFiltered(result);
  }, [search, typeFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await getAvailableJobs();
      setJobs(res.data.jobs);
      setFiltered(res.data.jobs);
    } catch {
      setMessage('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-textMuted text-sm font-medium">Finding jobs for you…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-textDark">Available Jobs</h1>
          <p className="text-textMuted text-sm mt-1">
            Showing{' '}
            <span className="font-bold text-primary">{filtered.length}</span>
            {' '}job{filtered.length !== 1 ? 's' : ''} matching your profile
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, company, location…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm text-textDark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm text-textDark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="internship">Internship</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Error message */}
        {message && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {message}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-textDark mb-1">No jobs found</h3>
            <p className="text-textMuted text-sm">
              {jobs.length === 0 ? 'No jobs are available right now. Check back soon!' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(job => {
              const ts = JOB_TYPE_STYLES[job.job_type] || JOB_TYPE_STYLES.contract;
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  ts={ts}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Job Card ── */
function JobCard({ job, ts, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-xl border cursor-pointer transition-all duration-200 p-6 ${
        hovered ? 'border-primary shadow-md' : 'border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">

        {/* Company logo */}
        <div className="w-13 h-13 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0" style={{width:'3.25rem',height:'3.25rem'}}>
          {job.company_logo
            ? <img src={job.company_logo} alt="logo" className="w-full h-full object-contain p-1" />
            : <svg className="w-6 h-6 text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-textDark leading-tight">{job.title}</h3>
              <p className="text-sm text-textMuted font-medium mt-0.5">
                {job.company_name || 'Company'}
                <span className="mx-1.5 text-slate-300">·</span>
                {job.location}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${ts.bg} ${ts.text} ${ts.border}`}>
              {ts.label}
            </span>
          </div>

          <p className="text-sm text-textMuted mt-2 leading-relaxed line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-textMuted">
            {job.package_lpa && (
              <span className="flex items-center gap-1.5 font-bold text-success">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.package_lpa} LPA
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.vacancy_count} vacanc{job.vacancy_count > 1 ? 'ies' : 'y'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              CGPA ≥ {job.min_cgpa}
            </span>
            {job.last_date_to_apply && (
              <span className="flex items-center gap-1.5 text-error font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Apply by {new Date(job.last_date_to_apply).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-textMuted">
          Posted {new Date(job.created_at).toLocaleDateString()}
        </p>
        <span className={`text-sm font-semibold transition-colors ${hovered ? 'text-secondary' : 'text-primary'}`}>
          View Details →
        </span>
      </div>
    </div>
  );
}
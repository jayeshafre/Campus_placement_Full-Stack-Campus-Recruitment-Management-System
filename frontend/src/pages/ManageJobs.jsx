import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyJobs, deleteJob, updateJob } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const JOB_TYPE_LABELS = {
  full_time: 'Full Time', internship: 'Internship',
  part_time: 'Part Time', contract: 'Contract',
};

export default function ManageJobs() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/dashboard'); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data.jobs);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load jobs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await updateJob(job.id, { is_active: !job.is_active });
      setJobs(jobs.map(j => j.id === job.id
        ? { ...j, is_active: !j.is_active } : j));
    } catch {
      setMessage({ type: 'error', text: 'Failed to update job status.' });
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      setMessage({ type: 'success', text: '✅ Job deleted.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete job.' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent
                        rounded-full animate-spin mx-auto mb-3" />
        <p className="text-textMuted text-sm">Loading jobs...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-textDark">My Job Postings</h1>
            <p className="text-textMuted text-sm mt-0.5">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </p>
          </div>
        </div>

        {/* ── Flash message ── */}
        {message.text && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>{message.text}</div>
        )}

        {/* ── Empty state ── */}
        {jobs.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-sm border border-slate-100
                          p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-textDark mb-2">
              No jobs posted yet
            </h3>
            <p className="text-textMuted text-sm mb-6">
              Post your first job to start receiving applications from students.
            </p>
            <button onClick={() => navigate('/jobs/post')}
              className="bg-primary hover:bg-secondary text-white px-6 py-2.5
                         rounded-xl text-sm font-semibold transition shadow-sm
                         border-none cursor-pointer">
              + Post First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id}
                className="bg-surface rounded-2xl shadow-sm border border-slate-100
                           p-6 hover:shadow-md hover:border-primary/30 transition">

                <div className="flex justify-between items-start">
                  <div className="flex-1">

                    {/* Title + badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-textDark">
                        {job.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-1
                                        rounded-full border ${
                        job.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-textMuted border-slate-200'
                      }`}>
                        {job.is_active ? '🟢 Active' : '⚫ Inactive'}
                      </span>
                      <span className="text-xs bg-blue-50 text-primary border
                                       border-blue-200 font-semibold px-2.5
                                       py-1 rounded-full">
                        {JOB_TYPE_LABELS[job.job_type]}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-textMuted">
                      <span>📍 {job.location}</span>
                      {job.package_lpa && (
                        <span className="text-emerald-600 font-semibold">
                          💰 {job.package_lpa} LPA
                        </span>
                      )}
                      <span>👥 {job.vacancy_count} vacanc{job.vacancy_count > 1 ? 'ies' : 'y'}</span>
                      <span>🎓 Min CGPA: {job.min_cgpa}</span>
                      {job.last_date_to_apply && (
                        <span>📅 Deadline: {new Date(job.last_date_to_apply).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Branches */}
                    {job.allowed_branches && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.allowed_branches.split(',').map(b => (
                          <span key={b}
                            className="text-xs bg-blue-50 text-primary border
                                       border-blue-100 font-medium px-2.5
                                       py-0.5 rounded-full uppercase">
                            {b.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Action buttons ── */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => handleToggleActive(job)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg
                                  border-none cursor-pointer transition ${
                        job.is_active
                          ? 'bg-slate-100 hover:bg-slate-200 text-textMuted'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}>
                      {job.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => navigate(`/jobs/applicants/${job.id}`)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                 bg-blue-50 hover:bg-blue-100 text-primary
                                 border-none cursor-pointer transition">
                      View Applicants
                    </button>
                    <button onClick={() => handleDelete(job.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                 bg-red-50 hover:bg-red-100 text-red-600
                                 border-none cursor-pointer transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { getAllStudents }       from '../api/auth';
import { useAuth }             from '../context/AuthContext';
import Navbar from '../components/Navbar';

const BRANCHES = [
  { value: '',           label: 'All Branches' },
  { value: 'BCA',        label: 'Bachelor of Computer Application' },
  { value: 'BBA',        label: 'Business Management' },
  { value: 'cs',         label: 'Computer Science' },
  { value: 'it',         label: 'Information Technology' },
  { value: 'entc',       label: 'Electronics & Telecom' },
  { value: 'mech',       label: 'Mechanical' },
  { value: 'civil',      label: 'Civil' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'other',      label: 'Other' },
];

const BRANCH_LABEL = {
  BCA: 'BCA', BBA: 'BBA',
  cs: 'CS', it: 'IT', entc: 'ENTC',
  mech: 'Mech', civil: 'Civil', electrical: 'Electrical', other: 'Other',
};

const inputClass =
  'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-textDark bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-slate-400';

const labelClass =
  'block text-xs font-semibold text-textMuted uppercase tracking-widest mb-1.5';

export default function BrowseStudents() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [message,   setMessage]   = useState('');

  const [search,        setSearch]        = useState('');
  const [branch,        setBranch]        = useState('');
  const [minCgpa,       setMinCgpa]       = useState('');
  const [maxCgpa,       setMaxCgpa]       = useState('');
  const [skill,         setSkill]         = useState('');
  const [year,          setYear]          = useState('');
  const [backlogFilter, setBacklogFilter] = useState('');

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/dashboard');
      return;
    }
    fetchStudents();
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search)        params.append('search',          search);
    if (branch)        params.append('branch',          branch);
    if (minCgpa)       params.append('min_cgpa',        minCgpa);
    if (maxCgpa)       params.append('max_cgpa',        maxCgpa);
    if (skill)         params.append('skill',           skill);
    if (year)          params.append('year_of_passing', year);
    if (backlogFilter) params.append('active_backlog',
                         backlogFilter === 'yes' ? 'true' : 'false');
    const q = params.toString();
    return q ? `?${q}` : '';
  };

  const fetchStudents = async (query = '') => {
    setLoading(true);
    try {
      const res = await getAllStudents(query);
      setStudents(res.data.students);
    } catch {
      setMessage('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchStudents(buildQuery());

  const handleReset = () => {
    setSearch(''); setBranch(''); setMinCgpa('');
    setMaxCgpa(''); setSkill(''); setYear('');
    setBacklogFilter('');
    fetchStudents('');
  };

  const parseSkills = (skills) =>
    skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-textDark">Browse Students</h1>
          <p className="text-textMuted text-sm mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* ── Filter Panel ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

            <div className="lg:col-span-2">
              <label className={labelClass}>Search by Name</label>
              <input type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFilter()}
                placeholder="e.g. Rahul"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Branch</label>
              <select value={branch} onChange={e => setBranch(e.target.value)}
                className={inputClass}>
                {BRANCHES.map(b =>
                  <option key={b.value} value={b.value}>{b.label}</option>
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>Min CGPA</label>
              <input type="number" value={minCgpa}
                onChange={e => setMinCgpa(e.target.value)}
                placeholder="e.g. 7.0" step="0.1" min="0" max="10"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Skill</label>
              <input type="text" value={skill}
                onChange={e => setSkill(e.target.value)}
                placeholder="e.g. Python"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Passing Year</label>
              <input type="number" value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2025"
                className={inputClass} />
            </div>
          </div>

          {/* Active Backlog row */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className={`${labelClass} mb-0`}>Active Backlog:</span>
            {[
              { val: '',    label: 'All Students'  },
              { val: 'yes', label: 'Has Backlog'   },
              { val: 'no',  label: 'No Backlog'    },
            ].map(opt => (
              <button key={opt.val} type="button"
                onClick={() => setBacklogFilter(opt.val)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-colors ${
                  backlogFilter === opt.val
                    ? 'bg-primary text-white border-primary'
                    : 'bg-slate-50 text-textMuted border-slate-200 hover:border-primary hover:text-primary'
                }`}>
                {opt.val === 'yes' && (
                  <span className="mr-1 text-warning">⚠</span>
                )}
                {opt.val === 'no' && (
                  <span className="mr-1 text-success">✓</span>
                )}
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 text-textMuted border border-slate-200 transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
            <button onClick={handleFilter}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-secondary text-white transition-colors shadow-sm flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {message}
          </div>
        )}

        {/* ── Main Layout: Card Grid + Side Panel ── */}
        <div className={`grid gap-6 ${selected ? 'grid-cols-3' : 'grid-cols-1'}`}>

          {/* Student Grid */}
          <div className={selected ? 'col-span-2' : 'col-span-1'}>
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-textMuted text-sm font-medium">Loading students…</p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-textDark mb-1">No students found</h3>
                <p className="text-textMuted text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isSelected={selected?.id === student.id}
                    onClick={() =>
                      setSelected(selected?.id === student.id ? null : student)
                    }
                    parseSkills={parseSkills}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Side Detail Panel ── */}
          {selected && (
            <div className="col-span-1">
              <StudentDetailPanel
                student={selected}
                onClose={() => setSelected(null)}
                parseSkills={parseSkills}
                navigate={navigate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Student Card Component ── */
function StudentCard({ student, isSelected, onClick, parseSkills }) {
  const skills     = parseSkills(student.skills).slice(0, 3);
  const backlogVal = student.active_backlog;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-primary shadow-md ring-2 ring-blue-100'
          : 'border-slate-200 hover:border-primary'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100">
          {student.profile_photo_url
            ? <img src={student.profile_photo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-base font-bold text-primary">
                {student.full_name?.[0]?.toUpperCase()}
              </span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-textDark truncate text-sm">{student.full_name}</h3>
          <p className="text-xs text-textMuted truncate">{student.email}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {student.branch && (
              <span className="text-xs bg-blue-50 text-primary font-semibold px-2 py-0.5 rounded-full uppercase border border-blue-100">
                {BRANCH_LABEL[student.branch] || student.branch}
              </span>
            )}
            {student.cgpa && (
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                CGPA {student.cgpa}
              </span>
            )}
            {student.year_of_passing && (
              <span className="text-xs text-textMuted">
                Batch {student.year_of_passing}
              </span>
            )}
            {backlogVal === true && (
              <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                ⚠ Backlog
              </span>
            )}
            {backlogVal === false && (
              <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                ✓ No Backlog
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills preview */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.map(s => (
            <span key={s} className="text-xs bg-slate-100 text-textMuted px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
          {parseSkills(student.skills).length > 3 && (
            <span className="text-xs text-textMuted">
              +{parseSkills(student.skills).length - 3} more
            </span>
          )}
        </div>
      )}

      <p className="text-right text-xs text-primary font-semibold mt-3">
        {isSelected ? 'Hide details ↑' : 'View details →'}
      </p>
    </div>
  );
}

/* ── Student Detail Side Panel ── */
function StudentDetailPanel({ student, onClose, parseSkills, navigate }) {
  const skills     = parseSkills(student.skills);
  const backlogVal = student.active_backlog;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)] pb-6">

      {/* Panel header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-textDark text-sm">Student Profile</h3>
        <button onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-textMuted transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Photo + name */}
      <div className="px-5 py-5 text-center border-b border-slate-100">
        <div className="w-18 h-18 rounded-full bg-blue-50 mx-auto mb-3 overflow-hidden flex items-center justify-center border-2 border-blue-100" style={{width:'4.5rem',height:'4.5rem'}}>
          {student.profile_photo_url
            ? <img src={student.profile_photo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold text-primary">
                {student.full_name?.[0]?.toUpperCase()}
              </span>
          }
        </div>
        <h3 className="font-bold text-textDark text-base">{student.full_name}</h3>
        <p className="text-xs text-textMuted mt-0.5">{student.email}</p>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
            <p className="text-base font-bold text-primary">{student.cgpa || '—'}</p>
            <p className="text-xs text-textMuted">CGPA</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
            <p className="text-xs font-bold text-textDark uppercase">{BRANCH_LABEL[student.branch] || student.branch || '—'}</p>
            <p className="text-xs text-textMuted">Branch</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
            <p className="text-base font-bold text-textDark">{student.year_of_passing || '—'}</p>
            <p className="text-xs text-textMuted">Batch</p>
          </div>
        </div>

        {/* Backlog status */}
        <div className="mt-3">
          {backlogVal === true && (
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              ⚠ Has Active Backlog
            </span>
          )}
          {backlogVal === false && (
            <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ No Active Backlog
            </span>
          )}
          {(backlogVal === null || backlogVal === undefined) && (
            <span className="inline-block text-xs text-textMuted italic">
              Backlog status not filled
            </span>
          )}
        </div>
      </div>

      {/* About */}
      {student.about && (
        <div className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">About</h4>
          <p className="text-sm text-textDark leading-relaxed">{student.about}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="px-5 py-4 border-b border-slate-100">
          <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2.5">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(s => (
              <span key={s} className="text-xs bg-blue-50 text-primary font-medium px-2.5 py-1 rounded-full border border-blue-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Links */}
      <div className="px-5 py-4 border-b border-slate-100 space-y-2.5">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">Contact & Links</h4>
        {student.phone && (
          <p className="text-sm text-textDark flex items-center gap-2">
            <svg className="w-4 h-4 text-textMuted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {student.phone}
          </p>
        )}
        {student.linkedin_url && (
          <a href={student.linkedin_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-secondary hover:underline transition-colors">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn Profile
          </a>
        )}
        {student.github_url && (
          <a href={student.github_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm text-textDark hover:text-primary hover:underline transition-colors">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub Profile
          </a>
        )}
      </div>

      {/* Resume */}
      <div className="px-5 py-4">
        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-3">Resume</h4>
        {student.resume_url ? (
          <a href={student.resume_url} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors w-full shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Resume (PDF)
          </a>
        ) : (
          <p className="text-xs text-textMuted italic text-center">No resume uploaded</p>
        )}
      </div>
    </div>
  );
}
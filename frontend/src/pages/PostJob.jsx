import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJob } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const BRANCHES = [
  { value: 'BCA',         label: 'Bachelor of Computer Application' },
  { value: 'cs',          label: 'Computer Science' },
  { value: 'it',          label: 'Information Technology' },
  { value: 'entc',        label: 'Electronics & Telecom' },
  { value: 'mech',        label: 'Mechanical' },
  { value: 'civil',       label: 'Civil' },
  { value: 'electrical',  label: 'Electrical' },
  { value: 'BBA',         label: 'Business Management' },
];

const CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amravati',
  'Amritsar','Aurangabad','Bangalore','Bareilly','Belgaum',
  'Bhilai','Bhopal','Bhubaneswar','Chandigarh','Chennai',
  'Coimbatore','Cuttack','Dehradun','Delhi','Dhanbad',
  'Faridabad','Ghaziabad','Goa','Gorakhpur','Gurgaon',
  'Guwahati','Gwalior','Hubli','Hyderabad','Indore',
  'Jabalpur','Jaipur','Jalandhar','Jammu','Jamshedpur',
  'Jodhpur','Kanpur','Kochi','Kolkata','Kota',
  'Kozhikode','Lucknow','Ludhiana','Madurai','Mangalore',
  'Meerut','Mumbai','Mysore','Nagpur','Nashik',
  'Navi Mumbai','Noida','Patna','Pune','Raipur',
  'Rajkot','Ranchi','Remote','Srinagar','Surat',
  'Thane','Thiruvananthapuram','Tiruchirappalli','Udaipur',
  'Vadodara','Varanasi','Vijayawada','Visakhapatnam','Warangal',
];

const CGPA_CLASSES = [
  { value: '',             label: 'No Minimum (All students eligible)', min_cgpa: '0'  },
  { value: 'third_class',  label: 'Third Class',  min_cgpa: '7.0', desc: 'CGPA > 7.0' },
  { value: 'second_class', label: 'Second Class', min_cgpa: '8.0', desc: 'CGPA > 8.0' },
  { value: 'first_class',  label: 'First Class',  min_cgpa: '9.0', desc: 'CGPA > 9.0' },
  { value: 'distinction',  label: 'Distinction',  min_cgpa: '9.5', desc: 'CGPA > 9.5' },
];

function LocationInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showList,    setShowList]    = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowList(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);
    setHighlighted(-1);
    if (!val.trim()) { setSuggestions([]); setShowList(false); return; }
    const primary   = CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 8);
    const secondary = CITIES.filter(c =>
      !c.toLowerCase().startsWith(val.toLowerCase()) &&
      c.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 4);
    setSuggestions([...primary, ...secondary]);
    setShowList(true);
  };

  const handleSelect = (city) => {
    onChange(city); setSuggestions([]); setShowList(false); setHighlighted(-1);
  };

  const handleKeyDown = (e) => {
    if (!showList || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(p => p < suggestions.length - 1 ? p + 1 : 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(p => p > 0 ? p - 1 : suggestions.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (highlighted >= 0) handleSelect(suggestions[highlighted]); }
    else if (e.key === 'Escape') { setShowList(false); }
  };

  const highlight = (city, query) => {
    const idx = city.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return city;
    return <>{city.slice(0, idx)}<strong style={{ color: '#2563EB' }}>{city.slice(idx, idx + query.length)}</strong>{city.slice(idx + query.length)}</>;
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input type="text" value={value} onChange={handleInput} onKeyDown={handleKeyDown}
        onFocus={() => value && suggestions.length > 0 && setShowList(true)}
        required autoComplete="off"
        placeholder="e.g. Pune / Remote / Bangalore"
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = '#2563EB'; value && suggestions.length > 0 && setShowList(true); }}
        onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
      />
      {showList && suggestions.length > 0 && (
        <ul style={{ position: 'absolute', zIndex: 50, left: 0, right: 0, marginTop: '4px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 4px 16px rgba(37,99,235,0.08)', overflow: 'hidden', maxHeight: '220px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
          {suggestions.map((city, idx) => (
            <li key={city} onMouseDown={() => handleSelect(city)} onMouseEnter={() => setHighlighted(idx)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.875rem', background: highlighted === idx ? '#EFF6FF' : '#FFFFFF', color: highlighted === idx ? '#1D4ED8' : '#374151' }}>
              <span style={{ color: '#94A3B8' }}>📍</span>
              <span>{highlight(city, value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '8px',
  padding: '0.6rem 0.85rem', fontSize: '0.875rem', outline: 'none',
  background: '#F8FAFC', color: '#1E293B', boxSizing: 'border-box', transition: 'border-color 0.2s'
};

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: '600',
  color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem'
};

export default function PostJob() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', responsibilities: '',
    requirements: '', job_type: 'full_time', location: '',
    package_lpa: '', min_cgpa: '0', vacancy_count: '1',
    last_date_to_apply: '', allowed_branches: [],
    allow_backlog: '',
  });

  const [cgpaClass, setCgpaClass] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [message,   setMessage]   = useState({ type: '', text: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCgpaClassSelect = (cls) => {
    setCgpaClass(cls.value);
    setForm(prev => ({ ...prev, min_cgpa: cls.min_cgpa }));
  };

  const toggleBranch = (val) => {
    const cur = form.allowed_branches;
    setForm({ ...form, allowed_branches: cur.includes(val) ? cur.filter(b => b !== val) : [...cur, val] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { ...form, allowed_branches: form.allowed_branches.join(',') };
      await postJob(payload);
      setMessage({ type: 'success', text: '✅ Job posted successfully!' });
      setTimeout(() => navigate('/jobs/manage'), 1500);
    } catch (err) {
      const d = err.response?.data;
      const msg = d?.title?.[0] || d?.min_cgpa?.[0] || d?.vacancy_count?.[0] || d?.error || 'Failed to post job.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const selectedClass = CGPA_CLASSES.find(c => c.value === cgpaClass);

  const sectionStyle = {
    background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0',
    padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(37,99,235,0.04)'
  };
  const sectionTitle = {
    fontSize: '0.75rem', fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <Navbar />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '0.25rem' }}>Post a New Job</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Fill in the details below. Students matching your criteria will see this job.</p>
        </div>

        {message.text && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500', background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2', color: message.type === 'success' ? '#16A34A' : '#DC2626', border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}` }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Basic Information</p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Job Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. Software Engineer, Data Analyst" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Job Type *</label>
                <select name="job_type" value={form.job_type} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'}>
                  <option value="full_time">Full Time</option>
                  <option value="internship">Internship</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location *</label>
                <LocationInput value={form.location} onChange={(val) => setForm({ ...form, location: val })} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Job Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                placeholder="Describe the role, the team, and what the candidate will be working on..."
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Responsibilities</label>
              <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={3}
                placeholder="List the key day-to-day responsibilities..."
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>

            <div>
              <label style={labelStyle}>Requirements</label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3}
                placeholder="List required skills, technologies, soft skills..."
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>
          </div>

          {/* Compensation */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Compensation & Vacancies</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Package (LPA)</label>
                <input type="number" name="package_lpa" value={form.package_lpa} onChange={handleChange}
                  step="0.1" min="0" placeholder="e.g. 6.5" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div>
                <label style={labelStyle}>No. of Vacancies *</label>
                <input type="number" name="vacancy_count" value={form.vacancy_count} onChange={handleChange}
                  required min="1" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div>
                <label style={labelStyle}>Last Date to Apply</label>
                <input type="date" name="last_date_to_apply" value={form.last_date_to_apply} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Eligibility Criteria</p>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1.25rem', marginTop: '-0.5rem' }}>Only students meeting these criteria will see this job posting.</p>

            {/* CGPA */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>CGPA Requirement</label>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>Select the minimum academic class required for this job.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CGPA_CLASSES.map(cls => (
                  <button key={cls.value} type="button" onClick={() => handleCgpaClassSelect(cls)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem', borderRadius: '10px', border: '2px solid',
                      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                      borderColor: cgpaClass === cls.value ? '#2563EB' : '#E2E8F0',
                      background: cgpaClass === cls.value ? '#EFF6FF' : '#F8FAFC',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${cgpaClass === cls.value ? '#2563EB' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {cgpaClass === cls.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />}
                      </div>
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '0.875rem', color: cgpaClass === cls.value ? '#1D4ED8' : '#374151' }}>
                          {cls.value === '' ? '🔓 No Minimum'
                            : cls.value === 'third_class'  ? '🥉 Third Class'
                            : cls.value === 'second_class' ? '🥈 Second Class'
                            : cls.value === 'first_class'  ? '🥇 First Class'
                            : '🏅 Distinction'}
                        </span>
                        {cls.desc && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#94A3B8' }}>({cls.desc})</span>}
                      </div>
                    </div>
                    {cls.value !== '' && (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '600', background: cgpaClass === cls.value ? '#DBEAFE' : '#F1F5F9', color: cgpaClass === cls.value ? '#1D4ED8' : '#64748B' }}>
                        Min CGPA: {cls.min_cgpa}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {selectedClass && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500', background: selectedClass.value === '' ? '#F8FAFC' : '#EFF6FF', color: selectedClass.value === '' ? '#64748B' : '#1D4ED8', border: `1px solid ${selectedClass.value === '' ? '#E2E8F0' : '#BFDBFE'}` }}>
                  {selectedClass.value === ''
                    ? '🔓 All students are eligible regardless of CGPA.'
                    : `✅ Only students with CGPA > ${selectedClass.min_cgpa} (${selectedClass.label}) can apply.`}
                </div>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                <label style={labelStyle}>Or enter exact Min CGPA manually</label>
                <input type="number" name="min_cgpa" value={form.min_cgpa}
                  onChange={e => { handleChange(e); setCgpaClass(''); }}
                  step="0.1" min="0" max="10" placeholder="e.g. 7.5" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563EB'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Manually entering a value will clear the class selection above.</p>
              </div>
            </div>

            {/* Backlog */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Allow Students with Active Backlog?</label>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>Choose whether students with an active backlog can apply.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ val: 'true', label: '⚠️ Yes, allowed', activeColor: '#F59E0B' }, { val: 'false', label: '✅ No backlog only', activeColor: '#16A34A' }].map(b => (
                  <button key={b.val} type="button" onClick={() => setForm({ ...form, allow_backlog: b.val })}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', border: '2px solid', transition: 'all 0.15s',
                      borderColor: form.allow_backlog === b.val ? b.activeColor : '#E2E8F0',
                      background: form.allow_backlog === b.val ? (b.val === 'true' ? '#FFFBEB' : '#F0FDF4') : '#F8FAFC',
                      color: form.allow_backlog === b.val ? b.activeColor : '#64748B' }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Branches */}
            <div>
              <label style={labelStyle}>Allowed Branches</label>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>Leave all unchecked = all branches allowed.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {BRANCHES.map(b => (
                  <label key={b.value}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s',
                      borderColor: form.allowed_branches.includes(b.value) ? '#2563EB' : '#E2E8F0',
                      background: form.allowed_branches.includes(b.value) ? '#EFF6FF' : '#F8FAFC',
                      color: form.allowed_branches.includes(b.value) ? '#1D4ED8' : '#475569',
                      fontWeight: form.allowed_branches.includes(b.value) ? '600' : '400' }}>
                    <input type="checkbox" style={{ display: 'none' }}
                      checked={form.allowed_branches.includes(b.value)}
                      onChange={() => toggleBranch(b.value)} />
                    <span style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0,
                      borderColor: form.allowed_branches.includes(b.value) ? '#2563EB' : '#CBD5E1',
                      background: form.allowed_branches.includes(b.value) ? '#2563EB' : 'transparent',
                      color: '#FFFFFF' }}>
                      {form.allowed_branches.includes(b.value) && '✓'}
                    </span>
                    {b.label}
                  </label>
                ))}
              </div>
              {form.allowed_branches.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: '500', marginTop: '8px' }}>✅ All branches are eligible</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/jobs/manage')}
              style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', background: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ padding: '0.65rem 2rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', background: saving ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: '#FFFFFF', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
              {saving ? 'Posting...' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
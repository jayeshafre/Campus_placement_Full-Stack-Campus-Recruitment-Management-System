import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecruiterProfile, updateRecruiterProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const INDUSTRIES = [
  { value: 'it',         label: 'Information Technology' },
  { value: 'finance',    label: 'Finance & Banking' },
  { value: 'core',       label: 'Core Engineering' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'ecommerce',  label: 'E-Commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education',  label: 'Education' },
  { value: 'other',      label: 'Other' },
];

const SIZES = [
  { value: 'startup', label: 'Startup (1–50)' },
  { value: 'small',   label: 'Small (51–200)' },
  { value: 'medium',  label: 'Medium (201–1000)' },
  { value: 'large',   label: 'Large (1001–5000)' },
  { value: 'mnc',     label: 'MNC (5000+)' },
];

const inputClass =
  'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-textDark bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-slate-400';

const labelClass =
  'block text-xs font-semibold text-textMuted uppercase tracking-wide mb-1.5';

export default function RecruiterProfile() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const logoRef   = useRef();

  const [profile,  setProfile]  = useState(null);
  const [editing,  setEditing]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [message,  setMessage]  = useState({ type: '', text: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    company_name: '', company_website: '', industry: '',
    company_size: '', designation: '', phone: '',
    company_description: '', city: '', state: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/dashboard'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getRecruiterProfile();
      setProfile(res.data);
      setForm({
        company_name:        res.data.company_name        || '',
        company_website:     res.data.company_website     || '',
        industry:            res.data.industry            || '',
        company_size:        res.data.company_size        || '',
        designation:         res.data.designation         || '',
        phone:               res.data.phone               || '',
        company_description: res.data.company_description || '',
        city:                res.data.city                || '',
        state:               res.data.state               || '',
      });
    } catch {
      setMessage({ type: 'error', text: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (logoFile) fd.append('company_logo', logoFile);
      const res = await updateRecruiterProfile(fd);
      setProfile(res.data.profile);
      setEditing(false);
      setMessage({ type: 'success', text: 'Company profile saved successfully!' });
    } catch (err) {
      const d = err.response?.data;
      const msg = d?.phone?.[0] || d?.company_name?.[0] || 'Failed to save.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  // Profile completion
  const completionFields = ['company_name','industry','company_size','designation','phone','company_description','city'];
  const filled     = completionFields.filter(f => form[f]).length;
  const completion = Math.round((filled / completionFields.length) * 100);

  const industryLabel = INDUSTRIES.find(i => i.value === form.industry)?.label;
  const sizeLabel     = SIZES.find(s => s.value === form.company_size)?.label;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-11 h-11 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-textMuted text-sm font-medium">Loading company profile…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">

              {/* Logo */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-blue-50 mx-auto ring-4 ring-slate-100 flex items-center justify-center">
                  {(logoPreview || profile?.company_logo) ? (
                    <img
                      src={logoPreview || `http://localhost:8000${profile.company_logo}`}
                      alt="Company Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-primary opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                {editing && (
                  <button
                    onClick={() => logoRef.current.click()}
                    className="absolute bottom-0 right-0 bg-primary hover:bg-secondary text-white w-7 h-7 rounded-full text-xs flex items-center justify-center shadow-md transition-colors"
                    title="Upload logo"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input ref={logoRef} type="file" accept="image/*"
                  onChange={handleLogoChange} className="hidden" />
              </div>

              <h2 className="text-lg font-bold text-textDark leading-tight">
                {form.company_name || 'Your Company'}
              </h2>
              <p className="text-textMuted text-xs mt-1">{user?.email}</p>

              {form.designation && (
                <p className="text-sm text-textDark mt-1.5 font-medium">{form.designation}</p>
              )}

              {industryLabel && (
                <span className="inline-block mt-2.5 bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                  {industryLabel}
                </span>
              )}

              {sizeLabel && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-sm font-bold text-primary">{sizeLabel}</p>
                  <p className="text-xs text-textMuted font-medium mt-0.5">Company Size</p>
                </div>
              )}

              {/* Completion bar */}
              <div className="mt-5 text-left">
                <div className="flex justify-between text-xs text-textMuted mb-1.5">
                  <span className="font-medium">Profile Completion</span>
                  <span className="font-bold text-primary">{completion}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                {completion < 100 && (
                  <p className="text-xs text-textMuted mt-1.5">Complete your profile to attract students</p>
                )}
              </div>
            </div>

            {/* Location & Website */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-semibold text-textMuted mb-3 text-xs uppercase tracking-widest">Location & Web</h3>
              {!editing ? (
                <div className="space-y-2.5">
                  {(form.city || form.state) ? (
                    <p className="text-sm text-textDark flex items-center gap-2">
                      <svg className="w-4 h-4 text-textMuted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[form.city, form.state].filter(Boolean).join(', ')}
                    </p>
                  ) : <p className="text-xs text-textMuted">No location added</p>}
                  {form.company_website ? (
                    <a href={form.company_website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-secondary hover:underline transition-colors">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Company Website
                    </a>
                  ) : <p className="text-xs text-textMuted">No website added</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <input type="text" name="city" value={form.city}
                    onChange={handleChange} placeholder="City"
                    className={inputClass} />
                  <input type="text" name="state" value={form.state}
                    onChange={handleChange} placeholder="State"
                    className={inputClass} />
                  <input type="url" name="company_website" value={form.company_website}
                    onChange={handleChange} placeholder="https://yourcompany.com"
                    className={inputClass} />
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-semibold text-textMuted mb-3 text-xs uppercase tracking-widest">Contact</h3>
              {!editing ? (
                <p className="text-sm text-textDark flex items-center gap-2">
                  {form.phone ? (
                    <>
                      <svg className="w-4 h-4 text-textMuted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {form.phone}
                    </>
                  ) : <span className="text-textMuted text-xs">No phone added</span>}
                </p>
              ) : (
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="10-digit phone"
                  className={inputClass} />
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-textDark">Company Profile</h1>
                <p className="text-sm text-textMuted mt-0.5">Manage your company information</p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setMessage({ type: '', text: '' }); }}
                    className="bg-white hover:bg-slate-50 text-textDark border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Company Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-textMuted mb-5 text-xs uppercase tracking-widest">Company Details</h3>
              <div className="grid grid-cols-2 gap-5">

                <div className="col-span-2">
                  <label className={labelClass}>Company Name</label>
                  {editing
                    ? <input type="text" name="company_name" value={form.company_name}
                        onChange={handleChange} placeholder="e.g. TCS, Infosys, Google"
                        className={inputClass} />
                    : <p className="text-textDark text-sm font-semibold">{form.company_name || '—'}</p>}
                </div>

                <div>
                  <label className={labelClass}>Industry</label>
                  {editing
                    ? <select name="industry" value={form.industry} onChange={handleChange}
                        className={inputClass}>
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                      </select>
                    : <p className="text-textDark text-sm font-semibold">{industryLabel || '—'}</p>}
                </div>

                <div>
                  <label className={labelClass}>Company Size</label>
                  {editing
                    ? <select name="company_size" value={form.company_size} onChange={handleChange}
                        className={inputClass}>
                        <option value="">Select Size</option>
                        {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    : <p className="text-textDark text-sm font-semibold">{sizeLabel || '—'}</p>}
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Your Designation</label>
                  {editing
                    ? <input type="text" name="designation" value={form.designation}
                        onChange={handleChange} placeholder="e.g. HR Manager, Technical Recruiter"
                        className={inputClass} />
                    : <p className="text-textDark text-sm font-semibold">{form.designation || '—'}</p>}
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-textMuted mb-5 text-xs uppercase tracking-widest">About the Company</h3>
              {editing
                ? <textarea
                    name="company_description"
                    value={form.company_description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your company — what you do, your culture, why students should join…"
                    className={`${inputClass} resize-none`}
                  />
                : <p className="text-textDark text-sm leading-relaxed">
                    {form.company_description ||
                      <span className="text-textMuted italic text-sm">No description added yet. Tell students about your company!</span>}
                  </p>}
            </div>

            {/* Quick Actions */}
            {!editing && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-textMuted mb-5 text-xs uppercase tracking-widest">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate('/jobs/post')}
                    className="group bg-slate-50 hover:bg-blue-50 rounded-xl p-4 text-center border border-slate-200 hover:border-primary transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-primary flex items-center justify-center mx-auto mb-2.5 transition-colors duration-200">
                      <svg className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-textDark">Post a Job</p>
                  </button>
                  <button
                    onClick={() => navigate('/students/browse')}
                    className="group bg-slate-50 hover:bg-blue-50 rounded-xl p-4 text-center border border-slate-200 hover:border-primary transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-primary flex items-center justify-center mx-auto mb-2.5 transition-colors duration-200">
                      <svg className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-textDark">Browse Students</p>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="group bg-slate-50 hover:bg-blue-50 rounded-xl p-4 text-center border border-slate-200 hover:border-primary transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-primary flex items-center justify-center mx-auto mb-2.5 transition-colors duration-200">
                      <svg className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-textDark">Dashboard</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
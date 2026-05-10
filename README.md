# 🎓 PlacementHub — Campus Placement Management System

A full-stack web application that connects **students**, **recruiters**, and **placement officers** on a single platform to streamline the campus recruitment process.

---

## 📸 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js, Tailwind CSS, React Router |
| Backend   | Django, Django REST Framework        |
| Auth      | JWT (SimpleJWT)                      |
| Database  | SQLite (dev) / PostgreSQL (prod)     |
| Media     | Django Media Files (resumes, photos) |

---

## 📁 Project Structure

```
campuse_placement-main/
├── backend/
│   ├── admin_panel/          # Admin management app
│   ├── applications/         # Job application logic
│   ├── jobs/                 # Job posting & browsing
│   ├── recruiters/           # Recruiter profiles
│   ├── students/             # Student profiles
│   ├── users/                # Auth & user management
│   ├── campus_placement/     # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── media/
│   │   └── resumes/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── auth.js           # Axios API calls
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── components/
    │   │   └── Navbar.jsx        # Shared navbar
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Forgotpassword.jsx
    │   │   ├── Resetpassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── StudentProfile.jsx
    │   │   ├── RecruiterProfile.jsx
    │   │   ├── BrowseJobs.jsx
    │   │   ├── JobDetail.jsx
    │   │   ├── PostJob.jsx
    │   │   ├── ManageJobs.jsx
    │   │   ├── JobApplicants.jsx
    │   │   ├── BrowseStudents.jsx
    │   │   ├── MyApplications.jsx
    │   │   ├── ApplicationTracker.jsx
    │   │   └── RecruiterTracker.jsx
    │   ├── App.jsx
    │   └── index.js
    ├── tailwind.config.js
    └── package.json
```

---

## 👥 User Roles

### 🎓 Student
- Register and complete profile (branch, CGPA, skills, resume)
- Browse available jobs filtered by their eligibility
- Apply to jobs with an optional cover letter
- Track application status in real time
- Withdraw applications

### 🏢 Recruiter
- Register and set up company profile
- Post jobs with eligibility criteria (min CGPA, branches, backlog policy)
- Manage posted jobs (activate/deactivate/delete)
- View and filter applicants per job
- Update applicant status (Applied → Under Review → Shortlisted → Selected/Rejected)
- Bulk update applicant statuses
- Add private recruiter notes per candidate
- Browse student profiles

### 🛡️ Admin (Placement Officer)
- Approve or reject student/recruiter registrations
- Activate/deactivate user accounts
- View platform-wide stats (total users, jobs, applications)
- Manage all job postings
- Monitor recent signups

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip & npm

---

### 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Create a superuser (admin)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# 4. Start the dev server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

For Django, update `backend/campus_placement/settings.py` as needed:

```python
# Allowed hosts for production
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 🛣️ API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login & get JWT tokens |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| GET | `/api/auth/me/` | Get current user info |
| GET/PUT | `/api/students/profile/` | Student profile |
| GET/PUT | `/api/recruiters/profile/` | Recruiter profile |
| GET/POST | `/api/jobs/my-jobs/` | Recruiter: list/create jobs |
| GET | `/api/jobs/available/` | Student: browse eligible jobs |
| GET | `/api/jobs/:id/` | Job detail |
| POST | `/api/applications/apply/` | Apply to a job |
| GET | `/api/applications/my-applications/` | Student's applications |
| GET | `/api/applications/job/:id/applicants/` | Recruiter: job applicants |
| PUT | `/api/applications/:id/update-status/` | Update applicant status |
| POST | `/api/applications/bulk-update-status/` | Bulk status update |
| GET | `/api/applications/recruiter-stats/` | Recruiter dashboard stats |
| GET | `/api/admin/stats/` | Admin platform stats |
| GET | `/api/admin/pending/` | Pending user approvals |

---

## 🎨 UI Theme

The frontend uses a **Clean Corporate** design system defined in `tailwind.config.js`:

| Token | Color | Usage |
|-------|-------|-------|
| `primary` | `#2563EB` | Buttons, links, highlights |
| `secondary` | `#4F46E5` | Hover states, accents |
| `accent` | `#818CF8` | Subtle highlights |
| `background` | `#F8FAFC` | Page background |
| `surface` | `#FFFFFF` | Cards, panels |
| `textDark` | `#1E293B` | Headings, body text |
| `textMuted` | `#64748B` | Labels, captions |

---

## ✨ Key Features

- **Role-based access control** — students, recruiters, and admins each have separate dashboards and permissions
- **Eligibility-aware job feed** — students only see jobs they qualify for (CGPA, branch, backlog)
- **Real-time status tracking** — students see application pipeline updates live
- **Bulk actions** — recruiters can move multiple applicants through the pipeline at once
- **CGPA classification** — automatic First Class / Distinction badges based on CGPA
- **Resume & photo uploads** — stored securely via Django media
- **Admin approval flow** — all new accounts require admin approval before login
- **Private recruiter notes** — internal candidate notes visible only to the recruiter

---

## 📄 License

This project is built for educational/campus use. Feel free to fork and adapt it for your institution.

---

> Built with ❤️ using Django + React

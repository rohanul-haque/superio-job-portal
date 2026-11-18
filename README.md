# 🚀 HireNest — Modern AI-Powered Job Portal

HireNest is a production-grade, AI-powered recruitment platform that seamlessly connects ambitious talent with top employers. Featuring Google Gemini AI for smart candidate matching and automated job description generation, HireNest streamlines every phase of the hiring lifecycle — from discovery to application tracking.

## 🔗 Live Demo

- **Live Application:** [https://superio-job-portal-gamma.vercel.app](https://superio-job-portal-gamma.vercel.app)
- **Backend API:** [https://superio-job-portal-backend.onrender.com/api/v1](https://superio-job-portal-backend.onrender.com/api/v1)

## 📸 Screenshots

![HireNest Job Details & Portal Overview](docs/screenshots/job-details.png)
*HireNest Job Details page featuring comprehensive role specifications, instant application flow, and dynamic category-based similar jobs recommendations.*

## ✨ Key Features

- **Role-Based Portals & Dashboards:** Tailored workspaces and protected routes for Candidates (browse, bookmark, apply, track status), Recruiters (post jobs, manage applicants, candidate matching), and Admins (platform oversight, category management, user moderation).
- **AI-Powered Recruitment (Google Gemini):** One-click AI job description generator for recruiters and intelligent resume-to-job matching score calculation with actionable strength and gap analysis.
- **Secure Dual-Token Auth & Rate Limiting:** JWT-based access and refresh token authentication, role-based authorization guards, multi-tier rate limiting against brute-force attacks, and secure OTP-based password reset.
- **Dynamic Search & Advanced Filtering:** Debounced keyword search, category, job type, experience level, salary range, and location filtering without layout shifts or focus loss.
- **Real-Time Application Tracking:** Cloudinary-backed resume uploads, multi-step application submission, and real-time candidate pipeline statuses (Pending, Shortlisted, Interviewing, Accepted, Rejected).
- **Responsive & Modern UI:** Built with Next.js 16 App Router, React 19, Tailwind CSS, TanStack Query for optimal client caching, and interactive modals.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query v5, Axios, Tiptap Editor, Lucide React, Recharts
- **Backend:** Node.js, Express.js v5, TypeScript, Prisma ORM v5, Zod, express-rate-limit
- **Database:** MongoDB Atlas (managed via Prisma MongoDB connector)
- **AI & Cloud Services:** Google Gemini Flash (via LangChain), Cloudinary (resume & media storage), Nodemailer (email verification & password reset)
- **Deployment & DevOps:** Vercel (Frontend), Render (Backend), Git / GitHub

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:
- Node.js (v18.18.0 or higher, Node 20 LTS recommended)
- npm, pnpm, or yarn
- MongoDB Atlas account or a local MongoDB database instance
- Google Gemini API key *(for AI description generation & candidate matching)*
- Cloudinary account *(for resume and company logo uploads)*

### Environment Variables

#### 1. Backend (`backend/.env`)

Create a `.env` file inside the `backend/` directory and configure the following variables:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirenest?retryWrites=true&w=majority"

# Authentication
JWT_ACCESS_SECRET="your_jwt_access_secret_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_here"

# Google Gemini AI
GOOGLE_GEMINI_API_KEY="your_google_gemini_api_key_here"
GEMINI_MODEL="gemini-1.5-flash"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Email Service (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
```

#### 2. Frontend (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run Locally

1. **Clone the repository:**
```bash
git clone https://github.com/rohanul-haque/superio-job-portal.git
cd superio-job-portal
```

2. **Setup and run the backend:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Backend runs on `http://localhost:5000` (API endpoint: `http://localhost:5000/api/v1`).*

3. **Setup and run the frontend:**
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

## 📂 Folder Structure

```text
superio-job-portal/
├── frontend/                     # Next.js 16 frontend application
│   ├── src/
│   │   ├── app/                  # Next.js App Router (public, auth, candidate, recruiter, admin)
│   │   ├── components/           # Reusable UI components, modals, filters & forms
│   │   ├── hooks/                # Custom React hooks (useAuth, useDebounce, etc.)
│   │   ├── services/             # Axios API service client modules
│   │   ├── store/                # Global state stores (Zustand)
│   │   └── types/                # Shared TypeScript types & interfaces
│   ├── next.config.ts            # Next.js configuration
│   └── package.json              # Frontend dependencies and scripts
├── backend/                      # Express.js REST API backend
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema and MongoDB data models
│   ├── src/
│   │   ├── config/               # App configuration & environment loader
│   │   ├── middlewares/          # Auth guards, role verification, rate limiting, error handling
│   │   ├── modules/              # Feature modules (auth, job, application, candidate, recruiter, admin)
│   │   ├── services/             # Third-party integrations (Gemini AI, Cloudinary, Nodemailer)
│   │   ├── app.ts                # Express application configuration and route registry
│   │   └── server.ts             # Server entry point
│   └── package.json              # Backend dependencies and scripts
├── docs/                         # Architecture documentation & design system
│   └── screenshots/              # Application screenshots
├── LICENSE                       # MIT License file
└── README.md                     # Project documentation
```

## 📡 API Reference

Here is a quick reference to the core API endpoints available at `/api/v1`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/candidate/signup` | Public | Register a new candidate account |
| `POST` | `/api/v1/auth/recruiter/signup` | Public | Register a new recruiter account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue access/refresh tokens |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request a 6-digit password reset OTP email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password using OTP verification code |
| `GET` | `/api/v1/jobs` | Public | Fetch paginated jobs with filters & debounced search |
| `GET` | `/api/v1/jobs/:id` | Public | Retrieve job details and category-based similar jobs |
| `POST` | `/api/v1/jobs` | Recruiter | Post a new job opportunity |
| `POST` | `/api/v1/jobs/generate-description` | Recruiter | Generate AI job description with Google Gemini |
| `POST` | `/api/v1/applications` | Candidate | Submit application with Cloudinary resume upload |
| `GET` | `/api/v1/applications/my-applications` | Candidate | Retrieve candidate's submitted applications |
| `PATCH` | `/api/v1/applications/:id/status` | Recruiter | Update application status (Shortlist, Interview, Reject) |
| `GET` | `/api/v1/recruiter/candidate-matching/:jobId` | Recruiter | Compute & fetch AI matching scores for applicants |
| `GET` | `/api/v1/admin/analytics` | Admin | Fetch platform-wide analytics and statistics |

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this code as per the license terms.

## 👤 Author

- **MD Rohanul Haque Rohan**
- Portfolio: [rohanul-haque.me](https://rohanul-haque.me)
- GitHub: [@rohanul-haque](https://github.com/rohanul-haque)
- LinkedIn: [MD Rohanul Haque Rohan](https://www.linkedin.com/in/md-rohanul-haque/)

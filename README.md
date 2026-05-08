# 🚀 LeadFlow CRM — Sales Pipeline Manager

> A full-stack CRM Lead Management System built for small sales teams.  
> Manage leads, track pipeline progress, add notes, and view a real-time analytics dashboard.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Features Implemented](#-features-implemented)
4. [How to Run Locally](#-how-to-run-locally)
5. [Environment Variables](#-environment-variables)
6. [Test Login Credentials](#-test-login-credentials)
7. [Database Setup](#-database-setup)
8. [Project Structure](#-project-structure)
9. [Known Limitations](#-known-limitations)
10. [Reflection](#-reflection)

---

## 🌟 Project Overview

**LeadFlow CRM** is a lightweight, full-stack Customer Relationship Management application designed for small sales teams to:

- Track potential customers (leads) as they move through a sales pipeline
- Assign leads to salespeople and monitor deal values
- Add time-stamped notes to individual leads
- Visualise pipeline health via an analytics dashboard with charts

The project demonstrates end-to-end full-stack development: a **Next.js** frontend talking to an **Express + MongoDB** REST API, secured with **JWT authentication**.

---

## 🛠 Tech Stack

| Layer       | Technology                                        | Version  |
|-------------|---------------------------------------------------|----------|
| Frontend    | Next.js (App Router)                              | 16.2.4   |
| UI Library  | React                                             | 19.2.4   |
| Styling     | Tailwind CSS                                      | 4.x      |
| Charts      | Recharts                                          | 3.x      |
| HTTP Client | Axios                                             | 1.x      |
| Cookies     | js-cookie                                         | 3.x      |
| Toasts      | react-hot-toast                                   | 2.x      |
| Icons       | react-icons                                       | 5.x      |
| Backend     | Node.js + Express                                 | 5.x      |
| Database    | MongoDB (via Mongoose ODM)                        | 9.x      |
| Auth        | JWT (`jsonwebtoken`) + Password hashing (`bcryptjs`) | —     |

---

## ✅ Features Implemented

### 🔐 Authentication
- JWT-based login / logout
- Protected routes — the CRM is inaccessible without a valid token
- Token stored in cookies with a **7-day expiry**
- Auto-redirect to `/login` on token expiration or missing token

### 📋 Lead Management — Full CRUD
| Operation | Description |
|-----------|-------------|
| **Create** | Add leads: name, company, email, phone, source, salesperson, status, deal value |
| **Read**   | Sortable & filterable lead table + individual lead detail page |
| **Update** | Edit any lead field; update status directly from the detail page |
| **Delete** | Remove a lead (cascades to associated notes) |

### 📝 Lead Notes
- Add notes to any lead
- Notes store content, author (logged-in user's name), and timestamp
- Displayed in reverse-chronological order

### 📊 Dashboard
- **KPI cards**: Total Leads · New · Qualified · Won · Lost · Total Deal Value · Won Value
- **Pie chart**: Leads by source
- **Bar chart**: Pipeline breakdown by stage
- **Recent Leads**: Quick-glance table of the latest 5 leads

### 🔍 Search & Filtering
- Filter by **Status** (New / Contacted / Qualified / Proposal Sent / Won / Lost)
- Filter by **Lead Source** (Website / LinkedIn / Referral / Cold Email / Event / Other)
- Filter by **Assigned Salesperson**
- Full-text **search** across lead name, company, and email
- Debounced search for smooth UX (reduces redundant API calls)

---

## ⚙️ How to Run Locally

### Prerequisites
- **Node.js** v18 or later — [Download](https://nodejs.org)
- **MongoDB** running locally _or_ a MongoDB Atlas connection string

---

### Step 1 — Clone the repository
```bash
git clone <repo-url>
cd "intern project"
```

---

### Step 2 — Backend setup

```bash
cd backend
npm install
```

Create `/backend/.env` (a pre-filled file is already included):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_leads
JWT_SECRET=crm_jwt_secret_key_2026
FRONTEND_URL=http://localhost:3000
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend dev server:
```bash
npm run dev
# Runs on http://localhost:5000 (with --watch hot-reload)
```

---

### Step 3 — Frontend setup

```bash
cd ../frontend
npm install
```

Create `/frontend/.env.local` (a pre-filled file is already included):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend dev server:
```bash
npm run dev
# Runs on http://localhost:3000
```

---

### Step 4 — Open the app

Visit **[http://localhost:3000](http://localhost:3000)** and log in with the [test credentials](#-test-login-credentials) below.

> **Health check:** `GET http://localhost:5000/api/health` returns `{ "status": "ok" }` when the backend is running correctly.

---

## 🔑 Environment Variables

### Backend — `/backend/.env`

| Variable       | Description                          | Default Value                         |
|----------------|--------------------------------------|---------------------------------------|
| `PORT`         | Express server port                  | `5000`                                |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://localhost:27017/crm_leads` |
| `JWT_SECRET`   | Secret key used to sign JWT tokens   | `crm_jwt_secret_key_2026`             |
| `FRONTEND_URL` | Allowed CORS origin (frontend URL)   | `http://localhost:3000`               |

### Frontend — `/frontend/.env.local`

| Variable              | Description              | Default Value                 |
|-----------------------|--------------------------|-------------------------------|
| `NEXT_PUBLIC_API_URL` | Base URL for the REST API | `http://localhost:5000/api`  |

---

## 🧪 Test Login Credentials

These accounts are created automatically by the seed script.

| Role        | Email                 | Password      |
|-------------|-----------------------|---------------|
| **Admin**   | `admin@example.com`   | `password123` |
| **Sales**   | `jane@example.com`    | `password123` |

> ⚠️ Both accounts share the same password for convenience during testing.  
> There is no self-registration flow — new users must be added via the seed script or directly in MongoDB.

---

## 🗄 Database Setup

The app uses **MongoDB**. Choose one option:

### Option A — Local MongoDB
1. Install MongoDB Community Edition: [docs.mongodb.com](https://www.mongodb.com/docs/manual/installation/)
2. Start the daemon: `mongod`
3. Use the default `MONGODB_URI=mongodb://localhost:27017/crm_leads`

### Option B — MongoDB Atlas (cloud)
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Copy your connection string
3. Replace `MONGODB_URI` in `/backend/.env` with your Atlas URI

### Seeding the Database

Run the seed script **once** after MongoDB is running:

```bash
cd backend
npm run seed
```

This will:
- ✅ Clear any existing `users`, `leads`, and `notes` collections
- ✅ Create **2 test users** (Admin + Salesperson)
- ✅ Insert **10 sample leads** covering all pipeline stages
- ✅ Add **6 notes** attached to the first 6 leads

> ⚠️ The seed script **deletes all existing data** before inserting. Do not run it on a database with real data.

---

## 📁 Project Structure

```
intern-project/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── authController.js       # POST /auth/login, GET /auth/me
│   │   ├── dashboardController.js  # GET /dashboard/stats
│   │   ├── leadController.js       # Lead CRUD endpoints
│   │   └── noteController.js       # Notes per lead
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── Lead.js                 # Lead Mongoose schema
│   │   ├── Note.js                 # Note Mongoose schema
│   │   └── User.js                 # User Mongoose schema (bcrypt hash)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── leadRoutes.js           # Includes nested note routes
│   ├── seed.js                     # Database seeder
│   ├── server.js                   # Express app entry point
│   └── .env                        # Backend env vars (pre-filled)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js           # Root layout — wraps AuthContext
│   │   │   ├── page.js             # Dashboard (protected)
│   │   │   ├── login/
│   │   │   │   └── page.js         # Login form
│   │   │   └── leads/
│   │   │       ├── page.js         # Lead list with search & filters
│   │   │       ├── new/
│   │   │       │   └── page.js     # Create lead form
│   │   │       └── [id]/
│   │   │           ├── page.js     # Lead detail + notes
│   │   │           └── edit/
│   │   │               └── page.js # Edit lead form
│   │   ├── components/
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ProtectedRoute.js   # Redirects unauthenticated users
│   │   │   ├── Sidebar.js          # Navigation sidebar
│   │   │   └── StatusBadge.js      # Coloured pipeline-status pill
│   │   ├── context/
│   │   │   └── AuthContext.js      # Auth state + login/logout helpers
│   │   └── lib/
│   │       └── api.js              # Axios instance with base URL + auth header
│   └── .env.local                  # Frontend env vars (pre-filled)
│
└── README.md
```

---

## ⚠️ Known Limitations

| Area | Limitation |
|------|------------|
| **User Management** | No self-registration — accounts are seeded only |
| **Salesperson Field** | Free-text input, not a dropdown of registered users |
| **Pagination** | Lead list loads all records; no server-side pagination |
| **Real-time Updates** | No WebSocket / Server-Sent Events; refresh required for new data |
| **File Attachments** | No document/image upload for leads |
| **Email Notifications** | No automated reminders or follow-up emails |
| **Multi-tenancy** | Single-tenant only; no organisation or team separation |
| **Role-based Access** | Both roles can perform all CRUD — role field exists but is not enforced |

---

## 💭 Reflection

This project was built to demonstrate full-stack engineering across authentication, REST API design, database modelling, and modern frontend development.

### Key Design Decisions

**1. JWT over Sessions**  
Chose stateless JWT tokens so the API is completely decoupled from the frontend. This makes the backend independently deployable and avoids session-store dependencies.

**2. Next.js App Router**  
Used the Next.js 16 App Router with client components (`"use client"`) for interactive pages and a root layout that wraps the auth context provider — following the recommended pattern for authentication in Next.js.

**3. MongoDB + Mongoose**  
Flexible document schema suits a CRM well; lead fields can evolve without costly migrations. Mongoose provides schema validation and a clean model API.

**4. Dark Theme with Glassmorphism UI**  
Designed a premium dark interface with glass-card effects, gradient accents, and subtle micro-animations to give the app a polished, professional appearance.

**5. Debounced Search**  
Client-side debounce (300 ms) prevents an API request on every keystroke, reducing server load while still feeling responsive.

**6. Pipeline Visualisation**  
Combined a pie chart (leads by source) and a horizontal bar chart (stage breakdown) on the dashboard so managers get an at-a-glance view of the pipeline without navigating into the leads list.

### What I Would Improve Next

- Add **server-side pagination** for scalability beyond a few hundred leads
- Enforce **role-based access control** (admin-only delete, salesperson-only own-leads view)
- Implement **user self-registration** with email verification
- Add **WebSocket** support for live collaborative updates across team members
- Write **unit + integration tests** (Jest + Supertest for the API; React Testing Library for the frontend)

---

*Built as part of an internship project — May 2026*

# EduMathAI — AI-Powered Class 9 Mathematics Learning Platform
### *Learn • Practice • Grow*

EduMathAI is a comprehensive, production-grade EdTech SaaS platform designed specifically for **Class 9 Mathematics**, aligned with both **CBSE (NCERT)** and **Andhra Pradesh (AP) State Board** curricula.

---

## 🚀 Key Features

1. **Dual Curriculum Engine**:
   - Seamless toggle between **CBSE Class 9** and **AP State Board Class 9**.
   - Covers all 15 curriculum chapters: Number Systems, Polynomials, Coordinate Geometry, Linear Equations in Two Variables, Euclid's Geometry, Lines and Angles, Triangles, Quadrilaterals, Circles, Heron's Formula, Surface Areas & Volumes, Statistics, Probability, and AP State Proofs/Real Numbers.

2. **Five Role-Based Portals**:
   - **Student Portal**: Interactive practice, timed chapter tests, study streaks, XP milestones, and personal progress analytics.
   - **Teacher Portal**: Classroom monitoring (Class 9-A & 9-B), homework assignment publishing, assessment scheduling, and diagnostic learning-gap identification.
   - **Parent Portal**: Live oversight into child scores (Aarav Sharma), study streaks, strengths, and teacher/AI recommendations.
   - **School Admin Portal**: Institution-wide metrics (Delhi Public International School), faculty allocations, classroom sections, and pass/fail analytics.
   - **Platform Admin Portal**: User account status toggling (activate/suspend), institutional onboarding, and live security audit logs.

3. **24/7 EduMathAI Tutor (Gemini AI Integration)**:
   - Server-side integration with Google GenAI (`gemini-3.8-flash`).
   - Acts as a friendly, expert Class 9 math teacher.
   - Step-by-step mathematical reasoning, explicit formula references, conceptual hints, and practice checks.
   - Chapter context switcher and quick prompts ("Explain this concept", "Solve this problem", "Give me a hint", "Explain this formula", "Test me on this chapter").

4. **Practice & Test Assessment Module**:
   - Multi-format practice engine: **MCQ**, **Numerical**, **True/False**, and **Fill in the blank**.
   - Immediate feedback with solution steps and formulas.
   - Standardized assessments with countdown timer, question palette (answered/unanswered/marked for review), and detailed result reviews.

5. **Study Material Library**:
   - Official chapter notes, formula cheat sheets, revision summaries, and worked examples.
   - Interactive in-app reader modal + 1-click Markdown download.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, tsx.
- **AI Engine**: `@google/genai` TypeScript SDK (server-side only via `gemini-3.8-flash`).
- **Database**: Persistent JSON database engine (`server/db/database.ts` with auto-sync to `server/data/edumath_db.json`).
- **Security**: SHA-256 password hashing with salt, role-based route guards, and zero client-exposed API keys.

---

## 🔑 Demo Accounts (Ready to Test)

All demo accounts use the password: `EduMath2026!`

| Role | Demo Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@edumathai.com` | `EduMath2026!` |
| **Teacher** | `teacher@edumathai.com` | `EduMath2026!` |
| **Parent** | `parent@edumathai.com` | `EduMath2026!` |
| **School Admin** | `schooladmin@edumathai.com` | `EduMath2026!` |
| **Platform Admin** | `admin@edumathai.com` | `EduMath2026!` |

---

## 💻 Local Setup & Execution

### 1. Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### 2. Installation
```bash
# Unzip the project and navigate to the directory
cd EduMathAI

# Install dependencies
npm install
```

### 3. Environment Variables
Create or verify `.env` file in the root directory:
```env
# Optional: Set your Gemini API key for live AI tutoring
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

PORT=3000
```
*(Note: If GEMINI_API_KEY is not provided, EduMathAI Tutor automatically falls back to an internal intelligent math reasoning engine.)*

### 4. Running the Platform
```bash
# Start development server (runs full-stack Express + Vite on port 3000)
npm run dev

# Or build and run in production:
npm run build
npm start
```
Open your browser and navigate to: **`http://localhost:3000`**

---

## 📁 Project Structure

```
EduMathAI/
├── index.html                  # HTML entry point with math typography
├── metadata.json               # Applet capabilities & metadata
├── package.json                # Dependencies and full-stack scripts
├── tsconfig.json               # TypeScript compiler config
├── vite.config.ts              # Vite bundling config
├── server.ts                   # Express server entry point mounting Vite middleware
├── server/
│   ├── apiRoutes.ts            # REST API endpoints for all 5 portals
│   ├── geminiService.ts        # Server-side Gemini 3.8 Flash AI tutoring service
│   ├── db/
│   │   ├── schema.ts           # Entity models & interfaces (20+ entities)
│   │   ├── seedData.ts         # Class 9 curriculum chapters, questions & demo users
│   │   └── database.ts         # Persistent JSON database manager
│   └── data/
│       └── edumath_db.json     # Auto-generated persistent database file
└── src/
    ├── main.tsx                # Client React entry point
    ├── App.tsx                 # Master application component & route controller
    ├── index.css               # Math pattern background & glassmorphism theme
    ├── types/index.ts          # Frontend TypeScript definitions
    ├── context/AuthContext.tsx # Role authorization & session state
    ├── services/api.ts         # Client typed API service
    ├── components/
    │   ├── Navbar.tsx          # Navigation, curriculum switch & quick ZIP download
    │   ├── Sidebar.tsx         # Role-specific responsive sidebar
    │   ├── RoleBadge.tsx       # Distinct role accent badges
    │   ├── NotificationsDropdown.tsx
    │   └── MaterialModal.tsx   # Study material reader dialog
    └── pages/
        ├── LandingPage.tsx     # Landing page with 5 portal cards & live demo
        ├── AuthPage.tsx        # Sign-in/registration with 1-click demo buttons
        ├── StudentDashboard.tsx# Core student KPI dashboard
        ├── SyllabusPage.tsx    # Class 9 CBSE & State Board syllabus catalog
        ├── ChapterDetailPage.tsx # 5-tab chapter deep-dive
        ├── StudyMaterialsPage.tsx# Filterable study material library
        ├── PracticePage.tsx    # Interactive problem solver with feedback
        ├── TestModule.tsx      # Test catalog & timed assessment runner
        ├── TestResultPage.tsx  # Test scoring review & solution breakdown
        ├── ProgressAnalyticsPage.tsx # Visual mastery charts
        ├── AITutorPage.tsx     # 24/7 EduMathAI Tutor powered by Gemini
        ├── AchievementsPage.tsx# Gamified XP and badge milestones
        ├── RecommendationsPage.tsx # Performance-driven suggestions
        ├── TeacherDashboard.tsx# Class analytics & assignment creator
        ├── ParentDashboard.tsx # Child progress oversight
        ├── SchoolAdminDashboard.tsx # School-wide faculty & section management
        ├── PlatformAdminDashboard.tsx # Super-admin user control & audit logs
        ├── ProfilePage.tsx     # User profile management
        ├── SettingsPage.tsx    # Security & curriculum preferences
        └── ErrorPages.tsx      # 404, 403, and 500 error pages
```

---

## 📜 Academic Project Submission Information
- **Project Title**: EduMathAI — Class 9 Mathematics Learning Platform
- **Target Audience**: Class 9 Students, Teachers, Parents, and School Administrators
- **Curriculum Alignment**: Central Board of Secondary Education (CBSE/NCERT) & Andhra Pradesh State Board
- **License**: Apache-2.0

# 🚀 CareerCraft - AI-Powered Career Guidance Platform

<div align="center">

![CareerCraft Banner](https://img.shields.io/badge/CareerCraft-Professional%20Growth%20Platform-00D9FF?style=for-the-badge)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

**Transform your professional aspirations into reality with our innovative career discovery platform.**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [UI Components](#-ui-components)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**CareerCraft** is a next-generation career guidance platform designed to help students, graduates, and professionals discover their ideal career paths through intelligent matching, skill development, and personalized recommendations. Built with modern web technologies and featuring a stunning, animated UI, CareerCraft provides an exceptional user experience.

### 🌟 Why CareerCraft?

- **Smart Career Discovery**: AI-powered matching system connecting passions with market opportunities
- **Dynamic Learning Pathways**: Adaptive skill development routes evolving with industry demands
- **Global Career Network**: Connect with worldwide opportunities and international career pathways
- **Achievement Ecosystem**: Comprehensive certification network with industry-recognized credentials
- **Beautiful UI**: Modern, animated interface with gradient designs and glass morphism effects

---

## ✨ Features

### 🎓 For Students
- **Interactive Career Assessments**: Discover your strengths and interests
- **Personalized Career Roadmaps**: Step-by-step guidance to your dream career
- **Skill Gap Analysis**: Identify and bridge skill gaps
- **Learning Resources**: Curated courses and materials
- **Progress Tracking**: Monitor your career development journey

### 🚀 For Graduates
- **Job Matching**: Precision-matched job opportunities
- **Resume Builder**: Create professional resumes
- **Certificate Management**: Upload and showcase certifications
- **Skill Enhancement Programs**: Continuous learning opportunities
- **Career Analytics**: Track your career growth metrics

### 👨‍🏫 For Mentors
- **Student Management**: Guide and mentor students
- **Progress Monitoring**: Track mentee achievements
- **Resource Sharing**: Share valuable career insights
- **Communication Tools**: Direct messaging with mentees

### 🛡️ For Administrators
- **Comprehensive Analytics**: Platform-wide insights and metrics
- **User Management**: Manage all platform users
- **Content Management**: Control skills, jobs, and career paths
- **System Configuration**: Platform settings and customization

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library for building interactive interfaces
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Next-generation frontend tooling
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **React Router DOM 6.30.1** - Client-side routing
- **React Hook Form 7.61.1** - Form validation
- **Zod 3.25.76** - Schema validation
- **Recharts 2.15.4** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize 6.35.1** - ORM for database operations
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Development Tools
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS transformation
- **Nodemon** - Auto-restart development server

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gurumurthys1/Career_Guide_IBM.git
   cd Career_Guide_IBM
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=your_password
   DB_NAME=career_guide_db
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb career_guide_db
   
   # Run database setup
   cd server
   npm run setup
   cd ..
   ```

6. **Start the development servers**

   **Terminal 1 - Frontend:**
   ```bash
   npm run dev
   ```

   **Terminal 2 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Default Admin Credentials

After database setup, login with:
- **Email**: `dharshandhiren@gmail.com`
- **Password**: `12345678`

---

## 📁 Project Structure

```
Career_Guide_IBM/
├── public/                      # Static assets
├── server/                      # Backend application
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── database/                # Database setup & migrations
│   ├── middleware/              # Custom middleware
│   ├── routes/                  # API routes
│   ├── scripts/                 # Utility scripts
│   ├── server.js                # Express server entry point
│   └── package.json             # Backend dependencies
├── src/                         # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui components
│   │   └── ...                  # Custom components
│   ├── data/                    # Static data files
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/            # Third-party integrations
│   ├── lib/                     # Utility functions
│   ├── pages/                   # Page components
│   │   ├── Index.tsx            # Landing page
│   │   ├── Login.tsx            # Authentication
│   │   ├── StudentDashboard.tsx # Student interface
│   │   ├── GraduateDashboard.tsx# Graduate interface
│   │   ├── AdminDashboard.tsx   # Admin interface
│   │   ├── MentorDashboard.tsx  # Mentor interface
│   │   ├── SkillTaxonomy.tsx    # Skills management
│   │   ├── JobTaxonomy.tsx      # Jobs management
│   │   └── CertificateUpload.tsx# Certificate management
│   ├── services/                # API services
│   ├── styles/                  # Global styles & animations
│   ├── types/                   # TypeScript type definitions
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Application entry point
├── .env                         # Environment variables (frontend)
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui configuration
├── index.html                   # HTML entry point
├── package.json                 # Frontend dependencies
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

---

## 🗄️ Database Setup

### Database Schema

The application uses PostgreSQL with the following main tables:

#### **users**
Stores user accounts with roles (student, graduate, mentor, admin, employer)
```sql
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role
- created_at
- updated_at
```

#### **skills**
Available skills in the system
```sql
- id (Primary Key)
- name
- category
- description
- created_at
```

#### **jobs**
Job postings and opportunities
```sql
- id (Primary Key)
- title
- company
- description
- requirements
- salary_range
- location
- created_at
```

#### **user_skills**
Junction table linking users to their skills
```sql
- user_id (Foreign Key)
- skill_id (Foreign Key)
- proficiency_level
```

#### **job_skills**
Junction table linking jobs to required skills
```sql
- job_id (Foreign Key)
- skill_id (Foreign Key)
- importance_level
```

#### **career_paths**
Career path information and recommendations
```sql
- id (Primary Key)
- title
- description
- required_skills
- average_salary
```

### Running Migrations

```bash
cd server
npm run migrate
```

---

## 🔐 Environment Variables

### Backend (server/.env)
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=career_guide_db
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

---

## 📜 Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
npm run start        # Start production server
npm run dev          # Start development server with nodemon
npm run setup        # Initialize database and seed data
npm run migrate      # Run database migrations
```

---

## 👥 User Roles

### 🎓 Student
- Access to career assessments
- View personalized career recommendations
- Track learning progress
- Upload certificates
- Browse job opportunities

### 🚀 Graduate
- All student features
- Advanced job matching
- Resume builder
- Career analytics dashboard
- Networking opportunities

### 👨‍🏫 Mentor
- Manage mentees
- Track student progress
- Share resources
- Provide guidance
- Communication tools

### 🛡️ Admin
- Full system access
- User management
- Content management (skills, jobs, career paths)
- Platform analytics
- System configuration

### 💼 Employer
- Post job opportunities
- Search candidates
- View applicant profiles
- Manage job postings

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
x-auth-token: your_jwt_token
```

### User Endpoints

```http
GET    /api/users           # Get all users (admin only)
GET    /api/users/:id       # Get user by ID
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user (admin only)
```

### Job Endpoints

```http
GET    /api/jobs            # Get all jobs
GET    /api/jobs/search     # Search jobs
POST   /api/jobs            # Create job (admin/employer)
PUT    /api/jobs/:id        # Update job
DELETE /api/jobs/:id        # Delete job
```

### Skill Endpoints

```http
GET    /api/skills          # Get all skills
GET    /api/skills/search   # Search skills
POST   /api/skills          # Create skill (admin only)
```

---

## 🎨 UI Components

### Design System

**Color Palette:**
- Primary: Teal to Cyan gradients (`from-teal-400 to-cyan-600`)
- Secondary: Violet to Purple gradients (`from-violet-400 to-purple-600`)
- Success: Emerald to Teal gradients (`from-emerald-400 to-teal-600`)
- Warning: Amber to Orange gradients (`from-amber-400 to-orange-500`)
- Background: Dark slate gradients (`from-slate-950 via-teal-950 to-cyan-950`)

**Typography:**
- Headings: Gradient text with `bg-clip-text text-transparent`
- Body: Consistent text colors with proper contrast
- Interactive: Color transitions on hover

**Components:**
- Cards: Glass morphism with gradient borders
- Buttons: Gradient backgrounds with hover animations
- Inputs: Icon integration with focus states
- Badges: Status-specific colors with icons

### Custom Animations

The project includes 50+ custom animations:
- Gradient animations (gradient-x, gradient-y, gradient-xy)
- Rotation animations (spin-slow, spin-reverse)
- Floating animations (float, float-reverse)
- Scale animations (pulse-scale, bounce-in)
- Slide animations (slide-in-left/right/up/down)
- Fade animations (fade-in, fade-in-up/down)
- Glow effects (glow, glow-purple, glow-green)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Gurumurthy S** - [GitHub](https://github.com/Gurumurthys1)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Lucide](https://lucide.dev/) - Icon Library
- [PostgreSQL](https://www.postgresql.org/) - Database

---

## 📞 Support

For support, email dharshandhiren@gmail.com or open an issue in the repository.

---

<div align="center">

**Made with ❤️ by the CareerCraft Team**

⭐ Star this repository if you find it helpful!

</div>

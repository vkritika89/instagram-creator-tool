# CreatorCanvas - Instagram Creator Tool

A modern SaaS platform for Instagram creators to generate AI-powered content, including weekly plans, Reel scripts, video generation, captions, and hashtags.

## 🚀 Features

- **Weekly Content Plans**: AI-generated weekly content ideas (3-7 posts) tailored to your niche
- **Reel Script Generator**: Viral Reel scripts with hooks, talking points, and CTAs
- **Video Generation**: Generate videos using Sora AI with detailed descriptions
- **Caption & Hashtag Generator**: 3 caption variants + niche-aware hashtag packs
- **Beautiful Dashboard**: Modern, responsive UI with infinite scrolling Reel cards
- **User Onboarding**: Multi-step profile setup for niche, goals, and audience

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Supabase** for authentication
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript**
- **Supabase** (PostgreSQL + Auth)
- **OpenAI** for AI content generation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
instagram-creator-tool/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── lib/           # Utilities (API, Supabase)
│   │   └── ...
│   └── package.json
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── lib/           # Utilities (Supabase, OpenAI)
│   │   ├── middleware/    # Auth middleware
│   │   └── index.ts       # Server entry point
│   └── package.json
├── supabase/         # Database schema
│   └── schema.sql
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database and auth)
- OpenAI API key (for AI content generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd instagram-creator-tool
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Environment Setup

1. **Frontend** (`frontend/.env`)
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3000
   ```

2. **Backend** (`backend/.env`)
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Database Setup**
   - Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
   - This creates the necessary tables: `creator_profiles`, `weekly_plans`, `reel_scripts`, `captions`

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

2. **Start the frontend dev server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎨 Features Overview

### Dashboard
- Welcome banner with personalized greeting
- Stats cards (Weekly Plans, Reel Scripts, Captions)
- Quick action cards
- Infinite scrolling Reel showcase
- Weekly content calendar
- Growth tips and content ideas

### Weekly Plan
- Generate 3-7 AI-powered content ideas per week
- Each post includes: type, hook, body, CTA
- Regenerate functionality
- Copy to clipboard

### Reel Scripts
- Input: Reel idea/topic
- Output: Script, on-screen text, shot guidance
- Copy functionality

### Video Generation & Caption
- Video description input
- Generate videos with Sora AI (backend integration ready)
- Auto-generate matching captions
- Hashtag pack generation
- Video preview and download

### Settings
- Edit profile (name, email, niche, goal, audience)
- Logout functionality

## 🔐 Authentication

- Email/password signup and login
- Google OAuth (via Supabase)
- Protected routes
- Demo mode for testing without login

## 📝 API Endpoints

### Profile
- `GET /api/profile` - Get creator profile
- `PUT /api/profile` - Update creator profile

### Weekly Plans
- `GET /api/weekly-plan` - Get weekly plans
- `POST /api/weekly-plan/generate` - Generate new weekly plan

### Reel Scripts
- `GET /api/reel-scripts` - Get reel scripts
- `POST /api/reel-scripts/generate` - Generate new reel script

### Captions
- `POST /api/captions/generate` - Generate captions and hashtags

### Video (Ready for backend)
- `POST /api/video/generate` - Generate video with Sora AI

### Stats
- `GET /api/stats` - Get dashboard statistics

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd frontend && npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

### Backend (Render/Railway/Vercel Serverless)
1. Set environment variables
2. Deploy the backend folder
3. Update `VITE_API_URL` in frontend to point to your backend URL

## 📄 License

MIT License

## 👨‍💻 Development

- Frontend dev server: `npm run dev` (in `frontend/`)
- Backend dev server: `npm run dev` (in `backend/`)
- TypeScript checking: `npx tsc --noEmit`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for Instagram creators


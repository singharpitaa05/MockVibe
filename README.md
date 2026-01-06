 MockVibe - AI-Powered Mock Interview Platform
A comprehensive mock interview platform with AI interviewing, video/voice analysis, real-time feedback, and advanced performance analytics.

🌐 Live Demo | 📖 Documentation | 🚀 Quick Start

MIT License Node.js React Vite MongoDB Express.js Tailwind CSS PRs Welcome

 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

 🌟 Overview
MockVibe is a sophisticated mock interview preparation platform designed to help users master job interviews through realistic practice sessions. It combines video interviews, voice analysis, AI-powered interviews, and detailed performance metrics to provide comprehensive interview preparation. Perfect for job seekers, students, and professionals aiming to excel in their next interview.

 🎯 Key Highlights
- **AI-Powered Interviews**: Practice with intelligent AI interviewers
- **Multiple Interview Formats**: Video, voice, and traditional text-based interviews
- **Real-time Feedback**: Instant performance analysis and suggestions
- **Advanced Analytics**: Detailed statistics on performance metrics
- **Interview Customization**: Create personalized interview sessions
- **Question Library**: Comprehensive database of interview questions
- **Admin Panel**: Manage questions, users, and platform content
- **Notification System**: Real-time alerts and updates
- **Responsive Design**: Seamless experience across all devices

 ✨ Features

 🤖 AI Interview System
- AI-Powered Mock Interviews: Practice with intelligent AI interviewers
- Conversational Q&A: Natural language interactions
- Performance Scoring: Get scored on communication skills
- Intelligent Feedback: Receive AI-generated suggestions
- Interview History: Track all interview sessions

 📹 Video Interview Module
- Live Video Recording: Record yourself answering questions
- Video Analysis: Advanced video performance metrics
- Facial Expression Analysis: Evaluate confidence and engagement
- Speech Analysis: Assess clarity and presentation
- Playback & Review: Watch and analyze your recordings

 🎙️ Voice Interview Module
- Voice Recording: Record audio responses
- Speech Analytics: Analyze pronunciation and clarity
- Tone Detection: Evaluate confidence and tone
- Audio Quality Assessment: Check microphone quality
- Voice Feedback: Personalized voice improvement suggestions

 📚 Question Management
- Curated Question Database: 1000+ interview questions
- Category-based Questions: Organized by job role and difficulty
- Search & Filter: Find questions by keywords
- Question Analytics: Track which questions you struggle with
- Admin Control: Add, edit, and manage questions (Admin only)

 📊 Advanced Analytics & Statistics
- Interview Performance Tracking: Monitor improvement over time
- Performance Metrics: Detailed breakdowns of strengths/weaknesses
- Comparison Analytics: Compare performance across interviews
- Progress Dashboard: Visualize your journey
- Export Reports: Download performance reports

 🎯 Interview Customization
- Difficulty Levels: Easy, Medium, Hard, Expert
- Interview Duration: Set your preferred duration
- Question Categories: Select specific topics
- Mock Type Selection: Choose interview format
- Custom Preferences: Personalized interview settings

 👤 User Management & Profiles
- User Registration: Secure account creation
- Profile Setup: Configure your profile information
- Preference Management: Customize your experience
- Interview History: View all past interviews
- Notifications: Real-time updates and alerts

 🔐 Authentication & Security
- JWT-based Authentication: Secure token-based auth
- Password Security: Bcrypt password hashing
- Session Management: Secure user sessions
- Email Verification: Confirm email addresses
- Profile Privacy: Control your data visibility

 👨‍💼 Admin Dashboard
- User Management: View and manage all users
- Question Management: Add, edit, delete interview questions
- Platform Statistics: Overall platform metrics
- User Analytics: Track user engagement
- Content Moderation: Review and approve content

 ⚙️ Tech Stack

 Frontend
- **Framework**: React 19.x 🛠️
- **Build Tool**: Vite 7.x ⚙️
- **Styling**: Tailwind CSS v4 🎨
- **Routing**: React Router 7.x 🗺️
- **State Management**: Context API / Redux 📦
- **HTTP Client**: Axios 🌐
- **Icons**: Tailwind Icons 🌟
- **Video/Audio**: React with Web APIs 📹

  Backend
- **Runtime**: Node.js 18+ 🟢
- **Framework**: Express.js 5.x 🚀
- **Database**: MongoDB + Mongoose 🗄️
- **Authentication**: JWT (jsonwebtoken) 🔑
- **Password Security**: Bcryptjs 🔐
- **AI Service Integration**: OpenAI API 🤖
- **Speech Analysis**: Web Speech API 🎙️
- **Utilities**: uuid, moment.js ⏰

  DevOps & Deployment
- **Frontend**: Vercel 🌐
- **Backend**: Render / Heroku 🚀
- **Database**: MongoDB Atlas 🗄️
- **Version Control**: Git + GitHub 🧑‍💻

 📁 Project Structure
```
MockVibe/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection setup
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT verification
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── InterviewSession.js        # Interview data model
│   │   ├── Question.js                # Questions database
│   │   ├── UserPreference.js          # User settings
│   │   └── Notification.js            # Notification model
│   ├── controllers/
│   │   ├── authController.js          # Auth logic
│   │   ├── aiInterviewController.js   # AI interview handling
│   │   ├── videoInterviewController.js # Video interview logic
│   │   ├── voiceInterviewController.js # Voice interview handling
│   │   ├── interviewController.js     # General interview logic
│   │   ├── questionController.js      # Question management
│   │   ├── statisticsController.js    # Analytics computation
│   │   ├── adminController.js         # Admin functions
│   │   ├── userController.js          # User management
│   │   ├── notificationController.js  # Notifications
│   │   └── preferencesController.js   # User preferences
│   ├── routes/
│   │   ├── authRoutes.js              # /api/auth/* routes
│   │   ├── aiInterviewRoutes.js       # /api/ai-interview/* routes
│   │   ├── advancedVideoRoutes.js     # /api/video/* routes
│   │   ├── voiceInterviewRoutes.js    # /api/voice/* routes
│   │   ├── interviewRoutes.js         # /api/interview/* routes
│   │   ├── questionRoutes.js          # /api/questions/* routes
│   │   ├── statisticsRoutes.js        # /api/statistics/* routes
│   │   ├── adminRoutes.js             # /api/admin/* routes
│   │   ├── userRoutes.js              # /api/users/* routes
│   │   ├── notificationRoutes.js      # /api/notifications/* routes
│   │   └── preferencesRoutes.js       # /api/preferences/* routes
│   ├── services/
│   │   ├── aiService.js               # AI integration service
│   │   ├── speechAnalysisService.js   # Speech analysis logic
│   │   └── codeExecutionService.js    # Code execution (if needed)
│   ├── utils/
│   │   ├── generateToken.js           # JWT generation
│   │   └── helpers.js                 # Utility functions
│   ├── .env
│   ├── .env.example
│   ├── server.js                      # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/                    # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx     # Route protection
│   │   │   ├── VideoInterview.jsx     # Video interview component
│   │   │   ├── VoiceInterview.jsx     # Voice interview component
│   │   │   ├── AIInterviewIllustration.jsx # AI interview UI
│   │   │   ├── AdvancedVideoInterview.jsx  # Advanced video features
│   │   │   └── FloatingStatsBadges.jsx    # Statistics display
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Home page
│   │   │   ├── Login.jsx              # Login page
│   │   │   ├── Register.jsx           # Registration page
│   │   │   ├── Dashboard.jsx          # User dashboard
│   │   │   ├── ProfileSetup.jsx       # Profile configuration
│   │   │   ├── InterviewCustomization.jsx # Interview setup
│   │   │   ├── InterviewSession.jsx   # Interview page
│   │   │   ├── InterviewResult.jsx    # Results & feedback
│   │   │   ├── InterviewHistory.jsx   # Past interviews
│   │   │   ├── PracticeMode.jsx       # Practice mode page
│   │   │   ├── Settings.jsx           # User settings
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx # Admin panel
│   │   │       ├── UserManagement.jsx # Manage users
│   │   │       └── QuestionManagement.jsx # Manage questions
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication context
│   │   ├── config/
│   │   │   └── api.js                 # API configuration
│   │   ├── App.jsx                    # Root component
│   │   ├── main.jsx                   # Entry point
│   │   ├── index.css                  # Global styles
│   │   ├── vite.config.js             # Vite configuration
│   │   ├── eslint.config.js           # ESLint rules
│   │   ├── .env                       # Environment variables
│   │   ├── .env.example               # Environment example
│   │   ├── index.html                 # HTML template
│   │   └── package.json
│
├── .gitignore
├── README.md
├── LICENSE
└── API_QUOTA_FALLBACK.md
```

 🚀 Installation

 Prerequisites
- Node.js 18+ and npm
- MongoDB (Local or Atlas)
- Git & GitHub
- OpenAI API Key (for AI interviews)

  1. Clone Repository
```bash
git clone https://github.com/yourusername/MockVibe.git
cd MockVibe
```

 2. Backend Setup
```bash
cd backend
npm install
```

 Create `.env` file in backend directory:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/mockvibe
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mockvibe

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# OpenAI API (for AI interviews)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

 Start backend server:**
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

 3. Frontend Setup
```bash
cd frontend
npm install
```

 Create `.env` file in frontend directory:**
```env
VITE_API_URL=http://localhost:5000/api
```

 Start frontend development server:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

 4. Access Application
Open your browser and navigate to: `http://localhost:5173`

 📝 API Endpoints

 Authentication
```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
GET    /api/auth/profile            - Get user profile
```

 Interview Management
```
POST   /api/interview/create        - Create new interview session
GET    /api/interview/:id           - Get interview details
POST   /api/interview/:id/submit    - Submit interview answers
GET    /api/interview/history       - Get interview history
DELETE /api/interview/:id           - Delete interview session
```

 AI Interviews
```
POST   /api/ai-interview/start      - Start AI interview session
POST   /api/ai-interview/:id/chat   - Send message to AI
GET    /api/ai-interview/:id        - Get AI interview progress
POST   /api/ai-interview/:id/end    - End AI interview
```

 Video Interviews
```
POST   /api/video/upload            - Upload video interview
GET    /api/video/:id               - Get video analysis
POST   /api/video/:id/analyze       - Analyze video performance
```

 Voice Interviews
```
POST   /api/voice/upload            - Upload voice interview
GET    /api/voice/:id               - Get voice analysis
POST   /api/voice/:id/analyze       - Analyze voice performance
```

 Questions
```
GET    /api/questions               - Get all questions
GET    /api/questions/:id           - Get specific question
GET    /api/questions/category/:cat - Get questions by category
POST   /api/questions               - Create question (Admin)
PUT    /api/questions/:id           - Update question (Admin)
DELETE /api/questions/:id           - Delete question (Admin)
```

 Statistics & Analytics
```
GET    /api/statistics/dashboard    - Get user dashboard stats
GET    /api/statistics/interview/:id - Get specific interview stats
GET    /api/statistics/performance  - Get performance metrics
```

 User Management
```
GET    /api/users/profile           - Get user profile
PUT    /api/users/profile           - Update user profile
GET    /api/users/preferences       - Get user preferences
PUT    /api/users/preferences       - Update preferences
```

 Admin Routes
```
GET    /api/admin/users             - List all users (Admin)
GET    /api/admin/questions         - Manage questions (Admin)
GET    /api/admin/analytics         - Platform analytics (Admin)
DELETE /api/admin/users/:id         - Delete user (Admin)
```

 Notifications
```
GET    /api/notifications           - Get user notifications
POST   /api/notifications/mark-read - Mark notification as read
DELETE /api/notifications/:id       - Delete notification
```

 🤝 Contributing
We welcome contributions! Please follow these guidelines:

 How to Contribute
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Code Standards
- Follow existing code style and conventions
- Write meaningful commit messages
- Ensure code passes linting: `npm run lint`
- Test your changes thoroughly

👤 Author
Designed and Developed with 💖 by Your Arpita Singh

🔗 Connect with me:
- 📧 [Email]()
- 💼 [LinkedIn](https://www.linkedin.com/in/singharpitaa05/)
- 🌐 [Portfolio](https://yourportfolio.com)
- 🐙 [GitHub](https://github.com/singharpitaa05)

📬 Feel free to reach out for questions, suggestions, or collaboration!

 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

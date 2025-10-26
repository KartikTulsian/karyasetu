# 🎉 KaryaSetu - Create. Collaborate. Celebrate.

**A unified platform for discovering, organizing, and celebrating college events across institutions.**

KaryaSetu is revolutionizing how students experience college life by creating a centralized hub for all academic and co-curricular events. Break institutional silos, discover opportunities beyond your campus, and build a vibrant inter-college community.

## 🌟 Overview

KaryaSetu addresses critical gaps in the current college event ecosystem:
- **Scattered Information**: No more hunting across multiple platforms for event details
- **Missed Opportunities**: Stay notified about all events across colleges
- **Limited Collaboration**: Connect and collaborate with students from different institutions
- **Lack of Recognition**: Build your portfolio with participation records and achievements

## ✨ Key Features

### 📊 Personalized Dashboard
- **Activity Timeline**: Track your event journey in one place
- **Event Calendar**: Never miss an important date
- **Team Management**: View and manage all your team participations
- **Portfolio Builder**: Your dashboard serves as a micro-resume for internships

### 🔍 Smart Event Discovery
- Browse events from your college and across institutions
- Filter by category, date, location, and event type
- Complete event details with integrated registration
- Real-time notifications for relevant events

### 🎯 Event Organization
- Create and manage events on behalf of your club or college
- Certified user verification for event organizers
- Post-event result uploads and media sharing
- Comprehensive event analytics and participation tracking

### 👥 Team Collaboration
- **Role-Based Recruitment**: Find team members with specific skills
- **Skill Matching**: Connect with students who have the expertise you need
- **Flexible Joining**: Accept invitations or submit offers to join teams
- **Cross-College Teams**: Collaborate beyond your campus boundaries

### 🏆 Results & Recognition
- Post-event result announcements
- Winner showcases and achievement highlights
- Photo and video galleries
- Certificate generation and distribution

### 🔐 Equal Access Model
- All users have equal base roles
- Organizer privileges granted per event
- Democratic and inclusive platform design
- Fair opportunity for all participants

## 🎯 Mission & Impact

KaryaSetu contributes to **UN Sustainable Development Goals**:

- **SDG 4 - Quality Education**: Promoting lifelong learning through diverse events
- **SDG 9 - Industry, Innovation & Infrastructure**: Building resilient digital infrastructure
- **SDG 17 - Partnerships for Goals**: Strengthening inter-college collaboration

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Runtime**: Node.js
- **IDE**: Visual Studio Code

### Frontend
- **Styling**: Tailwind CSS
- **Components**: React + JSX
- **Layout**: React Masonry for dynamic grids
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form + Zod validation

### Backend & Database
- **Database**: PostgreSQL
- **ORM**: Prisma Client
- **Validation**: Zod for schema validation
- **API Architecture**: RESTful APIs with Next.js API routes

### Authentication & Security
- **Authentication**: Clerk (Session management + RBAC)
- **Authorization**: Role-based access via database + event logic
- **Verification**: College email validation for organizers

### File Management
- **Storage**: Cloudinary via Next-Cloudinary
- **Support**: Images, PDFs, videos with MIME detection
- **Features**: Previews, PDF.js integration

### Analytics & Monitoring
- **Analytics**: Vercel Analytics / Plausible / Google Analytics
- **Error Tracking**: Sentry / LogRocket
- **Performance Monitoring**: Built-in Vercel analytics

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions / Vercel Pipelines
- **Hosting**: Vercel (Frontend + Serverless)
- **Self-Host Option**: Docker + Nginx + PostgreSQL
- **Package Manager**: npm / Yarn
- **Code Quality**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication
- Cloudinary account for media storage

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KartikTulsian/karyasetu.git
cd karyasetu
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/karyasetu"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Error Tracking (Optional)
SENTRY_DSN=your_sentry_dsn
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed initial data
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
karyasetu/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard pages
│   ├── events/            # Event-related pages
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
│   ├── db/               # Database utilities
│   ├── auth/             # Auth helpers
│   └── utils/            # Common utilities
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript definitions
```

## 🔧 Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!


### Self-Hosted Deployment with Docker
```bash
# Build Docker image
docker build -t karyasetu .

# Run container
docker run -p 3000:3000 karyasetu
```

Or use Docker Compose:
```bash
docker-compose up -d
```

## 🛡️ Security & Risk Mitigation

### Implemented Security Measures
- **Scalability**: Cloud-based architecture with CDN support
- **Authentication**: Clerk-based secure session management
- **Data Protection**: Encrypted database storage with HTTPS
- **Access Control**: Role-based permissions and event-level authorization
- **Content Moderation**: Verification layer for event creation
- **Vulnerability Testing**: Regular security audits

### Data Integrity
- College email validation for organizers
- Reporting mechanism for suspicious content
- Moderation queue for high-visibility posts
- Trusted status for frequent organizers

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Masonry Layout**: Dynamic, Pinterest-style event grid
- **Smooth Animations**: Framer Motion for delightful interactions
- **Dark Mode**: (Coming soon) Enhanced viewing experience
- **Accessibility**: WCAG 2.1 compliant design

## 🔄 Development Workflow

### Project Timeline
- ✅ Feasibility Study & SRS (18 Jul - 01 Aug 2025)
- 🔄 Design Documents (25 Jul - 08 Aug 2025)
- 🔄 Development Phase (25 Jul - 22 Aug 2025)
- ⏳ Implementation (08 Aug - 15 Aug 2025)
- ⏳ Testing & Debugging (15 Aug - 22 Aug 2025)
- ⏳ Quality Management (22 Aug - 29 Aug 2025)
- ⏳ Deployment (29 Aug - 12 Sep 2025)

## 🌐 Future Enhancements

- 🔔 Push notifications for mobile apps
- 🗺️ Interactive campus maps
- 🎫 QR code-based check-ins
- 📱 Native mobile applications
- 🤖 AI-powered event recommendations
- 🌍 Nationwide college network expansion

## 👥 Team

**Developed by IEM Software Engineering Lab (PCCCS594)**

- **Kartik Tulsian** (12023052004036) - Solution Architect & UI/UX Designer

**Mentored by:**
- Prof. Subhabrata Sengupta
- Prof. Dr. Rupayan Das

**Institution:** Department of Information Technology, Institute of Engineering and Management

## 📄 License

This project is part of an academic curriculum at IEM and is subject to institutional guidelines. For commercial use or licensing inquiries, please contact the team.

## 📞 Support & Contact

- 📧 Email: [kartiktulsian05172gmail.com]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication services
- Cloudinary for media management
- All contributors and testers
- IEM faculty for guidance and support

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM
- [Clerk Documentation](https://clerk.com/docs) - learn about authentication
- [Tailwind CSS](https://tailwindcss.com/docs) - learn about utility-first CSS

---

**Made with 💙 for the student community**

*Create. Collaborate. Celebrate. - Bringing college events together, one platform at a time.*
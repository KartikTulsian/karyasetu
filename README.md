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

## 📱 Web Application Demonstration

### 1. Landing Page - Hero Section
<img src="public\screenshots\img1.png" width="700" height="300" alt="Landing Page">

**Modern, Clean Homepage:**
- "One Platform. Every College Event."
- Discover, create, and celebrate college events like never before"

---

### 2. Sign In Page
<img src="public\screenshots\img2.png" width="700" height="300" alt="Sign In">

**Authentication Screen:**

---

### 3. Email Verification Screen
<img src="public\screenshots\img3.png" width="700" height="300" alt="Email Verification">

**Account Verification:**
- Verify Your Email
- Message will be sent
- Verification Code input field
- Clean, minimal security step
- Ensures valid institutional emails
- Part of signup flow for new users
- Prevents spam and fake accounts

---

### 4. First-Time User Welcome
<img src="public\screenshots\img4.png" width="700" height="300" alt="Welcome Screen">

**Onboarding Screen:**
- Welcome message
- Yellow "+" button to begin profile setup
- Guides new users to complete profile
- Simple, encouraging onboarding experience

---

### 5. Create New User Profile
<img src="public\screenshots\img5.png" width="700" height="300" alt="Create User">

**Complete Profile Setup Form:**
- Authentication Information
- Comprehensive form for new user registration
- Ensures complete profile data from start
- Part of initial onboarding flow
- Collects all necessary information at once

---

### 6. User Profile Dashboard
<img src="public\screenshots\img6.png" width="700" height="300" alt="Profile Dashboard">

**Personalized User Overview:**
- Your Stats cards
- Calendar widget
- Activity graph at bottom showing organized vs participated events

---

### 7. Update User Profile Modal
<img src="public\screenshots\im7.png" width="700" height="300" alt="Update Profile">

**Profile Editing Interface:**
- Modal overlay: "Update user"
- Authentication Information section
- Scrollable form with all profile fields

---

### 8. Profile with Activity Graph
<img src="public\screenshots\img8.png" width="700" height="300" alt="Profile Activity">

**User Activity Analytics:**
- Activity graph showing monthly participation:
- Visual representation of user engagement over time

---

### 9. Result Announcement Modal
<img src="public\screenshots\img9.png" width="700" height="300" alt="Result Announcement">

**Winner Declaration Screen:**
- Clean, organized information hierarchy

---

### 10. All Events Grid View
<img src="public\screenshots\img10.png" width="700" height="300" alt="All Events">

**Event Discovery Dashboard:**
- Grid layout showing events
- Edit/delete icons for own events
- Pagination at bottom

---

### 11. Event Details Page - Organizer View
<img src="public\screenshots\img11.png" width="700" height="300" alt="Event Details">

**Comprehensive Event Information:**
- Large hero image with details of the events

---

### 12. Full Event Details Page with participants
<img src="public\screenshots\img12.png" width="700" height="300" alt="Event Full Details">

**Complete Event Information:**
- Hero image
- Event description section
- Event Gallery section
- "Registered Participants" with participants
- Organizer contact

---

### 13. Event Registration - Team Creation
<img src="public\screenshots\img13.png" width="700" height="300" alt="Event Registration">

**Team Registration Form:**

---

### 14. Publish Result Dialog
<img src="public\screenshots\img14.png" width="700" height="300" alt="Publish Result">

**Winner Announcement Form:**
- Modal: "Create result" | "Publish Result"
- Result Text field (large textarea) for winner details
- Appears over event details page
- Simple, straightforward result publishing workflow

---

### 15. My Events - Created Tab
<img src="public\screenshots\img15.png" width="700" height="300" alt="My Events Created">

**Events I've Organized:**
- Clean card-based layout
- Option to view/edit created events

---

### 16. My Events - Participated Tab
<img src="public\screenshots\img16.png" width="700" height="300" alt="My Events Participated">

**Events I'm Attending:**
- Shows events where user is registered as participant
- Same clean layout as created events

---

### 17. All Offers Listing
<img src="public\screenshots\img17.png" width="700" height="300" alt="All Offers">

**Team Recruitment Hub:**
- Helps students find team members across colleges

---

### 18. Offer Details Modal
<img src="public\screenshots\img18.png" width="700" height="300" alt="Offer Details">

**Team Recruitment Request:**
- Clear call-out for required skills
- Facilitates skill-based team formation

---

### 19. Create New Offer Modal
<img src="public\screenshots\img19.png" width="700" height="300" alt="Create Offer">

**Team Recruitment Form:**
- Simple, focused form for posting recruitment needs
- Helps organizers or participants find team members

---

### 20. User's Created Offer - Detailed View
<img src="public\screenshots\img20.png" width="700" height="300" alt="User Offer Detail">

**Personal Offer Management:**
- User can manage their own posted offers

---

## 🎯 Key Features Demonstrated

**Event Management:**
- Create, edit, and delete events
- Publish results with media
- Track registrations and participants
- Comprehensive event details page

**User Experience:**
- Clean, modern UI with consistent branding
- Intuitive navigation and workflows
- Real-time updates and notifications
- Mobile-responsive design

**Collaboration:**
- Team recruitment offers
- Cross-college participation
- Skill-based matching
- Event discovery across institutions

**Security & Verification:**
- Email verification
- College authentication
- Role-based access control
- Profile completeness checks

**Analytics & Tracking:**
- Activity graphs
- Participation statistics
- Event performance metrics
- Personal dashboards

---

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
# Japan Trip Planner

A modern, comprehensive Japan trip planning application built with Next.js 15, featuring a beautiful Japanese tea house-inspired design and powerful collaborative planning tools.

## ✨ Features

### 🗾 **Comprehensive Trip Planning**
- **Interactive Itinerary**: Daily and timeline views with drag-and-drop scheduling
- **Hybrid Maps**: Mapbox GL JS with custom Japanese styling + Google Maps integration
- **Reservation Management**: Flights, hotels, trains, restaurants with QR code storage
- **Personal Checklists**: Separate lists per person with Japan travel essentials
- **Private Expense Tracking**: Budget monitoring with USD/JPY conversion
- **Activity Planning**: Sightseeing spots with priority ranking and completion tracking

### 🎌 **Modern Technology Stack**
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui with Japanese tea house theme
- **Backend**: Supabase (Database + Auth + Storage + Real-time)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Supabase adapter
- **State Management**: Zustand + TanStack Query
- **Maps**: Mapbox GL JS + Google Maps APIs
- **PWA**: Offline support for viewing trip data

### 🌸 **Japanese Tea House Design**
- **Color Palette**: Soft pastels, warm earth tones, sakura pink accents
- **Typography**: Clean, readable fonts with Japanese-inspired elements
- **Animations**: Subtle, zen-like transitions
- **Layout**: Minimalist design with plenty of whitespace
- **Mobile-first**: Responsive design optimized for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Mapbox account (optional)
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sciferguy/japan-trip-planner.git
   cd japan-trip-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your API keys:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   
   # Database Configuration
   DATABASE_URL=your_supabase_database_connection_string
   
   # Map API Keys (Optional)
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
japan-trip-planner/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── itinerary/            # Daily itinerary management
│   │   ├── map/                  # Interactive maps
│   │   ├── reservations/         # Booking management
│   │   ├── checklists/           # Personal task lists
│   │   ├── expenses/             # Private expense tracking
│   │   └── activities/           # Sightseeing planning
│   ├── globals.css               # Global styles with Japanese theme
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # Shadcn/ui components
│   ├── features/                 # Feature-specific components
│   └── maps/                     # Map-related components
├── lib/
│   ├── supabase/                 # Supabase client configuration
│   ├── auth/                     # Authentication utilities
│   ├── db.ts                     # Prisma client
│   └── utils.ts                  # Shared utilities
├── store/                        # Zustand state stores
│   ├── trip-store.ts
│   ├── itinerary-store.ts
│   └── map-store.ts
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── styles/                       # Additional styling
├── prisma/
│   └── schema.prisma             # Database schema
├── .env.example                  # Environment variables template
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json
```

## 🎨 Japanese Tea House Theme

The application features a carefully crafted design inspired by traditional Japanese tea houses:

### Color Palette
- **Sakura**: Pink cherry blossom tones for accents
- **Bamboo**: Natural green shades for nature elements
- **Stone**: Neutral grays for structure and text
- **Tea**: Warm brown tones for primary elements

### Design Principles
- **Minimalism**: Clean layouts with purposeful negative space
- **Zen Aesthetics**: Calming colors and subtle animations
- **Mobile-first**: Optimized for modern mobile usage
- **Accessibility**: WCAG compliant color contrasts and navigation

## 📊 Database Schema

The application uses a comprehensive PostgreSQL database with the following main entities:

- **Users**: Authentication and role management
- **Trips**: Main trip containers with date ranges
- **Trip Members**: User access control for collaborative planning
- **Itinerary Items**: Daily scheduled activities and events
- **Locations**: Geographic data with custom notes and pin types
- **Reservations**: Booking management across all categories
- **Checklist Items**: Personal task lists per user
- **Expenses**: Private expense tracking with categorization
- **Activities**: Sightseeing and experience planning

## 🔐 Authentication & Authorization

- **NextAuth.js v5**: Modern authentication with multiple providers
- **Supabase Integration**: Seamless database user management
- **Role-based Access**: Super users, collaborators, and viewers
- **Trip-level Permissions**: Granular access control per trip

## 🗺️ Map Integration

### Hybrid Approach
- **Mapbox GL JS**: Custom Japanese-inspired map styling
- **Google Maps APIs**: Comprehensive place data and directions
- **Offline Support**: Cached tiles for PWA functionality
- **Custom Pins**: Themed markers for different location types

## 📱 PWA Features

- **Offline Support**: View trip data without internet connection
- **Installable**: Add to home screen on mobile devices
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Reminders for reservations and check-ins

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **TypeScript**: Strict mode with comprehensive type definitions
- **ESLint**: Modern configuration with Next.js best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms
The application is built with standard Next.js 15 and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by traditional Japanese tea house aesthetics
- Built with modern web technologies and best practices
- Designed for collaborative trip planning with privacy in mind

---

**Built with ❤️ for planning the perfect Japan adventure**

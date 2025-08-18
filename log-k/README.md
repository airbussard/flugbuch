# Log-K - Professional Pilot Logbook

A modern, feature-rich digital pilot logbook built with Next.js 14, TypeScript, and Supabase. Designed for professional pilots with EASA/FAA compliance support.

## 🚀 Features

### Core Features
- ✈️ **Flight Logging** - Comprehensive flight data tracking with regulatory compliance fields
- 🛩️ **Fleet Management** - Track multiple aircraft with detailed specifications
- 👥 **Crew Management** - Manage crew members and assignments
- 📊 **Analytics Dashboard** - Visual insights into flight hours, landings, and aircraft usage
- 🌤️ **Weather Integration** - Real-time METAR/TAF data from NOAA
- 🗺️ **Flight Planning** - Route planning with calculations and weather briefing
- 📱 **PWA Support** - Works offline with progressive web app features
- 🌙 **Dark Mode** - Eye-friendly dark theme support

### Advanced Features
- 📄 **PDF Export** - Generate professional logbook PDFs
- 📁 **CSV Import/Export** - Bulk data management
- 🔄 **Real-time Sync** - Live updates across devices using Supabase
- 🔍 **Global Search** - Quick access to flights, aircraft, and crew
- 🔐 **Secure Authentication** - Supabase Auth with email/password
- 📱 **Responsive Design** - Optimized for desktop and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer
- **CSV Parsing**: Papaparse
- **Maps**: Mapbox GL (optional)
- **Deployment**: Docker/CapRover

## 📦 Installation

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/airbussard/flugbuch.git
cd flugbuch/log-k
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.production .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t log-k \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -f ../Dockerfile ..
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

### CapRover Deployment

1. Ensure `captain-definition` is in the root directory
2. Add CapRover remote:
```bash
caprover deploy -h https://captain.yourdomain.com -a log-k
```

3. Set environment variables in CapRover dashboard

### Manual Deployment

1. Build for production:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 🗄️ Database Setup

Run the following SQL in your Supabase dashboard:

```sql
-- Create tables for flights, aircraft, crew_members
-- Enable RLS policies
-- Create indexes for performance

-- See /supabase/migrations for complete schema
```

## 🔐 Security

- Row-Level Security (RLS) enabled on all tables
- User data isolation
- Secure authentication flow
- Environment variables for sensitive data
- HTTPS enforced in production
- Security headers configured

## 📊 Performance

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies implemented
- Standalone output for minimal Docker image
- Health check endpoint for monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token for maps | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking | No |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced weather layers
- [ ] Flight sharing features
- [ ] Training mode for students
- [ ] Integration with EFB systems
- [ ] Automated EASA/FAA reports

---

Built with ❤️ for pilots, by pilots
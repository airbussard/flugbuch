# Log-K Pilot Logbook - Claude Code Development Documentation

## 📱 App Overview

**Log-K** is a modern pilot logbook web application built with Next.js 15, TypeScript, and Tailwind CSS. It features Supabase for backend services (PostgreSQL database, authentication, real-time sync), comprehensive flight tracking, aircraft fleet management, crew assignments, weather integration, and regulatory compliance calculations for both EASA and FAA.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to CapRover
git add .
git commit -m "Your commit message"
git push caprover main
```

## 📦 Version Management

### Version Schema: `MAJOR.MINOR.PATCH`

- **Current Version**: `0.1.030` (30 commits as of project start)
- **Format**: `0.1.XXX` where XXX starts at 000
- **Increment**: +1 for each commit
- **Rollover**: At 0.1.999 → 0.2.000
- **Major version**: Reserved for significant releases

### Version Update Process

1. Before each commit, increment the version in `package.json`
2. Version is displayed in the footer of the application
3. Format: `0.1.XXX` where XXX = commit count since project start

Example progression:
- Commit 30: `0.1.030`
- Commit 31: `0.1.031`
- ...
- Commit 999: `0.1.999`
- Commit 1000: `0.2.000`

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: CapRover (Docker-based PaaS)
- **Maps**: Leaflet (no API keys required)
- **Weather**: aviationweather.gov API (proxy through Next.js API routes)

### Key Features
- ✈️ Comprehensive flight logging with EASA/FAA compliance
- 👥 Crew management and assignments
- 🛩️ Aircraft fleet tracking
- 🌤️ Real-time weather integration (METAR/TAF)
- 🗺️ Airport weather map with flight categories
- 📊 Analytics and statistics
- 📱 Responsive design for all devices

### Database Schema (Supabase)

#### Core Tables
- `flights` - Flight records with compliance fields
- `aircrafts` - Fleet management
- `crew_members` - Crew database
- `user_profiles` - User personalization
- `flight_roles` - Crew assignments per flight

#### Key Fields
- All tables include `user_id` for data isolation
- Soft delete pattern with `deleted` boolean field
- Timestamps: `created_at`, `updated_at`
- UUID primary keys for all entities

### API Routes Structure

```
/api/
├── weather/
│   ├── metar/         # Single airport METAR
│   ├── taf/           # Terminal Area Forecast
│   └── batch-metar/   # Multiple airports weather
└── [future endpoints]
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dqzqzbkgxboklbdsdmvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# Optional (for production)
NODE_ENV=production
```

### CapRover Deployment

The app is configured for CapRover deployment with:
- Dockerfile optimized for Next.js standalone output
- Runtime environment variable injection
- Automatic SSL through CapRover

## 🛡️ Security

### Implemented Measures
- Row-Level Security (RLS) in Supabase
- User data isolation via `user_id` foreign keys
- Secure authentication with Supabase Auth
- API route protection with auth checks
- CORS handling for external APIs

## 📝 Development Guidelines

### Commit Standards
1. Increment version in `package.json` before committing
2. Use descriptive commit messages
3. Include relevant emoji prefixes:
   - 🎯 Features
   - 🐛 Bug fixes
   - 📚 Documentation
   - 🎨 UI/UX improvements
   - ⚡ Performance
   - 🔧 Configuration

### Code Style
- TypeScript strict mode enabled
- Functional components with hooks
- Async/await for data fetching
- Tailwind CSS for styling
- Component-based architecture

### Testing Checklist
- [ ] Test locally with `npm run dev`
- [ ] Verify database operations
- [ ] Check responsive design
- [ ] Test authentication flows
- [ ] Validate form inputs
- [ ] Verify weather API integration

## 🚢 Deployment Process

### CapRover Deployment Steps

1. **Prepare for deployment**:
   ```bash
   npm run build  # Test build locally
   ```

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "🚀 Version 0.1.XXX: Your changes"
   git push caprover main
   ```

3. **Monitor deployment**:
   - Check CapRover dashboard
   - Verify app is running at log-k.com
   - Check logs for any errors

### Troubleshooting CapRover

If deployment fails:
1. Check CapRover logs
2. Verify environment variables are set
3. Try forcing a rebuild in CapRover UI
4. As last resort, create new app instance

## 🌟 Recent Updates

### Version 0.1.037
- ✅ Implemented Service Role Key admin access for bypassing RLS
- ✅ Created comprehensive User Management page
- ✅ Admin can now see ALL users and their data
- ✅ Added toggle admin status functionality
- ✅ User Management button in admin dashboard now functional
- ✅ Added user statistics (total, admins, active users)

### Version 0.1.035
- ✅ Implemented notification system for license/medical expiry warnings
- ✅ Added landing currency tracking (3 landings in 90 days requirement)
- ✅ Dark Mode toggle temporarily hidden in settings
- ✅ NotificationBell component shows expiry dates and warnings
- ✅ TopBar displays user name instead of email when available
- ✅ Real-time calculation of regulatory compliance status

### Version 0.1.034
- ✅ Fixed database queries: user_profiles uses 'id' as primary key (not 'user_id')
- ✅ Settings now properly loads and displays user data
- ✅ Admin dashboard visibility fixed for admin users
- ✅ Corrected all Supabase queries to match actual DB schema
- ✅ Fixed user profile joins in admin dashboard

### Version 0.1.033  
- Initial admin system implementation (had DB schema issues)

### Version 0.1.032
- ✅ Settings page now loads real user data from database
- ✅ Added /profile route (redirects to settings)
- ✅ Implemented admin system with conditional menu
- ✅ Created admin dashboard with system statistics
- ✅ Added CSV export functionality for flights
- ✅ Fixed empty form fields in settings

### Version 0.1.031
- ✅ Fixed airport weather map with flight category calculation
- ✅ Added personalized dashboard greeting
- ✅ Implemented 12-month trend analysis
- ✅ Re-enabled sidebar logo
- ✅ Added version footer
- ✅ Created CLAUDE.md documentation

## 📋 Known Issues & TODOs

### Current Issues
- None reported

### Future Enhancements
- [ ] PDF export functionality
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Offline support
- [ ] Multi-language support

## 🤝 Contributing

When working on this project:
1. Always increment version number
2. Test thoroughly before committing
3. Update this documentation as needed
4. Follow the established patterns

## 📞 Support

For issues or questions:
- Check CapRover logs
- Review Supabase dashboard
- Consult this documentation
- Test in development first

---

**Last Updated**: Version 0.1.030
**Maintained with**: Claude Code
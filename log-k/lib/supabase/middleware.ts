import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SubscriptionTier, AppFeature } from '@/lib/subscription/types'

// Feature access mapping for routes
const ROUTE_FEATURES: Record<string, AppFeature> = {
  '/dashboard': 'flights', // Dashboard requires flights access
  '/flights': 'flights',
  '/fleet': 'fleet',
  '/crew': 'crew',
  '/analytics': 'analytics',
  '/planning': 'flights',
  '/weather': 'weather',
  '/airports': 'airports',
  '/settings': 'settings',
  '/admin': 'admin'
}

// Routes that are always accessible (even without subscription)
const ALWAYS_ACCESSIBLE = [
  '/settings',
  '/subscription',
  '/api/account/delete' // Allow account deletion
]

// Feature access by tier (simplified for middleware)
const TIER_FEATURES: Record<SubscriptionTier, AppFeature[]> = {
  'none': ['settings'],
  'trial': ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync'],
  'basic': ['weather', 'airports', 'settings'],
  'premium': ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync'],
  'enterprise': ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync', 'admin']
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check auth status
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected routes - all dashboard group routes
  const protectedRoutes = [
    '/dashboard',
    '/flights',
    '/fleet', 
    '/crew',
    '/analytics',
    '/planning',
    '/weather',
    '/airports',
    '/settings',
    '/admin'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Redirect to login if not authenticated
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check subscription status for authenticated users
  if (user && isProtectedRoute) {
    // Check if route is always accessible
    const isAlwaysAccessible = ALWAYS_ACCESSIBLE.some(route => 
      pathname.startsWith(route)
    )
    
    if (!isAlwaysAccessible) {
      // Get user's subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, valid_until')
        .eq('user_id', user.id)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const tier = (subscription?.subscription_tier || 'none') as SubscriptionTier
      
      // Find required feature for this route
      const requiredFeature = Object.entries(ROUTE_FEATURES).find(([route]) => 
        pathname.startsWith(route)
      )?.[1]

      if (requiredFeature) {
        const allowedFeatures = TIER_FEATURES[tier] || []
        
        // If user doesn't have access to this feature, redirect to subscription page
        if (!allowedFeatures.includes(requiredFeature)) {
          // Add query param to indicate which feature was attempted
          const url = new URL('/subscription/choose', request.url)
          url.searchParams.set('feature', requiredFeature)
          url.searchParams.set('return_to', pathname)
          return NextResponse.redirect(url)
        }
      }

      // Check if trial/subscription is expired
      if (subscription && new Date(subscription.valid_until) < new Date()) {
        // Expired - redirect to subscription page (except for always accessible routes)
        const url = new URL('/subscription/choose', request.url)
        url.searchParams.set('expired', 'true')
        url.searchParams.set('return_to', pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
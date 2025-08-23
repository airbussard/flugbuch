import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that are ALWAYS accessible (even without active subscription)
const ALWAYS_ACCESSIBLE = [
  '/settings',              // Account settings
  '/subscription',          // Subscription management
  '/api/account/delete',    // Account deletion API
  '/api/subscription',      // Subscription APIs
  '/logout'                 // Logout
]

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
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
    '/admin',
    '/profile'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if route is always accessible
  const isAlwaysAccessible = ALWAYS_ACCESSIBLE.some(route => 
    pathname.startsWith(route)
  )
  
  // Redirect to login if not authenticated
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check subscription for authenticated users on protected routes
  if (user && isProtectedRoute && !isAlwaysAccessible) {
    // Only check subscription once per session (cache in cookie for 1 hour)
    const hasCheckedRecently = request.cookies.has('sub-check')
    
    if (!hasCheckedRecently) {
      // Check user's subscription status
      // Use maybeSingle() to handle cases where user has no subscription record at all
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, subscription_source, valid_until')
        .eq('user_id', user.id)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Set cookie to avoid repeated checks
      supabaseResponse.cookies.set('sub-check', '1', {
        maxAge: 60 * 60, // 1 hour
        httpOnly: true
      })

      // If no active subscription (including trials), redirect to expired page
      // This includes:
      // - Users with no subscription record at all (legacy accounts)
      // - Users with expired subscriptions
      // - Users whose trial has ended
      // Note: Trials have subscription_tier='pro' with subscription_source='trial'
      if (!subscription) {
        const url = new URL('/subscription/expired', request.url)
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
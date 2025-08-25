# Registration Fix Guide - RLS Policy Violation

## Problem Summary
Users cannot register due to RLS (Row-Level Security) policy violation when creating `user_profiles` entries. The error occurs because `auth.uid()` is not immediately available after `signUp()`.

Error: `new row violates row-level security policy for table user_profiles` (code 42501)

## Solutions Implemented

### 1. Debug Tools
- **Debug API Endpoint**: `/api/auth/debug-register` - Comprehensive registration testing
- **Debug Page**: `/debug-auth` - Interactive testing interface
- **Console Logging**: Enable with `NEXT_PUBLIC_DEBUG_AUTH=true` or `localStorage.setItem('debug_auth', 'true')`

### 2. Client-Side Fix (RegisterForm.tsx)
- Added retry logic with 3 attempts
- 1-second delay between attempts
- Comprehensive debug logging
- Session verification between retries

### 3. Server-Side Handler (/api/auth/register)
- Uses service role key to bypass RLS
- Fallback to regular client with retry
- Returns partial success if profile fails

### 4. Database Trigger (Recommended Solution)
Automatically creates user_profiles when users sign up.

**To apply this fix:**
1. Run in Supabase SQL Editor:
```sql
-- File: 20240825_create_user_profile_trigger.sql
-- This creates a trigger that automatically creates profiles
-- Copy the entire SQL file content and run it
```

### 5. Manual Profile Creation Function
If profile is missing, users can call:
```sql
SELECT ensure_user_profile();
```

## Deployment Steps for Caprover

### 1. Add Environment Variables
In Caprover app configuration:
```bash
NEXT_PUBLIC_DEBUG_AUTH=true
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Find the service role key in: Supabase Dashboard → Settings → API → Service Role Key

### 2. Apply SQL Migrations
Run these in order in Supabase SQL Editor:

1. **Debug Function** (optional but helpful):
```sql
-- From: 20240825_create_auth_debug_function.sql
```

2. **Profile Trigger** (CRITICAL - this is the main fix):
```sql
-- From: 20240825_create_user_profile_trigger.sql
```

### 3. Deploy the Application
```bash
npm run build
# Deploy to Caprover
```

### 4. Test Registration
1. Go to `/debug-auth` page
2. Click "Enable Debug Mode"
3. Try "Test Debug Registration API"
4. Check console for detailed logs

## Verification Steps

### Check if Trigger Exists:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

### Check RLS Policies:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'user_profiles';
```

### Test Manual Profile Creation:
```sql
-- As authenticated user
SELECT ensure_user_profile();
```

## Troubleshooting

### If registration still fails:

1. **Check Service Role Key**:
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Caprover
   - This allows server-side bypass of RLS

2. **Verify Trigger is Active**:
   - The trigger should auto-create profiles
   - Check Supabase logs for trigger errors

3. **Use Debug Mode**:
   - Set `NEXT_PUBLIC_DEBUG_AUTH=true`
   - Check browser console for detailed logs
   - Use `/debug-auth` page for testing

4. **Fallback Option**:
   - Users can sign up first
   - Then call `ensure_user_profile()` to create profile
   - Can be done via API or SQL function

## Key Files Modified

- `/app/(auth)/register/RegisterForm.tsx` - Added retry logic and debug logging
- `/app/api/auth/register/route.ts` - Server-side handler with service role
- `/app/api/auth/debug-register/route.ts` - Debug endpoint
- `/app/(auth)/debug-auth/page.tsx` - Debug interface
- `/supabase/migrations/20240825_create_user_profile_trigger.sql` - Auto-create trigger
- `/supabase/migrations/20240825_create_auth_debug_function.sql` - Debug helper

## The Root Cause

The issue occurs because:
1. `supabase.auth.signUp()` creates user in `auth.users`
2. Immediately trying to INSERT into `user_profiles` 
3. RLS policy checks `auth.uid() = id`
4. But `auth.uid()` is not yet available in the database session
5. This causes the RLS check to fail

The trigger solution bypasses this by:
- Running with SECURITY DEFINER
- Creating profile automatically when auth.users INSERT happens
- No client-side action needed
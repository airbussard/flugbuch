# Admin Panel Setup Guide

## Required: Service Role Key Configuration

The admin panel requires a Supabase Service Role Key to function properly. Without this key, admin pages like `/admin/subscriptions` will appear empty.

### Why is this needed?

The Service Role Key allows the admin panel to:
- Bypass Row Level Security (RLS) policies
- Access all users' data (not just the current user)
- Perform administrative operations like managing subscriptions

### How to get your Service Role Key:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (dqzqzbkgxboklbdsdmvf)
3. Navigate to **Settings** → **API**
4. Find the **service_role** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI...`)
5. Copy the entire key

### How to configure it:

1. Open `.env.local` in your project root
2. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...your-actual-key-here
   ```
3. Restart your development server or redeploy to production

### Security Warning ⚠️

**NEVER expose the Service Role Key to the client/browser!**

- This key has FULL database access
- It bypasses ALL security policies
- Only use it in server-side code
- Never commit it to version control
- Never use it with `NEXT_PUBLIC_` prefix

### Verifying it works:

After adding the key:
1. Visit `/admin/subscriptions`
2. You should now see subscription data instead of a warning message
3. The admin panel should have full access to manage users and subscriptions

### Troubleshooting:

If the admin panel is still empty after adding the key:
1. Make sure you copied the entire key (it's very long)
2. Check there are no extra spaces or line breaks
3. Restart your Next.js server
4. Check the browser console for any error messages
5. Verify you're logged in as an admin user (is_admin = true in user_profiles)

### Production Deployment:

For production (log-k.com), add the service role key to your hosting platform's environment variables:
- Vercel: Project Settings → Environment Variables
- Railway: Variables tab
- Other platforms: Check their documentation for environment variable configuration

Remember: The key should ONLY be added as `SUPABASE_SERVICE_ROLE_KEY`, never with the `NEXT_PUBLIC_` prefix!
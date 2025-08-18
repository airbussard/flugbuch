# CapRover Deployment Guide for Log-K

## ⚠️ Important: Environment Variables Configuration

The 502 Bad Gateway error occurs when environment variables are not properly configured. Follow these steps carefully:

## 1. Set Environment Variables in CapRover

In your CapRover dashboard for the `log-k` app, go to **App Configs** → **Environmental Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://dqzqzbkgxboklbdsdmvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-actual-anon-key-here]
```

**IMPORTANT**: Replace `[your-actual-anon-key-here]` with your actual Supabase anonymous key!

## 2. Configure Build Arguments

In CapRover dashboard, go to **App Configs** → **Build Configurations** and add these build arguments:

```
NEXT_PUBLIC_SUPABASE_URL=https://dqzqzbkgxboklbdsdmvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-actual-anon-key-here]
```

## 3. Deploy Steps

1. First, set the environment variables as described above
2. Then push your code:
```bash
git add -A
git commit -m "Fix deployment configuration"
git push origin main
```

3. In CapRover, trigger a new deployment or use CLI:
```bash
caprover deploy -h https://captain.yourdomain.com -a log-k
```

## 4. Verify Deployment

After deployment, check:
1. Application logs in CapRover dashboard
2. Visit https://log-k.com/api/health - should return JSON with status "healthy"
3. Main site should redirect to /dashboard

## 5. Troubleshooting

### Still getting 502 error?

1. **Check logs**: In CapRover dashboard → View App Logs
2. **Common issues**:
   - Missing environment variables (most common)
   - Port mismatch (app should listen on 3000)
   - Build failed silently

### Debug Commands

SSH into your CapRover server and run:
```bash
# Check if container is running
docker ps | grep log-k

# View container logs
docker logs srv-captain--log-k

# Check environment variables inside container
docker exec srv-captain--log-k env | grep SUPABASE
```

## 6. Alternative: Using .env File

If environment variables aren't working, you can create a `.env.production` file:

1. Create file `log-k/.env.production`:
```
NEXT_PUBLIC_SUPABASE_URL=https://dqzqzbkgxboklbdsdmvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
```

2. Update Dockerfile to copy it:
```dockerfile
COPY log-k/.env.production ./
```

**Note**: This is less secure as it embeds credentials in the image.

## 7. Required CapRover Settings

Ensure these settings in CapRover:
- **Port mapping**: 3000 (container) → 80 (host)
- **Persistent directories**: None required (stateless app)
- **Health check path**: `/api/health`
- **Restart policy**: Unless stopped

## Contact Support

If issues persist, check:
- Supabase dashboard for API status
- CapRover GitHub issues
- Application logs for specific error messages
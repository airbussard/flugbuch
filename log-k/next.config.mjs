/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['dqzqzbkgxboklbdsdmvf.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts', '@supabase/supabase-js'],
  },
}

export default nextConfig
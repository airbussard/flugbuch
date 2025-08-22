import HeroSlider from '@/components/layout/HeroSlider'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <HeroSlider className="fixed inset-0">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </HeroSlider>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/partners/store/authStore'
import Sidebar from '@/app/partners/components/layout/Sidebar'
import Header from '@/app/partners/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

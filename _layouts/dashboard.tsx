import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Sidebar } from '@/components/sidebar'
import { AuthContext } from '@/contexts/AuthContext'

export function DashboardLayout() {
  const { isAuthenticated, isProfileLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isProfileLoading && !isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate, isProfileLoading])

  return (
    <div className="min-h-screen antialiased lg:grid lg:grid-cols-app">
      <Sidebar />

      <main className="overflow-x-hidden px-4 pb-12 pt-[72px] lg:col-start-2 lg:px-8 lg:py-4">
        <Outlet />
      </main>
    </div>
  )
}

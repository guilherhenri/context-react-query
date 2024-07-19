import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import logo from '@/assets/images/logo.webp'
import { AuthContext } from '@/contexts/AuthContext'

export function AuthLayout() {
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <main className="flex-center min-h-[100vh] w-full p-8">
      <div className="flex w-[400px] flex-col rounded-lg bg-black px-6 py-8">
        <div className="flex-center mb-6 w-full">
          <img src={logo} alt="Logo" width={200} />
        </div>

        <Outlet />
      </div>
    </main>
  )
}

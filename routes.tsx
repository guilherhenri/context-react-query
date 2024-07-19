import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from './pages/_layouts/auth'
import { DashboardLayout } from './pages/_layouts/dashboard'
import { NotFound } from './pages/404'
import { RecoverPassword } from './pages/auth/recover-password'
import { SignIn } from './pages/auth/sign-in'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/', element: <SignIn /> },
      { path: '/esqueceu-senha', element: <RecoverPassword /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

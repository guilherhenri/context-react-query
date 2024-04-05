import { useMutation, useQuery } from '@tanstack/react-query'
import cookies from 'js-cookie'
import { createContext, ReactNode, useEffect, useState } from 'react'

import { getProfile } from '@/api/get-profile'
import { signIn } from '@/api/sign-in'
import { api } from '@/lib/axios'

type User = {
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

type SignInCredentials = {
  email: string
  password: string
  cpf?: string
}

type AuthContextData = {
  authenticate(credentials: SignInCredentials): Promise<void>
  user?: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  const token = cookies.get('srbanco.token')

  const { mutateAsync: authenticateFn } = useMutation({
    mutationFn: signIn,
  })
  const { data: profile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (isError || !token) {
      cookies.remove('srbanco.token')
      cookies.remove('srbanco.refreshToken')

      setUser(undefined)
    } else {
      if (profile) {
        const { name, email, role } = profile

        setUser({
          name,
          email,
          role,
        })
      }
    }
  }, [profile, isError, token])

  async function authenticate({ email, password, cpf }: SignInCredentials) {
    const {
      token,
      user: { name, role },
    } = await authenticateFn({ email, password, cpf })

    cookies.set('srbanco.token', token, {
      expires: 30, // 30 days
      path: '/',
    })

    setUser({
      name,
      email,
      role,
    })

    api.defaults.headers.Authorization = `Bearer ${token}`
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, user }}>
      {children}
    </AuthContext.Provider>
  )
}

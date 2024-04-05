import axios, { AxiosError } from 'axios'
import cookies from 'js-cookie'

import { refreshToken } from '@/api/refresh-token'
import { env } from '@/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${cookies.get('srbanco.token')}`,
  },
})

type ErrorResponse = {
  message: string
  code?: string
}

interface FailedRequestsQueue {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError) => void
}

let isRefreshing = false
let failedRequestsQueue: FailedRequestsQueue[] = []

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const errorResponse = error.response?.data as ErrorResponse

      if (errorResponse.code === 'token.expired') {
        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true

          refreshToken()
            .then(({ token }) => {
              cookies.set('srbanco.token', token, {
                expires: 30, // 30 days
                path: '/',
              })

              failedRequestsQueue.forEach((request) => request.onSuccess(token))
              failedRequestsQueue = []
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onFailure(err))
              failedRequestsQueue = []
            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (originalConfig) {
                originalConfig.headers.Authorization = `Bearer ${token}`

                resolve(api(originalConfig))
              }
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            },
          })
        })
      } else {
        cookies.remove('srbanco.token')
        cookies.remove('srbanco.refreshToken')
      }
    }

    return Promise.reject(error)
  },
)

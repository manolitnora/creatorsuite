import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add request interceptor for authentication
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  
  if (session?.user?.access_token) {
    config.headers.Authorization = `Bearer ${session.user.access_token}`
  }
  
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

// API Key Management
export const apiKeyService = {
  async listApiKeys() {
    const response = await api.get('/api/settings/api-keys')
    return response.data
  },

  async createApiKey(name: string, scopes: string[]) {
    const response = await api.post('/api/settings/api-keys', { name, scopes })
    return response.data
  },

  async deleteApiKey(keyId: string) {
    await api.delete(`/api/settings/api-keys/${keyId}`)
  },

  async regenerateApiKey(keyId: string) {
    const response = await api.post(`/api/settings/api-keys/${keyId}/regenerate`)
    return response.data
  },
}

export default api

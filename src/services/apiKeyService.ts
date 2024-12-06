import { ApiKey } from '@/types/settings'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiKeyService = {
  async listApiKeys(): Promise<ApiKey[]> {
    const response = await fetch(`${API_BASE_URL}/api/settings/api-keys`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch API keys')
    }

    return response.json()
  },

  async createApiKey(name: string, scopes: string[]): Promise<ApiKey> {
    const response = await fetch(`${API_BASE_URL}/api/settings/api-keys`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, scopes }),
    })

    if (!response.ok) {
      throw new Error('Failed to create API key')
    }

    return response.json()
  },

  async deleteApiKey(keyId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/settings/api-keys/${keyId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete API key')
    }
  },

  async regenerateApiKey(keyId: string): Promise<ApiKey> {
    const response = await fetch(`${API_BASE_URL}/api/settings/api-keys/${keyId}/regenerate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to regenerate API key')
    }

    return response.json()
  },
}

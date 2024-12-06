import api from './api'
import { Platform } from '@/types/content'

export interface Post {
  id: string
  content: string
  platform: Platform
  status: 'scheduled' | 'published' | 'draft'
  scheduledTime?: string
  publishedTime?: string
  media?: Array<{
    id: string
    url: string
    type: string
  }>
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

export interface PlatformStatus {
  platform: Platform
  status: 'healthy' | 'warning' | 'error'
  apiQuota: {
    used: number
    total: number
  }
  lastSync: string
  message?: string
}

export const socialService = {
  getPosts: async (filters?: {
    platform?: Platform
    status?: Post['status']
    search?: string
  }): Promise<Post[]> => {
    const response = await api.get('/social-media/posts', { params: filters })
    return response.data
  },

  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await api.post('/social-media/posts', post)
    return response.data
  },

  updatePost: async (id: string, post: Partial<Post>): Promise<Post> => {
    const response = await api.patch(`/social-media/posts/${id}`, post)
    return response.data
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/social-media/posts/${id}`)
  },

  uploadMedia: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/social-media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getAnalytics: async (postId: string): Promise<{
    impressions: number
    engagement: number
    clicks: number
    demographics: any
  }> => {
    const response = await api.get(`/social-media/posts/${postId}/analytics`)
    return response.data
  },

  getPlatformStatus: async (platforms?: Platform[]): Promise<PlatformStatus[]> => {
    const response = await api.get('/social-media/platform-health', {
      params: { platforms },
    })
    return response.data
  },

  verifyPlatformConnection: async (platform: Platform): Promise<{
    success: boolean
    message?: string
  }> => {
    const response = await api.post('/social-media/verify-connection', {
      platform,
    })
    return response.data
  },
}

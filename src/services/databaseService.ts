import prisma from './db'
import { randomUUID } from 'crypto'

export interface UserPreferences {
  goals: string[]
  platforms: string[]
  contentTypes: string[]
  postingFrequency: string
  targetAudience: string
  industryFocus: string
  onboardingCompleted: boolean
}

export interface PlatformCredentials {
  platform: string
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
}

class DatabaseService {
  // User Preferences
  async getUserPreferences(userEmail: string) {
    return await prisma.userPreferences.findUnique({
      where: { userEmail },
    })
  }

  async updateUserPreferences(userEmail: string, data: Partial<UserPreferences>) {
    return await prisma.userPreferences.upsert({
      where: { userEmail },
      update: data,
      create: {
        userEmail,
        ...data,
        goals: data.goals || [],
        platforms: data.platforms || [],
        contentTypes: data.contentTypes || [],
      },
    })
  }

  // Platform Credentials
  async getPlatformCredentials(userEmail: string, platform: string) {
    return await prisma.platformCredentials.findUnique({
      where: {
        userEmail_platform: {
          userEmail,
          platform,
        },
      },
    })
  }

  async updatePlatformCredentials(
    userEmail: string,
    platform: string,
    credentials: {
      accessToken: string
      refreshToken?: string
      expiresAt?: Date
    }
  ) {
    return await prisma.platformCredentials.upsert({
      where: {
        userEmail_platform: {
          userEmail,
          platform,
        },
      },
      update: credentials,
      create: {
        userEmail,
        platform,
        ...credentials,
      },
    })
  }

  // OAuth State
  async createOAuthState(userEmail: string, platform: string) {
    const state = randomUUID()
    await prisma.oAuthState.create({
      data: {
        state,
        platform,
        userEmail,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })
    return state
  }

  async verifyOAuthState(state: string, userEmail: string, platform: string) {
    const oauthState = await prisma.oAuthState.findFirst({
      where: {
        state,
        userEmail,
        platform,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (oauthState) {
      await prisma.oAuthState.update({
        where: { id: oauthState.id },
        data: { used: true },
      })
      return true
    }

    return false
  }

  // User Management
  async getUser(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        preferences: true,
        platformCredentials: true,
      },
    })
  }

  async createUser(email: string, name?: string, image?: string) {
    return await prisma.user.create({
      data: {
        email,
        name,
        image,
      },
    })
  }
}

// Export a singleton instance
export const db = new DatabaseService()

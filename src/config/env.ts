import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_WS_URL: z.string().url(),

  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_AUTH_ENABLED: z.string().transform((val) => val === 'true'),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_AB_TESTING: z.string().transform((val) => val === 'true'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform((val) => val === 'true'),
  NEXT_PUBLIC_ENABLE_AI_ASSISTANT: z.string().transform((val) => val === 'true'),

  // External Services
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Content Delivery
  NEXT_PUBLIC_MEDIA_URL: z.string().url(),
  NEXT_PUBLIC_ASSETS_URL: z.string().url(),

  // Social Media Platforms
  NEXT_PUBLIC_ENABLED_PLATFORMS: z.string().transform((val) => val.split(',')),

  // Performance
  NEXT_PUBLIC_API_TIMEOUT: z.string().transform((val) => parseInt(val, 10)),
  NEXT_PUBLIC_CACHE_MAX_AGE: z.string().transform((val) => parseInt(val, 10)),

  // Development
  NEXT_PUBLIC_DEBUG_MODE: z.string().transform((val) => val === 'true'),
  NEXT_PUBLIC_API_MOCK: z.string().transform((val) => val === 'true'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ');
      throw new Error(
        `❌ Invalid environment variables: ${missingVars}. Please check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();

// Feature flag checks
export const isFeatureEnabled = {
  abTesting: env.NEXT_PUBLIC_ENABLE_AB_TESTING,
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  aiAssistant: env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT,
};

// API configuration
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  wsUrl: env.NEXT_PUBLIC_WS_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  mockEnabled: env.NEXT_PUBLIC_API_MOCK,
};

// Content delivery configuration
export const contentConfig = {
  mediaUrl: env.NEXT_PUBLIC_MEDIA_URL,
  assetsUrl: env.NEXT_PUBLIC_ASSETS_URL,
};

// Social media platforms
export const enabledPlatforms = env.NEXT_PUBLIC_ENABLED_PLATFORMS;

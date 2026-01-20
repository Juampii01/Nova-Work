// OAuth provider configurations and utilities

export interface OAuthProvider {
  id: string
  name: string
  icon: string
  color: string
  authUrl: string
}

export const oauthProviders: Record<string, OAuthProvider> = {
  google: {
    id: "google",
    name: "Google",
    icon: "chrome",
    color: "#EA4335",
    authUrl: "/api/auth/google",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    color: "#0A66C2",
    authUrl: "/api/auth/linkedin",
  },
  github: {
    id: "github",
    name: "GitHub",
    icon: "github",
    color: "#181717",
    authUrl: "/api/auth/github",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    color: "#1877F2",
    authUrl: "/api/auth/facebook",
  },
}

export const initiateOAuth = async (provider: string) => {
  const providerConfig = oauthProviders[provider]
  if (!providerConfig) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

  // In a real implementation, this would redirect to the OAuth provider
  // Mock OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        provider: providerConfig.name,
        user: {
          email: `user@${provider}.com`,
          name: "Test User",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      })
    }, 1000)
  })
}

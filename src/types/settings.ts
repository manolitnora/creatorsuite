export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  scopes: string[]
}

export type ApiKeyCreateRequest = {
  name: string
  scopes: string[]
}

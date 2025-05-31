export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isEmailVerified: boolean
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  user: User
  accessToken: string
  refreshToken: string
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
}

export interface BackofficeUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  lastLogin?: Date
  isActive: boolean
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
}

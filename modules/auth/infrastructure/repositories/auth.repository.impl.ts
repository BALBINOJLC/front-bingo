import type { AuthRepository } from "../../domain/repositories/auth.repository"
import type { User, AuthUser } from "../../domain/entities/user.entity"
import { UserRole } from "../../domain/entities/user.entity"

export class AuthRepositoryImpl implements AuthRepository {
  // Mock users with roles
  private mockUsers = [
    {
      id: "admin-1",
      email: "admin@goldenbingo.com",
      name: "Super Administrador",
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-1",
      email: "usuario@goldenbingo.com",
      name: "Juan Pérez",
      role: UserRole.USER,
      isEmailVerified: true,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-2",
      email: "demo@goldenbingo.com",
      name: "Usuario Demo",
      role: UserRole.USER,
      isEmailVerified: true,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  async login(email: string, password: string): Promise<AuthUser> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Login attempt:", { email, password }) // Debug log

    // Find user by email (case insensitive)
    const mockUser = this.mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    console.log("Found user:", mockUser) // Debug log

    if (!mockUser) {
      console.log("User not found") // Debug log
      throw new Error("Usuario no encontrado")
    }

    // For demo purposes, accept any password for existing users
    console.log("Login successful for:", mockUser.email) // Debug log

    const user: User = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      isEmailVerified: mockUser.isEmailVerified,
      avatar: mockUser.avatar,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    }

    return {
      user,
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: UserRole.USER, // New users are regular users by default
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return {
      user,
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async verifyEmail(token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // In a real app, this would check the stored token
      const storedUser = localStorage.getItem("currentUser")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.removeItem("currentUser")
  }
}

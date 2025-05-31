import type { User, AuthUser } from "../entities/user.entity"

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthUser>
  register(name: string, email: string, password: string): Promise<AuthUser>
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
  verifyEmail(token: string): Promise<void>
  resendVerificationEmail(email: string): Promise<void>
  getCurrentUser(): Promise<User | null>
  logout(): Promise<void>
}

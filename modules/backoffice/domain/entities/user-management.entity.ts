import type { BackofficeUser, UserRole } from "./user.entity"

export interface UserDetails extends BackofficeUser {
  registrationDate: Date
  lastLogin: Date
  totalSpent: number
  totalWinnings: number
  favoriteGames: string[]
  ticketsPurchased: number
  gamesPlayed: number
  winRate: number
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED"
  notes?: string
  loginHistory: LoginHistoryEntry[]
  paymentMethods: PaymentMethod[]
  address?: Address
  phoneNumber?: string
  preferredLanguage: string
  marketingPreferences: MarketingPreferences
  deviceInfo: DeviceInfo[]
}

export interface LoginHistoryEntry {
  timestamp: Date
  ipAddress: string
  device: string
  location?: string
  success: boolean
}

export interface PaymentMethod {
  id: string
  type: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "E_WALLET"
  lastFourDigits?: string
  provider?: string
  isDefault: boolean
  expiryDate?: Date
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface MarketingPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  promotionalEmails: boolean
}

export interface DeviceInfo {
  deviceId: string
  deviceType: string
  browser?: string
  operatingSystem?: string
  lastUsed: Date
}

export interface UserFilters {
  role?: UserRole
  isActive?: boolean
  registrationDateFrom?: Date
  registrationDateTo?: Date
  minSpent?: number
  maxSpent?: number
  verificationStatus?: "VERIFIED" | "PENDING" | "REJECTED"
  searchTerm?: string
}

export interface UserSortOptions {
  field: "name" | "email" | "registrationDate" | "lastLogin" | "totalSpent" | "gamesPlayed"
  direction: "asc" | "desc"
}

export interface UserManagementRepository {
  getUsers(
    page: number,
    limit: number,
    filters?: UserFilters,
    sort?: UserSortOptions,
  ): Promise<{
    users: BackofficeUser[]
    total: number
  }>
  getUserDetails(userId: string): Promise<UserDetails>
  updateUserStatus(userId: string, isActive: boolean): Promise<boolean>
  updateUserRole(userId: string, role: UserRole): Promise<boolean>
  addUserNote(userId: string, note: string): Promise<boolean>
}

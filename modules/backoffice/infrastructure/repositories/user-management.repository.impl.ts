import type {
  UserManagementRepository,
  UserFilters,
  UserSortOptions,
  UserDetails,
} from "../../domain/entities/user-management.entity"
import { type BackofficeUser, UserRole } from "../../domain/entities/user-role.entity"

export class UserManagementRepositoryImpl implements UserManagementRepository {
  private mockUsers: BackofficeUser[] = [
    {
      id: "1",
      email: "carlos.rodriguez@example.com",
      name: "Carlos Rodríguez",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 30),
      isActive: true,
    },
    {
      id: "2",
      email: "maria.gonzalez@example.com",
      name: "María González",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 29),
      isActive: true,
    },
    {
      id: "3",
      email: "juan.perez@example.com",
      name: "Juan Pérez",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 28),
      isActive: false,
    },
    {
      id: "4",
      email: "ana.martinez@example.com",
      name: "Ana Martínez",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 27),
      isActive: true,
    },
    {
      id: "5",
      email: "pedro.sanchez@example.com",
      name: "Pedro Sánchez",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 26),
      isActive: true,
    },
    {
      id: "6",
      email: "lucia.fernandez@example.com",
      name: "Lucía Fernández",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 25),
      isActive: true,
    },
    {
      id: "7",
      email: "javier.lopez@example.com",
      name: "Javier López",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 24),
      isActive: false,
    },
    {
      id: "8",
      email: "carmen.diaz@example.com",
      name: "Carmen Díaz",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 23),
      isActive: true,
    },
    {
      id: "9",
      email: "miguel.torres@example.com",
      name: "Miguel Torres",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 22),
      isActive: true,
    },
    {
      id: "10",
      email: "sofia.ruiz@example.com",
      name: "Sofía Ruiz",
      role: UserRole.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 21),
      isActive: true,
    },
    {
      id: "11",
      email: "admin@goldenbingo.com",
      name: "Admin Principal",
      role: UserRole.SUPER_ADMIN,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(2025, 4, 31),
      isActive: true,
    },
  ]

  private mockUserDetails: Record<string, Partial<UserDetails>> = {
    "1": {
      registrationDate: new Date(2024, 11, 15),
      totalSpent: 250000,
      totalWinnings: 180000,
      favoriteGames: ["Bingo Express", "Bingo Clásico"],
      ticketsPurchased: 42,
      gamesPlayed: 38,
      winRate: 0.21,
      verificationStatus: "VERIFIED",
      notes: "Cliente frecuente, prefiere juegos nocturnos",
      phoneNumber: "+56 9 1234 5678",
      preferredLanguage: "es",
      marketingPreferences: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        promotionalEmails: true,
      },
    },
    "2": {
      registrationDate: new Date(2025, 1, 3),
      totalSpent: 180000,
      totalWinnings: 220000,
      favoriteGames: ["Bingo Express", "Bingo Millonario"],
      ticketsPurchased: 36,
      gamesPlayed: 30,
      winRate: 0.33,
      verificationStatus: "VERIFIED",
      phoneNumber: "+56 9 8765 4321",
      preferredLanguage: "es",
      marketingPreferences: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        promotionalEmails: false,
      },
    },
    "3": {
      registrationDate: new Date(2024, 9, 22),
      totalSpent: 75000,
      totalWinnings: 30000,
      favoriteGames: ["Bingo Clásico"],
      ticketsPurchased: 15,
      gamesPlayed: 12,
      winRate: 0.08,
      verificationStatus: "REJECTED",
      notes: "Cuenta suspendida por comportamiento sospechoso",
      phoneNumber: "+56 9 5555 5555",
      preferredLanguage: "es",
      marketingPreferences: {
        emailNotifications: false,
        smsNotifications: false,
        pushNotifications: false,
        promotionalEmails: false,
      },
    },
  }

  async getUsers(
    page: number,
    limit: number,
    filters?: UserFilters,
    sort?: UserSortOptions,
  ): Promise<{ users: BackofficeUser[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredUsers = [...this.mockUsers]

    // Apply filters
    if (filters) {
      if (filters.role !== undefined) {
        filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
      }

      if (filters.isActive !== undefined) {
        filteredUsers = filteredUsers.filter((user) => user.isActive === filters.isActive)
      }

      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(
          (user) => user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm),
        )
      }
    }

    // Apply sorting
    if (sort) {
      filteredUsers.sort((a, b) => {
        let comparison = 0
        switch (sort.field) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "email":
            comparison = a.email.localeCompare(b.email)
            break
          case "lastLogin":
            comparison = (a.lastLogin?.getTime() || 0) - (b.lastLogin?.getTime() || 0)
            break
          default:
            comparison = 0
        }
        return sort.direction === "asc" ? comparison : -comparison
      })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit)

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
    }
  }

  async getUserDetails(userId: string): Promise<UserDetails> {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const baseUser = this.mockUsers.find((user) => user.id === userId)
    if (!baseUser) {
      throw new Error("Usuario no encontrado")
    }

    const detailsPartial = this.mockUserDetails[userId] || {}

    // Generate mock data for fields not explicitly defined
    const loginHistory = Array(5)
      .fill(null)
      .map((_, i) => ({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: ["iPhone", "Android", "Desktop Chrome", "Desktop Safari", "iPad"][Math.floor(Math.random() * 5)],
        location: ["Santiago, Chile", "Valparaíso, Chile", "Concepción, Chile"][Math.floor(Math.random() * 3)],
        success: Math.random() > 0.1,
      }))

    const paymentMethods = [
      {
        id: "pm_1",
        type: "CREDIT_CARD" as const,
        lastFourDigits: "4242",
        provider: "Visa",
        isDefault: true,
        expiryDate: new Date(2026, 5, 30),
      },
    ]

    const deviceInfo = [
      {
        deviceId: `device_${Math.random().toString(36).substring(2, 10)}`,
        deviceType: ["iPhone", "Android", "Desktop", "iPad", "Tablet"][Math.floor(Math.random() * 5)],
        browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
        operatingSystem: ["iOS", "Android", "Windows", "macOS"][Math.floor(Math.random() * 4)],
        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      },
    ]

    // Combine base user with details and generated data
    return {
      ...baseUser,
      registrationDate: detailsPartial.registrationDate || new Date(2024, 0, 1),
      lastLogin: baseUser.lastLogin || new Date(),
      totalSpent: detailsPartial.totalSpent || 0,
      totalWinnings: detailsPartial.totalWinnings || 0,
      favoriteGames: detailsPartial.favoriteGames || [],
      ticketsPurchased: detailsPartial.ticketsPurchased || 0,
      gamesPlayed: detailsPartial.gamesPlayed || 0,
      winRate: detailsPartial.winRate || 0,
      verificationStatus: detailsPartial.verificationStatus || "PENDING",
      notes: detailsPartial.notes,
      loginHistory,
      paymentMethods,
      address: detailsPartial.address || {
        street: "Av. Providencia 1234",
        city: "Santiago",
        state: "Región Metropolitana",
        postalCode: "7500000",
        country: "Chile",
      },
      phoneNumber: detailsPartial.phoneNumber || "+56 9 1234 5678",
      preferredLanguage: detailsPartial.preferredLanguage || "es",
      marketingPreferences: detailsPartial.marketingPreferences || {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        promotionalEmails: true,
      },
      deviceInfo,
    }
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userIndex = this.mockUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return false
    }

    this.mockUsers[userIndex].isActive = isActive
    return true
  }

  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userIndex = this.mockUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return false
    }

    this.mockUsers[userIndex].role = role
    return true
  }

  async addUserNote(userId: string, note: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!this.mockUserDetails[userId]) {
      this.mockUserDetails[userId] = {}
    }

    this.mockUserDetails[userId].notes = note
    return true
  }
}

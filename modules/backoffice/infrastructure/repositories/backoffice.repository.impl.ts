import type { BackofficeRepository } from "../../domain/repositories/backoffice.repository"
import type { BackofficeUser } from "../../domain/entities/user-role.entity"
import type { DashboardStats, UserStats, RecentActivity } from "../../domain/entities/dashboard.entity"
import { UserRole as Role } from "../../domain/entities/user-role.entity"
import type { Event, Ticket } from "../../domain/entities/event.entity"

export class BackofficeRepositoryImpl implements BackofficeRepository {
  // Mock users for testing
  private mockUsers: BackofficeUser[] = [
    {
      id: "admin-1",
      email: "admin@goldenbingo.com",
      name: "Super Administrador",
      role: Role.SUPER_ADMIN,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(),
      isActive: true,
    },
    {
      id: "user-1",
      email: "usuario@goldenbingo.com",
      name: "Juan Pérez",
      role: Role.USER,
      avatar: "/placeholder.svg?height=40&width=40",
      lastLogin: new Date(),
      isActive: true,
    },
  ]

  async getUserByCredentials(email: string, password: string): Promise<BackofficeUser | null> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Attempting login with:", email) // Debug log

    // For demo purposes, any password works - just check if email exists
    const user = this.mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    console.log("Found user:", user) // Debug log

    if (user) {
      // Update last login
      user.lastLogin = new Date()
      return user
    }

    return null
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      totalUsers: 15420,
      activeGames: 45,
      totalPrizes: 1250000,
      revenue: 2850000,
      todayRegistrations: 127,
      onlineUsers: 892,
    }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      gamesPlayed: 156,
      prizesWon: 23,
      totalWinnings: 4500,
      lastGameDate: new Date(),
      activeTickets: 2,
      totalEvents: 12,
    }
  }

  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "1",
        type: "registration",
        description: "Nuevo usuario registrado: María González",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        userId: "user-2",
        userName: "María González",
      },
      {
        id: "2",
        type: "prize",
        description: "Premio ganado: $500 en Bingo Deluxe",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        userId: "user-3",
        userName: "Carlos Ruiz",
      },
      {
        id: "3",
        type: "game",
        description: "Nueva partida iniciada: Sala VIP #3",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        id: "4",
        type: "login",
        description: "Usuario conectado desde móvil",
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        userId: "user-4",
        userName: "Ana López",
      },
    ].slice(0, limit)
  }

  async getUserRecentActivity(userId: string, limit = 10): Promise<RecentActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "u1",
        type: "game",
        description: "Partida completada en Bingo Clásico",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "u2",
        type: "prize",
        description: "Premio ganado: $150",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: "u3",
        type: "game",
        description: "Partida iniciada en Bingo Rápido",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ].slice(0, limit)
  }

  async getAvailableEvents(): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "event-1",
        title: "Bingo Nocturno VIP",
        description: "Gran evento de bingo con premios especiales",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        location: "Sala Principal",
        price: 25000,
        availableTickets: 45,
        totalTickets: 100,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "event-2",
        title: "Bingo Familiar",
        description: "Evento especial para toda la familia",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
        location: "Sala Familiar",
        price: 15000,
        availableTickets: 78,
        totalTickets: 150,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "event-3",
        title: "Mega Bingo Championship",
        description: "Campeonato con el premio más grande del año",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En 14 días
        location: "Arena Central",
        price: 50000,
        availableTickets: 12,
        totalTickets: 50,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
      },
    ]
  }

  async getActiveEvents(): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "active-1",
        title: "Bingo Express",
        description: "Partidas rápidas cada 30 minutos",
        date: new Date(),
        location: "Sala Express",
        price: 5000,
        availableTickets: 25,
        totalTickets: 30,
        status: "active",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "active-2",
        title: "Bingo Clásico",
        description: "El tradicional bingo de siempre",
        date: new Date(),
        location: "Sala Clásica",
        price: 10000,
        availableTickets: 8,
        totalTickets: 20,
        status: "active",
        image: "/placeholder.svg?height=200&width=300",
      },
    ]
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "ticket-1",
        eventId: "event-1",
        eventTitle: "Bingo Nocturno VIP",
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        eventLocation: "Sala Principal",
        ticketNumber: "VIP-001-2024",
        purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        price: 25000,
        status: "active",
        qrCode: "QR123456789",
      },
      {
        id: "ticket-2",
        eventId: "active-1",
        eventTitle: "Bingo Express",
        eventDate: new Date(),
        eventLocation: "Sala Express",
        ticketNumber: "EXP-045-2024",
        purchaseDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
        price: 5000,
        status: "active",
        qrCode: "QR987654321",
      },
      {
        id: "ticket-3",
        eventId: "completed-1",
        eventTitle: "Bingo de Año Nuevo",
        eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        eventLocation: "Sala Principal",
        ticketNumber: "NYE-012-2024",
        purchaseDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        price: 30000,
        status: "used",
        qrCode: "QR456789123",
      },
    ]
  }
}

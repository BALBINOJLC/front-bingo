export interface DashboardStats {
  totalUsers: number
  activeGames: number
  totalPrizes: number
  revenue: number
  todayRegistrations: number
  onlineUsers: number
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  price: number
  availableTickets: number
  totalTickets: number
  image?: string
  status: "upcoming" | "active" | "completed" | "cancelled"
}

export interface Ticket {
  id: string
  eventId: string
  eventTitle: string
  eventDate: Date
  eventLocation: string
  ticketNumber: string
  purchaseDate: Date
  price: number
  status: "active" | "used" | "expired" | "cancelled"
  qrCode?: string
}

export interface UserStats {
  gamesPlayed: number
  prizesWon: number
  totalWinnings: number
  lastGameDate?: Date
  activeTickets: number
  totalEvents: number
}

export interface RecentActivity {
  id: string
  type: "game" | "prize" | "registration" | "login"
  description: string
  timestamp: Date
  userId?: string
  userName?: string
}

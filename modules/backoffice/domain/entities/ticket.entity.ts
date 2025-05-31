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

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  price: number
  availableTickets: number
  totalTickets: number
  status: "upcoming" | "active" | "completed" | "cancelled"
  image?: string
}

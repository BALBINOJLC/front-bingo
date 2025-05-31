import type { Event } from "../../domain/entities/event.entity"
import type { Ticket } from "../../domain/entities/ticket.entity"

export interface BackofficeRepository {
  getAvailableEvents(): Promise<Event[]>
  getActiveEvents(): Promise<Event[]>
  getUserTickets(userId: string): Promise<Ticket[]>
}

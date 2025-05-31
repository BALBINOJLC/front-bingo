"use client"

import { Calendar, MapPin, TicketIcon } from "lucide-react"
import type { Ticket } from "../../domain/entities/dashboard.entity"

interface TicketCardProps {
  ticket: Ticket
  onViewQR?: (ticketId: string) => void
}

export function TicketCard({ ticket, onViewQR }: TicketCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "used":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "expired":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "used":
        return "Usado"
      case "expired":
        return "Expirado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Pendiente"
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 hover:border-yellow-400/40 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{ticket.eventTitle}</h3>
          <div
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}
          >
            {getStatusText(ticket.status)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-yellow-400 font-bold">{formatPrice(ticket.price)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center text-gray-300">
          <TicketIcon className="h-4 w-4 mr-2 text-yellow-400" />
          {ticket.ticketNumber}
        </div>

        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
          {formatDate(ticket.eventDate)}
        </div>

        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
          {ticket.eventLocation}
        </div>
      </div>
    </div>
  )
}

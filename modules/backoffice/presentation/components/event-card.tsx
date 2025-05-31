"use client"

import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import type { Event } from "../../domain/entities/dashboard.entity"

interface EventCardProps {
  event: Event
  onJoin?: (eventId: string) => void
}

export function EventCard({ event, onJoin }: EventCardProps) {
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
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "En Vivo"
      case "upcoming":
        return "Próximo"
      case "completed":
        return "Finalizado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Disponible"
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-400/40 transition-colors">
      {/* Event Image */}
      <div className="relative h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}
        >
          {getStatusText(event.status)}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
          <p className="text-gray-300 text-sm">{event.description}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
            {formatDate(event.date)}
          </div>

          <div className="flex items-center text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
            {event.location}
          </div>

          <div className="flex items-center text-gray-300">
            <Users className="h-4 w-4 mr-2 text-yellow-400" />
            {event.availableTickets} / {event.totalTickets} disponibles
          </div>

          <div className="flex items-center text-gray-300">
            <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
            {formatPrice(event.price)}
          </div>
        </div>

        {/* Action Button */}
        {event.status === "active" || event.status === "upcoming" ? (
          <button
            onClick={() => {
              if (event.status === "active") {
                // Navigate to live event room instead of calling onJoin
                window.location.href = `/backoffice/live-event/${event.id}`
              } else {
                // Navigate to ticket purchase page
                window.location.href = `/backoffice/ticket-purchase/${event.id}`
              }
            }}
            disabled={event.availableTickets === 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              event.availableTickets === 0
                ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                : event.status === "active"
                  ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                  : "bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30"
            }`}
          >
            {event.availableTickets === 0 ? "Agotado" : event.status === "active" ? "Unirse Ahora" : "Comprar Ticket"}
          </button>
        ) : null}
      </div>
    </div>
  )
}

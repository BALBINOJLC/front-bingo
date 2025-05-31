"use client"

import { useState, useEffect } from "react"
import { StatCard } from "../components/stat-card"
import { EventCard } from "../components/event-card"
import { Trophy, TicketIcon, Users } from "lucide-react"
import type { UserStats, RecentActivity, Event, Ticket } from "../../domain/entities/dashboard.entity"
import type { BackofficeUser } from "../../domain/entities/user-role.entity"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"

interface UserDashboardProps {
  user: BackofficeUser
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [availableEvents, setAvailableEvents] = useState<Event[]>([])
  const [activeEvents, setActiveEvents] = useState<Event[]>([])
  const [userTickets, setUserTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const repository = new BackofficeRepositoryImpl()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData, availableEventsData, activeEventsData, ticketsData] = await Promise.all([
          repository.getUserStats(user.id),
          repository.getUserRecentActivity(user.id, 6),
          repository.getAvailableEvents(),
          repository.getActiveEvents(),
          repository.getUserTickets(user.id),
        ])
        setStats(statsData)
        setActivities(activitiesData)
        setAvailableEvents(availableEventsData)
        setActiveEvents(activeEventsData)
        setUserTickets(ticketsData)
      } catch (error) {
        console.error("Error loading user dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user.id])

  const handleJoinEvent = (eventId: string) => {
    console.log("Joining event:", eventId)
    // Aquí implementarías la lógica para unirse al evento
  }

  const handleViewQR = (ticketId: string) => {
    console.log("Viewing QR for ticket:", ticketId)
    // Aquí implementarías la lógica para mostrar el código QR
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-white">Error al cargar tus datos</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido, {user.name}!</h1>
        <p className="text-gray-300">Descubre eventos emocionantes y gestiona tus tickets</p>
      </div>

      {/* Stats Grid - Actualizado sin saldo, wallet y juego favorito */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Eventos Activos" value={activeEvents.length} icon={Users} description="Eventos en vivo" />

        <StatCard title="Mis Tickets" value={stats.activeTickets} icon={TicketIcon} description="Tickets disponibles" />

        <StatCard
          title="Premios Totales"
          value={`$${activeEvents.reduce((total, event) => total + (event.totalPrizes || 0), 0)}`}
          icon={Trophy}
          description="En eventos activos"
        />
      </div>

      {/* Eventos Activos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🔴 Eventos Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeEvents.map((event) => (
            <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />
          ))}
        </div>
      </div>

      {/* Eventos Disponibles */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📅 Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableEvents.map((event) => (
            <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />
          ))}
        </div>
      </div>
    </div>
  )
}

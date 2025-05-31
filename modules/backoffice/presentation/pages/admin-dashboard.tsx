"use client"

import { useState, useEffect } from "react"
import { StatCard } from "../components/stat-card"
import { ActivityFeed } from "../components/activity-feed"
import { Users, GamepadIcon, Trophy, DollarSign, UserPlus, Wifi } from "lucide-react"
import type { DashboardStats, RecentActivity } from "../../domain/entities/dashboard.entity"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const repository = new BackofficeRepositoryImpl()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          repository.getDashboardStats(),
          repository.getRecentActivity(8),
        ])
        setStats(statsData)
        setActivities(activitiesData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-white">Error al cargar los datos del dashboard</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-300">Vista general del sistema Golden Bingo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Usuarios"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="Usuarios registrados"
        />

        <StatCard
          title="Partidas Activas"
          value={stats.activeGames}
          icon={GamepadIcon}
          trend={{ value: 8, isPositive: true }}
          description="Salas en vivo"
        />

        <StatCard
          title="Premios Entregados"
          value={`$${(stats.totalPrizes / 1000000).toFixed(1)}M`}
          icon={Trophy}
          trend={{ value: 15, isPositive: true }}
          description="Total histórico"
        />

        <StatCard
          title="Ingresos"
          value={`$${(stats.revenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
          description="Este mes"
        />

        <StatCard
          title="Registros Hoy"
          value={stats.todayRegistrations}
          icon={UserPlus}
          trend={{ value: 5, isPositive: true }}
          description="Nuevos usuarios"
        />

        <StatCard title="Usuarios Online" value={stats.onlineUsers} icon={Wifi} description="Conectados ahora" />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed title="Actividad Reciente" activities={activities} />

        <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 rounded-lg text-white transition-colors">
              📊 Ver reportes detallados
            </button>
            <button className="w-full text-left p-3 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/30 rounded-lg text-white transition-colors">
              🎮 Gestionar partidas
            </button>
            <button className="w-full text-left p-3 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 rounded-lg text-white transition-colors">
              👥 Administrar usuarios
            </button>
            <button className="w-full text-left p-3 bg-purple-400/10 hover:bg-purple-400/20 border border-purple-400/30 rounded-lg text-white transition-colors">
              ⚙️ Configuración del sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

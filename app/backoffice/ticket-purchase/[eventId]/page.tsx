"use client"

import { useState, useEffect } from "react"
import { BackofficeLayout } from "@/modules/backoffice/presentation/components/backoffice-layout"
import { TicketPurchase } from "@/modules/backoffice/presentation/pages/ticket-purchase"
import type { User } from "@/modules/auth/domain/entities/user.entity"
import { AuthRepositoryImpl } from "@/modules/auth/infrastructure/repositories/auth.repository.impl"
import { Crown } from "lucide-react"

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default function TicketPurchasePage({ params }: PageProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>("")

  const authRepository = new AuthRepositoryImpl()

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        setEventId(resolvedParams.eventId)

        const user = await authRepository.getCurrentUser()
        if (user) {
          setCurrentUser(user)
        } else {
          window.location.href = "/auth/login"
        }
      } catch (error) {
        console.error("Error loading data:", error)
        window.location.href = "/auth/login"
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  const handleLogout = async () => {
    try {
      await authRepository.logout()
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <Crown className="h-12 w-12 text-yellow-400" />
              <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full"></div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              GOLDEN BINGO
            </span>
          </div>

          {/* Loading Card */}
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-8 max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-yellow-400/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-orange-500 rounded-full animate-spin animation-delay-150"></div>
              </div>

              {/* Loading Text */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Cargando Evento</h2>
                <p className="text-gray-300 text-sm">Preparando la sala de bingo...</p>
              </div>

              {/* Loading Steps */}
              <div className="w-full space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm">Verificando acceso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-gray-300 text-sm">Cargando cartones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
                  <span className="text-gray-300 text-sm">Preparando interfaz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  // Convert User to BackofficeUser format for compatibility
  const backofficeUser = {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: currentUser.role,
    avatar: currentUser.avatar,
    lastLogin: new Date(),
    isActive: true,
  }

  return (
    <div className="animate-fadeIn">
      <BackofficeLayout user={backofficeUser} onLogout={handleLogout}>
        <TicketPurchase eventId={eventId} />
      </BackofficeLayout>
    </div>
  )
}

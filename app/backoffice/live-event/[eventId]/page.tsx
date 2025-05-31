"use client"

import { useState, useEffect } from "react"
import { LiveEventRoom } from "@/modules/live-event/presentation/pages/live-event-room"
import type { User } from "@/modules/auth/domain/entities/user.entity"
import { AuthRepositoryImpl } from "@/modules/auth/infrastructure/repositories/auth.repository.impl"

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default function LiveEventPage({ params }: PageProps) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando sala de bingo...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return <LiveEventRoom eventId={eventId} userId={currentUser.id} />
}

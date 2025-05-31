"use client"

import { useState, useEffect } from "react"
import { BackofficeLayout } from "@/modules/backoffice/presentation/components/backoffice-layout"
import { AdminDashboard } from "@/modules/backoffice/presentation/pages/admin-dashboard"
import { UserDashboard } from "@/modules/backoffice/presentation/pages/user-dashboard"
import type { User } from "@/modules/auth/domain/entities/user.entity"
import { AuthRepositoryImpl } from "@/modules/auth/infrastructure/repositories/auth.repository.impl"

export default function BackofficePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const authRepository = new AuthRepositoryImpl()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authRepository.getCurrentUser()
        if (user) {
          setCurrentUser(user)
        } else {
          // Redirect to login if not authenticated
          window.location.href = "/auth/login"
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        window.location.href = "/auth/login"
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
  }

  const isAdmin = currentUser.role === "SUPER_ADMIN"

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
    <BackofficeLayout user={backofficeUser} onLogout={handleLogout}>
      {isAdmin ? <AdminDashboard /> : <UserDashboard user={backofficeUser} />}
    </BackofficeLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { BackofficeLayout } from "@/modules/backoffice/presentation/components/backoffice-layout"
import { MyTicketsPage } from "@/modules/backoffice/presentation/pages/my-tickets"
import { BackofficeRepositoryImpl } from "@/modules/backoffice/infrastructure/repositories/backoffice.repository.impl"
import { useRouter } from "next/navigation"

export default function MyTickets() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulamos verificación de autenticación
    const checkAuth = async () => {
      try {
        // En una aplicación real, verificaríamos el token o sesión
        const repository = new BackofficeRepositoryImpl()
        const mockUser = await repository.getUserByCredentials("usuario@goldenbingo.com", "password")

        if (mockUser) {
          setUser(mockUser)
        } else {
          // Redirigir al login si no hay usuario autenticado
          router.push("/backoffice/login")
        }
      } catch (error) {
        console.error("Error de autenticación:", error)
        router.push("/backoffice/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // Lógica de cierre de sesión
    router.push("/backoffice/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <BackofficeLayout user={user} onLogout={handleLogout}>
      <MyTicketsPage />
    </BackofficeLayout>
  )
}

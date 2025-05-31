"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BackofficeLayout } from "@/modules/backoffice/presentation/components/backoffice-layout"
import { UserProfile } from "@/modules/backoffice/presentation/pages/user-profile"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate getting user data - in real app this would come from context/auth
    const mockUser = {
      id: "user-123",
      email: "usuario@email.com",
      name: "Usuario Demo",
      role: "USER",
      avatar: "/placeholder.svg",
      lastLogin: new Date(),
      isActive: true,
    }

    setUser(mockUser)
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <BackofficeLayout user={user} onLogout={handleLogout}>
      <UserProfile userId={user.id} />
    </BackofficeLayout>
  )
}

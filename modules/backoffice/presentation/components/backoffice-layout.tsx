"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Menu, X, Home, Users, GamepadIcon, Trophy, BarChart3, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"

interface BackofficeUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  lastLogin?: Date
  isActive: boolean
}

interface BackofficeLayoutProps {
  children: React.ReactNode
  user: BackofficeUser
  onLogout: () => void
}

export function BackofficeLayout({ children, user, onLogout }: BackofficeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user.role === "SUPER_ADMIN"

  const adminMenuItems = [
    { icon: Home, label: "Dashboard", href: "/backoffice" },
    { icon: Users, label: "Usuarios", href: "/backoffice/users" },
    { icon: GamepadIcon, label: "Partidas", href: "/backoffice/games" },
    { icon: Trophy, label: "Premios", href: "/backoffice/prizes" },
    { icon: BarChart3, label: "Reportes", href: "/backoffice/reports" },
    { icon: Settings, label: "Configuración", href: "/backoffice/settings" },
  ]

  const userMenuItems = [
    { icon: Home, label: "Mi Dashboard", href: "/backoffice" },
    { icon: GamepadIcon, label: "Mis Tickets", href: "/backoffice/my-tickets" },
    { icon: User, label: "Mi Perfil", href: "/backoffice/profile" },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-md border-r border-yellow-500/20 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/20">
          <Link href="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              GOLDEN BINGO
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-yellow-400/10 hover:text-yellow-400 rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-yellow-400 text-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.name}</p>
                <p className="text-yellow-400 text-sm">{isAdmin ? "Super Admin" : "Usuario"}</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-black/20 backdrop-blur-md border-b border-yellow-500/20 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-yellow-400 text-sm">{isAdmin ? "Super Administrador" : "Usuario Regular"}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-yellow-400 text-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

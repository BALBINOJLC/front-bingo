"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Trophy,
  GamepadIcon,
  Star,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  birthDate?: Date
  address?: string
  city?: string
  country?: string
  joinDate: Date
  lastLogin: Date
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  stats: {
    totalTickets: number
    activeTickets: number
    eventsAttended: number
    totalSpent: number
    prizesWon: number
    totalWinnings: number
  }
}

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const repository = new BackofficeRepositoryImpl()

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfile: UserProfile = {
        id: userId,
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        phone: "+57 300 123 4567",
        avatar: "/placeholder.svg?height=120&width=120",
        birthDate: new Date("1990-05-15"),
        address: "Calle 123 #45-67",
        city: "Bogotá",
        country: "Colombia",
        joinDate: new Date("2023-01-15"),
        lastLogin: new Date(),
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        stats: {
          totalTickets: 45,
          activeTickets: 3,
          eventsAttended: 28,
          totalSpent: 675000,
          prizesWon: 8,
          totalWinnings: 125000,
        },
      }

      setProfile(mockProfile)
      setEditForm(mockProfile)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm(profile || {})
  }

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (profile && editForm) {
        const updatedProfile = { ...profile, ...editForm }
        setProfile(updatedProfile)
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(profile || {})
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Contraseña actualizada exitosamente")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
    } catch (error) {
      console.error("Error changing password:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-64 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-32 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No se pudo cargar el perfil</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        {!isEditing && (
          <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20">
            <CardHeader className="border-b border-yellow-500/20">
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-yellow-400" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-yellow-400 text-black text-xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    {profile.emailVerified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-yellow-400 mb-1">{profile.email}</p>
                  <p className="text-white/70 text-sm">Miembro desde {formatDate(profile.joinDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Correo Electrónico
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <p className="text-white">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                        placeholder="Número de teléfono"
                      />
                    ) : (
                      <p className="text-white">{profile.phone || "No especificado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Fecha de Nacimiento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.birthDate?.toISOString().split("T")[0] || ""}
                        onChange={(e) => setEditForm({ ...editForm, birthDate: new Date(e.target.value) })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <p className="text-white">
                        {profile.birthDate ? formatDate(profile.birthDate) : "No especificada"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Dirección
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.address || ""}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                        placeholder="Dirección"
                      />
                    ) : (
                      <p className="text-white">{profile.address || "No especificada"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Ciudad</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.city || ""}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                        placeholder="Ciudad"
                      />
                    ) : (
                      <p className="text-white">{profile.city || "No especificada"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">País</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.country || ""}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                        placeholder="País"
                      />
                    ) : (
                      <p className="text-white">{profile.country || "No especificado"}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-white/10">
                  <Button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20 mt-6">
            <CardHeader className="border-b border-yellow-500/20">
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-yellow-400" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Contraseña</p>
                    <p className="text-white/70 text-sm">Última actualización hace 30 días</p>
                  </div>
                  <Button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Cambiar Contraseña
                  </Button>
                </div>

                {showPasswordForm && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Contraseña Actual</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                            placeholder="Contraseña actual"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Nueva Contraseña</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                            placeholder="Nueva contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Confirmar Nueva Contraseña</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                            placeholder="Confirmar nueva contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handlePasswordChange}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                        >
                          Actualizar Contraseña
                        </Button>
                        <Button
                          onClick={() => setShowPasswordForm(false)}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20">
            <CardHeader className="border-b border-yellow-500/20">
              <CardTitle className="text-white flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GamepadIcon className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-white/70 text-sm">Tickets Totales</span>
                  </div>
                  <span className="text-white font-bold">{profile.stats.totalTickets}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-white/70 text-sm">Tickets Activos</span>
                  </div>
                  <span className="text-white font-bold">{profile.stats.activeTickets}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-white/70 text-sm">Eventos Asistidos</span>
                  </div>
                  <span className="text-white font-bold">{profile.stats.eventsAttended}</span>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Total Gastado</span>
                  <span className="text-white font-bold">{formatCurrency(profile.stats.totalSpent)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Premios Ganados</span>
                  <span className="text-yellow-400 font-bold">{profile.stats.prizesWon}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Total Ganado</span>
                  <span className="text-green-400 font-bold">{formatCurrency(profile.stats.totalWinnings)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20">
            <CardHeader className="border-b border-yellow-500/20">
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-yellow-400" />
                Estado de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Email Verificado</span>
                  <Badge
                    className={
                      profile.emailVerified
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profile.emailVerified ? "Verificado" : "Pendiente"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Teléfono Verificado</span>
                  <Badge
                    className={
                      profile.phoneVerified
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {profile.phoneVerified ? "Verificado" : "Pendiente"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Cuenta Activa</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activa</Badge>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <p className="text-white/70 text-sm mb-1">Último Acceso</p>
                  <p className="text-white text-sm">{formatDate(profile.lastLogin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

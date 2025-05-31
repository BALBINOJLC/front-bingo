"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type UserDetails, UserRole } from "../../domain/entities/user-role.entity"
import { CalendarDays, CreditCard, DollarSign, Mail, MapPin, Phone, Shield, Trophy, User } from "lucide-react"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserDetails | null
  onUpdateStatus: (userId: string, isActive: boolean) => Promise<void>
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>
  onAddNote: (userId: string, note: string) => Promise<void>
  isLoading: boolean
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onUpdateStatus,
  onUpdateRole,
  onAddNote,
  isLoading,
}: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [noteText, setNoteText] = useState("")

  if (!user) return null

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <Badge className="bg-green-500">Verificado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500">Rechazado</Badge>
      default:
        return <Badge className="bg-gray-500">Desconocido</Badge>
    }
  }

  const handleSubmitNote = async () => {
    if (noteText.trim() && user) {
      await onAddNote(user.id, noteText)
      setNoteText("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-md border border-yellow-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-yellow-400 text-black">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-white">{user.name}</span>
              <div className="text-sm font-normal text-gray-300">{user.email}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/20 border border-yellow-500/20 grid grid-cols-4">
              <TabsTrigger value="general" className="data-[state=active]:bg-yellow-500/20">
                General
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-yellow-500/20">
                Actividad
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-yellow-500/20">
                Pagos
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-yellow-500/20">
                Admin
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Información Personal</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Nombre</div>
                        <div>{user.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Email</div>
                        <div>{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Teléfono</div>
                        <div>{user.phoneNumber || "No registrado"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Dirección</div>
                        <div>
                          {user.address
                            ? `${user.address.street}, ${user.address.city}, ${user.address.country}`
                            : "No registrada"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Fecha de registro</div>
                        <div>{formatDate(user.registrationDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Estado de verificación</div>
                        <div>{getVerificationStatusBadge(user.verificationStatus)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Estadísticas de Juego</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Total gastado</div>
                        <div>{formatCurrency(user.totalSpent)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Total ganado</div>
                        <div>{formatCurrency(user.totalWinnings)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-400">Tickets comprados</div>
                        <div>{user.ticketsPurchased}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400">🎮</div>
                      <div>
                        <div className="text-sm text-gray-400">Partidas jugadas</div>
                        <div>{user.gamesPlayed}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400">📊</div>
                      <div>
                        <div className="text-sm text-gray-400">Tasa de victoria</div>
                        <div>{(user.winRate * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400">⭐</div>
                      <div>
                        <div className="text-sm text-gray-400">Juegos favoritos</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.favoriteGames && user.favoriteGames.length > 0 ? (
                            user.favoriteGames.map((game) => (
                              <Badge key={game} variant="outline" className="bg-yellow-500/10">
                                {game}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Sin juegos favoritos</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Notas</h3>
                  <div className="mb-4">
                    <p className="text-gray-300">{user.notes || "No hay notas para este usuario."}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4">
              <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Historial de Inicio de Sesión</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="pb-2 text-gray-400">Fecha</th>
                        <th className="pb-2 text-gray-400">IP</th>
                        <th className="pb-2 text-gray-400">Dispositivo</th>
                        <th className="pb-2 text-gray-400">Ubicación</th>
                        <th className="pb-2 text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.loginHistory?.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-3">{formatDate(entry.timestamp)}</td>
                          <td className="py-3">{entry.ipAddress}</td>
                          <td className="py-3">{entry.device}</td>
                          <td className="py-3">{entry.location || "Desconocida"}</td>
                          <td className="py-3">
                            {entry.success ? (
                              <Badge className="bg-green-500">Exitoso</Badge>
                            ) : (
                              <Badge className="bg-red-500">Fallido</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Dispositivos</h3>
                <div className="space-y-4">
                  {user.deviceInfo?.map((device, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div>
                        <div className="font-medium">{device.deviceType}</div>
                        <div className="text-sm text-gray-400">
                          {device.browser} en {device.operatingSystem}
                        </div>
                        <div className="text-xs text-gray-500">Último uso: {formatDate(device.lastUsed)}</div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/10">
                        {device.deviceId.substring(0, 8)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-4">
              <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Métodos de Pago</h3>
                <div className="space-y-4">
                  {user.paymentMethods?.map((method, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {method.type === "CREDIT_CARD"
                              ? "Tarjeta de Crédito"
                              : method.type === "DEBIT_CARD"
                                ? "Tarjeta de Débito"
                                : method.type === "BANK_TRANSFER"
                                  ? "Transferencia Bancaria"
                                  : "E-Wallet"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {method.provider} {method.lastFourDigits ? `•••• ${method.lastFourDigits}` : ""}
                          </div>
                          {method.expiryDate && (
                            <div className="text-xs text-gray-500">
                              Expira: {method.expiryDate.getMonth() + 1}/
                              {method.expiryDate.getFullYear().toString().substr(-2)}
                            </div>
                          )}
                        </div>
                      </div>
                      {method.isDefault && <Badge className="bg-yellow-500 text-black">Predeterminado</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Preferencias de Marketing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notif">Notificaciones por email</Label>
                    <Switch id="email-notif" checked={user.marketingPreferences?.emailNotifications} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notif">Notificaciones SMS</Label>
                    <Switch id="sms-notif" checked={user.marketingPreferences?.smsNotifications} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notif">Notificaciones push</Label>
                    <Switch id="push-notif" checked={user.marketingPreferences?.pushNotifications} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promo-emails">Emails promocionales</Label>
                    <Switch id="promo-emails" checked={user.marketingPreferences?.promotionalEmails} disabled />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Gestión de Usuario</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="user-status" className="block mb-2">
                        Estado de la cuenta
                      </Label>
                      <div className="flex items-center gap-3">
                        <Switch
                          id="user-status"
                          checked={user.isActive}
                          onCheckedChange={(checked) => onUpdateStatus(user.id, checked)}
                          disabled={isLoading}
                        />
                        <span>{user.isActive ? "Activo" : "Inactivo"}</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="user-role" className="block mb-2">
                        Rol de usuario
                      </Label>
                      <Select
                        value={user.role}
                        onValueChange={(value) => onUpdateRole(user.id, value as UserRole)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full bg-black/30 border-yellow-500/30 text-white">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-yellow-500/30 text-white">
                          <SelectItem value={UserRole.USER}>Usuario</SelectItem>
                          <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Agregar Nota</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Escribe una nota sobre este usuario..."
                      className="bg-black/30 border-yellow-500/30 text-white h-32"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <Button
                      onClick={handleSubmitNote}
                      disabled={!noteText.trim() || isLoading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Guardar Nota
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-yellow-500/50 text-yellow-400">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { UserManagementRepositoryImpl } from "../../infrastructure/repositories/user-management.repository.impl"
import { type BackofficeUser, UserRole } from "../../domain/entities/user-role.entity"
import type { UserFilters, UserSortOptions, UserDetails } from "../../domain/entities/user-management.entity"
import { UserDetailsModal } from "../components/user-details-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, Filter, UserCog, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const [users, setUsers] = useState<BackofficeUser[]>([])
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [filters, setFilters] = useState<UserFilters>({})
  const [sort, setSort] = useState<UserSortOptions>({ field: "lastLogin", direction: "desc" })
  const [showFilters, setShowFilters] = useState(false)

  const { toast } = useToast()
  const repository = new UserManagementRepositoryImpl()
  const USERS_PER_PAGE = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    loadUsers()
  }, [currentPage, debouncedSearchTerm, filters, sort])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const updatedFilters = { ...filters }
      if (debouncedSearchTerm) {
        updatedFilters.searchTerm = debouncedSearchTerm
      }

      const result = await repository.getUsers(currentPage, USERS_PER_PAGE, updatedFilters, sort)
      setUsers(result.users)
      setTotalUsers(result.total)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenUserDetails = async (userId: string) => {
    try {
      setIsActionLoading(true)
      const userDetails = await repository.getUserDetails(userId)
      setSelectedUser(userDetails)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error loading user details:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del usuario",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setIsActionLoading(true)
      await repository.updateUserStatus(userId, isActive)

      // Update the user in the list
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, isActive } : user)))

      // Update the selected user if it's the same one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, isActive })
      }

      toast({
        title: "Éxito",
        description: `Usuario ${isActive ? "activado" : "desactivado"} correctamente`,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    try {
      setIsActionLoading(true)
      await repository.updateUserRole(userId, role)

      // Update the user in the list
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role } : user)))

      // Update the selected user if it's the same one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role })
      }

      toast({
        title: "Éxito",
        description: "Rol de usuario actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleAddUserNote = async (userId: string, note: string) => {
    try {
      setIsActionLoading(true)
      await repository.addUserNote(userId, note)

      // Update the selected user if it's the same one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, notes: note })
      }

      toast({
        title: "Éxito",
        description: "Nota agregada correctamente",
      })
    } catch (error) {
      console.error("Error adding user note:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar la nota",
        variant: "destructive",
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleSortChange = (field: string) => {
    setSort((prevSort) => {
      if (prevSort.field === field) {
        return { field: field as any, direction: prevSort.direction === "asc" ? "desc" : "asc" }
      }
      return { field: field as any, direction: "asc" }
    })
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-300">Administra los usuarios del sistema Golden Bingo</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            className="pl-10 bg-black/20 border-yellow-500/20 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-yellow-500/50 text-yellow-400"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Rol</label>
            <Select
              value={filters.role || ""}
              onValueChange={(value) => setFilters({ ...filters, role: value ? (value as UserRole) : undefined })}
            >
              <SelectTrigger className="bg-black/30 border-yellow-500/30 text-white">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-yellow-500/30 text-white">
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value={UserRole.USER}>Usuario</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Estado</label>
            <Select
              value={filters.isActive === undefined ? "" : filters.isActive ? "active" : "inactive"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  isActive: value === "" ? undefined : value === "active",
                })
              }
            >
              <SelectTrigger className="bg-black/30 border-yellow-500/30 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-yellow-500/30 text-white">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Ordenar por</label>
            <Select
              value={`${sort.field}-${sort.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-")
                setSort({ field: field as any, direction: direction as "asc" | "desc" })
              }}
            >
              <SelectTrigger className="bg-black/30 border-yellow-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-yellow-500/30 text-white">
                <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                <SelectItem value="lastLogin-desc">Último acceso (Reciente)</SelectItem>
                <SelectItem value="lastLogin-asc">Último acceso (Antiguo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button
              variant="outline"
              className="border-yellow-500/50 text-yellow-400"
              onClick={() => {
                setFilters({})
                setSort({ field: "lastLogin", direction: "desc" })
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/30 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSortChange("lastLogin")}
                  >
                    Último acceso
                    {sort.field === "lastLogin" && <span className="ml-1">{sort.direction === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-700 rounded w-24"></div>
                            <div className="h-3 bg-gray-700 rounded w-32 mt-2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-700 rounded w-20"></div>
                      </td>
                    </tr>
                  ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 text-gray-500 mb-3" />
                      <p className="text-lg font-medium">No se encontraron usuarios</p>
                      <p className="text-sm">Intenta con otros filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-black/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-yellow-400 text-black">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={user.role === UserRole.SUPER_ADMIN ? "bg-purple-500" : "bg-blue-500"}>
                        {user.role === UserRole.SUPER_ADMIN ? "Super Admin" : "Usuario"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.lastLogin ? formatDate(user.lastLogin) : "Nunca"}</td>
                    <td className="px-6 py-4">
                      <Badge className={user.isActive ? "bg-green-500" : "bg-red-500"}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/50 text-yellow-400"
                        onClick={() => handleOpenUserDetails(user.id)}
                        disabled={isActionLoading}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Detalles
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Mostrando <span className="font-medium">{(currentPage - 1) * USERS_PER_PAGE + 1}</span> a{" "}
              <span className="font-medium">{Math.min(currentPage * USERS_PER_PAGE, totalUsers)}</span> de{" "}
              <span className="font-medium">{totalUsers}</span> usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-500/50 text-yellow-400"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-500/50 text-yellow-400"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onUpdateStatus={handleUpdateUserStatus}
        onUpdateRole={handleUpdateUserRole}
        onAddNote={handleAddUserNote}
        isLoading={isActionLoading}
      />
    </div>
  )
}

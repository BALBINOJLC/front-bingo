"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../../../auth/presentation/components/auth-layout"
import { FormField } from "../../../auth/presentation/components/form-field"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"
import { Loader2 } from "lucide-react"
import type { BackofficeUser } from "../../domain/entities/user-role.entity"

interface BackofficeLoginProps {
  onLogin: (user: BackofficeUser) => void
}

export function BackofficeLogin({ onLogin }: BackofficeLoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const repository = new BackofficeRepositoryImpl()

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({}) // Clear previous errors

    try {
      console.log("Attempting login with:", formData.email) // Debug log

      const user = await repository.getUserByCredentials(formData.email, formData.password)

      console.log("Login result:", user) // Debug log

      if (user) {
        console.log("Login successful, calling onLogin") // Debug log
        onLogin(user)
      } else {
        console.log("Login failed - no user found") // Debug log
        setErrors({ email: "Usuario no encontrado. Verifica el correo electrónico." })
      }
    } catch (error) {
      console.error("Login error:", error) // Debug log
      setErrors({ email: "Error al iniciar sesión. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Acceso al Backoffice" subtitle="Ingresa con tu cuenta autorizada">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Correo electrónico"
          type="email"
          placeholder="tu@goldenbingo.com"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          required
          disabled={isLoading}
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando acceso...
            </>
          ) : (
            "Acceder al Sistema"
          )}
        </Button>

        {/* Demo Users Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
          <h4 className="text-blue-400 font-semibold mb-2">👨‍💼 Usuarios de Prueba:</h4>
          <div className="space-y-2 text-gray-300">
            <div className="bg-gray-800/50 p-2 rounded">
              <p>
                <strong className="text-yellow-400">Super Admin:</strong>
              </p>
              <p className="text-xs">📧 admin@goldenbingo.com</p>
              <p className="text-xs">🔑 cualquier contraseña</p>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <p>
                <strong className="text-green-400">Usuario Regular:</strong>
              </p>
              <p className="text-xs">📧 usuario@goldenbingo.com</p>
              <p className="text-xs">🔑 cualquier contraseña</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">💡 Copia y pega los emails exactamente como aparecen</p>
        </div>
      </form>
    </AuthLayout>
  )
}

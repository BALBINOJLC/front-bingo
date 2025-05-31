"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { FormField } from "../components/form-field"
import type { LoginDto } from "../../application/dtos/auth.dto"
import { LoginUseCase } from "../../application/use-cases/login.use-case"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function LoginPage() {
  const [formData, setFormData] = useState<LoginDto>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginDto>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const loginUseCase = new LoginUseCase(new AuthRepositoryImpl())

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginDto> = {}

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
      console.log("Attempting login with:", formData) // Debug log

      const result = await loginUseCase.execute(formData)

      console.log("Login successful:", result) // Debug log

      // Store user in localStorage for demo
      localStorage.setItem("currentUser", JSON.stringify(result.user))

      setSuccess(true)

      // Redirect based on user role
      setTimeout(() => {
        if (result.user.role === "SUPER_ADMIN" || result.user.role === "USER") {
          window.location.href = "/backoffice"
        } else {
          window.location.href = "/"
        }
      }, 1500)
    } catch (error) {
      console.error("Login error:", error) // Debug log
      setErrors({ email: "Error al iniciar sesión. Verifica tus credenciales." })
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login buttons for demo
  const handleQuickLogin = (email: string) => {
    setFormData({ email, password: "demo123" })
  }

  if (success) {
    return (
      <AuthLayout title="¡Bienvenido!" subtitle="Inicio de sesión exitoso">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-gray-300 mb-6">Redirigiendo al sistema...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Accede a tu cuenta de Golden Bingo">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
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

        <div className="flex items-center justify-between">
          <Link
            href="/auth/forgot-password"
            className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        <div className="text-center">
          <span className="text-gray-300">¿No tienes cuenta? </span>
          <Link href="/auth/register" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Regístrate aquí
          </Link>
        </div>

        {/* Demo Users Info with Quick Login */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
          <h4 className="text-blue-400 font-semibold mb-3">👨‍💼 Usuarios de Prueba:</h4>
          <div className="space-y-3">
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-yellow-400 font-medium">Super Admin</p>
                  <p className="text-xs text-gray-300">admin@goldenbingo.com</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickLogin("admin@goldenbingo.com")}
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xs"
                >
                  Usar
                </Button>
              </div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-green-400 font-medium">Usuario Regular</p>
                  <p className="text-xs text-gray-300">usuario@goldenbingo.com</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickLogin("usuario@goldenbingo.com")}
                  className="border-green-400/50 text-green-400 hover:bg-green-400 hover:text-black text-xs"
                >
                  Usar
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            💡 Haz clic en "Usar" para llenar automáticamente las credenciales
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}

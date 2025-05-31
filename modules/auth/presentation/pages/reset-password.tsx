"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { FormField } from "../components/form-field"
import type { ResetPasswordDto } from "../../application/dtos/auth.dto"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ResetPasswordPageProps {
  token?: string
}

export function ResetPasswordPage({ token = "mock-token" }: ResetPasswordPageProps) {
  const [formData, setFormData] = useState<ResetPasswordDto>({
    token,
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<ResetPasswordDto>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const authRepository = new AuthRepositoryImpl()

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordDto> = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await authRepository.resetPassword(formData.token, formData.password)
      setSuccess(true)
    } catch (error) {
      setErrors({ password: "Error al restablecer la contraseña. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="¡Contraseña Actualizada!" subtitle="Tu contraseña ha sido restablecida exitosamente">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-gray-300 mb-6">
            Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/login")}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
          >
            Iniciar sesión
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Nueva Contraseña" subtitle="Ingresa tu nueva contraseña">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Nueva contraseña"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <FormField
          label="Confirmar nueva contraseña"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
          error={errors.confirmPassword}
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
              Actualizando contraseña...
            </>
          ) : (
            "Actualizar contraseña"
          )}
        </Button>

        <div className="text-center">
          <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

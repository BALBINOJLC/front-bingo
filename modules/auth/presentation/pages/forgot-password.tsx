"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { FormField } from "../components/form-field"
import type { ForgotPasswordDto } from "../../application/dtos/auth.dto"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordDto>({
    email: "",
  })
  const [errors, setErrors] = useState<Partial<ForgotPasswordDto>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const authRepository = new AuthRepositoryImpl()

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordDto> = {}

    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await authRepository.forgotPassword(formData.email)
      setSuccess(true)
    } catch (error) {
      setErrors({ email: "Error al enviar el correo. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Correo Enviado" subtitle="Revisa tu bandeja de entrada">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-300 mb-6">
            Hemos enviado un enlace de recuperación a <strong className="text-white">{formData.email}</strong>. Revisa
            tu correo y sigue las instrucciones para restablecer tu contraseña.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Enviar nuevamente
            </Button>
            <Link href="/auth/login" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar Contraseña" subtitle="Ingresa tu correo para recibir un enlace de recuperación">
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando correo...
            </>
          ) : (
            "Enviar enlace de recuperación"
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

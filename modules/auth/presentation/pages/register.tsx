"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { FormField } from "../components/form-field"
import type { RegisterDto } from "../../application/dtos/auth.dto"
import { RegisterUseCase } from "../../application/use-cases/register.use-case"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function RegisterPage() {
  const [formData, setFormData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<RegisterDto>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const registerUseCase = new RegisterUseCase(new AuthRepositoryImpl())

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterDto> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

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
      const result = await registerUseCase.execute(formData)
      setSuccess(true)
      console.log("Registration successful:", result)
    } catch (error) {
      setErrors({ email: "Error al crear la cuenta. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="¡Cuenta Creada!" subtitle="Verifica tu correo electrónico">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 mb-6">
            Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y
            haz clic en el enlace para activar tu cuenta.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = "/auth/email-verification")}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
            >
              Ir a verificación
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
    <AuthLayout title="Crear Cuenta" subtitle="Únete a Golden Bingo y comienza a ganar">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
          required
          disabled={isLoading}
        />

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

        <FormField
          label="Confirmar contraseña"
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
              Creando cuenta...
            </>
          ) : (
            "Crear Cuenta"
          )}
        </Button>

        <div className="text-center">
          <span className="text-gray-300">¿Ya tienes cuenta? </span>
          <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

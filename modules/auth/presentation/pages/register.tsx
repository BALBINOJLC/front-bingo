// modules/auth/presentation/pages/register.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { FormField } from "../components/form-field"

// Assuming RegisterDto will be updated or RegisterUseCase handles a flexible object.
// For this example, we'll define an extended interface here for formData.
interface RegisterPageFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
  // role: string; // Role is usually assigned by backend or fixed for registration type
}

import { RegisterUseCase } from "../../application/use-cases/register.use-case"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function RegisterPage() {
  const [formData, setFormData] = useState<RegisterPageFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    // role: "USER", // Default role if needed by DTO, but repository sets it
  })
  const [errors, setErrors] = useState<Partial<RegisterPageFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const registerUseCase = new RegisterUseCase(new AuthRepositoryImpl())

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterPageFormData> = {}

    if (!formData.first_name.trim()) newErrors.first_name = "El nombre es requerido";
    if (!formData.last_name.trim()) newErrors.last_name = "El apellido es requerido";
    if (!formData.dni.trim()) newErrors.dni = "El DNI es requerido";


    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) { // Assuming min length 6, adjust if different
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
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
    setErrors({})
    try {
      // Prepare data for the use case / repository
      // AuthRepository.register expects: name (combined), email, password, dni?, role?, first_name?, last_name?
      // The repository implementation prefers first_name, last_name.
      // We can pass them directly. The 'name' parameter in the repo was a fallback.
      const registrationData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        dni: formData.dni,
        // role: formData.role, // Role is set by backend or default in repo
      };

      // The `RegisterUseCase` should be adapted to take this structure or `AuthRepository.register` called directly for now.
      // Assuming RegisterUseCase.execute can take this object:
      const authUser = await registerUseCase.execute(registrationData);

      console.log("Registration successful:", authUser);
      // If registration returns a token (auto-login), store it.
      // The Postman example for SIGNUP (which is actually a SIGNIN response) has accessToken and user.
      if (authUser && authUser.user && authUser.accessToken) {
        localStorage.setItem("currentUser", JSON.stringify(authUser.user));
        localStorage.setItem("accessToken", authUser.accessToken);
        if (authUser.refreshToken) {
          localStorage.setItem("refreshToken", authUser.refreshToken);
        }
         // Redirect to login or backoffice if registration implies auto-login
        // For now, keeping the original flow of showing success message for email verification.
        setSuccess(true);
      } else {
         // If no token, proceed to email verification message as per original UI.
        setSuccess(true);
      }

    } catch (error: any) {
      console.error("Registration page error:", error);
      setErrors({ email: error.message || "Error al crear la cuenta. Intenta con otro correo o verifica los datos." });
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    // This UI part remains, guiding user to email verification.
    // If auto-login happens, this screen might be skipped or adapted.
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
              onClick={() => (window.location.href = "/auth/login")} // Go to login after registration success message
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
            >
              Ir al Inicio de Sesión
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Únete a Golden Bingo y comienza a ganar">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Nombres"
          type="text"
          placeholder="Tus nombres"
          value={formData.first_name}
          onChange={(value) => setFormData({ ...formData, first_name: value })}
          error={errors.first_name}
          required
          disabled={isLoading}
        />
        <FormField
          label="Apellidos"
          type="text"
          placeholder="Tus apellidos"
          value={formData.last_name}
          onChange={(value) => setFormData({ ...formData, last_name: value })}
          error={errors.last_name}
          required
          disabled={isLoading}
        />
        <FormField
          label="DNI / Cédula"
          type="text"
          placeholder="Tu número de identificación"
          value={formData.dni}
          onChange={(value) => setFormData({ ...formData, dni: value })}
          error={errors.dni}
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

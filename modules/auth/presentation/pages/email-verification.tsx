"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "../components/auth-layout"
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl"
import { Loader2, Mail, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface EmailVerificationPageProps {
  token?: string
  email?: string
}

export function EmailVerificationPage({ token, email = "usuario@ejemplo.com" }: EmailVerificationPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const authRepository = new AuthRepositoryImpl()

  const handleVerifyEmail = async () => {
    if (!token) return

    setIsLoading(true)
    setError("")
    try {
      await authRepository.verifyEmail(token)
      setSuccess(true)
    } catch (error) {
      setError("Error al verificar el correo. El enlace puede haber expirado.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    setError("")
    try {
      await authRepository.resendVerificationEmail(email)
      setError("") // Clear any previous errors
      // Show success message
    } catch (error) {
      setError("Error al reenviar el correo. Intenta nuevamente.")
    } finally {
      setIsResending(false)
    }
  }

  // Auto-verify if token is present
  if (token && !success && !isLoading && !error) {
    handleVerifyEmail()
  }

  if (success) {
    return (
      <AuthLayout title="¡Correo Verificado!" subtitle="Tu cuenta ha sido activada exitosamente">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-gray-300 mb-6">
            ¡Excelente! Tu correo electrónico ha sido verificado correctamente. Ahora puedes acceder a todas las
            funciones de Golden Bingo.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = "/auth/login")}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Verificar Correo" subtitle="Confirma tu dirección de correo electrónico">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>

        {token ? (
          // Verification in progress or error
          <div>
            {isLoading ? (
              <div>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
                <p className="text-gray-300 mb-6">Verificando tu correo electrónico...</p>
              </div>
            ) : error ? (
              <div>
                <p className="text-red-400 mb-6">{error}</p>
                <Button
                  onClick={handleVerifyEmail}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold mb-3"
                >
                  Intentar nuevamente
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          // No token - show instructions
          <div>
            <p className="text-gray-300 mb-6">
              Hemos enviado un correo de verificación a <strong className="text-white">{email}</strong>. Haz clic en el
              enlace del correo para verificar tu cuenta.
            </p>

            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                💡 Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
              </p>
            </div>

            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black mb-3"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reenviar correo
                </>
              )}
            </Button>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <Link href="/auth/login" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
            Volver al inicio de sesión
          </Link>
          <Link href="/" className="block text-gray-400 hover:text-gray-300 transition-colors">
            Ir al inicio
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

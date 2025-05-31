"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Gift, Mail } from "lucide-react"
import Link from "next/link"

export function MainSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">¡Nuevo! Bingo en Vivo</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              GOLDEN
            </span>
            <br />
            <span className="text-white">BINGO</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experimenta la emoción del bingo como nunca antes. Premios increíbles, salas exclusivas y la mejor
            experiencia de juego online.
          </p>

          {/* Bonus Highlight */}
          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Gift className="h-6 w-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">BONO DE BIENVENIDA</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">$100</div>
            <div className="text-gray-300">+ 50 Cartones Gratis</div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                JUGAR AHORA
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-lg px-8 py-4 rounded-xl"
            >
              VER DEMO
            </Button>
          </div>

          {/* Registration Form */}
          <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¡Únete a la{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Diversión!
              </span>
            </h2>

            <p className="text-lg text-gray-300 mb-6">
              Regístrate ahora y recibe tu bono de bienvenida de $100 + 50 cartones gratis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Tu email aquí..."
                  className="pl-10 bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-400 focus:border-yellow-400 h-12"
                />
              </div>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 h-12 rounded-xl w-full sm:w-auto"
                >
                  REGISTRARSE
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">10,000+</div>
              <div className="text-gray-300">Jugadores Activos</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">$2M+</div>
              <div className="text-gray-300">Premios Entregados</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Salas Disponibles</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Crown } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-400" />
              <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              GOLDEN BINGO
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-white hover:text-yellow-400 transition-colors">
              Inicio
            </a>
            <a href="#juegos" className="text-white hover:text-yellow-400 transition-colors">
              Juegos
            </a>
            <a href="#promociones" className="text-white hover:text-yellow-400 transition-colors">
              Promociones
            </a>
            <a href="#contacto" className="text-white hover:text-yellow-400 transition-colors">
              Contacto
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-yellow-500/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#inicio" className="text-white hover:text-yellow-400 transition-colors">
                Inicio
              </a>
              <a href="#juegos" className="text-white hover:text-yellow-400 transition-colors">
                Juegos
              </a>
              <a href="#promociones" className="text-white hover:text-yellow-400 transition-colors">
                Promociones
              </a>
              <a href="#contacto" className="text-white hover:text-yellow-400 transition-colors">
                Contacto
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

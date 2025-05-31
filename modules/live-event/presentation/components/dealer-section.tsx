"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mic, Volume2, VolumeX } from "lucide-react"
import type { Dealer, BingoCall } from "../../domain/entities/live-event.entity"

// Update interface to remove nextCall
interface DealerSectionProps {
  dealer: Dealer
  currentCall?: BingoCall
  timeToNextCall: number
}

// Update component to remove nextCall parameter and next number section
export function DealerSection({ dealer, currentCall, timeToNextCall }: DealerSectionProps) {
  const [countdown, setCountdown] = useState(timeToNextCall)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    setCountdown(timeToNextCall)
  }, [timeToNextCall])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 15 // Reset to 15 when it reaches 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function getNumberColor(letter: string) {
    switch (letter) {
      case "B":
        return "text-blue-400"
      case "I":
        return "text-green-400"
      case "N":
        return "text-yellow-400"
      case "G":
        return "text-purple-400"
      case "O":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  // Remove getNumberColor function and update the grid to only show current number and countdown
  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-yellow-400">
              <AvatarImage src={dealer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-yellow-400 text-black text-xl">
                {dealer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {dealer.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{dealer.name}</h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Mic className="h-3 w-3 mr-1" />
                En Vivo
              </Badge>
              <span className="text-gray-400 text-sm">Presentadora Oficial</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-lg transition-colors ${
            isMuted
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-green-500/20 text-green-400 border border-green-500/30"
          }`}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Current Number */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-3">Número Actual</h3>
          {currentCall ? (
            <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl p-3">
              <div className={`text-4xl font-bold mb-2 ${getNumberColor(currentCall.letter)}`}>
                {currentCall.letter}
              </div>
              <div className="text-6xl font-bold text-white mb-2">{currentCall.number}</div>
            </div>
          ) : (
            <div className="bg-gray-500/20 border border-gray-500/30 rounded-xl p-8">
              <div className="text-gray-400 text-2xl">Esperando...</div>
            </div>
          )}
        </div>

        {/* Countdown */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-3">Próximo Número en</h3>
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-3">
            <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
            <div className="text-lg text-gray-300">segundos</div>
            <div className="w-full bg-white/20 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${((15 - countdown) / 15) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Audio Indicator */}
      <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-400">
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-green-400 rounded animate-pulse"></div>
          <div className="w-1 h-6 bg-green-400 rounded animate-pulse delay-100"></div>
          <div className="w-1 h-3 bg-green-400 rounded animate-pulse delay-200"></div>
          <div className="w-1 h-5 bg-green-400 rounded animate-pulse delay-300"></div>
        </div>
        <span>Audio en vivo</span>
      </div>
    </div>
  )
}

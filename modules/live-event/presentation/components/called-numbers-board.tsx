"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { BingoCall } from "../../domain/entities/live-event.entity"

interface CalledNumbersBoardProps {
  calledNumbers: BingoCall[]
  currentCall?: BingoCall
}

export function CalledNumbersBoard({ calledNumbers, currentCall }: CalledNumbersBoardProps) {
  const [showAll, setShowAll] = useState(false)

  const getLetterColor = (letter: string) => {
    switch (letter) {
      case "B":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "I":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "N":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "G":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "O":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const displayNumbers = showAll ? calledNumbers : calledNumbers.slice(-10)
  const allNumbers = [...calledNumbers]
  if (currentCall && !calledNumbers.find((c) => c.number === currentCall.number)) {
    allNumbers.push(currentCall)
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Números Cantados</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {allNumbers.length} número{allNumbers.length !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="sm"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
          >
            {showAll ? "Mostrar menos" : "Ver todos"}
          </Button>
        </div>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
        {displayNumbers.map((call, index) => (
          <div
            key={`${call.number}-${call.callOrder}`}
            className={`aspect-square flex flex-col items-center justify-center rounded-full border text-xs font-bold transition-all ${getLetterColor(call.letter)} ${
              currentCall?.number === call.number ? "ring-2 ring-white/50 scale-110" : ""
            }`}
          >
            <div className="text-xs opacity-70">{call.letter}</div>
            <div className="text-lg">{call.number}</div>
          </div>
        ))}
      </div>

      {/* Current Number Highlight */}
      {currentCall && (
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">Número Actual</div>
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${getLetterColor(currentCall.letter)}`}
              >
                <div className="text-center">
                  <div className="text-xs">{currentCall.letter}</div>
                  <div className="text-xl font-bold">{currentCall.number}</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">Orden</div>
              <div className="text-2xl font-bold text-white">#{currentCall.callOrder}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">Hora</div>
              <div className="text-sm text-white">
                {currentCall.timestamp.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      {calledNumbers.length > 10 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={showAll}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-400">{showAll ? "Todos" : `Últimos 10`}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={showAll}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

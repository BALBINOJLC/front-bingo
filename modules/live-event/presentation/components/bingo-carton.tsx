"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Star } from "lucide-react"
import type { LiveCarton } from "../../domain/entities/live-event.entity"

interface BingoCartonProps {
  carton: LiveCarton
  calledNumbers: number[]
  onMarkNumber: (number: number) => void
  onClaimWin: (winType: "LINE" | "FULL_HOUSE" | "FOUR_CORNERS") => void
  isCurrentUser?: boolean
}

// Generate a proper bingo carton with correct number ranges BY COLUMNS
function generateBingoCarton(): number[] {
  const carton: number[] = new Array(25)

  // B column: 1-15 (positions 0, 5, 10, 15, 20)
  const bNumbers = Array.from({ length: 15 }, (_, i) => i + 1)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  // I column: 16-30 (positions 1, 6, 11, 16, 21)
  const iNumbers = Array.from({ length: 15 }, (_, i) => i + 16)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  // N column: 31-45 (positions 2, 7, 12, 17, 22) - center will be FREE
  const nNumbers = Array.from({ length: 15 }, (_, i) => i + 31)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4) // Only 4 numbers since center is FREE

  // G column: 46-60 (positions 3, 8, 13, 18, 23)
  const gNumbers = Array.from({ length: 15 }, (_, i) => i + 46)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  // O column: 61-75 (positions 4, 9, 14, 19, 24)
  const oNumbers = Array.from({ length: 15 }, (_, i) => i + 61)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  // Fill the carton BY COLUMNS
  // B column (column 0)
  for (let row = 0; row < 5; row++) {
    carton[row * 5 + 0] = bNumbers[row]
  }

  // I column (column 1)
  for (let row = 0; row < 5; row++) {
    carton[row * 5 + 1] = iNumbers[row]
  }

  // N column (column 2) - with FREE space in center
  let nIndex = 0
  for (let row = 0; row < 5; row++) {
    if (row === 2) {
      carton[row * 5 + 2] = 0 // FREE space
    } else {
      carton[row * 5 + 2] = nNumbers[nIndex]
      nIndex++
    }
  }

  // G column (column 3)
  for (let row = 0; row < 5; row++) {
    carton[row * 5 + 3] = gNumbers[row]
  }

  // O column (column 4)
  for (let row = 0; row < 5; row++) {
    carton[row * 5 + 4] = oNumbers[row]
  }

  return carton
}

// Validate if carton follows proper bingo column rules
function isValidBingoCarton(numbers: number[]): boolean {
  if (numbers.length !== 25) return false

  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 5; row++) {
      const index = row * 5 + col
      const number = numbers[index]

      // Skip FREE space
      if (index === 12 && number === 0) continue

      // Check column ranges
      switch (col) {
        case 0: // B column: 1-15
          if (number < 1 || number > 15) return false
          break
        case 1: // I column: 16-30
          if (number < 16 || number > 30) return false
          break
        case 2: // N column: 31-45
          if (index !== 12 && (number < 31 || number > 45)) return false
          break
        case 3: // G column: 46-60
          if (number < 46 || number > 60) return false
          break
        case 4: // O column: 61-75
          if (number < 61 || number > 75) return false
          break
      }
    }
  }
  return true
}

export function BingoCarton({
  carton,
  calledNumbers,
  onMarkNumber,
  onClaimWin,
  isCurrentUser = false,
}: BingoCartonProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set(carton.markedNumbers))

  // Use proper bingo carton if the current one doesn't follow rules
  const properCarton = isValidBingoCarton(carton.numbers) ? carton.numbers : generateBingoCarton()

  // Update selected numbers when carton.markedNumbers changes
  useEffect(() => {
    setSelectedNumbers(new Set(carton.markedNumbers))
  }, [carton.markedNumbers])

  const handleNumberClick = (number: number) => {
    if (!isCurrentUser || number === 0) return // Can't mark FREE space or if not current user

    if (calledNumbers.includes(number)) {
      const newSelected = new Set(selectedNumbers)
      if (newSelected.has(number)) {
        newSelected.delete(number)
      } else {
        newSelected.add(number)
        onMarkNumber(number)
      }
      setSelectedNumbers(newSelected)
    }
  }

  const isNumberCalled = (number: number) => calledNumbers.includes(number)
  const isNumberMarked = (number: number) => selectedNumbers.has(number)

  const getNumberStyle = (number: number, index: number) => {
    const isCenter = index === 12 // Center position (FREE)
    const isCalled = isNumberCalled(number)
    const isMarked = isNumberMarked(number)

    if (isCenter) {
      return "bg-yellow-400/30 text-yellow-400 border-yellow-400/50 text-lg font-bold"
    }

    if (isMarked && isCalled) {
      return "bg-green-500/30 text-green-400 border-green-500/50 ring-2 ring-green-400/50"
    }

    if (isCalled && isCurrentUser) {
      return "bg-blue-500/30 text-blue-400 border-blue-500/50 cursor-pointer hover:bg-blue-500/40"
    }

    if (isCalled) {
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }

    return "bg-white/10 text-white border-white/20"
  }

  const getColumnColor = (colIndex: number) => {
    const colors = [
      "text-blue-400 bg-blue-400/20 border-blue-400/30",
      "text-green-400 bg-green-400/20 border-green-400/30",
      "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      "text-purple-400 bg-purple-400/20 border-purple-400/30",
      "text-red-400 bg-red-400/20 border-red-400/30",
    ]
    return colors[colIndex]
  }

  const checkForWins = () => {
    const wins = []

    // Check for horizontal lines (rows)
    for (let row = 0; row < 5; row++) {
      let markedInRow = 0
      for (let col = 0; col < 5; col++) {
        const index = row * 5 + col
        const number = properCarton[index]
        if (index === 12 || selectedNumbers.has(number)) {
          // Center is always marked
          markedInRow++
        }
      }
      if (markedInRow === 5) {
        wins.push("LINE")
        break
      }
    }

    // Check for vertical lines (columns)
    for (let col = 0; col < 5; col++) {
      let markedInCol = 0
      for (let row = 0; row < 5; row++) {
        const index = row * 5 + col
        const number = properCarton[index]
        if (index === 12 || selectedNumbers.has(number)) {
          // Center is always marked
          markedInCol++
        }
      }
      if (markedInCol === 5) {
        wins.push("LINE")
        break
      }
    }

    // Check for diagonal lines
    let diag1Marked = 0
    let diag2Marked = 0
    for (let i = 0; i < 5; i++) {
      // Main diagonal (top-left to bottom-right)
      const diag1Index = i * 5 + i
      const diag1Number = properCarton[diag1Index]
      if (diag1Index === 12 || selectedNumbers.has(diag1Number)) {
        diag1Marked++
      }

      // Anti-diagonal (top-right to bottom-left)
      const diag2Index = i * 5 + (4 - i)
      const diag2Number = properCarton[diag2Index]
      if (diag2Index === 12 || selectedNumbers.has(diag2Number)) {
        diag2Marked++
      }
    }

    if (diag1Marked === 5 || diag2Marked === 5) {
      wins.push("LINE")
    }

    // Check for full house
    const totalMarked = selectedNumbers.size + 1 // +1 for FREE space
    if (totalMarked === 25) {
      wins.push("FULL_HOUSE")
    }

    // Check for four corners
    const corners = [properCarton[0], properCarton[4], properCarton[20], properCarton[24]]
    const markedCorners = corners.filter((num) => selectedNumbers.has(num))
    if (markedCorners.length === 4) {
      wins.push("FOUR_CORNERS")
    }

    return wins
  }

  const possibleWins = checkForWins()

  return (
    <div
      className={`bg-black/30 backdrop-blur-md rounded-xl border p-4 transition-all ${
        isCurrentUser ? "border-yellow-500/40 hover:border-yellow-400/60" : "border-white/20"
      } ${carton.isWinner ? "ring-2 ring-green-400/50" : ""}`}
    >
      {/* Carton Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Cartón #{carton.id}</h3>
          {isCurrentUser && <span className="text-yellow-400 text-sm font-medium">Tu cartón</span>}
        </div>
        {carton.isWinner && (
          <div className="flex items-center text-green-400">
            <Trophy className="h-5 w-5 mr-1" />
            <span className="text-sm font-bold">¡Ganador!</span>
          </div>
        )}
      </div>

      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {["B", "I", "N", "G", "O"].map((letter, i) => (
          <div key={i} className={`text-center text-lg font-bold py-2 rounded border ${getColumnColor(i)}`}>
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Numbers Grid - 5 rows x 5 columns */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {properCarton.map((number, i) => {
          const isCenter = i === 12
          const displayNumber = isCenter ? "★" : number

          return (
            <button
              key={i}
              onClick={() => handleNumberClick(number)}
              disabled={!isCurrentUser || isCenter}
              className={`aspect-square flex items-center justify-center text-sm font-bold rounded border transition-all ${getNumberStyle(number, i)}`}
            >
              {displayNumber}
            </button>
          )
        })}
      </div>

      {/* Column ranges info */}
      <div className="text-xs text-gray-400 mb-3 text-center">
        <div className="grid grid-cols-5 gap-1">
          <span className="text-blue-400">1-15</span>
          <span className="text-green-400">16-30</span>
          <span className="text-yellow-400">31-45</span>
          <span className="text-purple-400">46-60</span>
          <span className="text-red-400">61-75</span>
        </div>
      </div>

      {/* Win Claims */}
      {isCurrentUser && possibleWins.length > 0 && (
        <div className="space-y-2">
          {possibleWins.map((winType) => (
            <Button
              key={winType}
              onClick={() => onClaimWin(winType as "LINE" | "FULL_HOUSE" | "FOUR_CORNERS")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              ¡Reclamar {winType === "LINE" ? "Línea" : winType === "FULL_HOUSE" ? "Cartón Lleno" : "Cuatro Esquinas"}!
            </Button>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-400">Marcados: {selectedNumbers.size + 1}/25</div>
        <div className="w-full bg-white/20 rounded-full h-1 mt-1">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 rounded-full transition-all"
            style={{
              width: `${((selectedNumbers.size + 1) / 25) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

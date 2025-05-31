"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Trophy, Clock, Volume2 } from "lucide-react"
import Link from "next/link"
import { DealerSection } from "../components/dealer-section"
import { BingoCarton } from "../components/bingo-carton"
import { ParticipantsSidebar } from "../components/participants-sidebar"
import { CalledNumbersBoard } from "../components/called-numbers-board"
import { LiveEventRepositoryImpl } from "../../infrastructure/repositories/live-event.repository.impl"
import { JoinLiveEventUseCase } from "../../application/use-cases/join-live-event.use-case"
import type { LiveEvent, GameState } from "../../domain/entities/live-event.entity"

interface LiveEventRoomProps {
  eventId: string
  userId?: string
}

export function LiveEventRoom({ eventId, userId = "user-1" }: LiveEventRoomProps) {
  const [event, setEvent] = useState<LiveEvent | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const repository = new LiveEventRepositoryImpl()
  const joinEventUseCase = new JoinLiveEventUseCase(repository)

  useEffect(() => {
    const initializeEvent = async () => {
      try {
        setLoading(true)

        // Join the event
        const eventData = await joinEventUseCase.execute(eventId, userId)
        setEvent(eventData)

        // Get initial game state
        const initialGameState = await repository.getGameState(eventId)
        setGameState(initialGameState)

        // Subscribe to game updates
        const unsubscribe = repository.subscribeToGameUpdates(eventId, (newGameState) => {
          setGameState(newGameState)
        })

        return () => {
          unsubscribe()
          repository.leaveEvent(eventId, userId)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el evento")
      } finally {
        setLoading(false)
      }
    }

    initializeEvent()
  }, [eventId, userId])

  const handleMarkNumber = async (cartonId: number, number: number) => {
    try {
      await repository.markNumber(eventId, cartonId, number, userId)
    } catch (err) {
      console.error("Error marking number:", err)
    }
  }

  const handleClaimWin = async (cartonId: number, winType: "LINE" | "FULL_HOUSE" | "FOUR_CORNERS") => {
    try {
      const isValid = await repository.claimWin(eventId, cartonId, winType, userId)
      if (isValid) {
        // Update local state or show success message
        console.log("¡Felicidades! Has ganado:", winType)
      } else {
        console.log("La reclamación no es válida")
      }
    } catch (err) {
      console.error("Error claiming win:", err)
    }
  }

  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Conectando a la sala...</p>
          <p className="text-gray-400 text-sm">Preparando tu experiencia de bingo</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "Evento no encontrado"}</p>
          <Link href="/backoffice">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userCartons = event.cartons.filter((carton) => carton.userId === userId)
  const calledNumbers = gameState?.calledNumbers.map((call) => call.number) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-yellow-500/20 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/backoffice">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{event.name}</h1>
                <p className="text-gray-300">{event.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center text-yellow-400">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="font-bold">{formatPrize(event.prizePool)}</span>
                </div>
                <div className="text-xs text-gray-400">Premio Total</div>
              </div>

              <div className="text-center">
                <div className="flex items-center text-green-400">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-bold">{event.participants.filter((p) => p.isOnline).length}</span>
                </div>
                <div className="text-xs text-gray-400">En Línea</div>
              </div>

              <div className="text-center">
                <div className="flex items-center text-blue-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-bold">
                    {event.timeStart} - {event.timeEnd}
                  </span>
                </div>
                <div className="text-xs text-gray-400">Horario</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Dealer Section */}
            {event.dealer && gameState && (
              <DealerSection
                dealer={event.dealer}
                currentCall={gameState.currentCall}
                timeToNextCall={gameState.timeToNextCall}
              />
            )}

            {/* Called Numbers Board */}
            {gameState && (
              <CalledNumbersBoard calledNumbers={gameState.calledNumbers} currentCall={gameState.currentCall} />
            )}

            {/* User's Cartons */}
            {userCartons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Mis Cartones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userCartons.map((carton) => (
                    <BingoCarton
                      key={carton.id}
                      carton={carton}
                      calledNumbers={calledNumbers}
                      onMarkNumber={(number) => handleMarkNumber(carton.id, number)}
                      onClaimWin={(winType) => handleClaimWin(carton.id, winType)}
                      isCurrentUser={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Players' Cartons */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Otros Jugadores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.cartons
                  .filter((carton) => carton.userId && carton.userId !== userId)
                  .slice(0, 6) // Show only first 6 for performance
                  .map((carton) => (
                    <BingoCarton
                      key={carton.id}
                      carton={carton}
                      calledNumbers={calledNumbers}
                      onMarkNumber={() => {}} // No interaction for other players
                      onClaimWin={() => {}} // No interaction for other players
                      isCurrentUser={false}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ParticipantsSidebar participants={event.participants} currentUserId={userId} />
          </div>
        </div>
      </div>

      {/* Floating Audio Controls */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg" size="sm">
          <Volume2 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

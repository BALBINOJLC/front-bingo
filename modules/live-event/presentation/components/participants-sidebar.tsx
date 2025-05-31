"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Trophy } from "lucide-react"
import type { Participant } from "../../domain/entities/live-event.entity"

interface ParticipantsSidebarProps {
  participants: Participant[]
  currentUserId?: string
}

export function ParticipantsSidebar({ participants, currentUserId }: ParticipantsSidebarProps) {
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  const sortedParticipants = [...participants].sort((a, b) => {
    // Current user first
    if (a.id === currentUserId) return -1
    if (b.id === currentUserId) return 1

    // Then by online status
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1

    // Then by join time (most recent first)
    return b.joinedAt.getTime() - a.joinedAt.getTime()
  })

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">Participantes</h3>
        <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
          {participants.filter((p) => p.isOnline).length}
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              participant.id === currentUserId
                ? "bg-yellow-400/10 border border-yellow-400/30"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                  {participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Online indicator */}
              {participant.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-black rounded-full"></div>
              )}

              {/* Top player indicator */}
              {index === 0 && participant.id !== currentUserId && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="h-2 w-2 text-black" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-white font-medium truncate">
                  {participant.name}
                  {participant.id === currentUserId && <span className="text-yellow-400 text-xs ml-1">(Tú)</span>}
                </p>
                {participant.cartons.some((c) => c.isWinner) && <Trophy className="h-3 w-3 text-yellow-400" />}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400">
                  {participant.cartons.length} cartón{participant.cartons.length !== 1 ? "es" : ""}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{formatTimeAgo(participant.joinedAt)}</span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              {participant.isOnline ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">En línea</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">Ausente</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-lg font-bold text-white">{participants.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400">{participants.filter((p) => p.isOnline).length}</div>
            <div className="text-xs text-gray-400">En línea</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"
import { TicketCard } from "../components/ticket-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { QrCode, Calendar, MapPin, TicketIcon, AlertCircle } from "lucide-react"
import type { Ticket } from "../../domain/entities/ticket.entity"
import { Skeleton } from "@/components/ui/skeleton"

// Componente para mostrar el código QR de un ticket
function QRCodeDisplay({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg mb-4">
        <div className="w-64 h-64 relative">
          {/* Simulación de código QR con imagen */}
          <img
            src={`/placeholder.svg?height=256&width=256&query=QR%20Code%20for%20${ticket.ticketNumber}`}
            alt="Código QR"
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-32 h-32 text-black/20" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{ticket.eventTitle}</h3>
      <p className="text-yellow-400 font-bold mb-4">Ticket #{ticket.ticketNumber}</p>

      <div className="w-full space-y-3 text-sm">
        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
          {new Date(ticket.eventDate).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
          {ticket.eventLocation}
        </div>

        <div className="flex items-center text-gray-300">
          <TicketIcon className="h-4 w-4 mr-2 text-yellow-400" />
          Comprado el {new Date(ticket.purchaseDate).toLocaleDateString("es-ES")}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg w-full">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <p className="text-white text-sm">
              Presenta este código QR en la entrada del evento para acceder. No compartas esta imagen con nadie.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar un cartón de bingo
function BingoCard({ ticket }: { ticket: Ticket }) {
  // Generamos un cartón de bingo basado en el ticketNumber para que sea consistente
  const generateBingoCard = (ticketSeed: string) => {
    // Usamos el ticketNumber como semilla para generar números consistentes
    const seed = ticketSeed.split("").reduce((a, b) => a + b.charCodeAt(0), 0)

    // Función para generar un número aleatorio pero determinista basado en la semilla
    const seededRandom = (min: number, max: number, offset = 0) => {
      const x = Math.sin(seed + offset) * 10000
      const rand = x - Math.floor(x)
      return Math.floor(rand * (max - min + 1)) + min
    }

    // Generar columnas con rangos específicos para bingo de 100 bolas
    const generateColumn = (min: number, max: number, count: number, offset: number) => {
      const numbers = new Set<number>()
      while (numbers.size < count) {
        numbers.add(seededRandom(min, max, offset + numbers.size))
      }
      return Array.from(numbers).sort((a, b) => a - b)
    }

    return {
      b: generateColumn(1, 20, 5, 0),
      i: generateColumn(21, 40, 5, 100),
      n: generateColumn(41, 60, 4, 200), // N tiene 4 números + espacio libre
      g: generateColumn(61, 80, 5, 300),
      o: generateColumn(81, 100, 5, 400),
    }
  }

  const bingoCard = generateBingoCard(ticket.ticketNumber)

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-lg p-4 mb-4 w-full max-w-xs">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white">{ticket.eventTitle}</h3>
          <p className="text-yellow-400 text-sm">Cartón #{ticket.ticketNumber}</p>
        </div>

        <div className="grid grid-cols-5 gap-1 mb-4">
          {/* Encabezado BINGO */}
          {["B", "I", "N", "G", "O"].map((letter) => (
            <div key={letter} className="bg-yellow-400 text-black font-bold text-center py-2 rounded-sm">
              {letter}
            </div>
          ))}

          {/* Números del cartón */}
          {[0, 1, 2, 3, 4].map((row) => (
            <>
              {/* Columna B */}
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCard.b[row]}</div>

              {/* Columna I */}
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCard.i[row]}</div>

              {/* Columna N - con espacio libre en el centro */}
              <div
                className={`${row === 2 ? "bg-yellow-400/50" : "bg-black/30"} text-white text-center py-2 rounded-sm`}
              >
                {row === 2 ? "FREE" : bingoCard.n[row > 2 ? row - 1 : row]}
              </div>

              {/* Columna G */}
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCard.g[row]}</div>

              {/* Columna O */}
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCard.o[row]}</div>
            </>
          ))}
        </div>
      </div>

      <div className="w-full space-y-3 text-sm">
        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
          {new Date(ticket.eventDate).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
          {ticket.eventLocation}
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar múltiples cartones de bingo
function BingoCardsDisplay({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="flex flex-col items-center max-h-[70vh] overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-2">{tickets[0]?.eventTitle}</h3>
      <p className="text-gray-300 mb-6">
        {tickets.length === 1 ? "Tu cartón para este evento" : `Tus ${tickets.length} cartones para este evento`}
      </p>

      <div className="space-y-6 w-full">
        {tickets.map((ticket) => (
          <BingoCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}

export function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [selectedEventTickets, setSelectedEventTickets] = useState<Ticket[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<"qr" | "card">("qr")

  const repository = new BackofficeRepositoryImpl()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Simulamos un ID de usuario para la demo
        const userTickets = await repository.getUserTickets("user-1")
        setTickets(userTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleViewQR = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket) {
      setSelectedTicket(ticket)
      setDialogContent("qr")
      setDialogOpen(true)
    }
  }

  const handleViewCard = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket) {
      // Buscar todos los tickets del mismo evento
      const eventTickets = tickets.filter((t) => t.eventId === ticket.eventId)
      setSelectedTicket(ticket)
      setSelectedEventTickets(eventTickets)
      setDialogContent("card")
      setDialogOpen(true)
    }
  }

  const activeTickets = tickets.filter((ticket) => ticket.status === "active")
  const pastTickets = tickets.filter((ticket) => ticket.status !== "active")

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mis Tickets</h1>
        <p className="text-gray-300">Gestiona tus tickets y cartones de bingo para próximos eventos</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-black/20 border border-yellow-500/20">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
          >
            Tickets Activos ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
          >
            Tickets Pasados ({pastTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-1/4 bg-gray-700/30 mb-4" />
                  <Skeleton className="h-4 w-full bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700/30 mb-4" />
                  <Skeleton className="h-10 w-full bg-gray-700/30" />
                </div>
              ))}
            </div>
          ) : activeTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-col">
                  <TicketCard ticket={ticket} onViewQR={() => handleViewQR(ticket.id)} />
                  <Button
                    onClick={() => handleViewCard(ticket.id)}
                    className="mt-2 w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30"
                    variant="outline"
                  >
                    Ver Cartón de Bingo
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl">
              <TicketIcon className="h-16 w-16 mx-auto text-yellow-400/30 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tienes tickets activos</h3>
              <p className="text-gray-400 mb-6">Compra tickets para próximos eventos y aparecerán aquí</p>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Explorar Eventos</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-1/4 bg-gray-700/30 mb-4" />
                  <Skeleton className="h-4 w-full bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-700/30 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700/30 mb-4" />
                </div>
              ))}
            </div>
          ) : pastTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl">
              <TicketIcon className="h-16 w-16 mx-auto text-yellow-400/30 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tienes tickets pasados</h3>
              <p className="text-gray-400">Aquí aparecerán tus tickets de eventos anteriores</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para mostrar QR o cartón */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md border border-yellow-500/20 text-white max-w-lg max-h-[80vh] overflow-hidden">
          {selectedTicket && dialogContent === "qr" && <QRCodeDisplay ticket={selectedTicket} />}

          {selectedEventTickets.length > 0 && dialogContent === "card" && (
            <BingoCardsDisplay tickets={selectedEventTickets} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

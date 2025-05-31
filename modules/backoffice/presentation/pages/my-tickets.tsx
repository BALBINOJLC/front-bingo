// modules/backoffice/presentation/pages/my-tickets.tsx
"use client"

import { useState, useEffect } from "react"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"
import { TicketCard } from "../components/ticket-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { QrCode, Calendar, MapPin, TicketIcon, AlertCircle, Loader2 } from "lucide-react" // Added Loader2
import type { Ticket } from "../../domain/entities/ticket.entity" // Domain entity for a ticket
import type { User } from "@/modules/auth/domain/entities/user.entity"; // For user ID
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"; // Added Link
import React from "react" // Added React for React.Fragment

// QRCodeDisplay and BingoCard components (from original file) are assumed to be here or imported.
// For brevity, they are not repeated in this diff, but their props might need adjustment if Ticket structure changes.

// Component to show the QR code (simplified, assuming it exists as before)
function QRCodeDisplay({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg mb-4">
        <div className="w-64 h-64 relative">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(ticket.qrCode || ticket.ticketNumber)}`} alt="Código QR" className="w-full h-full" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{ticket.eventTitle}</h3>
      <p className="text-yellow-400 font-bold mb-4">Ticket #{ticket.ticketNumber}</p>
      <div className="w-full space-y-3 text-sm">
        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
          {new Date(ticket.eventDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"})}
        </div>
        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
          {ticket.eventLocation}
        </div>
      </div>
       <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg w-full">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div><p className="text-white text-sm">Presenta este código QR en la entrada del evento.</p></div>
        </div>
      </div>
    </div>
  );
}

// Component to show bingo card (simplified, assuming it exists as before)
function BingoCard({ ticket }: { ticket: Ticket }) {
  const generateBingoCard = (ticketSeed: string) => {
    const seed = ticketSeed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const seededRandom = (min: number, max: number, offset = 0) => { const x = Math.sin(seed + offset) * 10000; return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min; };
    const generateColumn = (min: number, max: number, count: number, offset: number) => { const nums = new Set<number>(); while (nums.size < count) nums.add(seededRandom(min, max, offset + nums.size)); return Array.from(nums).sort((a, b) => a - b);};
    return { b: generateColumn(1, 20, 5, 0), i: generateColumn(21, 40, 5, 100), n: generateColumn(41, 60, 4, 200), g: generateColumn(61, 80, 5, 300), o: generateColumn(81, 100, 5, 400) };
  };
  const bingoCardData = generateBingoCard(ticket.ticketNumber);
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-lg p-4 mb-4 w-full max-w-xs">
        <div className="text-center mb-4"><h3 className="text-lg font-bold text-white">{ticket.eventTitle}</h3><p className="text-yellow-400 text-sm">Cartón #{ticket.ticketNumber}</p></div>
        <div className="grid grid-cols-5 gap-1 mb-4">
          {["B", "I", "N", "G", "O"].map((l) => (<div key={l} className="bg-yellow-400 text-black font-bold text-center py-2 rounded-sm">{l}</div>))}
          {[0, 1, 2, 3, 4].map((row) => (<React.Fragment key={row}>
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCardData.b[row]}</div>
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCardData.i[row]}</div>
              <div className={`${row === 2 ? "bg-yellow-400/50" : "bg-black/30"} text-white text-center py-2 rounded-sm`}>{row === 2 ? "FREE" : bingoCardData.n[row > 2 ? row - 1 : row]}</div>
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCardData.g[row]}</div>
              <div className="bg-black/30 text-white text-center py-2 rounded-sm">{bingoCardData.o[row]}</div>
          </React.Fragment>))}
        </div>
      </div>
      <div className="w-full space-y-3 text-sm">
        <div className="flex items-center text-gray-300"><Calendar className="h-4 w-4 mr-2 text-yellow-400" />{new Date(ticket.eventDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"})}</div>
        <div className="flex items-center text-gray-300"><MapPin className="h-4 w-4 mr-2 text-yellow-400" />{ticket.eventLocation}</div>
      </div>
    </div>
  );
}
function BingoCardsDisplay({ tickets }: { tickets: Ticket[] }) {
  if (!tickets || tickets.length === 0) return <p className="text-white">No hay cartones para mostrar.</p>;
  return (
    <div className="flex flex-col items-center max-h-[70vh] overflow-y-auto p-1">
      <h3 className="text-xl font-bold text-white mb-2">{tickets[0]?.eventTitle}</h3>
      <p className="text-gray-300 mb-6">{tickets.length === 1 ? "Tu cartón para este evento" : `Tus ${tickets.length} cartones para este evento`}</p>
      <div className="space-y-6 w-full">
        {tickets.map((ticket) => (<BingoCard key={ticket.id} ticket={ticket} />))}
      </div>
    </div>
  );
}


export function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [selectedEventTickets, setSelectedEventTickets] = useState<Ticket[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<"qr" | "card">("qr")

  const repository = new BackofficeRepositoryImpl()

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      const currentUserString = localStorage.getItem("currentUser");

      if (!token || !currentUserString) {
        setError("Autenticación requerida. Por favor, inicia sesión.");
        setLoading(false);
        // Optional: redirect to login
        // window.location.href = "/auth/login";
        return;
      }

      let currentUser: User;
      try {
        currentUser = JSON.parse(currentUserString);
        if (!currentUser || !currentUser.id) {
          throw new Error("Invalid user data in storage.");
        }
      } catch (e) {
        setError("Error al leer datos de usuario. Intenta iniciar sesión de nuevo.");
        setLoading(false);
        return;
      }

      try {
        // IMPORTANT: Assumes repository.getUserTickets(userId, token) is now functional
        // and correctly fetches tickets for the user.
        // This was previously a point of uncertainty.
        const userTickets = await repository.getUserTickets(currentUser.id, token);
        setTickets(userTickets || []); // Ensure tickets is always an array
      } catch (err: any) {
        console.error("Error fetching tickets:", err);
        // Check if the error is because the endpoint is not defined (as warned in repo)
        if (err.message && err.message.includes("endpoint not defined")) {
            setError("La función para cargar tus tickets aún no está disponible. Intenta más tarde.");
        } else {
            setError(err.message || "No se pudieron cargar tus tickets.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []); // Empty dependency array means this runs once on mount

  const handleViewQR = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setDialogContent("qr");
      setDialogOpen(true);
    }
  };

  const handleViewCard = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      const eventTickets = tickets.filter((t) => t.eventId === ticket.eventId && t.status === "active"); // Show only active tickets for this event
      setSelectedTicket(ticket); // The primary ticket selected
      setSelectedEventTickets(eventTickets.length > 0 ? eventTickets : [ticket]); // Show all for event, or just this one
      setDialogContent("card");
      setDialogOpen(true);
    }
  };

  const activeTickets = tickets.filter((ticket) => ticket.status === "active");
  const pastTickets = tickets.filter((ticket) => ticket.status !== "active");

  if (loading) {
    return (
      <div className="container mx-auto animate-pulse">
        <div className="mb-6">
          <Skeleton className="h-8 w-1/3 bg-gray-700/30 mb-2" />
          <Skeleton className="h-4 w-1/2 bg-gray-700/30" />
        </div>
        <Skeleton className="h-10 w-full bg-gray-700/30 mb-6" /> {/* TabsList Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
              <Skeleton className="h-6 w-3/4 bg-gray-700/30 mb-2" />
              <Skeleton className="h-4 w-1/4 bg-gray-700/30 mb-4" />
              <Skeleton className="h-4 w-full bg-gray-700/30 mb-2" />
              <Skeleton className="h-4 w-3/4 bg-gray-700/30 mb-4" />
              <Skeleton className="h-10 w-full bg-gray-700/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto text-center py-10">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error al Cargar Tickets</h2>
        <p className="text-red-400 mb-6">{error}</p>
        <Link href="/backoffice">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Volver al Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mis Tickets</h1>
        <p className="text-gray-300">Gestiona tus tickets y cartones de bingo para próximos eventos</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-black/20 border border-yellow-500/20">
          <TabsTrigger value="active" className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400">
            Tickets Activos ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400">
            Tickets Pasados ({pastTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-col">
                  <TicketCard ticket={ticket} onViewQR={() => handleViewQR(ticket.id)} />
                  <Button
                    onClick={() => handleViewCard(ticket.id)}
                    className="mt-2 w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30"
                    variant="outline"
                  >
                    Ver Cartón(es) de Bingo
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl">
              <TicketIcon className="h-16 w-16 mx-auto text-yellow-400/30 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tienes tickets activos</h3>
              <p className="text-gray-400 mb-6">Compra tickets para próximos eventos y aparecerán aquí.</p>
              <Link href="/backoffice"> {/* Assuming /backoffice lists events */}
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Explorar Eventos</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl">
              <TicketIcon className="h-16 w-16 mx-auto text-yellow-400/30 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tienes tickets pasados</h3>
              <p className="text-gray-400">Aquí aparecerán tus tickets de eventos anteriores.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md border border-yellow-500/20 text-white max-w-lg max-h-[80vh] overflow-hidden">
          {/* Ensure selectedTicket or selectedEventTickets are valid before rendering children */}
          {dialogContent === "qr" && selectedTicket && <QRCodeDisplay ticket={selectedTicket} />}
          {dialogContent === "card" && selectedEventTickets.length > 0 && <BingoCardsDisplay tickets={selectedEventTickets} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

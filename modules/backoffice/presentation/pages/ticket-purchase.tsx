"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, Trophy, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"

interface TicketPurchaseProps {
  eventId?: string
}

interface Ticket {
  id: string
  number: string
  price: number
  isAvailable: boolean
  isPurchased: boolean
  bingoNumbers: number[] // Add this line
}

export function TicketPurchase({ eventId }: TicketPurchaseProps) {
  const [loadingTicketId, setLoadingTicketId] = useState<string | null>(null)
  const [purchasedTickets, setPurchasedTickets] = useState<Set<string>>(new Set())
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    referenceNumber: "",
    phoneNumber: "",
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedTicketInfo, setPurchasedTicketInfo] = useState<{ ticket: Ticket; reference: string } | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Aquí podrías agregar un toast de confirmación
      console.log(`${label} copiado al portapapeles`)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Static event data to avoid any async issues
  const eventData = {
    id: eventId || "1",
    title: "Bingo Navideño 2024",
    description: "Gran bingo navideño con premios especiales",
    dateText: "19/12/2024",
    timeText: "18:00 - 22:00",
    prize: 5000,
    availableTickets: 98,
    status: "active",
  }

  // Mock API response structure for bingo cards with proper BINGO logic for 100-ball bingo
  // B: 1-20, I: 21-40, N: 41-60 (with FREE), G: 61-80, O: 81-100
  const mockBingoCards = [
    {
      id: 103,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [
        // B column (1-20): positions 0,5,10,15,20
        12,
        26,
        41,
        66,
        81, // Row 1: B-I-N-G-O
        1,
        38,
        58,
        72,
        93, // Row 2
        14,
        34,
        0,
        61,
        88, // Row 3 (center is FREE)
        7,
        29,
        54,
        78,
        95, // Row 4
        3,
        40,
        45,
        67,
        82, // Row 5
      ],
      ticketId: null,
      price: 10000,
    },
    {
      id: 105,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [8, 35, 43, 69, 84, 15, 27, 59, 75, 91, 11, 39, 0, 66, 87, 5, 32, 52, 71, 94, 9, 28, 46, 80, 89],
      ticketId: null,
      price: 10000,
    },
    {
      id: 106,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [13, 31, 47, 73, 86, 2, 36, 41, 68, 92, 10, 29, 0, 76, 83, 6, 33, 53, 70, 95, 15, 40, 44, 79, 81],
      ticketId: null,
      price: 10000,
    },
    {
      id: 107,
      status: "SOLD",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [4, 28, 42, 67, 85, 11, 37, 50, 74, 90, 8, 34, 0, 69, 93, 14, 26, 48, 77, 82, 1, 39, 55, 71, 88],
      ticketId: "user-123",
      price: 10000,
    },
    {
      id: 108,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [9, 30, 45, 72, 87, 6, 35, 51, 66, 94, 13, 27, 0, 78, 81, 3, 38, 43, 75, 91, 12, 32, 49, 68, 89],
      ticketId: null,
      price: 10000,
    },
    {
      id: 109,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [7, 29, 46, 70, 83, 15, 36, 42, 67, 92, 1, 33, 0, 79, 86, 10, 28, 54, 73, 95, 4, 40, 47, 76, 84],
      ticketId: null,
      price: 10000,
    },
    {
      id: 110,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [11, 34, 48, 74, 88, 5, 31, 53, 69, 91, 14, 37, 0, 71, 82, 2, 26, 41, 77, 94, 8, 39, 50, 66, 85],
      ticketId: null,
      price: 10000,
    },
    {
      id: 111,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [3, 27, 44, 68, 90, 12, 38, 51, 75, 81, 6, 30, 0, 72, 93, 15, 35, 49, 67, 87, 9, 32, 45, 80, 89],
      ticketId: null,
      price: 10000,
    },
    {
      id: 112,
      status: "SOLD",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [13, 28, 43, 76, 84, 7, 36, 52, 70, 92, 1, 33, 0, 68, 95, 2, 26, 48, 67, 90, 7, 39, 45, 78, 84],
      ticketId: "user-456",
      price: 10000,
    },
    {
      id: 113,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [8, 31, 50, 71, 87, 14, 26, 46, 78, 94, 2, 39, 0, 66, 81, 11, 34, 54, 74, 90, 5, 37, 42, 69, 88],
      ticketId: null,
      price: 10000,
    },
    {
      id: 114,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [15, 35, 48, 67, 85, 3, 30, 44, 77, 91, 9, 27, 0, 72, 93, 6, 38, 51, 75, 82, 12, 32, 49, 70, 89],
      ticketId: null,
      price: 10000,
    },
    {
      id: 115,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [1, 29, 45, 73, 86, 13, 36, 41, 68, 94, 7, 33, 0, 76, 83, 4, 28, 53, 71, 92, 10, 40, 47, 79, 88],
      ticketId: null,
      price: 10000,
    },
    {
      id: 116,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [11, 34, 52, 69, 81, 5, 31, 43, 74, 95, 14, 37, 0, 67, 87, 8, 26, 48, 78, 90, 2, 39, 46, 72, 84],
      ticketId: null,
      price: 10000,
    },
    {
      id: 117,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [6, 32, 49, 75, 89, 12, 27, 54, 66, 93, 3, 35, 0, 70, 82, 15, 38, 42, 77, 91, 9, 30, 51, 73, 85],
      ticketId: null,
      price: 10000,
    },
    {
      id: 118,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [14, 28, 47, 68, 94, 1, 36, 44, 79, 86, 8, 33, 0, 71, 88, 4, 29, 50, 76, 92, 11, 40, 53, 67, 83],
      ticketId: null,
      price: 10000,
    },
    {
      id: 119,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [7, 34, 41, 72, 90, 13, 31, 48, 66, 81, 2, 26, 0, 78, 95, 10, 39, 45, 74, 87, 5, 37, 52, 69, 84],
      ticketId: null,
      price: 10000,
    },
    {
      id: 120,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [9, 30, 46, 70, 85, 15, 35, 43, 77, 93, 3, 28, 0, 67, 89, 6, 32, 54, 73, 91, 12, 38, 49, 80, 82],
      ticketId: null,
      price: 10000,
    },
    {
      id: 121,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [4, 27, 51, 75, 87, 11, 33, 42, 68, 94, 1, 36, 0, 71, 86, 14, 29, 47, 79, 90, 8, 40, 53, 66, 83],
      ticketId: null,
      price: 10000,
    },
    {
      id: 122,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [13, 31, 44, 69, 87, 5, 38, 50, 76, 81, 10, 34, 0, 72, 95, 2, 26, 48, 67, 90, 7, 39, 45, 78, 84],
      ticketId: null,
      price: 10000,
    },
    {
      id: 123,
      status: "AVAILABLE",
      event_id: "a2a1ff81-e86d-4472-a2eb-5232da6ae4a1",
      numbers: [12, 35, 52, 74, 89, 3, 30, 41, 70, 93, 9, 27, 0, 77, 85, 15, 37, 49, 66, 91, 6, 32, 54, 73, 82],
      ticketId: null,
      price: 10000,
    },
  ]

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const getBingoColumnRange = (column: number): string => {
    switch (column) {
      case 0:
        return "B: 1-20"
      case 1:
        return "I: 21-40"
      case 2:
        return "N: 41-60"
      case 3:
        return "G: 61-80"
      case 4:
        return "O: 81-100"
      default:
        return ""
    }
  }

  const getWhatsAppLink = (ticket: Ticket, userName: string) => {
    // Número de WhatsApp (incluir código de país)
    const phoneNumber = "584241234567" // Reemplazar con el número real

    // Crear el mensaje con la información del cartón y usuario
    const message = `
*¡RESERVA DE CARTÓN GOLDEN BINGO!*
------------------------------
*Cartón:* ${ticket.number}
*Precio:* $${formatPrice(ticket.price)}
*Usuario:* ${userName}
*Evento:* ${eventData.title}
*Fecha:* ${eventData.dateText}
*Hora:* ${eventData.timeText}
------------------------------
Este cartón quedará reservado por 15 minutos para completar tu pago.
`

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message)

    // Generar la URL de WhatsApp
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  const handleWhatsAppPurchase = (ticket: Ticket, userName: string) => {
    if (!ticket) return

    // Cerrar el modal inmediatamente
    setShowPurchaseModal(false)

    // Procesar como compra/reserva
    setLoadingTicketId(ticket.id)

    setTimeout(() => {
      setLoadingTicketId(null)
      setPurchasedTickets((prev) => new Set([...prev, ticket.id]))
      setPurchasedTicketInfo({
        ticket: ticket,
        reference: `WA-${Date.now().toString().slice(-6)}`, // Generar referencia de WhatsApp
      })
      setShowSuccessModal(true)
      setSelectedTicket(null)

      console.log(`Ticket reservado vía WhatsApp: ${ticket.id}`)
    }, 1000)

    // Abrir WhatsApp después de un pequeño delay
    setTimeout(() => {
      const whatsappUrl = getWhatsAppLink(ticket, userName)
      window.open(whatsappUrl, "_blank")
    }, 500)
  }

  const handleTicketPurchase = (ticketId: string) => {
    if (loadingTicketId === ticketId || purchasedTickets.has(ticketId)) return

    setLoadingTicketId(ticketId)

    // Use setTimeout for simulation
    setTimeout(() => {
      setLoadingTicketId(null)
      setPurchasedTickets((prev) => new Set([...prev, ticketId]))
      console.log(`Ticket purchased: ${ticketId}`)
    }, 1000)
  }

  const handleOpenPurchaseModal = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowPurchaseModal(true)
    setPaymentForm({ referenceNumber: "", phoneNumber: "" })
    setLoadingTicketId(null)

    // Simular reserva del cartón por 15 minutos
    console.log(`Cartón ${ticket.number} reservado por 15 minutos para compra`)

    // En una implementación real, aquí se haría una llamada a la API para reservar el cartón
  }

  const handleConfirmPurchase = () => {
    if (!selectedTicket || !paymentForm.referenceNumber || !paymentForm.phoneNumber) return

    setLoadingTicketId(selectedTicket.id)
    setTimeout(() => {
      setLoadingTicketId(null)
      setPurchasedTickets((prev) => new Set([...prev, selectedTicket.id]))
      setPurchasedTicketInfo({ ticket: selectedTicket, reference: paymentForm.referenceNumber })
      setShowPurchaseModal(false)
      setShowSuccessModal(true)
      setSelectedTicket(null)
      setPaymentForm({ referenceNumber: "", phoneNumber: "" })
      console.log(`Ticket purchased: ${selectedTicket.id}`, paymentForm)
    }, 1000)
  }

  // Convert to the format expected by the component
  const tickets: Ticket[] = mockBingoCards.map((card) => ({
    id: `ticket-${card.id}`,
    number: `#${card.id}`,
    price: card.price,
    isAvailable: card.status === "AVAILABLE",
    isPurchased: false,
    bingoNumbers: card.numbers, // Add the bingo numbers array
  }))

  const availableTicketsCount = tickets.filter((t) => t.isAvailable && !purchasedTickets.has(t.id)).length

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-yellow-400/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-medium">Cargando cartones...</p>
          <p className="text-gray-400 text-sm mt-1">Preparando la sala de bingo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/backoffice" className="text-yellow-400 hover:text-yellow-300 transition-colors">
          Dashboard
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-white">Comprar Tickets</span>
      </div>

      {/* Back Button */}
      <div>
        <Link
          href="/backoffice"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
      </div>

      {/* Event Header */}
      <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 animate-slideInUp">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{eventData.title}</h1>
            <p className="text-gray-300">{eventData.description}</p>
          </div>
          <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30 animate-pulse">
            🔴 En Vivo
          </span>
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Fecha</h3>
              <p className="text-gray-300">{eventData.dateText}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Horario</h3>
              <p className="text-gray-300">{eventData.timeText}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Premio</h3>
              <p className="text-yellow-400 font-semibold text-lg">${formatPrice(eventData.prize)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <CreditCard className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Disponibles</h3>
              <p className="text-gray-300">{availableTicketsCount} cartones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 animate-slideInUp animation-delay-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Cartones Disponibles</h2>
          <p className="text-gray-300">Selecciona y compra tus cartones para participar en el evento</p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tickets.map((ticket, index) => {
            const isPurchased = purchasedTickets.has(ticket.id)
            const isTicketAvailable = ticket.isAvailable && !isPurchased

            return (
              <div
                key={ticket.id}
                className={`bg-black/30 backdrop-blur-md rounded-xl border p-4 transition-all animate-fadeInScale ${
                  isTicketAvailable
                    ? "border-yellow-500/20 hover:border-yellow-400/50 hover:bg-black/40 hover:scale-105"
                    : "border-gray-500/20 bg-black/20"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Bingo Card Header */}
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-white mb-1">{ticket.number}</div>
                  <div className="text-sm font-semibold text-yellow-400">${formatPrice(ticket.price)}</div>
                </div>

                {/* Bingo Card Visual */}
                <div className="bg-white/10 rounded-lg p-3 mb-4 border border-white/20">
                  {/* BINGO Header */}
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {["B", "I", "N", "G", "O"].map((letter, i) => (
                      <div
                        key={i}
                        className="text-center text-xs font-bold text-yellow-400 py-1 relative group"
                        title={getBingoColumnRange(i)}
                      >
                        {letter}
                        <span className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {getBingoColumnRange(i)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bingo Numbers Grid */}
                  <div className="grid grid-cols-5 gap-1">
                    {ticket.bingoNumbers.map((number, i) => {
                      const isCenter = i === 12
                      const displayNumber = number === 0 ? "★" : number
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${
                            isCenter ? "bg-yellow-400/30 text-yellow-400" : "bg-white/20 text-white"
                          }`}
                        >
                          {displayNumber}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handleOpenPurchaseModal(ticket)}
                  disabled={!isTicketAvailable || loadingTicketId === ticket.id}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                    isPurchased
                      ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                      : !ticket.isAvailable
                        ? "bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                        : loadingTicketId === ticket.id
                          ? "bg-yellow-400/30 text-yellow-200 border border-yellow-400/30 cursor-wait"
                          : "bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30 hover:scale-105 font-bold"
                  }`}
                >
                  {isPurchased ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">✓</span>
                      Comprado
                    </div>
                  ) : !ticket.isAvailable ? (
                    "No disponible"
                  ) : loadingTicketId === ticket.id ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Comprando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">🎯</span>
                      Comprar Cartón
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg animate-slideInUp animation-delay-400">
          <div className="flex justify-between items-center text-center">
            <div>
              <p className="text-gray-300">Cartones disponibles</p>
              <p className="text-2xl font-bold text-white">{availableTicketsCount}</p>
            </div>
            {purchasedTickets.size > 0 && (
              <div>
                <p className="text-gray-300">Cartones comprados</p>
                <p className="text-2xl font-bold text-yellow-400">{purchasedTickets.size}</p>
              </div>
            )}
            {purchasedTickets.size > 0 && (
              <div>
                <p className="text-gray-300">Total invertido</p>
                <p className="text-2xl font-bold text-green-400">${formatPrice(purchasedTickets.size * 10000)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Purchase Modal */}
      {showPurchaseModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInScale">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Confirmar Compra</h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selected Ticket Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-3">Cartón Seleccionado</h3>

                <div className="bg-black/30 backdrop-blur-md rounded-xl border border-yellow-500/20 p-4">
                  <div className="text-center mb-3">
                    <div className="text-xl font-bold text-white mb-1">{selectedTicket.number}</div>
                    <div className="text-lg font-semibold text-yellow-400">${formatPrice(selectedTicket.price)}</div>
                  </div>

                  {/* Bingo Card Visual */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                    {/* BINGO Header */}
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      {["B", "I", "N", "G", "O"].map((letter, i) => (
                        <div key={i} className="text-center text-sm font-bold text-yellow-400 py-1">
                          {letter}
                        </div>
                      ))}
                    </div>

                    {/* Bingo Numbers Grid */}
                    <div className="grid grid-cols-5 gap-1">
                      {selectedTicket.bingoNumbers.map((number, i) => {
                        const isCenter = i === 12
                        const displayNumber = number === 0 ? "★" : number
                        return (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm font-medium rounded ${
                              isCenter ? "bg-yellow-400/30 text-yellow-400" : "bg-white/20 text-white"
                            }`}
                          >
                            {displayNumber}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Button - Modificado */}
                  <button
                    onClick={() => handleWhatsAppPurchase(selectedTicket, "Usuario")}
                    className="flex items-center justify-center w-full mt-4 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    Reservar por WhatsApp
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-3">Datos de Pago</h3>

                {/* Bank Transfer Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <h4 className="text-blue-400 font-semibold mb-3">📱 Datos para Transferencia</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">Banco:</span>
                        <span className="text-white font-medium ml-2">Banco de Venezuela</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("Banco de Venezuela", "Banco")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar banco"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">Tipo:</span>
                        <span className="text-white font-medium ml-2">Cuenta Corriente</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("Cuenta Corriente", "Tipo de cuenta")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar tipo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">Cuenta:</span>
                        <span className="text-white font-medium ml-2">0102-0000-1234567890</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("0102-0000-1234567890", "Número de cuenta")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar cuenta"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">Titular:</span>
                        <span className="text-white font-medium ml-2">BINGO APP C.A.</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("BINGO APP C.A.", "Titular")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar titular"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">RIF:</span>
                        <span className="text-white font-medium ml-2">J-12345678-9</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("J-12345678-9", "RIF")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar RIF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-gray-300">Teléfono:</span>
                        <span className="text-white font-medium ml-2">0424-1234567</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard("0424-1234567", "Teléfono")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Copiar teléfono"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Número de Referencia *</label>
                    <input
                      type="text"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                      placeholder="Ej: 123456789"
                      required
                      className="w-full bg-white/10 border border-yellow-400/30 text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Número de Teléfono *</label>
                    <input
                      type="tel"
                      value={paymentForm.phoneNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                      placeholder="Ej: 0424-1234567"
                      required
                      className="w-full bg-white/10 border border-yellow-400/30 text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border border-gray-500/30 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    disabled={!paymentForm.referenceNumber || !paymentForm.phoneNumber || loadingTicketId !== null}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                      !paymentForm.referenceNumber || !paymentForm.phoneNumber
                        ? "bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                        : loadingTicketId !== null
                          ? "bg-yellow-400/30 text-yellow-200 border border-yellow-400/30 cursor-wait"
                          : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black"
                    }`}
                  >
                    {loadingTicketId !== null ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Procesando...
                      </div>
                    ) : (
                      "Confirmar Compra"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && purchasedTicketInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md border border-green-500/20 rounded-2xl p-8 max-w-md w-full animate-fadeInScale">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {purchasedTicketInfo.reference.startsWith("WA-") ? "¡Reserva Exitosa!" : "¡Compra Exitosa!"}
              </h2>
              <p className="text-gray-300">
                {purchasedTicketInfo.reference.startsWith("WA-")
                  ? "Tu cartón ha sido reservado por 15 minutos"
                  : "Tu cartón ha sido reservado"}
              </p>
            </div>

            {/* Purchase Details */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Cartón:</span>
                  <span className="text-white font-medium">{purchasedTicketInfo.ticket.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Precio:</span>
                  <span className="text-green-400 font-medium">${formatPrice(purchasedTicketInfo.ticket.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Referencia:</span>
                  <span className="text-white font-medium">{purchasedTicketInfo.reference}</span>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
              <h4 className="text-yellow-400 font-semibold mb-2">⏱️ Verificación de Pago</h4>
              <p className="text-gray-300 text-sm">
                {purchasedTicketInfo.reference.startsWith("WA-") ? (
                  <>
                    Tu cartón está <strong className="text-white">reservado por 15 minutos</strong>. Completa el pago
                    por WhatsApp para confirmar tu compra. Si no se completa el pago, el cartón volverá a estar
                    disponible.
                  </>
                ) : (
                  <>
                    Verificaremos tu transacción en los próximos <strong className="text-white">15 minutos</strong>. Si
                    es correcta, el cartón aparecerá automáticamente en tu perfil.
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition-colors"
              >
                Continuar Comprando
              </button>
              <button
                onClick={() => (window.location.href = "/backoffice")}
                className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg font-medium transition-colors"
              >
                Ver Mi Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

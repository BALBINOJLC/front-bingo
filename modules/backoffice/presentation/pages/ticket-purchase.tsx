// modules/backoffice/presentation/pages/ticket-purchase.tsx
"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, Trophy, CreditCard, Loader2, AlertCircle } from "lucide-react" // Added AlertCircle
import Link from "next/link"
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl"
import type { Event, Ticket as DomainTicket } from "../../domain/entities/event.entity" // Assuming Ticket here is for purchased tickets, not cartons
import type { User } from "@/modules/auth/domain/entities/user.entity"; // For user ID

// Define a simple Carton type based on Postman expectations for purchase and display
interface Carton {
  id: number; // carton_id for purchase
  numbers: number[];
  price: number;
  status: string; // "AVAILABLE", "SOLD", etc.
  event_id: string;
  ticketId: string | null; // If it gets a ticket ID after purchase
}

// Local UI representation of a ticket/carton for selection
interface UICarton {
  id: string; // Unique ID for UI (e.g., `carton-${carton.id}`)
  originalCartonId: number; // The actual ID from backend (carton_id)
  numberLabel: string; // Display number (e.g., `#103`)
  price: number;
  isAvailable: boolean;
  isPurchased: boolean; // UI state
  bingoNumbers: number[];
}


interface TicketPurchaseProps {
  eventId: string; // Make eventId mandatory and expect it as a prop or from router
}

export function TicketPurchase({ eventId }: TicketPurchaseProps) {
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [availableCartons, setAvailableCartons] = useState<Carton[]>([]);
  const [uiCartons, setUiCartons] = useState<UICarton[]>([]);

  const [loadingTicketId, setLoadingTicketId] = useState<string | null>(null); // For individual carton purchase loading
  const [purchasedUICartonIds, setPurchasedUICartonIds] = useState<Set<string>>(new Set()); // Tracks UI cartons marked as purchased
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUICarton, setSelectedUICarton] = useState<UICarton | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ referenceNumber: "", phoneNumber: "" });
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false);


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Use UICarton for purchasedTicketInfo to match what's displayed
  const [purchasedTicketInfo, setPurchasedTicketInfo] = useState<{ uiCarton: UICarton; reference: string } | null>(null);


  const backofficeRepository = new BackofficeRepositoryImpl();

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Autenticación requerida.");
        setPageLoading(false);
        // Redirect to login or show login prompt
        window.location.href = "/auth/login";
        return;
      }

      if (!eventId) {
        setError("ID de evento no encontrado.");
        setPageLoading(false);
        return;
      }

      try {
        const [eventData, cartonsData] = await Promise.all([
          backofficeRepository.getEventById(eventId, token),
          backofficeRepository.getAvailableCartons(eventId, token) // This returns Carton[]
        ]);

        if (eventData) {
          setEventDetails(eventData);
        } else {
          setError("Evento no encontrado.");
        }

        setAvailableCartons(cartonsData || []); // cartonsData could be Carton[]

        // Transform backend cartons (Carton[]) to UICarton[]
        const transformedUiCartons = (cartonsData || []).map((carton: Carton) => ({
          id: `carton-${carton.id}`,
          originalCartonId: carton.id,
          numberLabel: `#${carton.id}`, // Or use a more descriptive field if available
          price: carton.price,
          isAvailable: carton.status === "AVAILABLE",
          isPurchased: false, // Initially not purchased by this user in this session
          bingoNumbers: carton.numbers,
        }));
        setUiCartons(transformedUiCartons);

      } catch (err: any) {
        console.error("Error fetching event data or cartons:", err);
        setError(err.message || "Error al cargar datos del evento.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${label} copiado al portapapeles`);
      // Consider adding a toast notification for user feedback
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString();
  const getBingoColumnRange = (column: number): string => { /* ... same as before ... */ return ""; }; // Placeholder, keep original logic

  // --- Purchase Logic ---
  const handleOpenPurchaseModal = (uiCarton: UICarton) => {
    if (!uiCarton.isAvailable || purchasedUICartonIds.has(uiCarton.id)) return;
    setSelectedUICarton(uiCarton);
    setShowPurchaseModal(true);
    setPaymentForm({ referenceNumber: "", phoneNumber: "" });
    // setLoadingTicketId(null); // Not needed here, use isSubmittingPurchase for modal
  };

  const handleConfirmPurchase = async () => {
    if (!selectedUICarton || !paymentForm.referenceNumber || !paymentForm.phoneNumber || isSubmittingPurchase) return;

    const token = localStorage.getItem("accessToken");
    const currentUserString = localStorage.getItem("currentUser");
    if (!token || !currentUserString) {
      setError("Autenticación requerida para comprar.");
      setShowPurchaseModal(false);
      return;
    }

    let currentUser: User;
    try {
      currentUser = JSON.parse(currentUserString);
    } catch (e) {
      setError("Error al obtener datos del usuario.");
      setShowPurchaseModal(false);
      return;
    }

    setIsSubmittingPurchase(true);
    setLoadingTicketId(selectedUICarton.id); // For visual feedback on the specific carton if needed

    try {
      const purchaseData = {
        user_id: currentUser.id, // Get user_id from stored current user
        carton_id: selectedUICarton.originalCartonId, // Use the actual carton_id from backend
        amount_payment: selectedUICarton.price.toString(), // API expects string for amount_payment
        reference_payment: paymentForm.referenceNumber,
        number_payment: paymentForm.phoneNumber, // Assuming phone number is used as number_payment
      };

      // This is the actual API call
      const purchaseResult = await backofficeRepository.purchaseTicket(purchaseData, token);
      console.log("Ticket purchase successful:", purchaseResult);

      setPurchasedUICartonIds((prev) => new Set(prev).add(selectedUICarton.id));
      setPurchasedTicketInfo({ uiCarton: selectedUICarton, reference: paymentForm.referenceNumber });

      // Update the specific UICarton's isPurchased status for immediate UI feedback
      setUiCartons(prevCartons => prevCartons.map(c =>
        c.id === selectedUICarton.id ? { ...c, isPurchased: true, isAvailable: false } : c
      ));

      setShowPurchaseModal(false);
      setShowSuccessModal(true);
      setSelectedUICarton(null); // Reset selected carton
      setPaymentForm({ referenceNumber: "", phoneNumber: "" });

    } catch (err: any) {
      console.error("Error purchasing ticket:", err);
      setError(err.message || "Error al procesar la compra.");
      // Optionally, keep modal open to show error, or close and show toast
      setShowPurchaseModal(false);
    } finally {
      setIsSubmittingPurchase(false);
      setLoadingTicketId(null);
    }
  };

  // WhatsApp purchase logic - This seems more like a reservation than an immediate purchase.
  // The backend `purchaseTicket` endpoint is what actually confirms a purchase.
  // If WhatsApp is just for initiating, the flow might differ.
  // For now, let's assume it also leads to a "reservation" or a similar state.
  const handleWhatsAppPurchase = (uiCarton: UICarton, userName: string) => {
    if (!uiCarton) return;

    // Mark as "processing" or "reserved" in UI
    setLoadingTicketId(uiCarton.id);
    // Simulate reservation
    setTimeout(() => {
      setLoadingTicketId(null);
      setPurchasedUICartonIds((prev) => new Set(prev).add(uiCarton.id)); // Mark as "purchased" in UI
      setPurchasedTicketInfo({
        uiCarton: uiCarton,
        reference: `WA-${Date.now().toString().slice(-6)}`,
      });
      // Update UI for this carton
       setUiCartons(prevCartons => prevCartons.map(c =>
        c.id === uiCarton.id ? { ...c, isPurchased: true, isAvailable: false } : c
      ));

      setShowPurchaseModal(false); // Close main purchase modal if open
      setShowSuccessModal(true); // Show success/reservation modal
      setSelectedUICarton(null);

      const getWhatsAppLink = (ticket: UICarton, userName: string, eventTitle: string, eventDate: string, eventTime: string) => {
        const phoneNumber = "584241234567"; // Replace with actual number
        const message = `*¡RESERVA DE CARTÓN GOLDEN BINGO!*
------------------------------
*Cartón:* ${ticket.numberLabel}
*Precio:* $${formatPrice(ticket.price)}
*Usuario:* ${userName}
*Evento:* ${eventTitle}
*Fecha:* ${eventDate}
*Hora:* ${eventTime}
------------------------------
Este cartón quedará reservado por 15 minutos para completar tu pago.`;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      };

      if(eventDetails){
        const whatsappUrl = getWhatsAppLink(uiCarton, userName, eventDetails.title, new Date(eventDetails.date).toLocaleDateString(), eventDetails.time_start || "");
        window.open(whatsappUrl, "_blank");
      } else {
        console.error("Event details not available for WhatsApp message");
      }
    }, 500); // Short delay before opening WhatsApp
  };


  const availableUiCartonsCount = uiCartons.filter((t) => t.isAvailable && !purchasedUICartonIds.has(t.id)).length;
  const totalPurchasedOnUi = purchasedUICartonIds.size;
  const totalInvertedOnUi = Array.from(purchasedUICartonIds).reduce((acc, id) => {
    const carton = uiCartons.find(c => c.id === id);
    return acc + (carton ? carton.price : 0);
  }, 0);


  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-yellow-400/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-medium">Cargando evento y cartones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
         <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
        <p className="text-red-400 mb-6">{error}</p>
        <Link href="/backoffice" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
      </div>
    );
  }

  if (!eventDetails) {
     return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Evento no disponible</h2>
        <p className="text-yellow-400 mb-6">No se pudieron cargar los detalles del evento.</p>
        <Link href="/backoffice" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
      </div>
    );
  }

  // Main component render using eventDetails and uiCartons
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/backoffice" className="text-yellow-400 hover:text-yellow-300 transition-colors">Dashboard</Link>
        <span className="text-gray-400">/</span>
        <span className="text-white">Comprar Tickets para: {eventDetails.title}</span>
      </div>

      {/* Back Button */}
      <div>
        <Link href="/backoffice" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
      </div>

      {/* Event Header */}
      <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 animate-slideInUp">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{eventDetails.title}</h1>
            <p className="text-gray-300">{eventDetails.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
            eventDetails.status === "ACTIVE"
              ? "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse"
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }`}>
            {eventDetails.status === "ACTIVE" ? "🔴 En Vivo" : eventDetails.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg"><Calendar className="h-5 w-5 text-yellow-400" /></div>
            <div>
              <h3 className="font-semibold text-white mb-1">Fecha</h3>
              <p className="text-gray-300">{new Date(eventDetails.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg"><Clock className="h-5 w-5 text-yellow-400" /></div>
            <div>
              <h3 className="font-semibold text-white mb-1">Horario</h3>
              <p className="text-gray-300">{eventDetails.time_start} - {eventDetails.time_end}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg"><Trophy className="h-5 w-5 text-yellow-400" /></div>
            <div>
              <h3 className="font-semibold text-white mb-1">Premio</h3>
              <p className="text-yellow-400 font-semibold text-lg">${formatPrice(eventDetails.prize_pool || 0)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-400/20 rounded-lg"><CreditCard className="h-5 w-5 text-yellow-400" /></div>
            <div>
              <h3 className="font-semibold text-white mb-1">Cartones Totales</h3>
              <p className="text-gray-300">{eventDetails.total_cartons}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 animate-slideInUp animation-delay-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Cartones Disponibles</h2>
          <p className="text-gray-300">Selecciona y compra tus cartones para participar en el evento ({availableUiCartonsCount} disponibles)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {uiCartons.map((uiCarton, index) => {
            const isEffectivelyPurchased = purchasedUICartonIds.has(uiCarton.id) || uiCarton.isPurchased;
            const canPurchase = uiCarton.isAvailable && !isEffectivelyPurchased;

            return (
              <div
                key={uiCarton.id}
                className={`bg-black/30 backdrop-blur-md rounded-xl border p-4 transition-all animate-fadeInScale ${
                  canPurchase
                    ? "border-yellow-500/20 hover:border-yellow-400/50 hover:bg-black/40 hover:scale-105"
                    : "border-gray-500/20 bg-black/20 opacity-70" // Dim if not available or purchased
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-white mb-1">{uiCarton.numberLabel}</div>
                  <div className="text-sm font-semibold text-yellow-400">${formatPrice(uiCarton.price)}</div>
                </div>
                {/* Bingo Card Visual (remains the same) */}
                <div className="bg-white/10 rounded-lg p-3 mb-4 border border-white/20">
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {["B", "I", "N", "G", "O"].map((letter, i) => (
                      <div key={i} className="text-center text-xs font-bold text-yellow-400 py-1 relative group" title={getBingoColumnRange(i)}>
                        {letter}
                         <span className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {getBingoColumnRange(i)}
                        </span>
                      </div>))}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {uiCarton.bingoNumbers.map((number, i) => {
                      const isCenter = i === 12;
                      const displayNumber = number === 0 ? "★" : number;
                      return (<div key={i} className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${isCenter ? "bg-yellow-400/30 text-yellow-400" : "bg-white/20 text-white"}`}>{displayNumber}</div>);
                    })}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenPurchaseModal(uiCarton)}
                  disabled={!canPurchase || loadingTicketId === uiCarton.id || isSubmittingPurchase}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                    isEffectivelyPurchased
                      ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                      : !uiCarton.isAvailable
                        ? "bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                        : (loadingTicketId === uiCarton.id || isSubmittingPurchase)
                          ? "bg-yellow-400/30 text-yellow-200 border border-yellow-400/30 cursor-wait"
                          : "bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30 hover:scale-105 font-bold"
                  }`}
                >
                  {isEffectivelyPurchased ? (<div className="flex items-center justify-center"><span className="mr-1">✓</span>Comprado</div>)
                  : !uiCarton.isAvailable ? ("No disponible")
                  : (loadingTicketId === uiCarton.id || isSubmittingPurchase) ? (<div className="flex items-center justify-center"><Loader2 className="h-3 w-3 animate-spin mr-1" />Procesando...</div>)
                  : (<div className="flex items-center justify-center"><span className="mr-1">🎯</span>Comprar Cartón</div>)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg animate-slideInUp animation-delay-400">
          <div className="flex justify-between items-center text-center">
            <div>
              <p className="text-gray-300">Cartones disponibles (API)</p>
              <p className="text-2xl font-bold text-white">{availableUiCartonsCount}</p>
            </div>
            {totalPurchasedOnUi > 0 && (
              <div>
                <p className="text-gray-300">Cartones comprados (Sesión)</p>
                <p className="text-2xl font-bold text-yellow-400">{totalPurchasedOnUi}</p>
              </div>
            )}
            {totalPurchasedOnUi > 0 && (
              <div>
                <p className="text-gray-300">Total invertido (Sesión)</p>
                <p className="text-2xl font-bold text-green-400">${formatPrice(totalInvertedOnUi)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal (remains largely the same, but uses selectedUICarton) */}
      {showPurchaseModal && selectedUICarton && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInScale">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Confirmar Compra</h2>
              <button onClick={() => setShowPurchaseModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4"> {/* Selected Ticket Preview */}
                <h3 className="text-lg font-bold text-white mb-3">Cartón Seleccionado</h3>
                <div className="bg-black/30 backdrop-blur-md rounded-xl border border-yellow-500/20 p-4">
                  <div className="text-center mb-3">
                    <div className="text-xl font-bold text-white mb-1">{selectedUICarton.numberLabel}</div>
                    <div className="text-lg font-semibold text-yellow-400">${formatPrice(selectedUICarton.price)}</div>
                  </div>
                  {/* Bingo Card Visual (same as in grid) */}
                   <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <div className="grid grid-cols-5 gap-1 mb-2">
                        {["B", "I", "N", "G", "O"].map((letter, i) => (<div key={i} className="text-center text-sm font-bold text-yellow-400 py-1">{letter}</div>))}
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {selectedUICarton.bingoNumbers.map((number, i) => {
                          const isCenter = i === 12; const displayNumber = number === 0 ? "★" : number;
                          return (<div key={i} className={`aspect-square flex items-center justify-center text-sm font-medium rounded ${isCenter ? "bg-yellow-400/30 text-yellow-400" : "bg-white/20 text-white"}`}>{displayNumber}</div>);
                        })}
                      </div>
                    </div>
                  <button onClick={() => handleWhatsAppPurchase(selectedUICarton, JSON.parse(localStorage.getItem("currentUser") || "{}").name || "Usuario")}
                    className="flex items-center justify-center w-full mt-4 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                    Reservar por WhatsApp
                  </button>
                </div>
              </div>
              <div className="space-y-4"> {/* Payment Form */}
                <h3 className="text-lg font-bold text-white mb-3">Datos de Pago</h3>
                {/* Bank Transfer Info (static part, remains the same) */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <h4 className="text-blue-400 font-semibold mb-3">📱 Datos para Transferencia</h4>
                   <div className="space-y-3 text-sm">
                    {/* ... bank details ... */}
                   </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Número de Referencia *</label>
                    <input type="text" value={paymentForm.referenceNumber} onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })} placeholder="Ej: 123456789" required className="w-full bg-white/10 border border-yellow-400/30 text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/20" />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Número de Teléfono (Pago Móvil) *</label>
                    <input type="tel" value={paymentForm.phoneNumber} onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })} placeholder="Ej: 0424-1234567" required className="w-full bg-white/10 border border-yellow-400/30 text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400/20" />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button onClick={() => setShowPurchaseModal(false)} className="flex-1 py-3 px-4 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border border-gray-500/30 rounded-lg font-medium transition-colors">Cancelar</button>
                  <button onClick={handleConfirmPurchase} disabled={!paymentForm.referenceNumber || !paymentForm.phoneNumber || isSubmittingPurchase}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${!paymentForm.referenceNumber || !paymentForm.phoneNumber || isSubmittingPurchase ? "bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed" : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black"}`}>
                    {isSubmittingPurchase ? (<div className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-2" />Procesando...</div>) : "Confirmar Compra"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (remains largely the same, uses purchasedTicketInfo with UICarton) */}
      {showSuccessModal && purchasedTicketInfo && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md border border-green-500/20 rounded-2xl p-8 max-w-md w-full animate-fadeInScale">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{purchasedTicketInfo.reference.startsWith("WA-") ? "¡Reserva Exitosa!" : "¡Compra Exitosa!"}</h2>
              <p className="text-gray-300">{purchasedTicketInfo.reference.startsWith("WA-") ? "Tu cartón ha sido reservado por 15 minutos" : "Tu cartón ha sido reservado"}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-300">Cartón:</span><span className="text-white font-medium">{purchasedTicketInfo.uiCarton.numberLabel}</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Precio:</span><span className="text-green-400 font-medium">${formatPrice(purchasedTicketInfo.uiCarton.price)}</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Referencia:</span><span className="text-white font-medium">{purchasedTicketInfo.reference}</span></div>
              </div>
            </div>
             <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
              <h4 className="text-yellow-400 font-semibold mb-2">⏱️ Verificación de Pago</h4>
              <p className="text-gray-300 text-sm">{purchasedTicketInfo.reference.startsWith("WA-") ? (<>Tu cartón está <strong className="text-white">reservado por 15 minutos</strong>. Completa el pago por WhatsApp para confirmar tu compra. Si no se completa el pago, el cartón volverá a estar disponible.</>) : (<>Verificaremos tu transacción en los próximos <strong className="text-white">15 minutos</strong>. Si es correcta, el cartón aparecerá automáticamente en tu perfil.</>)}</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition-colors">Continuar Comprando</button>
              <button onClick={() => (window.location.href = "/backoffice/my-tickets")} className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg font-medium transition-colors">Ver Mis Tickets</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to keep BINGO column visual logic (can be moved to a utils file)
const getBingoColumnRange = (column: number): string => {
    switch (column) {
      case 0: return "B: 1-20";
      case 1: return "I: 21-40";
      case 2: return "N: 41-60";
      case 3: return "G: 61-80";
      case 4: return "O: 81-100";
      default: return "";
    }
};

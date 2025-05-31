// modules/backoffice/presentation/pages/user-dashboard.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "../components/event-card"; // Assuming this component exists and takes an Event prop
import { BackofficeRepositoryImpl } from "../../infrastructure/repositories/backoffice.repository.impl";
import type { Event } from "../../domain/entities/event.entity";
import { AlertCircle, Loader2 } from "lucide-react"; // For error/loading display
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Other components used by UserDashboard (StatCard, ActivityFeed) are not modified here
// but would also need to fetch their data similarly if they are dynamic.

export function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  // Other states for dashboard elements (stats, activity) would also be needed
  // For brevity, focusing on events list here.

  const backofficeRepository = new BackofficeRepositoryImpl();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      setErrorEvents(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setErrorEvents("Autenticación requerida para ver eventos.");
        setIsLoadingEvents(false);
        // Optional: redirect to login
        // window.location.href = "/auth/login";
        return;
      }

      try {
        const fetchedEvents = await backofficeRepository.getAvailableEvents(token);
        setEvents(fetchedEvents || []);
      } catch (err: any) {
        console.error("Error fetching available events:", err);
        setErrorEvents(err.message || "No se pudieron cargar los eventos.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
    // Fetch other dashboard data here (stats, activity) in parallel or sequentially
  }, []); // Runs once on mount

  return (
    <div className="space-y-8">
      {/* Placeholder for other dashboard sections like Stats, Recent Activity */}
      {/* These would also need to be updated to fetch real data */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Eventos de Bingo Disponibles</h2>
        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-black/20 p-4 rounded-lg border border-yellow-500/20">
                <Skeleton className="h-40 w-full bg-gray-700/30 mb-4" /> {/* Image placeholder */}
                <Skeleton className="h-6 w-3/4 bg-gray-700/30 mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-1/2 bg-gray-700/30 mb-1" /> {/* Date */}
                <Skeleton className="h-4 w-1/3 bg-gray-700/30 mb-3" /> {/* Price */}
                <Skeleton className="h-10 w-full bg-yellow-400/20" /> {/* Button */}
              </div>
            ))}
          </div>
        ) : errorEvents ? (
          <div className="text-center py-10 bg-black/20 rounded-lg border border-red-500/30">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-400">{errorEvents}</p>
            {errorEvents.includes("Autenticación requerida") && (
                <Button asChild className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black">
                    <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
            )}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event}>
                {/* Add a "Purchase Tickets" button to EventCard or handle link here */}
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold">
                  <Link href={`/backoffice/ticket-purchase/${event.id}`}>
                    Comprar Cartones
                  </Link>
                </Button>
              </EventCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-black/20 rounded-lg border border-yellow-500/20">
            <p className="text-gray-300 text-lg">No hay eventos de bingo disponibles en este momento.</p>
            <p className="text-gray-400 mt-2">Por favor, revisa más tarde.</p>
          </div>
        )}
      </section>

      {/* Placeholder for User Stats / My Activity sections */}
      {/* <section>
        <h2 className="text-2xl font-bold text-white mb-6">Mis Estadísticas</h2>
        // UserStatsComponent would fetch from backofficeRepository.getUserStats()
      </section> */}
    </div>
  );
}

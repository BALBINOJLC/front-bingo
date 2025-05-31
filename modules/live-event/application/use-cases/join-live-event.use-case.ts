import type { LiveEventRepository } from "../../domain/repositories/live-event.repository"

export class JoinLiveEventUseCase {
  constructor(private liveEventRepository: LiveEventRepository) {}

  async execute(eventId: string, userId: string) {
    // Validate event exists and is active
    const event = await this.liveEventRepository.getEventById(eventId)

    if (!event) {
      throw new Error("Evento no encontrado")
    }

    if (event.status !== "ACTIVE") {
      throw new Error("El evento no está activo")
    }

    // Join the event
    await this.liveEventRepository.joinEvent(eventId, userId)

    return event
  }
}

import type { LiveEvent, GameState } from "../entities/live-event.entity"

export interface LiveEventRepository {
  getEventById(eventId: string): Promise<LiveEvent | null>
  joinEvent(eventId: string, userId: string): Promise<void>
  leaveEvent(eventId: string, userId: string): Promise<void>
  getGameState(eventId: string): Promise<GameState>
  markNumber(eventId: string, cartonId: number, number: number, userId: string): Promise<void>
  claimWin(eventId: string, cartonId: number, winType: string, userId: string): Promise<boolean>
  subscribeToGameUpdates(eventId: string, callback: (gameState: GameState) => void): () => void
}

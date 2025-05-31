import type { LiveEventRepository } from "../../domain/repositories/live-event.repository"
import type { LiveEvent, GameState, BingoCall, Dealer, Participant } from "../../domain/entities/live-event.entity"

export class LiveEventRepositoryImpl implements LiveEventRepository {
  private gameStateCallbacks: Map<string, ((gameState: GameState) => void)[]> = new Map()
  private gameStateInterval: NodeJS.Timeout | null = null
  private gameHistory: Map<string, BingoCall[]> = new Map() // Persistent game history
  private markedNumbers: Map<string, Map<number, Set<number>>> = new Map() // eventId -> cartonId -> markedNumbers

  async getEventById(eventId: string): Promise<LiveEvent | null> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock dealer
    const dealer: Dealer = {
      id: "dealer-1",
      name: "María González",
      avatar: "/placeholder.svg?height=80&width=80",
      isOnline: true,
      currentEventId: eventId,
    }

    // Mock participants
    const participants: Participant[] = [
      {
        id: "user-1",
        name: "Juan Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
        cartons: [],
        isOnline: true,
        joinedAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: "user-2",
        name: "Ana López",
        avatar: "/placeholder.svg?height=40&width=40",
        cartons: [],
        isOnline: true,
        joinedAt: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        id: "user-3",
        name: "Carlos Ruiz",
        avatar: "/placeholder.svg?height=40&width=40",
        cartons: [],
        isOnline: true,
        joinedAt: new Date(Date.now() - 3 * 60 * 1000),
      },
    ]

    // Generate proper bingo cartons
    const generateBingoCarton = (cartonId: number): number[] => {
      const carton: number[] = new Array(25)

      // B column: 1-15
      const bNumbers = Array.from({ length: 15 }, (_, i) => i + 1)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)

      // I column: 16-30
      const iNumbers = Array.from({ length: 15 }, (_, i) => i + 16)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)

      // N column: 31-45
      const nNumbers = Array.from({ length: 15 }, (_, i) => i + 31)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)

      // G column: 46-60
      const gNumbers = Array.from({ length: 15 }, (_, i) => i + 46)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)

      // O column: 61-75
      const oNumbers = Array.from({ length: 15 }, (_, i) => i + 61)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)

      // Fill by columns
      for (let row = 0; row < 5; row++) {
        carton[row * 5 + 0] = bNumbers[row] // B
        carton[row * 5 + 1] = iNumbers[row] // I
        carton[row * 5 + 2] = row === 2 ? 0 : nNumbers[row > 2 ? row - 1 : row] // N
        carton[row * 5 + 3] = gNumbers[row] // G
        carton[row * 5 + 4] = oNumbers[row] // O
      }

      return carton
    }

    const mockEvent: LiveEvent = {
      id: eventId,
      name: "Bingo Express",
      description: "Partidas rápidas cada 30 minutos",
      startDate: "2024-12-19",
      endDate: "2024-12-19",
      timeStart: "18:00",
      timeEnd: "22:00",
      status: "ACTIVE",
      prizePool: 500000,
      commission: 10,
      numbers: [],
      createdAt: "2025-05-31T03:16:12.825Z",
      updatedAt: "2025-05-31T03:16:12.825Z",
      cartons: [
        {
          id: 201,
          status: "PLAYING",
          eventId: eventId,
          numbers: generateBingoCarton(201),
          ticketId: "ticket-user-1",
          userId: "user-1",
          markedNumbers: [],
          isWinner: false,
        },
        {
          id: 202,
          status: "PLAYING",
          eventId: eventId,
          numbers: generateBingoCarton(202),
          ticketId: "ticket-user-1-2",
          userId: "user-1",
          markedNumbers: [],
          isWinner: false,
        },
        {
          id: 203,
          status: "PLAYING",
          eventId: eventId,
          numbers: generateBingoCarton(203),
          ticketId: "ticket-user-2",
          userId: "user-2",
          markedNumbers: [],
          isWinner: false,
        },
      ],
      currentNumber: 0,
      nextNumber: 0,
      dealer,
      participants,
    }

    // Initialize marked numbers for this event
    if (!this.markedNumbers.has(eventId)) {
      this.markedNumbers.set(eventId, new Map())
    }

    return mockEvent
  }

  async joinEvent(eventId: string, userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`User ${userId} joined event ${eventId}`)
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    console.log(`User ${userId} left event ${eventId}`)
  }

  async getGameState(eventId: string): Promise<GameState> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Initialize game history if not exists
    if (!this.gameHistory.has(eventId)) {
      const initialHistory: BingoCall[] = [
        { number: 7, letter: "B", timestamp: new Date(Date.now() - 5 * 60 * 1000), callOrder: 1 },
        { number: 14, letter: "B", timestamp: new Date(Date.now() - 4.5 * 60 * 1000), callOrder: 2 },
        { number: 28, letter: "I", timestamp: new Date(Date.now() - 4 * 60 * 1000), callOrder: 3 },
      ]
      this.gameHistory.set(eventId, initialHistory)
    }

    const calledNumbers = this.gameHistory.get(eventId) || []
    const currentCall = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : undefined

    return {
      isActive: true,
      currentCall,
      calledNumbers,
      winners: [],
      timeToNextCall: 15,
    }
  }

  async markNumber(eventId: string, cartonId: number, number: number, userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Get or create marked numbers for this event
    if (!this.markedNumbers.has(eventId)) {
      this.markedNumbers.set(eventId, new Map())
    }

    const eventMarkedNumbers = this.markedNumbers.get(eventId)!

    // Get or create marked numbers for this carton
    if (!eventMarkedNumbers.has(cartonId)) {
      eventMarkedNumbers.set(cartonId, new Set())
    }

    const cartonMarkedNumbers = eventMarkedNumbers.get(cartonId)!
    cartonMarkedNumbers.add(number)

    console.log(`User ${userId} marked number ${number} on carton ${cartonId} in event ${eventId}`)
    console.log(`Carton ${cartonId} marked numbers:`, Array.from(cartonMarkedNumbers))
  }

  async claimWin(eventId: string, cartonId: number, winType: string, userId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`User ${userId} claimed ${winType} win with carton ${cartonId} in event ${eventId}`)
    return Math.random() > 0.3 // 70% chance of valid win
  }

  subscribeToGameUpdates(eventId: string, callback: (gameState: GameState) => void): () => void {
    if (!this.gameStateCallbacks.has(eventId)) {
      this.gameStateCallbacks.set(eventId, [])
    }

    this.gameStateCallbacks.get(eventId)!.push(callback)

    // Start simulation if not already running
    if (!this.gameStateInterval) {
      this.startGameSimulation(eventId)
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.gameStateCallbacks.get(eventId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private startGameSimulation(eventId: string) {
    // Numbers to be called in sequence
    const numbersToCall = [
      45, 62, 18, 29, 44, 58, 73, 88, 2, 17, 31, 46, 60, 75, 89, 4, 19, 35, 51, 66, 82, 97, 8, 23, 37, 52, 67, 81, 96,
      11, 26, 40, 55, 70, 84, 99, 5, 20, 34, 49, 64, 78, 93, 1, 16, 32, 47, 61, 76, 90, 6, 21, 36, 50, 65, 79, 94, 9,
      24, 38, 53, 68, 83, 98,
    ]

    let numberIndex = 0

    this.gameStateInterval = setInterval(async () => {
      if (numberIndex >= numbersToCall.length) {
        numberIndex = 0 // Reset for demo
      }

      const currentNumber = numbersToCall[numberIndex]
      const letter = this.getLetterForNumber(currentNumber)

      // Get existing history or create new one
      const existingHistory = this.gameHistory.get(eventId) || []
      const callOrder = existingHistory.length + 1

      // Add new call to history
      const newCall: BingoCall = {
        number: currentNumber,
        letter,
        timestamp: new Date(),
        callOrder,
      }

      existingHistory.push(newCall)
      this.gameHistory.set(eventId, existingHistory)

      const gameState: GameState = {
        isActive: true,
        currentCall: newCall,
        calledNumbers: existingHistory, // Send complete history
        winners: [],
        timeToNextCall: 15,
      }

      // Notify all subscribers
      const callbacks = this.gameStateCallbacks.get(eventId)
      if (callbacks) {
        callbacks.forEach((callback) => callback(gameState))
      }

      numberIndex++
      console.log(`Called number: ${letter}${currentNumber}, Total called: ${existingHistory.length}`)
    }, 15000) // New number every 15 seconds
  }

  private getLetterForNumber(number: number): "B" | "I" | "N" | "G" | "O" {
    if (number >= 1 && number <= 15) return "B"
    if (number >= 16 && number <= 30) return "I"
    if (number >= 31 && number <= 45) return "N"
    if (number >= 46 && number <= 60) return "G"
    if (number >= 61 && number <= 75) return "O"
    return "B" // fallback
  }

  // Method to get marked numbers for a carton
  getMarkedNumbers(eventId: string, cartonId: number): number[] {
    const eventMarkedNumbers = this.markedNumbers.get(eventId)
    if (!eventMarkedNumbers) return []

    const cartonMarkedNumbers = eventMarkedNumbers.get(cartonId)
    if (!cartonMarkedNumbers) return []

    return Array.from(cartonMarkedNumbers)
  }
}

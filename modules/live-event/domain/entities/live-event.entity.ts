export interface LiveEvent {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  timeStart: string
  timeEnd: string
  status: "ACTIVE" | "WAITING" | "FINISHED" | "CANCELLED"
  prizePool: number
  commission: number
  numbers: number[] // Números ya cantados
  createdAt: string
  updatedAt: string
  cartons: LiveCarton[]
  currentNumber?: number // Número actual siendo cantado
  dealer?: Dealer
  participants: Participant[]
}

export interface LiveCarton {
  id: number
  status: "AVAILABLE" | "SOLD" | "PLAYING"
  eventId: string
  numbers: number[] // 25 números del cartón (5x5 con centro libre)
  ticketId?: string
  userId?: string
  markedNumbers: number[] // Números marcados por el usuario
  isWinner?: boolean
  winType?: "LINE" | "FULL_HOUSE" | "FOUR_CORNERS"
}

export interface Dealer {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  currentEventId?: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  cartons: LiveCarton[]
  isOnline: boolean
  joinedAt: Date
}

export interface BingoCall {
  number: number
  letter: "B" | "I" | "N" | "G" | "O"
  timestamp: Date
  callOrder: number
}

export interface GameState {
  isActive: boolean
  currentCall?: BingoCall
  calledNumbers: BingoCall[]
  winners: {
    userId: string
    cartonId: number
    winType: "LINE" | "FULL_HOUSE" | "FOUR_CORNERS"
    timestamp: Date
  }[]
  timeToNextCall: number // segundos (always 15)
}

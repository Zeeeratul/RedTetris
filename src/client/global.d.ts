declare global {

    // Piece
    type StructureCell = '' | '#'
    type StructureType = StructureCell[][]
    type PieceType = '' | '*' | 'I' | 'J' | 'L' | 'T' | 'O' | 'S' | 'Z'
    type Grid = PieceType[][]

    interface Position {
        x: number,
        y: number
    }

    interface Piece {
        structure: StructureType,
        type: PieceType,
        leftTopPosition: Position,
        positions: Position[]
    }

    // Game Playing (grid)
    interface GamePlaying {
        isKo: boolean,
        grid: Grid,
        piece: Piece | null,
        nextPiece: Piece | null,
    }

    // Player
    type PlayerStatus = 'playing' | 'KO'

    interface Player {
        currentPieceIndex: number,
        id: string
        position: number
        score: number
        spectrum: number[]
        status: PlayerStatus
        username: string
    }

    // Game Parameters
    type GameStatus = 'idle' | 'started'
    type GameSpeed = 0.5 | 1 | 1.5 | 2
    type GameMode = 'classic' | 'invisible' | 'marathon'
    type GameMaxPlayers = 1 | 2 | 3 | 4 | 5

    interface Game {
        leaderId: string,
        maxPlayers: GameMaxPlayers,
        status: GameStatus,
        speed: GameSpeed
        mode: GameMode,
        name: string,
        players: Player[]
    }

    interface Result {
        id: string
        username: string
        position: number
        score: number
    }

    // Chat
    interface Message {
        sender: {
            username: string,
            id: string
        },
        content: string,
        id: string
    }

    // Socket
    interface CallbackFunction {
        (error: SocketError, data?: any): void
    }

    type SocketError = string | null
}

export {}
/// <reference types="node" />

declare global {

    type StructureCell = '' | '#'
    type StructureType = StructureCell[][]
    type PieceType = '' | '*' | 'I' | 'J' | 'L' | 'T' | 'O' | 'S' | 'Z'

    type GameStatus = 'idle' | 'started'
    type GameSpeed = 0.5 | 1 | 1.5 | 2
    type GameMode = 'classic' | 'invisible' | 'marathon'
    type GameMaxPlayers = 1 | 2 | 3 | 4 | 5

    type PlayerStatus = 'playing' | 'KO'

    type SpectrumArray = number[]

    type SocketError = string | null
    
    interface Position {
        x: number,
        y: number
    }

    interface User {
        id: string
        username: string
        game_name?: string
    }
    
    interface GameParameters {
        name: string,
        maxPlayers?: GameMaxPlayers,
        mode?: GameMode,
        speed?: GameSpeed,
        isSolo?: boolean
    }

    interface CallbackFunction {
        (error: SocketError, data?: any): void
    }
}
// "ts-node": {
//     "files": true
//   },
//   "files": [
//     "src/server/global.d.ts"
//   ],
//   "include": ["src/server/**/*"],
//   "exclude": ["node_modules", "src/client/**/*"]

export {}
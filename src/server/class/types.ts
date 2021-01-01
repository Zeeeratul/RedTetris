export interface User {
    id: string
    username: string
    game_name?: string
}

export interface GameParameters {
    name: string,
    maxPlayers?: number,
    mode?: string,
    speed?: number
}

export interface Coords {
    x: number;
    y: number;
}

export type gameStatusType = 'idle' | 'started' | 'ended';

export type gameModeType = 'classic' | 'invisible';

export interface CallbackFunction {
    (error: string | null, data?: any): void
}
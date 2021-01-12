export interface User {
    id: string
    username: string
    game_name?: string
}

export interface GameParameters {
    name: string,
    maxPlayers?: number,
    mode?: string,
    speed?: number,
    isSolo?: boolean
}

export interface Coords {
    x: number;
    y: number;
}

export type gameStatusType = 'idle' | 'started' | 'ended';
export type gameSpeedType = 0.5 | 1 | 1.5 | 2;
export type gameModeType = 'classic' | 'invisible' | 'marathon';

export interface CallbackFunction {
    (error: string | null, data?: any): void
}
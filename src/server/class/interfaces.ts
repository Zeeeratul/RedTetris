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
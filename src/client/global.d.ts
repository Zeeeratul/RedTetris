declare global {
    interface Player {
        currentPieceIndex: number,
        id: string
        position: number
        score: number
        spectrum: number[]
        status: string
        username: string
    }

    interface ResultInterface {
        id: string
        username: string
        position: number
        score: number
    }
}

export {}
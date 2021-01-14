declare global {
    interface PlayerInterface {
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

    interface positionInterface {
        x: number,
        y: number
    }
    
    type structureInterface = string[][]
    
    interface pieceInterface {
        leftTopPosition: positionInterface,
        type: string,
        positions: positionInterface[],
        structure: structureInterface
    }
}

export {}
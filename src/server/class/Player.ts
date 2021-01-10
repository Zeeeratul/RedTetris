class Player {
    username: string;
    id: string;
    currentPieceIndex: number = 0;
    score: number = 0;
    position: number = 1;
    status: string = 'playing';
    spectrum: number[] = []

    constructor(username: string, id: string) { 
        this.username = username
        this.id = id
    }

    incrementCurrentPieceIndex() {
        this.currentPieceIndex = this.currentPieceIndex + 1
    }

    setStatus(status: string) {
        this.status = status
    }

    reset() {
        this.spectrum = []
        this.score = 0
        this.position = 1
        this.status = 'playing'
        this.currentPieceIndex = 0
    }
}

export { Player }
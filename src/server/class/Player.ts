class Player {
    username: string;
    id: string;
    currentPieceIndex: number = 0;
    score: number = 0;
    status: string = 'playing';
    spectrum: number[] = []

    constructor(username: string, id: string) { 
        this.username = username
        this.id = id
    }

    incrementCurrentPieceIndex() {
        this.currentPieceIndex = this.currentPieceIndex + 1
    }

    incrementScore() {
        this.score = this.score + 10
    }

    setStatus(status: string) {
        this.status = status
    }

    setSpectrum(spectrum: number[]) {
        this.spectrum = spectrum
    }

    reset() {
        this.spectrum = []
        this.score = 0
        this.status = 'playing'
        this.currentPieceIndex = 0
    }
}

export { Player }
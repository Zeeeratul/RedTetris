class Player {
    username: string;
    id: string;
    currentPieceIndex: number = 0;
    score: number = 0;
    status: string = 'playing';

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
}

export default Player
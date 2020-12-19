class Player {
    username: string;
    id: string;
    currentPieceIndex: number = 0;
    score: number = 0;

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
}

export default Player

interface PlayerInterface {
    id: string,
    username: string,
    currentPieceIndex: number,
    incrementCurrentPieceIndex(): void;
}

class Player {
    username: string;
    id: string;
    currentPieceIndex: number;

    constructor(playerData: { username: string, id: string }) {
        this.username = playerData.username
        this.id = playerData.id
        this.currentPieceIndex = 0
    }

    incrementCurrentPieceIndex(): void{
        this.currentPieceIndex = this.currentPieceIndex + 1
    }
}

export { Player, PlayerInterface }

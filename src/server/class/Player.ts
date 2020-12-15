class Player {
    currentPieceIndex: number = 0;

    constructor(public username: string, public id: string) { }

    incrementCurrentPieceIndex(): void{
        this.currentPieceIndex = this.currentPieceIndex + 1
    }
}

export { Player }

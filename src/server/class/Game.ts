import _ from 'lodash'
import { Player, PlayerInterface } from './Player'
import { Piece, PieceInterface } from './Piece'

interface GameInterface {
    name: string,
    status: 'idle' | 'started' | 'terminated',
    maxPlayers: number,
    players: PlayerInterface[],
    leaderId: string,
    pieces: PieceInterface[],
    gameInfo(): {}
}

class Game {
    name: string;
    status: 'idle' | 'started' | 'terminated';
    maxPlayers: number;
    players: PlayerInterface[];
    leaderId: string;
    pieces: PieceInterface[]

    constructor(name: string, leader: PlayerInterface) {
        this.name = name
        this.status = 'idle'
        this.maxPlayers = 2
        this.players = [new Player(leader)]
        this.leaderId = leader.id
        this.pieces = this.generatePieces()
    }

    addPlayer(playerData: { username: string, id: string }) {
        const player = new Player(playerData)
        this.players.push(player)
    }

    changeStatus(status: 'idle' | 'started' | 'terminated') {
        this.status = status
    }

    isLeader(playerId: string) {
        return this.leaderId === playerId
    }

    removePlayer(playerId: string) {
        const index = _.findIndex(this.players, { id: playerId })
        this.players.splice(index, 1)

        // if the leader leave give leader to another
        if (playerId === this.leaderId) {
            this.leaderId = this.players[0].id
        }
    }
    
    getPlayer(playerId: string): PlayerInterface | null {
        const player = _.find(this.players, { id: playerId }) || null
        return player
    }

    // pieces handling
    generatePieces() {
        const pieces = []
        for (let i = 0; i < 100; i++) {
            const piece = new Piece()
            pieces.push(piece)
        }
        return pieces
    }

    givePiece(playerId: string) {
        const player = this.getPlayer(playerId)
        if (player) {
            const currentPieceIndex = player.currentPieceIndex
            player.incrementCurrentPieceIndex()
            return this.pieces[currentPieceIndex]
        }
    }

    gameInfo() {
        return {
            name: this.name,
            players: this.players.length
        }
    }

}

export { GameInterface, Game }
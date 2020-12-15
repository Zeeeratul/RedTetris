import _ from 'lodash'
import { Player } from './Player'
import { Piece } from './Piece'

type gameStatusType = 'idle' | 'started' | 'terminated';

class Game {
    status: gameStatusType = 'idle';
    leaderId: string;
    maxPlayers: number;
    players: Player[];
    pieces: Piece[]

    constructor(public name: string, player: Player) {
        this.maxPlayers = 2
        this.players = [player]
        this.leaderId = player.id
        this.pieces = Piece.generatingPiecesPool()
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayer(playerId: string) {
        const index = _.findIndex(this.players, { id: playerId })
        this.players.splice(index, 1)
    }

    transferOwnership() {
        this.leaderId = this.players[0].id
    }

    changeStatus(status: gameStatusType) {
        this.status = status
    }

    isLeader(playerId: string) {
        return this.leaderId === playerId
    }
    
    getPlayer(playerId: string): Player | null {
        const player = _.find(this.players, { id: playerId }) || null
        return player
    }

    givePiece(playerId: string) {
        const player = this.getPlayer(playerId)
        if (player) {
            const currentPieceIndex = player.currentPieceIndex
            player.incrementCurrentPieceIndex()
            return this.pieces[currentPieceIndex]
        }
        else 
            return null
    }

    gameInfo() {
        return {
            name: this.name,
            players: this.players.length
        }
    }

}


export { Game }
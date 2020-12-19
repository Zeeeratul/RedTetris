import _ from 'lodash'
import Player from './Player'
import Piece from './Piece'
import { GameParameters } from './interfaces'

type gameStatusType = 'idle' | 'started' | 'terminated';
type gameModeType = 'classic' | 'invisible';

class Game {
    players: Player[];
    pieces: Piece[];
    leaderId: string;
    name: string;
    status: gameStatusType = 'idle';
    mode: gameModeType = 'classic';
    maxPlayers: number = 2;
    speed: number = 1;

    constructor(gameParameters: GameParameters, player: Player) {
        this.name = gameParameters.name
        this.players = [player]
        this.leaderId = player.id
        this.pieces = Piece.generatingPiecesPool()
        Object.assign(this, gameParameters)
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayer(playerId: string) {
        const index = _.findIndex(this.players, { id: playerId })
        this.players.splice(index, 1)
    }

    transferLeadership() {
        this.leaderId = this.players[0].id
    }

    changeStatus(status: gameStatusType) {
        this.status = status
    }

    changeGameParameters(gameParameters: GameParameters) {
        Object.assign(this, gameParameters)
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

    gameInfo(playerId?: string) {
        if (playerId) {
            return {
                name: this.name,
                players: this.players.map((player) => ({
                    username: player.username,
                    score: player.score,
                    yourself: playerId === player.id
                })),
                maxPlayers: this.maxPlayers,
                mode: this.mode,
                speed: this.speed,
                isLeader: this.isLeader(playerId)
            }
        }
        else {
            return {
                name: this.name,
                players: this.players.map((player) => ({
                    username: player.username,
                    score: player.score
                })),
                maxPlayers: this.maxPlayers,
                mode: this.mode,
                speed: this.speed,
            }
        }
    }
}


export default Game
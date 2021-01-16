import _ from 'lodash'
import { Player } from './Player'
import { Piece } from './Piece'
import { SOCKET } from '../config/constants.json'

class Game {
    players: Player[];
    pieces: Piece[];
    leaderId: string;
    name: string;
    status: GameStatus = 'idle';
    mode: GameMode = 'classic';
    maxPlayers: GameMaxPlayers = 2;
    speed: GameSpeed = 1.5;

    constructor(gameParameters: GameParameters, player: Player) {
        this.name = gameParameters.name
        this.players = [player]
        this.leaderId = player.id
        this.pieces = Piece.generatingPiecesPool()
        Object.assign(this, this.checkGameParameters(gameParameters))
    }

    checkGameParameters(gameParameters: GameParameters) {
        if (!gameParameters.mode || ['classic', 'invisible', 'marathon'].indexOf(gameParameters.mode) === -1)
            gameParameters.mode = 'classic'
        if (!gameParameters.speed || [0.5, 1, 1.5, 2].indexOf(gameParameters.speed) === -1) 
            gameParameters.speed = 1.5
        if (!gameParameters.maxPlayers || [1, 2, 3, 4, 5].indexOf(gameParameters.maxPlayers) === -1)
            gameParameters.maxPlayers = 2
        return gameParameters
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayer(playerId: string) {
        const index = _.findIndex(this.players, { id: playerId })
        if (index !== -1)
            this.players.splice(index, 1)
    }

    transferLeadership() {
        this.leaderId = this.players[0].id
    }

    isLeader(playerId: string) {
        return this.leaderId === playerId
    }

    getPlayer(playerId: string) {
        const player = _.find(this.players, { id: playerId }) || null
        return player
    }

    givePiece(playerId: string) {
        const player = this.getPlayer(playerId)
        if (!player) 
            throw SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND
        if (player.status === 'KO')
            throw SOCKET.GAMES.ERROR.PLAYER_KO

        const currentPieceIndex = player.currentPieceIndex
        player.incrementCurrentPieceIndex()
        // Generate new pieces if the player is close the end of the pieces heap
        if (player.currentPieceIndex + 1 > this.pieces.length)
            this.pieces = _.concat(this.pieces, Piece.generatingPiecesPool())
        return this.pieces[currentPieceIndex]
    }

    updateScore(lineCleared: number, playerId: string) {
        const player = this.getPlayer(playerId)
        if (!player)
            throw SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND
        if (player.status === 'KO')
            throw SOCKET.GAMES.ERROR.PLAYER_KO

        player.score = player.score + (lineCleared * 10)
    }

    updateSpectrum(spectrumArray: number[], playerId: string) {
        const player = this.getPlayer(playerId)
        if (!player)
            throw SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND
        if (player.status === 'KO')
            throw SOCKET.GAMES.ERROR.PLAYER_KO

        player.spectrum = spectrumArray
    }

    setPlayerKo(playerId: string) {
        const player = this.getPlayer(playerId)
        if (!player)
            throw SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND
            
        player.status = 'KO'
        const playersStillPlaying = _.filter(this.players, { status: 'playing' })
        player.position = playersStillPlaying.length + 1
    }

    isGameOver() {
        if (this.status === 'started') {
            const playersStillPlaying = _.filter(this.players, { status: 'playing' })
            // Solo Game
            if (this.players.length === 1) {
                if (playersStillPlaying.length === 0)
                    return true
            }
            // Multi Game
            else if (this.players.length > 1) {
                if (playersStillPlaying.length === 1)
                    return true
            }
        }
        return false
    }

    getResults() {
        return this.players.map((player: Player) => ({
            id: player.id,
            username: player.username,
            position: player.position,
            score: player.score,
        }))
    }

    info() {
        return {
            name: this.name,
            players: this.players.map((player) => player),
            maxPlayers: this.maxPlayers,
            mode: this.mode,
            speed: this.speed,
            status: this.status,
            leaderId: this.leaderId,
        }
    }

    reset() {
        this.pieces = Piece.generatingPiecesPool()
        this.status = 'idle'
        this.players.forEach((player) => player.reset())
    }
}


export { Game }
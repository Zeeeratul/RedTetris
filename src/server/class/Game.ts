import _ from 'lodash'
import { Player } from './Player'
import { Piece } from './Piece'
import { gameModeType, GameParameters, gameStatusType, gameSpeedType } from './types'

// TO BE DONE
// FOR Now 100 piece are created at the beginning but need to create more if needed


class Game {
    players: Player[];
    pieces: Piece[];
    leaderId: string;
    name: string;
    status: gameStatusType = 'idle';
    mode: gameModeType = 'classic';
    maxPlayers: number = 2;
    speed: gameSpeedType = 1;

    constructor(gameParameters: GameParameters, player: Player) {
        this.name = gameParameters.name
        this.players = [player]
        this.leaderId = player.id
        this.pieces = Piece.generatingPiecesPool()
        Object.assign(this, this.checkGameParameters(gameParameters))
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayer(playerId: string) {
        const index = _.findIndex(this.players, { id: playerId })
        this.players.splice(index, 1)
        this.updateStatus()
    }

    transferLeadership() {
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

    // Check the game Parameters and set it to default if not provided
    checkGameParameters(gameParameters: GameParameters) {
        if (gameParameters.mode && ['classic', 'invisible', 'marathon'].indexOf(gameParameters.mode))
            gameParameters.mode = 'classic'
        if (gameParameters.speed && [0.5, 1, 1.5, 2].indexOf(gameParameters.speed)) 
            gameParameters.speed = 1
        if (gameParameters.maxPlayers && [1, 2, 3, 4, 5].indexOf(gameParameters.maxPlayers)) 
            gameParameters.maxPlayers = 2

        return gameParameters
    }


    // set player ko and position

    // on info check winner



    givePiece(player: Player) {
        if (player) {
            const currentPieceIndex = player.currentPieceIndex
            player.incrementCurrentPieceIndex()
            return this.pieces[currentPieceIndex]
        }
        else 
            return null
    }

    updateScore(lineCleared: number, playerId: string) {
        const player = this.getPlayer(playerId)
        if (player)
            player.score = player.score + lineCleared * 10
    }

    updateSpectrum(spectrumArray: number[], playerId: string) {
        const player = this.getPlayer(playerId)
        if (player)
            player.spectrum = spectrumArray
    }

    updateStatus() {
        // When game is launched
        if (this.status === 'started') {
            const playersStillPlaying = _.filter(this.players, { status: 'playing' })
            // Solo Game
            if (this.players.length === 1) {
                if (playersStillPlaying.length === 0) {
                    this.status = 'ended'
                }
            }
            // Multi Game
            else if (this.players.length > 1) {
                if (playersStillPlaying.length === 1) {
                    this.status = 'ended'
                }
            }
        }
    }

    setPlayerKo(playerId: string) {
        const player = this.getPlayer(playerId)
        if (!player)
            return
            
        player.status = 'KO'
        const playersStillPlaying = _.filter(this.players, { status: 'playing' })
        player.position = playersStillPlaying.length + 1
        // this.updateStatus()
    }

    // 
    checkGameOver() {
        if (this.status === 'started') {
            const playersStillPlaying = _.filter(this.players, { status: 'playing' })
            // Solo Game
            if (this.players.length === 1) {
                if (playersStillPlaying.length === 0) {
                    return true
                    // this.status = 'ended'
                }
            }
            // Multi Game
            else if (this.players.length > 1) {
                if (playersStillPlaying.length === 1) {
                    return true
                    // this.status = 'ended'
                }
            }
        }
        return false
    }

    getResults() {
        const results = this.players.map((player: Player) => ({
            id: player.id,
            username: player.username,
            position: player.position,
            score: player.score,
        }))
        return results
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
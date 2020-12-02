const _ = require('lodash')
const { Piece } = require('./Piece')
const { Player } = require('./Player')

class Game {
    constructor(name, leader) {
        this.name = name
        this.status = 'idle'
        this.maxPlayers = 2
        this.players = [new Player(leader)]
        this.leaderId = leader.id
        this.pieces = this.generatePieces()
    }

    addPlayer(playerData) {
        const player = new Player(playerData)
        this.players.push(player)
    }

    changeStatus(status) {
        this.status = status
    }

    isLeader(userId) {
        return this.leaderId === userId
    }

    removePlayer(playerId) {
        const index = _.findIndex(this.players, { id: playerId })
        this.players.splice(index, 1)

        // if the leader leave give leader to another
        if (playerId === this.leaderId) {
            this.leaderId = this.players[0].id
        }
    }
    
    getPlayer(userId) {
        const player = _.find(this.players, { id: userId })
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

    givePiece(userId) {
        const player = this.getPlayer(userId)
        const currentPieceIndex = player.currentPieceIndex
        player.incrementCurrentPieceIndex()
        return this.pieces[currentPieceIndex]
    }

}

exports.Game = Game
const _ = require('lodash')
const { Piece } = require('./Piece')

class Game {
    constructor(name, leader) {
        this.name = name
        this.leader = leader
        this.player2 = null
        this.started = false
        this.pieces = this.generatePieces()
    }

    generatePieces() {
        const pieces = []
        for (let i = 0; i < 100; i++) {
            const piece = new Piece()
            pieces.push(piece)
        }
        return pieces
    }

    isLeader(username) {
        return username === this.leader.username
    }

    addPlayer(player) {
        this.player2 = player
    }

    removePlayer() {
        this.player2 = null
    }

    tranferOwnership() {
        this.leader = this.player2
        this.player2 = null
    }

    getPlayers() {
        return { leader: this.leader, player2: this.player2 }
    }

    givePiece() {
        const piece = new Piece()
        return piece
    }

}

exports.Game = Game
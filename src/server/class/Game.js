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
        for (let i = 0; i < 10; i++) {
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

    getPlayer(username) {
        if (this.leader.username === username) {
            return this.leader
        }
        else if (this.player2.username === username) {
            return this.player2
        }
    }

    getPlayers() {
        return { leader: this.leader, player2: this.player2 }
    }

    givePiece(username) {
        const player = this.getPlayer(username)
        
        player.incrementCurrentPieceIndex()
        console.log(player)

        console.log(this.pieces)
        
        // console.log(this.pieces, 'new tab \n')
        // let pieceIndex = 0
        // if (this.leader.username === username) {
        //     pieceIndex = this.leader.currentPieceIndex
        //     this.leader.incrementCurrentPieceIndex()
        //     // console.log('leader get new piece', pieceIndex)
        // }
        // else if (this.player2.username === username) {
        //     pieceIndex = this.leader.currentPieceIndex
        //     this.player2.incrementCurrentPieceIndex()
        //     // console.log('player2 get new piece', pieceIndex)
        // }
        // else console.log('should be impossible to have username not equal to one of the two player')
    
        // console.log(`${username} with piece index: ${pieceIndex}`)
        // return this.pieces[pieceIndex]

        return new Piece()
    }

}

exports.Game = Game
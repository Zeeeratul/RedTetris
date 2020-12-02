const _ = require('lodash')

class Player {
    constructor({ username, id }) {
        this.username = username
        this.id = id
        this.currentPieceIndex = 0
    }

    incrementCurrentPieceIndex() {
        this.currentPieceIndex = this.currentPieceIndex + 1
    }
}

exports.Player = Player

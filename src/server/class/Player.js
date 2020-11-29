const _ = require('lodash')

class Player {
    constructor({ username, id }) {
        this.username = username
        this.id = id
        this.game_name = null
        this.currentPiece = 0
    }

    joinGame(game_name) {
        this.game_name = game_name
    }

    leaveGame() {
        this.game_name = null
    }

    playerExists() {
    }



}

exports.Player = Player

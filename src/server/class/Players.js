const _ = require('lodash')
const { Player } = require('./Player')

class Players {
    constructor() {
        this.players = []
    }

    getPlayer({ username, id }) {
        if (username) {
            const user = _.find(this.players, { 'username': username })
            return user || null
        }
        else if (id) {
            const user = _.find(this.players, { id })
            return user || null
        }
        return null
    }

    addPlayer(username, id) {
        const player = new Player({ username, id })
        this.players.push(player)
        console.log(`Players.js: login player created: `, player.username)
        return player
    }

    removePlayer(username) {
        const index = _.findIndex(this.players, { username })
    
        // remove the player
        this.players.splice(index, 1)
    }


}

exports.Players = Players

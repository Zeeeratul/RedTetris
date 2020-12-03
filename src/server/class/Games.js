const _ = require('lodash')
const { Game } = require('./Game')

class Games {
    constructor() {
        this.games = []
    }

    createGame(lobby_name, leader) {
        const game = new Game(lobby_name, leader)
        this.games.push(game)
    }

    destroyGame(game_name) {
        const index = _.findIndex(this.games, { name: game_name })
        if (index !== -1) 
            this.games.splice(index, 1)
    }

    getGame(game_name) {
        return _.find(this.games, { name: game_name }) || null
    }

    getGames() {
        const games = _.filter(this.games, { status: 'idle' }) || []
        const gamesInfo = games.map((game) => game.gameInfo)
        return gamesInfo
    }


}

exports.Games = Games

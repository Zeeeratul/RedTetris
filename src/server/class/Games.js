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
        this.games.splice(index, 1)
    }

    joinGame(game_name, player) {
        const game = _.find(this.games, { name: game_name })
        game.addPlayer(player)
    }

    getGame(lobby_name) {
        return _.find(this.games, { name: lobby_name }) || null
    }

    getGames() {
        return this.games
    }


}

exports.Games = Games

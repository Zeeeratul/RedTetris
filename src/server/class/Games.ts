import _ from 'lodash'
import { Game, GameInterface } from './Game'
import { PlayerInterface } from './Player'

class Games {
    games: GameInterface[];

    constructor() {
        this.games = []
    }

    createGame(lobby_name: string, leader: PlayerInterface) {
        const game = new Game(lobby_name, leader)
        this.games.push(game)
    }

    destroyGame(game_name: string) {
        const index = _.findIndex(this.games, { name: game_name })
        if (index !== -1) 
            this.games.splice(index, 1)
    }

    getGame(game_name: string) {
        return _.find(this.games, { name: game_name }) || null
    }

    getGames() {
        const games = _.filter(this.games, { status: 'idle' }) || []
        const gamesInfo = games.map((game) => game.gameInfo())
        return gamesInfo
    }


}

export default Games
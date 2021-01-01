import _ from 'lodash'
import { Game } from './Game'
import { Player } from './Player'
import { SOCKET } from '../../client/config/constants.json'
import { User, GameParameters } from './types'

class Games {
    games: Game[] = [];

    createGame(gameParameters: GameParameters, playerData: User) {
        if (!gameParameters.name)
            throw SOCKET.GAMES.ERROR.INVALID_NAME

        const checkGame = this.getGame(gameParameters.name)
        if (checkGame)
            throw SOCKET.GAMES.ERROR.NAME_TAKEN
            
        const player = new Player(playerData.username, playerData.id)
        const game = new Game(gameParameters, player)
        this.games.push(game)
        return game.name
    }

    joinGame(gameName: string, playerData: User) {
        const game = this.getGame(gameName)

        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND
        else if (game.status === 'started')
            throw SOCKET.GAMES.ERROR.STARTED
        else if (game.players.length >= game.maxPlayers)
            throw SOCKET.GAMES.ERROR.FULL

        const player = new Player(playerData.username, playerData.id)
        game.addPlayer(player)
        return game
    }

    leaveGame(gameName: string, playerData: User) {
        const game = this.getGame(gameName)
        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND

        if (game.players.length > 1) {
            game.removePlayer(playerData.id)
            game.transferLeadership()
            return game
        }
        else 
            this.destroyGame(gameName)
    }

    destroyGame(gameName: string) {
        const index = _.findIndex(this.games, { name: gameName })
        if (index !== -1) 
            this.games.splice(index, 1)
    }

    startGame(gameName: string, playerData: User) {
        const game = this.getGame(gameName)
        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND

        if (!game.isLeader(playerData.id))
            throw SOCKET.GAMES.ERROR.NOT_LEADER

        game.changeStatus('started')
        return game
    }

    getGame(gameName: string) {
        return _.find(this.games, { name: gameName }) || null
    }

    getGamesList() {
        return _.filter(this.games, (game) => game.status === 'idle' || game.status === 'ended')
    }
}

export { Games }
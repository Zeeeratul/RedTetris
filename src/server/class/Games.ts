import _ from 'lodash'
import { Game } from './Game'
import { Player } from './Player'
import { SOCKET } from '../config/constants.json'

class Games {
    games: Game[] = [];

    createGame(gameParameters: GameParameters, userData: User) {
        if (!gameParameters.name || gameParameters.name.length < 4|| gameParameters.name.length > 25)
            throw SOCKET.GAMES.ERROR.INVALID_NAME

        const checkGame = this.getGame(gameParameters.name)
        if (checkGame)
            throw SOCKET.GAMES.ERROR.NAME_TAKEN
            
        const player = new Player(userData.username, userData.id)
        const game = new Game(gameParameters, player)
        this.games.push(game)
        return game.name
    }

    joinGame(gameName: string, userData: User) {
        const game = this.getGame(gameName)

        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND
        else if (game.status === 'started')
            throw SOCKET.GAMES.ERROR.STARTED
        else if (game.players.length >= game.maxPlayers)
            throw SOCKET.GAMES.ERROR.FULL

        const player = new Player(userData.username, userData.id)
        game.addPlayer(player)
        return game
    }

    leaveGame(gameName: string, userData: User) {
        const game = this.getGame(gameName)
        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND

        if (game.players.length > 1) {
            game.removePlayer(userData.id)
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

    startGame(gameName: string, userData: User) {
        const game = this.getGame(gameName)
        if (!game)
            throw SOCKET.GAMES.ERROR.NOT_FOUND

        if (!game.isLeader(userData.id))
            throw SOCKET.GAMES.ERROR.NOT_LEADER
        game.reset()
        game.status = 'started'
        return game
    }

    getGame(gameName: string) {
        return _.find(this.games, { name: gameName }) || null
    }

    getGamesList() {
        const unstartedGames = _.filter(this.games, (game) => {
            if (game.status === 'idle' && game.players.length < game.maxPlayers)
                return true
            return false
        })

        return unstartedGames.map((game: Game) => game.info())
    }
}

export { Games }
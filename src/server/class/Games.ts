import _ from 'lodash'
import { Game } from './Game'
import { Player } from './Player'
import { Piece } from './Piece'
import { SOCKET } from '../../client/config/constants.json'

interface PlayerData {
    username: string,
    id: string,
}

class Games {
    games: Game[] = [];

    createGame(game_name: string, playerData: PlayerData) 
    {
        try {
            if (!game_name)
                throw SOCKET.GAMES.ERROR.INVALID_NAME

            const checkGame = this.getGame(game_name)
            if (checkGame)
                throw SOCKET.GAMES.ERROR.NAME_TAKEN
                
            const player = new Player(playerData.username, playerData.id)
            const game = new Game(game_name, player)
            this.games.push(game)
            return { url: `#${game_name}` }
        }
        catch (error) {
            return { error }
        }
    }

    joinGame(game_name: string, playerData: PlayerData) {
        try {
            const game = this.getGame(game_name)
            if (!game)
                throw SOCKET.GAMES.ERROR.NOT_FOUND

            if (game.status === 'started')
                throw SOCKET.GAMES.ERROR.STARTED
            else if (game.players.length >= game.maxPlayers)
                throw SOCKET.GAMES.ERROR.FULL

            const player = new Player(playerData.username, playerData.id)
            game.addPlayer(player)
            return { url: `#${game_name}` }
        }
        catch (error) {
            return { error }
        }
    }

    leaveGame(game_name: string, playerData: PlayerData) {
        try {
            const game = this.getGame(game_name)
            if (!game)
                throw SOCKET.GAMES.ERROR.NOT_FOUND

            if (game.players.length > 1) {
                game.removePlayer(playerData.id)
                game.transferOwnership()
            }
            else
                this.destroyGame(game_name)
            return { success: 'leave_correctly' }
        }
        catch (error) {
            return { error }
        }
    }

    destroyGame(game_name: string) {
        const index = _.findIndex(this.games, { name: game_name })
        if (index !== -1) 
            this.games.splice(index, 1)
    }

    startGame(game_name: string, playerData: PlayerData) {
        try {
            const game = this.getGame(game_name)
            if (!game)
                throw SOCKET.GAMES.ERROR.NOT_FOUND

            if (!game.isLeader(playerData.id))
                throw SOCKET.GAMES.ERROR.NOT_LEADER

            game.changeStatus('started')

            // create the two first piece that will be sended to the players
            const payload = {
                currentPiece: new Piece(),
                nextPiece: new Piece(),
            }
            return { payload }
        }
        catch (error) {
            return { error }
        }
    }

    endGame(game_name: string, playerData: PlayerData) {
        try {
            const game = this.getGame(game_name)
            if (!game)
                throw SOCKET.GAMES.ERROR.NOT_FOUND

            game.changeStatus('terminated')

            const payload = {
                message: `${playerData.username} lose the game`
            }
            return { payload }
        }
        catch (error) {
            return { error }
        }
    }

    getGame(game_name: string) {
        return _.find(this.games, { name: game_name }) || null
    }

    getUnstartedGamesList() {
        const games = _.filter(this.games, { status: 'idle' })
        const gamesInfo = games.map((game) => game.gameInfo())
        return gamesInfo
    }
}

export default Games
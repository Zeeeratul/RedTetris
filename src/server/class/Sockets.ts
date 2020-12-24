import _ from 'lodash'
import Games from './Games'
import { SOCKET } from '../../client/config/constants.json'
import { User, GameParameters } from './interfaces'
const SocketIO = require('socket.io')

interface CallbackFunction {
    (error: string | null, data?: any): void;
}

class Sockets {
    io: any;
    games: Games;
    users: User[];

    constructor(http: any) {
        this.io = SocketIO(http)
        this.games = new Games()
        this.users = []
    }

    // callback function send back data to client
    
    listenToEvents() {

        this.io.on('connection', (socket: any) => {

            // AUTH ROUTES
            socket.on(SOCKET.AUTH.LOGIN, (username: string, callback: CallbackFunction) => {
                try {
                    if (!username) 
                        throw SOCKET.AUTH.ERROR.INVALID_USERNAME
            
                    const findUser = _.find(this.users, { username })
                    if (findUser)
                        throw SOCKET.AUTH.ERROR.USERNAME_TAKEN
            
                    const user: User = {
                        id: socket.id,
                        username,
                    }
                    this.users.push(user)
                    socket.player = user
            
                    callback(null, { id: socket.id, username })
                }
                catch (error) {
                    console.error(error)
                    callback(error)
                }
            })
     
            socket.on(SOCKET.AUTH.DISCONNECT, () => {
                if (socket.player) {
                    const { gameName, id } = socket.player
                    this.games.leaveGame(gameName, socket.player)
         
                    socket.leave(gameName)

                    const game = this.games.getGame(gameName)
                    if (game) {
                        const gameInfo = game.gameInfo()
                        socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
                    }

                    const index = _.findIndex(this.users, { id })
                    if (index !== -1)
                        this.users.splice(index, 1)
                }
            })

            socket.on(SOCKET.GAMES.CREATE, (gameParameters: GameParameters, callback: CallbackFunction) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED

                    const gameName = this.games.createGame(gameParameters, socket.player)

                    socket.player.gameName = gameName
                    socket.join(gameName)
                    callback(null, gameName)
                }
                catch (error) {
                    console.log('error', error)
                    return callback(error)
                }
            })

            socket.on(SOCKET.GAMES.JOIN, (gameNameToJoin: string, callback: CallbackFunction) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED

                    const gameInfo = this.games.joinGame(gameNameToJoin, socket.player)

                    if (gameInfo) {
                        socket.player.gameName = gameInfo.name
                        socket.join(gameInfo.name)
                        socket.to(gameInfo.name).emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
                        callback(null, gameInfo.name)
                    }
                }
                catch (error) {
                    console.log('error', error)
                    return callback(error)
                }
            })
            
            socket.on(SOCKET.GAMES.LEAVE, () => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED

                    const { gameName } = socket.player
                    const gameInfo = this.games.leaveGame(gameName, socket.player)
                    delete socket.player.gameName
                    socket.leave(gameName)

                    if (gameInfo)
                        socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
        
                }
                catch (error) {
                    console.log('error', error)
                }
            })
            
            socket.on(SOCKET.GAMES.GET_INFO, (_: any) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName } = socket.player
                const game = this.games.getGame(gameName)
                
                if (game) {
                    const gameInfo = game.gameInfo()
                    socket.emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
                }
                else
                    socket.emit(SOCKET.GAMES.ERROR.NOT_FOUND)
            })

            // actions to send to the whole room
            socket.on(SOCKET.GAMES.START, () => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName } = socket.player
                const { error } = this.games.startGame(gameName, socket.player)
                
                if (error) 
                    return console.error(error)

                const game = this.games.getGame(gameName)

                if (game) {
                    const gameInfo = game.gameInfo()
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
                }
            })


            // when game over change player status
            // and check if there is a last player with a status playing

            socket.on(SOCKET.GAMES.GAME_OVER, () => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                    
                const { gameName, id } = socket.player
                const game = this.games.getGame(gameName)

                if (game) {
                    game.setPlayerKo(id)
                    console.log(game.players)
                    this.io.in(gameName).emit(SOCKET.GAMES.GAME_OVER, null, game.gameInfo())
                }
            })








            
            socket.on(SOCKET.GAMES.SEND_SPECTRUM, (spectrumArray: []) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                
                const { gameName } = socket.player
                const game = this.games.getGame(gameName)
                if (!game)
                    return

                socket.to(gameName).emit(SOCKET.GAMES.GET_SPECTRUM, {
                    type: 'spectrum',
                    data: spectrumArray
                })
            })
            
            socket.on(SOCKET.GAMES.LINE_PENALTY, (linesCount: number) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                
                const { gameName } = socket.player
                const game = this.games.getGame(gameName)
                
                if (!game)
                    return

                console.log('send linepenalty: ', linesCount)
                
                socket.to(gameName).emit(SOCKET.GAMES.LINE_PENALTY, null, linesCount)
            })




            // games data
            socket.on(SOCKET.GAMES.GET_GAMES, (_: any, callback: CallbackFunction) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const games = this.games.getUnstartedGamesList()
                callback(null, games)
            })

            socket.on(SOCKET.GAMES.GET_PIECE, (_: any, callback: CallbackFunction) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName, id } = socket.player
                const game = this.games.getGame(gameName)
                if (!game)
                    return console.error('game not found cant give piece')

                const piece = game.givePiece(id)
                if (!piece) 
                    return console.error('player not found cant give piece')
                callback(null, piece)
            })
        })
    }
}

export default Sockets
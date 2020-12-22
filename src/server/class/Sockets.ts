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
            
                    callback(null, { token: socket.id, username })
                }
                catch (error) {
                    console.error(error)
                    callback(error)
                }
            })
     
            socket.on(SOCKET.AUTH.DISCONNECT, () => {
                if (socket.player) {
                    const { gameName, id, username } = socket.player
                    this.games.leaveGame(gameName, socket.player)
         
                    socket.leave(gameName)

                    socket.to(gameName).emit(SOCKET.GAMES.INFO, null, { 
                        type: SOCKET.GAMES.LEAVE,
                        content: `${username} leave_game`
                    })

                    const index = _.findIndex(this.users, { id })
                    if (index !== -1)
                        this.users.splice(index, 1)
                }
            })


                // this.games.createGame(gameParameters, socket.player)
                //     .then((data) => {
                //         callback(null, data)
                //     })
                //     .catch((err) => {
                //         callback(err)
                //     })

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


            // send to all players of the game the following data: 
            // game name && mode && speed
            socket.on(SOCKET.GAMES.JOIN, (gameNameToJoin: string, callback: CallbackFunction) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
    
                    const { username } = socket.player
                    const gameName = this.games.joinGame(gameNameToJoin, socket.player)
    
                    socket.player.gameName = gameName
                    socket.join(gameName)
    
                    callback(null, gameName)

                    // to other player send updated game data
                    socket.to(gameName).emit(SOCKET.GAMES.INFO, null, { 
                        type: SOCKET.GAMES.JOIN,
                        content: `${username} join_game`
                    })
                }
                catch (error) {
                    console.log('error', error)
                    return callback(error)
                }
            })
            
            socket.on(SOCKET.GAMES.LEAVE, () => {
                if (!socket.player)
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName, username } = socket.player
                this.games.leaveGame(gameName, socket.player)

                delete socket.player.gameName
                socket.leave(gameName)

                socket.to(gameName).emit(SOCKET.GAMES.INFO, null, { 
                    type: SOCKET.GAMES.LEAVE,
                    content: `${username} leave_game`
                })
            })
            
            socket.on(SOCKET.GAMES.GET_INFO, (_: any, callback: CallbackFunction) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName, id } = socket.player
                const game = this.games.getGame(gameName)
                
                if (game) {
                    const gameInfo = game.gameInfo(id)
                    callback(null, gameInfo)
                }
                else
                    callback(SOCKET.GAMES.ERROR.NOT_FOUND)
            })


            // useless route ??
            // useless route ??
            // useless route ??
            // useless route ??
            socket.on(SOCKET.GAMES.CHECK_LEADER, (_: any, callback: CallbackFunction) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                    
                const { gameName } = socket.player
                const { isLeader, error } = this.games.checkLeader(gameName, socket.player)
                callback(error, isLeader)
            })




            // actions to send to the whole room
            socket.on(SOCKET.GAMES.START, () => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName } = socket.player
                const { payload, error } = this.games.startGame(gameName, socket.player)
                if (error)
                    socket.emit('error', error)
                else 
                    this.io.in(gameName).emit(SOCKET.GAMES.START, payload)
            })

            socket.on(SOCKET.GAMES.END, () => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { gameName } = socket.player
                const { payload, error } = this.games.endGame(gameName, socket.player)

                if (error)
                    socket.emit('error', error)
                else 
                    this.io.in(gameName).emit(SOCKET.GAMES.END, payload)
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
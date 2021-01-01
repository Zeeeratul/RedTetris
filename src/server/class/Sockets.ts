import _ from 'lodash'
import http from 'http'
import { Games } from './Games'
import { SOCKET } from '../../client/config/constants.json'
import { User, GameParameters, CallbackFunction } from './types'
import { Server } from 'socket.io'

class Sockets {
    io: Server;
    games: Games;
    users: User[];

    constructor(http: http.Server) {
        this.io = new Server(http)
        this.games = new Games()
        this.users = []
    }

    listenToEvents() {

        this.io.on('connection', (socket) => {

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
                try {
                    if (socket.player) {
                        const { gameName, id } = socket.player

                        const index = _.findIndex(this.users, { id })
                        if (index !== -1)
                            this.users.splice(index, 1)

                        const game = this.games.leaveGame(gameName, socket.player)
                        socket.leave(gameName)
    
                        if (game) {
                            const info = game.info()
                            socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, info)
                        }
                    }
                }
                catch (error) {
                    console.error(error)
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

                    const game = this.games.joinGame(gameNameToJoin, socket.player)

                    const info = game.info()
                    socket.player.gameName = info.name
                    socket.join(info.name)
                    socket.to(info.name).emit(SOCKET.GAMES.GET_INFO, null, info)
                    callback(null, info.name)
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
                    const game = this.games.leaveGame(gameName, socket.player)
                    delete socket.player.gameName
                    socket.leave(gameName)

                    if (game) {
                        const info = game.info()
                        socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, info)
                    }
                }
                catch (error) {
                    console.log('error', error)
                }
            })

            socket.on(SOCKET.GAMES.START, () => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
    
                    const { gameName } = socket.player
                    const game = this.games.startGame(gameName, socket.player)
    
                    game.reset()
                    const info = game.info()
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, info)
                }
                catch (error) {
                    console.log('error', error)
                    // return callback(error)
                }
            })

            socket.on(SOCKET.GAMES.GAME_OVER, () => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
                        
                    const { gameName, id } = socket.player
                    const game = this.games.getGame(gameName)
    
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    game.setPlayerKo(id)
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, game.info())

                }
                catch (error) {
                    console.log('error', error)
                    // return callback(error)
                }
            })

            socket.on(SOCKET.GAMES.SPECTRUM, (spectrumArray: number[]) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
                        
                    const { gameName } = socket.player
                    const game = this.games.getGame(gameName)
    
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    game.updateSpectrum(spectrumArray, socket.player.id)
                    socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, game.info())
                }
                catch (error) {
                    console.log('error', error)
                    // return callback(error)
                }
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

            socket.on(SOCKET.GAMES.GET_GAMES, (_: any, callback: CallbackFunction) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const games = this.games.getGamesList()
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

                        
            socket.on(SOCKET.GAMES.GET_INFO, (_: any) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
    
                    const { gameName } = socket.player
                    const game = this.games.getGame(gameName)
                    
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
                    else {
                        const info = game.info()
                        socket.emit(SOCKET.GAMES.GET_INFO, null, info)
                    }
                }
                catch (error) {
                    console.log('error', error)
                }
            })
        })
    }
}

export { Sockets }
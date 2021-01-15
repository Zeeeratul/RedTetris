import _ from 'lodash'
import http from 'http'
import { Games } from './Games'
import { SOCKET } from '../config/constants.json'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

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
                    if (!username || username.length > 25) 
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
                            const gameOver = game.isGameOver()
                            if (gameOver) {
                                const results = game.getResults()
                                this.io.in(gameName).emit(SOCKET.GAMES.RESULTS, null, results)
                                game.reset()
                            }
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

                    let gameName : string
                    if (gameParameters.isSolo) {
                        const soloGameParameters = {
                            ...gameParameters,
                            maxPlayers: 1 as GameMaxPlayers,
                            name: uuidv4()
                        }
                        gameName = this.games.createGame(soloGameParameters, socket.player)
                    }
                    else
                        gameName = this.games.createGame(gameParameters, socket.player)

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
                        const gameOver = game.isGameOver()
                        if (gameOver) {
                            const results = game.getResults()
                            this.io.in(gameName).emit(SOCKET.GAMES.RESULTS, null, results)
                            game.reset()
                        }
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
    
                    const info = game.info()
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, info)
                }
                catch (error) {
                    console.log('error', error)
                }
            })

            socket.on(SOCKET.GAMES.GAME_OVER, () => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
                        
                    const { gameName, id: playerId } = socket.player
                    const game = this.games.getGame(gameName)
    
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    game.setPlayerKo(playerId)
                    const gameOver = game.isGameOver()

                    if (gameOver) {
                        const results = game.getResults()
                        this.io.in(gameName).emit(SOCKET.GAMES.RESULTS, null, results)
                        game.reset()
                    }
                    const info = game.info()
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, info)
                }
                catch (error) {
                    console.log('error', error)
                }
            })

            socket.on(SOCKET.GAMES.SPECTRUM, (spectrumArray: SpectrumArray) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
                        
                    const { gameName, id: playerId } = socket.player
                    const game = this.games.getGame(gameName)
    
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    game.updateSpectrum(spectrumArray, playerId)
                    socket.to(gameName).emit(SOCKET.GAMES.GET_INFO, null, game.info())
                }
                catch (error) {
                    console.log('error', error)
                }
            })
            
            socket.on(SOCKET.GAMES.LINE, (linesCount: number) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
    
                    const { gameName, id: playerId } = socket.player
                    const game = this.games.getGame(gameName)

                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    if (linesCount > 1 && game.mode !== 'marathon')
                        socket.to(gameName).emit(SOCKET.GAMES.LINE_PENALTY, null, linesCount - 1)
                    game.updateScore(linesCount, playerId)
                    const gameInfo = game.info()
                    this.io.in(gameName).emit(SOCKET.GAMES.GET_INFO, null, gameInfo)
                }
                catch (error) {
                    console.error(error)
                }
            })

            socket.on(SOCKET.GAMES.GET_PIECE, (_: any, callback: CallbackFunction) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
                    
                    const { gameName, id: playerId } = socket.player
                    const game = this.games.getGame(gameName)
                    if (!game)
                        throw SOCKET.GAMES.ERROR.NOT_FOUND
    
                    const piece = game.givePiece(playerId)
                    callback(null, piece)
                }
                catch (error) {
                    console.error(error)
                }
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
                    socket.emit(SOCKET.GAMES.GET_INFO, error)
                }
            })

            socket.on(SOCKET.GAMES.MESSAGES, (messageContent: string) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED
    
                    const { gameName, username, id } = socket.player

                    const message = {
                        content: messageContent,
                        sender: {
                            username,
                            id
                        },
                        id: uuidv4()
                    }  

                    this.io.in(gameName).emit(SOCKET.GAMES.MESSAGES, null, message)
                }
                catch (error) {
                    console.log('error', error)
                }
            })

            socket.on(SOCKET.GAMES.GET_GAMES, (_: any, callback: CallbackFunction) => {
                try {
                    if (!socket.player) 
                        throw SOCKET.SERVER_ERROR.USER_NOT_CONNECTED

                    const games = this.games.getGamesList()
                    callback(null, games)
                }
                catch (error) {
                    console.error(error)
                    callback(error)
                }
            })
        })
    }
}

export { Sockets }
import _ from 'lodash'
import Games from './Games'
import { SOCKET } from '../../client/config/constants.json'
import { Player } from './Player'
const SocketIO = require('socket.io')

type User = {
    id: string
    username: string
    game_name?: string
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
    
    loginUser(username: string, socket: any, callback: any) {
        if (!username) 
            return callback({ error: SOCKET.AUTH.ERROR.INVALID_USERNAME })

        const findUser = _.find(this.users, { username })
        if (findUser)
            return callback({ error: SOCKET.AUTH.ERROR.USERNAME_TAKEN })

        const user: User = {
            id: socket.id,
            username,
        }
        this.users.push(user)
        socket.player = user
        callback({ token: socket.id, username })
    }

    disconnectUser(socket: any) {
        if (socket.player) {
            const { game_name, username, id } = socket.player
            this.games.leaveGame(game_name, socket.player)
 
            this.io.to(game_name).emit('information', {
                type: 'leave',
                username
            })
            socket.leave(game_name)

            const index = _.findIndex(this.users, { id })
            if (index !== -1)
                this.users.splice(index, 1)
        }
    }

    listenToEvents() {

        this.io.on('connection', (socket: any) => {

            // AUTH ROUTES
            socket.on(SOCKET.AUTH.LOGIN, (username: string, callback: (data: {}) => void ) => this.loginUser(username, socket, callback))
     
            socket.on(SOCKET.AUTH.DISCONNECT, () => this.disconnectUser(socket))

            // GAMES ROUTES
            socket.on(SOCKET.GAMES.CREATE, (game_name: string, callback: any) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { error, url } = this.games.createGame(game_name, socket.player)

                if (error) 
                    return callback({ error })

                socket.player = { ...socket.player, game_name }
                socket.join(game_name)
                callback({ url })
            })

            socket.on(SOCKET.GAMES.JOIN, (game_name: string, callback: any) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { error, url } = this.games.joinGame(game_name, socket.player)

                if (error)
                    return callback({ error })

                socket.player = { ...socket.player, game_name }
                socket.join(game_name)
                callback({ url })
                this.io.to(game_name).emit('information', {
                    type: 'join',
                    username: socket.player.username
                })
            })
            
            socket.on(SOCKET.GAMES.LEAVE, (game_name: string) => {
                if (!socket.player)
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                this.games.leaveGame(game_name, socket.player)

                delete socket.player.game_name
                this.io.to(game_name).emit('information', {
                    type: 'leave',
                    username: socket.player.username
                })
                socket.leave(game_name)
            })

            socket.on(SOCKET.GAMES.CHECK_LEADER, (game_name: string, callback: any) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                    
                const { id } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return callback({ error: SOCKET.GAMES.ERROR.NOT_FOUND })

                callback({ isLeader: game.isLeader(id) })
            })
            
            socket.on(SOCKET.GAMES.START, (game_name: string) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { payload, error } = this.games.startGame(game_name, socket.player.id)

                if (error)
                    socket.emit('error', error)
                else 
                    this.io.to(game_name).emit(SOCKET.GAMES.START, payload)
            })

            socket.on(SOCKET.GAMES.END, (game_name: string) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { payload, error } = this.games.endGame(game_name, socket.player)

                if (error)
                    socket.emit('error', error)
                else 
                    this.io.to(game_name).emit(SOCKET.GAMES.END, payload)
            })

            socket.on(SOCKET.GAMES.SEND_SPECTRUM, (spectrumArray: []) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                
                const { game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                socket.to(game_name).emit(SOCKET.GAMES.GET_SPECTRUM, {
                    type: 'spectrum',
                    data: spectrumArray
                })
            })
            
            socket.on(SOCKET.GAMES.SEND_LINE_PENALTY, (linesNumbers: number) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                
                const { game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                socket.to(game_name).emit(SOCKET.GAMES.GET_LINE_PENALTY, {
                    type: 'penalty',
                    data: linesNumbers
                })
            })

            socket.on(SOCKET.GAMES.GET_GAMES, (_: any, callback: any) => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                callback({ games: this.games.getUnstartedGamesList() })
            })

            socket.on(SOCKET.GAMES.GET_PIECE, () => {
                if (!socket.player) 
                    return console.error(SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)

                const { game_name, id } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                socket.emit('new_piece', { piece: game.givePiece(id) })
            })

        })
    }
}

export default Sockets
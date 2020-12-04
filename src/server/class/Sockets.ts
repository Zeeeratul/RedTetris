import _ from 'lodash'
import Games from './Games'
const SocketIO = require('socket.io')

type User = {
    id: string
    username: string
    game_name?: string
}

class Sockets {
    games: any;
    players: any;
    users: User[];
    // io: SocketIO.Socket;
    io: any;
    authRoutes: any;

    constructor(http: any) {
        this.games = new Games()
        this.users = []
        this.io = SocketIO(http)
        this.authRoutes = this.io.of('/auth')
    }

    listenToEvents() {

        /*
            To do:

            GAME
            SPACE BAR KEY HANDLING
            SEND GAMES INFO NICELY

        */

        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('login', (username: string, callback: (data: {}) => void ) => {
                if (!username) return

                const findUser = _.find(this.users, { username })
                if (findUser)
                    return callback({ error: 'username_taken' })

                const user: User = {
                    id: socket.id,
                    username,
                }
                this.users.push(user)
                callback({ token: socket.id })
            })
        })

        this.authRoutes.use((socket: any, next: any) => {
            const token = socket?.handshake?.query?.token

            if (!token)
                return next(new Error('No token provided'))

            const player = _.find(this.users, { id: token })
            if (!player)
                return next(new Error('Authentication error'))

            socket.player = player
            next()
        })
        .on('connection', (socket: any) => {
            console.log('Connected on private routes', socket.player)

            // games functions
            socket.on('create', (game_name: string, callback: any) => {
                if (!game_name)
                    return callback({ error: 'invalid_game_name '})

                const game = this.games.getGame(game_name)
                if (game) {
                    callback({ error: 'game_name_taken '})
                }
                else {
                    socket.player = { ...socket.player, game_name }
                    socket.join(game_name)
                    this.games.createGame(game_name, socket.player)
                    callback({ url: `#${game_name}` })
                }
            })

            socket.on('join', (game_name: string, callback: any) => {
                const game = this.games.getGame(game_name)
                if (!game)
                    return callback({ error: 'game not found'})
                 
                if (game.players.length >= game.maxPlayers) {
                    console.log('sorry game is full')
                    callback({ error: 'game_full'})
                }
                else if (game.status === 'started') {
                    console.log('game has started wait for it to end')
                    callback({ error: 'game_started'})
                }
                else {
                    game.addPlayer(socket.player)
                    socket.player = { ...socket.player, game_name }
                    socket.join(game_name)
                    callback({ url: `#${game_name}` })
                    this.authRoutes.to(game_name).emit('information', {
                        type: 'join',
                        username: socket.player.username
                    })
                }
            })
            
            socket.on('leave', () => {

                const { game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (game && game.players.length > 1)
                    game.removePlayer(socket.player.id)
                else
                    this.games.destroyGame(game_name)

                delete socket.player.game_name
                this.authRoutes.to(game_name).emit('information', {
                    type: 'leave',
                    username: socket.player.username
                })
                socket.leave(game_name)
            })

            socket.on('is_leader', (_: any, callback: any) => {
                const { game_name, id } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                callback({ isLeader: game.isLeader(id) })
            })
            
            socket.on('start', () => {
                const { game_name, id } = socket.player
                const game = this.games.getGame(game_name)
                if (!game || !game.isLeader(id))
                    return
                
                game.changeStatus('started')
                this.authRoutes.to(game_name).emit('information', {
                    type: 'started',
                })
            })

            socket.on('lose', () => {
                const { game_name, username } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return
                
                game.changeStatus('terminated')
                this.authRoutes.to(game_name).emit('information', {
                    type: 'lose_game',
                    username: username
                })
            })


            socket.on('message', (content: string) => {
                const { game_name, username } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                const data = {
                    content,
                    username,
                    date: new Date()
                }

                this.authRoutes.to(game_name).emit('information', {
                    type: 'message',
                    data
                })
            })


            socket.on('spectrum', (spectrumArray: []) => {
                const { game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                socket.to(game_name).emit('information', {
                    type: 'spectrum',
                    data: spectrumArray
                })
            })
            
            socket.on('lines', (linesNumbers: number) => {
                const { game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                socket.to(game_name).emit('information', {
                    type: 'penalty',
                    data: linesNumbers
                })
            })

            // lobbies functions
            socket.on('get_games', (_: any, callback: any) => {
                callback({ games: this.games.getGames() })
            })


            socket.on('piece', (_: any, callback: any) => {
                const { game_name, id } = socket.player
                const game = this.games.getGame(game_name)
                if (!game)
                    return

                callback({ piece: game.givePiece(id) })
            })

            socket.on('disconnect', () => {
                console.log('disconnect', socket.player)
                const { game_name, id } = socket.player

                // game part
                const game = this.games.getGame(game_name)
                if (game && game.players.length > 1)
                    game.removePlayer(socket.player.id)
                else
                    this.games.destroyGame(game_name)

                this.authRoutes.to(game_name).emit('information', {
                    type: 'leave',
                    username: socket.player.username
                })
                socket.leave(game_name)

                const userIndex = _.findIndex(this.users, { id })
                this.users.splice(userIndex, 1)
            })
        })
    }
}

export default Sockets
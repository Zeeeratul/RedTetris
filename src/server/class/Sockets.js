const socketIO = require('socket.io')
const { Games } = require('./Games')
const { Players } = require('./Players')

const _ = require('lodash')

class Sockets {
    constructor(http) {
        this.games = new Games()
        this.players = new Players()
        this.users = []
        this.io = socketIO(http)
        this.authRoutes = this.io.of('/auth')
    }

    listenToEvents() {

        this.io.on('connection', (socket) => {
            socket.on('login', (username, callback) => {
                if (!username) return

                const findUser = _.find(this.users, { username })
                // const findUser = this.players.getPlayer({ username })
                if (findUser) {
                    callback({ error: 'username_taken' })
                }
                else {
                    this.users.push({
                        id: socket.id,
                        username
                    })
                    // this.players.addPlayer(username, socket.id)
                    callback({ token: socket.id })
                }
            })
        })

        this.authRoutes.use((socket, next) => {
            const token = socket?.handshake?.query?.token

            if (!token)
                return next(new Error('No token provided'))

            const player = _.find(this.users, { id: token })
            if (!player)
                return next(new Error('Authentication error'))

            socket.player = player
            next()
        })
        .on('connection', (socket) => {
            console.log('Connected on private routes', socket.player)

            // games functions
            socket.on('create', (game_name, callback) => {
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

            socket.on('join', (game_name, callback) => {
                const game = this.games.getGame(game_name)
                if (!game)
                    return callback({ error: 'game not found'})
                 
                if (game.players.length >= game.maxPlayers) {
                    console.log('sorry game is full')
                    callback({ error: 'game_full'})
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

            socket.on('is_leader', (_, callback) => {
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
            

            // lobbies functions
            socket.on('get_games', (_, callback) => {
                const games = this.games.getGames()
                callback({ games })
            })






            socket.on('piece', (_, callback) => {
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

exports.Sockets = Sockets
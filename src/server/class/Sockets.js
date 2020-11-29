const socketIO = require('socket.io')
const { Games } = require('./Games')
const { Players } = require('./Players')

class Sockets {
    constructor(http) {
        this.games = new Games()
        this.players = new Players()
        this.io = socketIO(http)
        this.authRoutes = this.io.of('/auth')
    }

    listenToEvents() {

        // login route
        this.io.on('connection', (socket) => {
            socket.on('login', (username, callback) => {
                const findUser = this.players.getPlayer({ username })
                if (findUser) {
                    callback({ error: 'username_taken' })
                }
                else {
                    callback({ token: socket.id })
                    this.players.addPlayer(username, socket.id)
                }
            })
        })

        // all others routes
        // middleware checking user token
        this.authRoutes.use((socket, next) => {
            const token = socket.handshake && socket.handshake.query.token
            console.log(token)

            if (!token)
                return next(new Error('No token provided'))
            const player = this.players.getPlayer({ id: token })
            if (!player)
                return next(new Error('Authentication error'))
            socket.player = player
            next()
        })
        .on('connection', (socket) => {
            console.log('Connected on private routes')


            // games CRUD

            socket.on('create_game', (game_name, callback) => {

                const lobbyExists = this.games.getGame(game_name)
                if (lobbyExists) {
                    callback({ error: 'game_name taken '})
                }
                else {
                    socket.join(game_name)
                    this.games.createGame(game_name, socket.player)
                    socket.player.joinGame(game_name)
                    const url = `#${game_name}[${socket.player.username}]`
                    callback({ url })
                }
      
            })

            socket.on('join_game', (game_name, callback) => {

                const lobbyExists = this.games.getGame(game_name)
                if (!lobbyExists)
                    callback({ error: 'unknown game'})
                else {
                    socket.join(game_name)
                    this.games.joinGame(game_name, socket.player)
                    socket.player.joinGame(game_name)
                    const url = `#${game_name}[${socket.player.username}]`
                    callback({ url })
                }
            })

            socket.on('start_game', () => {

                // check that player is leader of the game
                const { username, game_name } = socket.player

                // generate piece !!
                // init piece index player at 0
                // send to all people in the room the first piece

                const game = this.games.getGame(game_name)
                if (game) {
                    this.authRoutes.to(game_name).emit('start_game')
                }
            })


            socket.on('piece', (_, callback) => {

                // check that player is leader of the game
                const { username, game_name } = socket.player
                const game = this.games.getGame(game_name)
                const piece = game.givePiece()
                callback({ piece })
            })


            socket.on('is_leader', () => {
                const { username, game_name } = socket.player
                const game = this.games.getGame(game_name)
                const isLeader = game.isLeader(username)
                socket.emit('is_leader', { isLeader })
            })

            socket.on('get_players', () => {
                const { username, game_name } = socket.player
                const game = this.games.getGame(game_name)
                const players = game.getPlayers()

                

                socket.emit('get_players', { data: players })
            })

            socket.on('get_games', (_, callback) => {
                const games = this.games.getGames()
                callback({ games })
            })

            socket.on('leave_game', () => {
                const { username, game_name } = socket.player
                const game = this.games.getGame(game_name)
                const isLeader = game.isLeader(username)
                let message = ''

                if (isLeader) {
                    if (game.player2) {
                        message = `${username} leave the game, you are now the leader of the game`
                        game.tranferOwnership()
                    }
                    else
                        this.games.destroyGame(game_name)
                }
                else {
                    game.removePlayer(username)
                    message = `${username} leave the game`
                }

                socket.to(game_name).emit('leave_game', { information: message })
                socket.leave(game_name)
                socket.player.leaveGame()
            })

            socket.on('disconnect', () => {
                const { username, game_name } = socket.player
                const game = this.games.getGame(game_name)
                if (game) {
                    const isLeader = game.isLeader(username)
                    let message = ''
    
                    if (isLeader) {
                        if (game.player2) {
                            message = `${username} leave the game, you are now the leader of the game`
                            game.tranferOwnership()
                        }
                        else
                            this.games.destroyGame(game_name)
                    }
                    else {
                        game.removePlayer(username)
                        message = `${username} leave the game`
                    }
    
                    socket.to(game_name).emit('leave_game', { information: message })
                    socket.leave(game_name)
                    socket.player.leaveGame()
                }
                this.players.removePlayer(username)
            })
        })
    }
}

exports.Sockets = Sockets
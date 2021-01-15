import io from 'socket.io-client'
import http from 'http'
import { Sockets } from '../../server/class/Sockets'
import { SOCKET } from '../../client/config/constants.json'
// import { Game } from '../../server/class/Game'
import faker from 'faker'
import { generateUserData } from './player.test'


let clientSocket
let notLoggedClientSocket
let socketsInstance : Sockets
let httpServer : http.Server;
let httpServerAddr

let correctGameParameters = {
    name: 'random_game_name',
    mode: 'classic',
    speed: 1.5,
    maxPlayers: 2
}

let alreadyLoggedUser = {
    username: 'Zeeratul',
    id: '123r2t9u953847t94hu3jk'
}

beforeAll((done) => {
    httpServer = http.createServer()
    httpServerAddr = httpServer.listen().address()
    socketsInstance = new Sockets(httpServer)
    socketsInstance.listenToEvents()

    // Create a user logged
    socketsInstance.users.push(alreadyLoggedUser)

    // Create a game 
    socketsInstance.games.createGame(correctGameParameters, alreadyLoggedUser)

    done()
})

afterAll((done) => {
    httpServer.close()
    httpServer = null
    socketsInstance = null
    clientSocket = null
    notLoggedClientSocket = null
    done()
})


describe('login', () => {
    beforeEach((done) => {
        clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            reconnectionDelay: 0,
            forceNew: true,
        })
        clientSocket.on('connect', () => {
            done()
        })
    })

    afterEach((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect()
        }
        // Wait a bit for the socket to be disconnected correctly
        setTimeout(() => {
            done()
        }, 200)
    })

    test('working', (done) => {
        const alreadyLoggedUser = generateUserData()
        clientSocket.emit(SOCKET.AUTH.LOGIN, alreadyLoggedUser.username, (error, data) => {
            expect(data.username).toBe(alreadyLoggedUser.username)
            done()
        })
    })

    test('invalid_username', (done) => {
        clientSocket.emit(SOCKET.AUTH.LOGIN, '', (error, data) => {
            expect(error).toBe(SOCKET.AUTH.ERROR.INVALID_USERNAME)
            done()
        })
    })

    test('username taken', (done) => {
        clientSocket.emit(SOCKET.AUTH.LOGIN, alreadyLoggedUser.username, (error, data) => {
            expect(error).toBe(SOCKET.AUTH.ERROR.USERNAME_TAKEN)
            done()
        })
    })
})

describe('connected routes', () => {
    beforeEach((done) => {
        clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            reconnectionDelay: 0,
            forceNew: true,
        })
        clientSocket.on('connect', () => {
            done()
        })
        clientSocket.emit(SOCKET.AUTH.LOGIN, alreadyLoggedUser.username, (error, data) => {
            done()
        })
    })

    afterEach((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect()
        }
        // Wait a bit for the socket to be disconnected correctly
        setTimeout(() => {
            done()
        }, 200)
    })

    test('createGame', (done) => {
        const gameParameters = {
            name: 'random_game_name',
        }
        clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
            expect(data).toBe(gameParameters.name)
            done()
        })
    })

    test('createGame solo', (done) => {
        const gameParameters = {
            isSolo: true
        }
        clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
            expect(data).toBeTruthy()
            done()
        })
    })

    // test('createGame', (done) => {
    //     const gameParameters = {
    //         name: 'random_game_name',
    //     }
    //     clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
    //         expect(data).toBe(gameParameters.name)
    //         done()
    //     })
    // })

})
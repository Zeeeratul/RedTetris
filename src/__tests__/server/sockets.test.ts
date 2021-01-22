import io from 'socket.io-client'
import http from 'http'
import { Sockets } from '../../server/class/Sockets'
import { SOCKET } from '../../client/config/constants.json'
import { generateUserData } from './player.test'

let clientSocket
let socketsInstance : Sockets
let httpServer : http.Server;
let httpServerAddr

beforeAll((done) => {
    httpServer = http.createServer()
    httpServerAddr = httpServer.listen().address()
    socketsInstance = new Sockets(httpServer)
    socketsInstance.listenToEvents()
    done()
})

afterAll((done) => {
    httpServer.close()
    httpServer = null
    socketsInstance = null
    clientSocket = null
    done()
})

describe('login route', () => {
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

    const user = generateUserData()

    test('working', (done) => {
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
            expect(data.username).toBe(user.username)
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
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
            done()
        })
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
            expect(error).toBe(SOCKET.AUTH.ERROR.USERNAME_TAKEN)
            done()
        })
    })
})

describe('createGame', () => {
    const user = generateUserData()
    const gameParameters = {
        name: 'random_game_name',
    }

    beforeEach((done) => {
        clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            reconnectionDelay: 0,
            forceNew: true,
        })
        clientSocket.on('connect', () => {
            done()
        })
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
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
        clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
            expect(data).toBe(gameParameters.name)
            done()
        })
    })

    test('createGame solo', (done) => {
        clientSocket.emit(SOCKET.GAMES.CREATE, {
            isSolo: true
        }, (error, data) => {
            expect(data).toBeTruthy()
            done()
        })
    })

    test('createGame invalid name', (done) => {
        clientSocket.emit(SOCKET.GAMES.CREATE, {
            name: null
        }, (error, data) => {
            expect(error).toBe(SOCKET.GAMES.ERROR.INVALID_NAME)
            done()
        })
    })

    test('createGame game name taken', (done) => {
        clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
            done()
        })
        clientSocket.emit(SOCKET.GAMES.CREATE, gameParameters, (error, data) => {
            expect(error).toBe(SOCKET.GAMES.ERROR.NAME_TAKEN)
            done()
        })
    })
})

describe('leaveGame', () => {
    const user = generateUserData()

    beforeEach((done) => {
        clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            reconnectionDelay: 0,
            forceNew: true,
        })
        clientSocket.on('connect', () => {
            done()
        })
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
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
        }, 100)
    })

    test('leaveGame', (done) => {
        clientSocket.emit(SOCKET.GAMES.LEAVE)
        setTimeout(() => {
            done()
        }, 100)
    })
})

describe('in Game actions', () => {
    const user = generateUserData()

    beforeEach((done) => {
        clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            reconnectionDelay: 0,
            forceNew: true,
        })
        clientSocket.on('connect', () => {
            done()
        })
        clientSocket.emit(SOCKET.AUTH.LOGIN, user.username, (error, data) => {
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
        }, 100)
    })

    test('send Message', (done) => {
        clientSocket.emit(SOCKET.GAMES.MESSAGES)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('send specturm', (done) => {
        clientSocket.emit(SOCKET.GAMES.SPECTRUM)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('send line penalty', (done) => {
        clientSocket.emit(SOCKET.GAMES.LINE)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('get_piece', (done) => {
        clientSocket.emit(SOCKET.GAMES.GET_PIECE)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('get_info', (done) => {
        clientSocket.emit(SOCKET.GAMES.GET_INFO)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('game_over', (done) => {
        clientSocket.emit(SOCKET.GAMES.GAME_OVER)
        setTimeout(() => {
            done()
        }, 100)
    })

    test('get_games', (done) => {
        const fn = jest.fn()
        clientSocket.emit(SOCKET.GAMES.GET_GAMES, null, fn)
        setTimeout(() => {
            expect(fn).toHaveBeenCalled()
            done()
        }, 100)
    })
})
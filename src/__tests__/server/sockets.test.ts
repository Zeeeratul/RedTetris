import io from 'socket.io-client'
import http from 'http'
import Sockets from '../../server/class/Sockets'
import { Game } from '../../server/class/Game'
import { SOCKET } from '../../client/config/constants.json'
import faker from 'faker'

let clientSocket
let clientSocketLogged
let httpServer
let httpServerAddr
let sockets : Sockets
let hardcoded_game_name = 'test_game'

beforeAll((done) => {
    httpServer = http.createServer()
    httpServerAddr = httpServer.listen().address()
    sockets = new Sockets(httpServer)
    sockets.listenToEvents()

    // creating a hardcoded user
    const users = {
        username: 'zeeratul',
        id: 'BoaOv68vTABR93xaAAAB'
    }

    sockets.users.push(users)
    // creating a hardcoded game
    sockets.games.createGame(hardcoded_game_name, users)
    
    done()
})

afterAll((done) => {
    httpServer.close()
    httpServer = null
    sockets = null
    done()
})

// describe('un_connected route', () => {
//     beforeEach((done) => {
//         clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
//             reconnectionDelay: 0,
//             forceNew: true,
//         })
//         clientSocket.on('connect', () => {
//             done()
//         })
//     })

//     afterEach((done) => {
//         if (clientSocket.connected) {
//             clientSocket.disconnect()
//         }
//         // wait a bit for the socket to be disconnected correctly
//         setTimeout(() => {
//             done()
//         }, 200)
//     })



//     test('login auth route', (done) => {
//         const usernameFaker = faker.internet.userName()
//         clientSocket.emit(SOCKET.AUTH.LOGIN, usernameFaker, ({ username, error }: any) => {
//             try {
//                 if (error) throw new Error(error)
//                 expect(username).toEqual(usernameFaker)
//                 done()
//             } 
//             catch (error) {
//                 done(error)
//             }
//         })
//     })

//     test('login auth route invalid_username', (done) => {
//         const username = ''
//         clientSocket.emit(SOCKET.AUTH.LOGIN, username, ({ error }: any) => {
//             expect(error).toEqual(SOCKET.AUTH.ERROR.INVALID_USERNAME)
//             done()
//         })
//     })

//     test('login auth route username_taken', (done) => {
//         clientSocket.emit(SOCKET.AUTH.LOGIN, 'zeeratul', ({ error }: any) => {
//             expect(error).toEqual(SOCKET.AUTH.ERROR.USERNAME_TAKEN)
//             done()
//         })
//     })

// })
  

// describe('connected route', () => {
    
//     beforeEach((done) => {
//         const usernameFaker = faker.internet.userName()
//         clientSocketLogged = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
//             reconnectionDelay: 0,
//             forceNew: true,
//         })

//         clientSocketLogged.on('connect', () => {
//             clientSocketLogged.emit(SOCKET.AUTH.LOGIN, usernameFaker, ({ error }: any) => {
//                 try {
//                     if (error) throw new Error(error)
//                     done()
//                 } 
//                 catch (error) {
//                     done(error)
//                 }
//             })
//         })
//     })

//     afterEach((done) => {
//         if (clientSocketLogged.connected) {
//             clientSocketLogged.disconnect()
//         }
//         // wait a bit for the socket to be disconnected correctly
//         setTimeout(() => {
//             done()
//         }, 200)
//     })

//     test('Game Create route', (done) => {
//         const gameName = faker.random.word()
    
//         clientSocketLogged.emit(SOCKET.GAMES.CREATE, gameName, ({ error, url }: any) => {
//             expect(sockets.games.games.length).toEqual(2)
//             done()
//         })
//     })

//     test('Game Join route', (done) => {

//         clientSocketLogged.emit(SOCKET.GAMES.JOIN, hardcoded_game_name, ({ error, url }: any) => {
//             expect(url).toBe(`#${hardcoded_game_name}`)
//             done()
//         })
//     })

//     test('Game Join route not_existing_game', (done) => {
//         const gameName = faker.random.word()
    
//         clientSocketLogged.emit(SOCKET.GAMES.JOIN, gameName, ({ error }) => {
//             expect(error).toBe(SOCKET.GAMES.ERROR.NOT_FOUND)
//             done()
//         })
//     })


//     test('Game check leader route, being leader', (done) => {
//         const gameName = faker.random.word()
    
//         clientSocketLogged.emit(SOCKET.GAMES.CREATE, gameName, ({ error, url }: any) => {
//             clientSocketLogged.emit(SOCKET.GAMES.CHECK_LEADER, gameName, ({ isLeader }) => {
//                 expect(isLeader).toBeTruthy()
//                 done()
//             })
//         })
//     })

//     test('Game check leader route, not being leader', (done) => {
//         clientSocketLogged.emit(SOCKET.GAMES.CHECK_LEADER, hardcoded_game_name, ({ isLeader }) => {
//             expect(isLeader).toBeFalsy()
//             done()
//         })
//     })

// })

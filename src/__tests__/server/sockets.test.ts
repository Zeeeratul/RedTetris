import io from 'socket.io-client'
import http from 'http'
import { SOCKET } from '../../client/config/constants.json'
import Sockets from '../../server/class/Sockets'
import faker from 'faker'

let clientSocket
let httpServer
let httpServerAddr
let sockets

// setup the server
beforeAll((done) => {
    httpServer = http.createServer()
    httpServerAddr = httpServer.listen().address()
    sockets = new Sockets(httpServer)
    sockets.listenToEvents()

    // creating a user
    sockets.users.push({
        username: 'zeeratul',
        id: 'BoaOv68vTABR93xaAAAB'
    })

    
    done()
})

// close the server
afterAll((done) => {
    httpServer.close()
    httpServer = null
    sockets = null
    done()
})

// // init the socket io client
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
    // wait a bit for the socket to be disconnected correctly
    setTimeout(() => {
        done()
    }, 200)
})
  

test('Login route working', (done) => {
    const usernameFaker = faker.internet.userName()
    clientSocket.emit(SOCKET.AUTH.LOGIN, usernameFaker, ({ username, error }: any) => {
        try {
            if (error) throw new Error(error)
            expect(username).toEqual(usernameFaker)
            done()
        } 
        catch (error) {
            done(error)
        }
    })
})


test('Login route username taken', (done) => {
    clientSocket.emit(SOCKET.AUTH.LOGIN, 'zeeratul', ({ error }: any) => {
        expect(error).toEqual(SOCKET.AUTH.ERROR.USERNAME_TAKEN)
        done()
    })
})

test('Game Create route', (done) => {
    const gameName = faker.random.word()

    clientSocket.emit(SOCKET.GAMES.CREATE, gameName, ({ error, url }: any) => {
        expect(url).toEqual(`#${gameName}`)
        done()
    })
})

// test('Login route', (done) => {
//     clientSocket.emit('login', 'zeeratul', ({ username }: any) => {
//         try {
//             expect(username).toBe('zeeratul')
//             done()
//         } 
//         catch (error) {
//             done(error)
//         }
//     })
// })

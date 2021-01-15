import { Games } from '../../server/class/Games'
import { Player } from '../../server/class/Player'
import { generateUserData } from './player.test'
import { SOCKET } from '../../client/config/constants.json'

let gamesInstance : Games
let correctGameParameters = {
    name: 'random_game_name',
    mode: 'classic',
    speed: 1.5,
    maxPlayers: 2
}
let userData1 : any

beforeEach(() => {
    /* 
        before each test
        creating a Games instance, and a Game instance
    */
   userData1 = generateUserData()
   gamesInstance = new Games()
   gamesInstance.createGame(correctGameParameters, userData1)
})

afterEach(() => {
    gamesInstance = null
    userData1 = null
})

describe('createGame', () => {
    test('working', () => {
        expect(gamesInstance.games.length).toBe(1)
    })

    test('invalid gameName', () => {
        expect(() => {
            gamesInstance.createGame({
                name: 'too_long_game_name____invalid',
            }, userData1)
        })
        .toThrow(SOCKET.GAMES.ERROR.INVALID_NAME)
    })

    test('gameName already taken', () => {
        expect(() => {
            gamesInstance.createGame({
                name: correctGameParameters.name,
            }, userData1)
        })
        .toThrow(SOCKET.GAMES.ERROR.NAME_TAKEN)
    })
})

describe('joinGame', () => {
    test('working', () => {
        const userData2 = generateUserData()
        const game = gamesInstance.joinGame(correctGameParameters.name, userData2)
        expect(game.players.length).toBe(2)
    })

    test('unknown game', () => {
        const userData2 = generateUserData()
        expect(() => {
            gamesInstance.joinGame('unknown_game_name', userData2)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })

    test('started game', () => {
        gamesInstance.games[0].status = 'started'
        const userData2 = generateUserData()
        expect(() => {
            gamesInstance.joinGame(correctGameParameters.name, userData2)
        })
        .toThrow(SOCKET.GAMES.ERROR.STARTED)
    })

    test('full game', () => {
        gamesInstance.games[0].maxPlayers = 1
        const userData2 = generateUserData()

        expect(() => {
            gamesInstance.joinGame(correctGameParameters.name, userData2)
        })
        .toThrow(SOCKET.GAMES.ERROR.FULL)
    })
})

describe('leaveGame', () => {
    test('1 player', () => {
        gamesInstance.leaveGame(correctGameParameters.name, userData1)
        expect(gamesInstance.games.length).toBe(0)
    })    

    test('multiple players', () => {
        const userData2 = generateUserData()
        gamesInstance.joinGame(correctGameParameters.name, userData2)

        const game = gamesInstance.leaveGame(correctGameParameters.name, userData1)
        expect(game.players.length).toBe(1)
    })

    test('unknown game', () => {
        expect(() => {
            gamesInstance.leaveGame('unknown_game_name', userData1)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })
})

describe('startGame', () => {
    test('working', () => {
        const game = gamesInstance.startGame(correctGameParameters.name, userData1)
        expect(game.status).toBe('started')
    })  

    test('unknown game', () => {
        expect(() => {
            gamesInstance.startGame('unknown_game_name', userData1)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })  

    test('player not leader', () => {
        const userData2 = generateUserData()
        gamesInstance.joinGame(correctGameParameters.name, userData2)

        expect(() => {
            gamesInstance.startGame(correctGameParameters.name, userData2)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_LEADER)
    })  
})

describe('getGamesList', () => {
    test('unstarted game', () => {
        const games = gamesInstance.getGamesList()
    
        expect(games.length).toBe(1)
    })
    
    test('started game', () => {
        gamesInstance.games[0].status = 'started'
        const games = gamesInstance.getGamesList()
    
        expect(games.length).toBe(0)
    })
})
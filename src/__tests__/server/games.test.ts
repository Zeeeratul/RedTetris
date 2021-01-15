import { Games } from '../../server/class/Games'
import { Player } from '../../server/class/Player'
import { generateUserData } from './player.test'
import { SOCKET } from '../../client/config/constants.json'

let gamesInstance : Games
let player: Player
let correctGameParameters = {
    name: 'random_game_name',
    mode: 'classic',
    speed: 1.5,
    maxPlayers: 2
}
let playerData : any

beforeEach(() => {
    /* 
        before each test
        creating a Games instance, and a Game instance
    */
   playerData = generateUserData()
   player = new Player(playerData.username, playerData.id)

   gamesInstance = new Games()
   gamesInstance.createGame(correctGameParameters, player)
})

afterEach(() => {
    gamesInstance = null
    player = null
    playerData = null
})

describe('createGame', () => {
    test('working', () => {
        expect(gamesInstance.games.length).toBe(1)
    })

    test('invalid gameName', () => {
        expect(() => {
            gamesInstance.createGame({
                name: 'too_long_game_name_so_its_invalid',
            }, player)
        })
        .toThrow(SOCKET.GAMES.ERROR.INVALID_NAME)
    })

    test('gameName already taken', () => {
        expect(() => {
            gamesInstance.createGame({
                name: correctGameParameters.name,
            }, player)
        })
        .toThrow(SOCKET.GAMES.ERROR.NAME_TAKEN)
    })
})

describe('joinGame', () => {
    test('working', () => {
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)
        const game = gamesInstance.joinGame(correctGameParameters.name, player2)
        expect(game.players.length).toBe(2)
    })

    test('unknown game', () => {
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)

        expect(() => {
            gamesInstance.joinGame('unknown_game_name', player2)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })

    test('started game', () => {
        gamesInstance.games[0].status = 'started'
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)

        expect(() => {
            gamesInstance.joinGame(correctGameParameters.name, player2)
        })
        .toThrow(SOCKET.GAMES.ERROR.STARTED)
    })

    test('full game', () => {
        gamesInstance.games[0].maxPlayers = 1
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)

        expect(() => {
            gamesInstance.joinGame(correctGameParameters.name, player2)
        })
        .toThrow(SOCKET.GAMES.ERROR.FULL)
    })
})

describe('leaveGame', () => {
    test('1 player', () => {
        gamesInstance.leaveGame(correctGameParameters.name, player)
        expect(gamesInstance.games.length).toBe(0)
    })    

    test('multiple players', () => {
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)

        gamesInstance.games[0].addPlayer(player2)
        const game = gamesInstance.leaveGame(correctGameParameters.name, player)
        expect(game.players.length).toBe(1)
    })

    test('unknown game', () => {
        expect(() => {
            gamesInstance.leaveGame('unknown_game_name', player)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })
})

describe('startGame', () => {
    test('working', () => {
        const game = gamesInstance.startGame(correctGameParameters.name, player)
        expect(game.status).toBe('started')
    })  

    test('unknown game', () => {
        expect(() => {
            gamesInstance.startGame('unknown_game_name', player)
        })
        .toThrow(SOCKET.GAMES.ERROR.NOT_FOUND)
    })  

    test('player not leader', () => {
        const playerData2 = generateUserData()
        const player2 = new Player(playerData2.username, playerData2.id)
        gamesInstance.joinGame(correctGameParameters.name, player2)

        expect(() => {
            gamesInstance.startGame(correctGameParameters.name, player2)
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
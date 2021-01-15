import { Game } from '../../server/class/Game'
import { Player } from '../../server/class/Player'
import { Piece } from '../../server/class/Piece'
import { generateUserData } from './player.test'
import { SOCKET } from '../../client/config/constants.json'

let game : Game
let correctGameParameters : any
let player1 : Player
let player2 : Player

beforeEach(() => {
    /* 
        Before each test
        Creating a game instance, and two player instances
    */
    const player1Data = generateUserData()
    const player2Data = generateUserData()
    player1 = new Player(player1Data.username, player1Data.id)
    player2 = new Player(player2Data.username, player2Data.id)
    
    correctGameParameters = {
        name: 'random_game_name',
        mode: 'classic',
        speed: 1.5,
        maxPlayers: 2
    }

    // Game is only create with one player 
    game = new Game(correctGameParameters, player1)
})

afterEach(() => {
    player1 = null
    player2 = null
    correctGameParameters = null
    game = null
})

test('constructor correct parameters', () => {
    expect(game.name).toEqual(correctGameParameters.name)
})

test('constructor bad parameters', () => {
    const badGameParameters = {
        name: 'random_game_name',
        mode: 'not_existing_mode',
        speed: 100,
        maxPlayers: 12000
    }

    const game = new Game(badGameParameters, player1)

    expect({
        mode: game.mode,
        speed: game.speed,
        maxPlayers: game.maxPlayers,
    })
    .toStrictEqual({
        mode: 'classic',
        speed: 1.5,
        maxPlayers: 2,
    })
})

test('addPlayer', () => {
    game.addPlayer(player2)

    expect(game.players.length).toBe(2)
})

test('removePlayer', () => {
    game.addPlayer(player2)
    game.removePlayer(player2.id)

    expect(game.players.length).toBe(1)
})

test('transferLeadership', () => {
    game.addPlayer(player2)
    game.removePlayer(player1.id)
    game.transferLeadership()

    expect(game.leaderId).toBe(player2.id)
})

test('isLeader', () => {
    expect(game.isLeader(player1.id)).toBeTruthy()
})

test('getPlayer', () => {
    const player = game.getPlayer(player1.id)
    expect(player).toStrictEqual(player1)
})

describe('givePiece', () => {
    test('with player', () => {
        const piece = game.givePiece(player1.id)
        expect(piece).toBeInstanceOf(Piece)
    })

    test('without player', () => {
        expect(() => {
            game.givePiece('unknown_id')
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND)
    })
    
    test('player being KO', () => {
        player1.status = 'KO'
        expect(() => {
            game.givePiece(player1.id)
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_KO)
    })
})

describe('updateScore', () => {
    test('with player', () => {
        game.updateScore(1, player1.id)
        expect(player1.score).toBe(10)
    })

    test('without player', () => {
        expect(() => {
            game.updateScore(1, 'unknown_id')
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND)
    })
        
    test('player being KO', () => {
        player1.status = 'KO'
        expect(() => {
            game.updateScore(1, player1.id)
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_KO)
    })
})

describe('updateSpectrum', () => {
    const spectrum = Array(10).fill(19)

    test('with player', () => {
        game.updateSpectrum(spectrum, player1.id)
        expect(player1.spectrum.length).toBe(10)
    })

    test('without player', () => {
        expect(() => {
            game.updateSpectrum(spectrum, 'unknown_id')
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND)
    })

    test('player being KO', () => {
        player1.status = 'KO'
        expect(() => {
            game.updateSpectrum(spectrum, player1.id)
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_KO)
    })
})

describe('setPlayerKo', () => {
    test('with player', () => {
        game.setPlayerKo(player1.id)
        expect(player1.status).toBe('KO')
    })

    test('without player', () => {
        expect(() => {
            game.setPlayerKo('unknown_id')
        })
        .toThrow(SOCKET.GAMES.ERROR.PLAYER_NOT_FOUND)
    })
})

describe('isGameOver', () => {
    test('not started game', () => {
        const isGameOver = game.isGameOver()
        expect(isGameOver).toBeFalsy()
    })

    test('started solo game and player still playing', () => {
        game.status = 'started'
        const isGameOver = game.isGameOver()
        expect(isGameOver).toBeFalsy()
    })

    test('started solo game and player being KO', () => {
        game.status = 'started'
        game.setPlayerKo(player1.id)
        const isGameOver = game.isGameOver()
        expect(isGameOver).toBeTruthy()
    })

    test('started multiplayer game and one player still playing', () => {
        game.addPlayer(player2)
        game.status = 'started'
        game.setPlayerKo(player1.id)
        const isGameOver = game.isGameOver()
        expect(isGameOver).toBeTruthy()
    })
})

test('reset', () => {
    game.status = 'started'
    game.reset()

    expect(game.status).toBe('idle')
})
import Games from '../../server/class/Games'
import { Player } from '../../server/class/Player'
import { Piece } from '../../server/class/Piece'
import { generateUserData } from './player.test'
import faker from 'faker'
import { SOCKET } from '../../client/config/constants.json'

let games : Games
let game_name : string
let playerData : any

beforeEach(() => {
    /* 
        before each test
        creating a Games instance, and a Game instance
    */
   playerData = generateUserData()

   game_name = faker.random.word()
   games = new Games()
   games.createGame(game_name, new Player(playerData.username, playerData.id))
})

afterEach(() => {
    games = null
    game_name = null
    playerData = null
})

describe('createGame()', () => {
    test('working', () => {
        expect(games.games.length).toBe(1)
    })
    
    test('gameName taken', () => {
        const playerData = generateUserData()
        // still one game because this game doesn't exist
        const { error } = games.createGame(game_name, playerData)
        expect(error).toEqual(SOCKET.GAMES.ERROR.NAME_TAKEN)
    })
    
    test('invalid name', () => {
        const newPlayerData = generateUserData()
        const { error } = games.createGame('', new Player(newPlayerData.username, newPlayerData.id))
        expect(error).toBe(SOCKET.GAMES.ERROR.INVALID_NAME)
    })
})


describe('destroyGame()', () => {
    test('working', () => {
        games.destroyGame(game_name)
        expect(games.games.length).toBe(0)
    })

    test('unexisting game', () => {
        const non_existing_game_name = faker.random.word()
    
        // still one game because this game doesn't exist
        games.destroyGame(non_existing_game_name)
        expect(games.games.length).toBe(1)
    })
})



describe('joinGame()', () => {
    test('add player and send the url of the game', () => {
        const secondPlayerData = generateUserData()
    
        const { url } = games.joinGame(game_name, secondPlayerData)
        expect(url).toBe(`#${game_name}`)
    })
    
    test('game not found', () => {
        const secondPlayerData = generateUserData()
    
        const { url, error } = games.joinGame('not_existing_game_name', secondPlayerData)
        expect(url).toBeUndefined()
        expect(error).toEqual(SOCKET.GAMES.ERROR.NOT_FOUND)
    })

    test('game full', () => {
        const secondPlayerData = generateUserData()
        const thirdPlayerData = generateUserData()

        // can join because less than 2 player
        games.joinGame(game_name, secondPlayerData)
        // can't because there are 2 players
        const { url, error } = games.joinGame(game_name, thirdPlayerData)
        
        expect(url).toBeUndefined()
        expect(error).toEqual(SOCKET.GAMES.ERROR.FULL)
    })
})

describe('leaveGame()', () => {
    test('leaveGame() leader player leaving', () => {
        const { error } = games.leaveGame(game_name, playerData)
        
        expect(error).toBeUndefined()
    })
    
    test('leaveGame() other player leaving', () => {
        const secondPlayerData = generateUserData()
        games.joinGame(game_name, secondPlayerData)
        const { error } = games.leaveGame(game_name, secondPlayerData)
        
        expect(error).toBeUndefined()
    })
    
    test('leaveGame()  game not found', () => {
        const { error } = games.leaveGame('not_existing_game_name', playerData)
        expect(error).toBe(SOCKET.GAMES.ERROR.NOT_FOUND)
    })
    
})




describe('startGame()', () => {
    test('working', () => {
        const { payload } = games.startGame(game_name, playerData)
        expect(payload.currentPiece).toBeInstanceOf(Piece)
    })
    
    test('not existing game', () => {
        const { error } = games.startGame('not_existing_game_name', playerData)
        expect(error).toEqual(SOCKET.GAMES.ERROR.NOT_FOUND)
    })
    
    test('not being leader', () => {
        const playerNotInTheGame = generateUserData()
        const { error } = games.startGame(game_name, playerNotInTheGame)
        expect(error).toEqual(SOCKET.GAMES.ERROR.NOT_LEADER)
    })
})

describe('endGame()', () => {
    test('working', () => {
        const { payload } = games.endGame(game_name, playerData)
        expect(payload).toBeTruthy()
    })
    
    test('not existing game', () => {
        const { error } = games.endGame('not_existing_game_name', playerData)
        expect(error).toEqual(SOCKET.GAMES.ERROR.NOT_FOUND)
    })
})

describe('getGame() and getUnstartGamesList()', () => {
    test('send game_name and players number', () => {
        const game = games.getGame(game_name)
        expect(game.name).toBe(game_name)

        const non_existing_game_name = faker.random.word()
        const non_existing_game = games.getGame(non_existing_game_name)
        expect(non_existing_game).toBeNull()

    })

    test('send all games with a status idle', () => {
        
        const game = games.getGame(game_name)
        let gamesList = games.getGamesList()
        expect(gamesList.length).toBe(1)

        game.changeStatus('started')
        gamesList = games.getGamesList()
        expect(gamesList.length).toBe(0)
    })  
})


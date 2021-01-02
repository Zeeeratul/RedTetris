import { Game } from '../../server/class/Game'
import { Player } from '../../server/class/Player'
import { generateUserData } from './player.test'
import faker from 'faker'

let game : Game
let game_name : string
let leader_player : Player
let second_player : Player

beforeEach(() => {
    /* 
        before each test
        creating a game instance, and two player instances
    */
    const playerData = generateUserData()
    const secondPlayerData = generateUserData()
    leader_player = new Player(playerData.username, playerData.id)
    second_player = new Player(secondPlayerData.username, secondPlayerData.id)
    
    game_name = faker.random.word()
    // Game is only create with one player 
    // if needed you have to add the second player in the test
    game = new Game(game_name, leader_player)
})

afterEach(() => {
    leader_player = null
    second_player = null
    game_name = null
    game = null
})

test('Game Class, init', () => {
    expect(game.name).toEqual(game_name)
})

test('Game Class, isLeader()', () => {
    game.addPlayer(second_player)

    const checkLeader1 = game.isLeader(leader_player.id)
    expect(checkLeader1).toEqual(true)

    const checkLeader2 = game.isLeader(second_player.id)
    expect(checkLeader2).toEqual(false)
})

test('Game Class, add a second player and remove him', () => {
    game.addPlayer(second_player)
    expect(game.players.length).toEqual(2)

    game.removePlayer(second_player.id)
    expect(game.players.length).toEqual(1)
})

test('Game Class, ownership tranfer', () => {
    game.addPlayer(second_player)
    game.removePlayer(leader_player.id)
    game.transferLeadership()

    expect(game.leaderId).toBe(second_player.id)
})

test('Game Class, getPlayer()', () => {
    const player = game.getPlayer(leader_player.id)
    expect(player).toEqual(leader_player)
    
    // this user is not in the game -> should be null
    const player2 = game.getPlayer(second_player.id)
    expect(player2).toBeNull()
})

test('Game Class, givePiece()', () => {
    game.addPlayer(second_player)

    const piece_leader_player = game.givePiece(leader_player.id)
    const piece_second_player = game.givePiece(second_player.id)
    expect(piece_leader_player).toHaveProperty('type')
    expect(piece_second_player).toHaveProperty('type')

    // should be the same piece
    expect(piece_leader_player.type).toEqual(piece_second_player.type)
})

test('Game Class, givePiece() wrong user', () => {
    const noPiece = game.givePiece('bad_username')
    expect(noPiece).toBeNull()

})

test('Game Class, info()', () => {
    const info = game.info()
    expect(info).toEqual({
        name: game_name,
        players: 1
    })
})

test('Game Class, status()', () => {
    const status = 'started'
    game.changeStatus(status)
    expect(game.status).toEqual(status)
})
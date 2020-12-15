import { Player } from '../../server/class/Player'
import faker from 'faker'

export const generateUserData = () => {
    return {
        username: faker.internet.userName(),
        id: faker.random.uuid()
    }
}

test('Player Class, init', () => {
    const playerData = generateUserData()
    const player = new Player(playerData.username, playerData.id)

    expect(player).toMatchObject(playerData)
})

test('Player Class, incrementPieceIndex() function', () => {
    const playerData = generateUserData()
    const player = new Player(playerData.username, playerData.id)

    expect(player.currentPieceIndex).toEqual(0)
    player.incrementCurrentPieceIndex()
    expect(player.currentPieceIndex).toEqual(1)
})
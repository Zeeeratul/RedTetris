import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameInfo from '../../../client/components/idleGame/GameInfo'
import faker from 'faker'

const GameInfoProps = {
    gameName: 'test_game',
    speed: 1.5,
    mode: 'classic',
    players: [
        {
            currentPieceIndex: 0,
            id: faker.random.uuid(),
            position: 1,
            score: 0,
            spectrum: Array(10).fill(0),
            status: 'playing',
            username: faker.internet.userName()  
        }
    ],
    maxPlayers: 2,
    isLeader: true,
    startGame: () => console.log()
}

test('GameInfo renders without crashing', () => {
  render(<GameInfo {...GameInfoProps} />)
})


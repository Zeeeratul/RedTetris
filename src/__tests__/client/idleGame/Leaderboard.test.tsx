import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Leaderboard from '../../../client/components/idleGame/Leaderboard'
import faker from 'faker'

const LeaderboardProps = [
    {
        id: faker.random.uuid(),
        username: faker.internet.userName(),
        position: 1,
        score: 200
    },
    {
        id: faker.random.uuid(),
        username: faker.internet.userName(),
        position: 2,
        score: 100
    }
]

test('Leaderboard renders without crashing', () => {
  render(<Leaderboard results={LeaderboardProps} />)
})


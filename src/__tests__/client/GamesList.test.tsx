import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GamesList from '../../client/pages/GamesList'
import ThemesProvider from '../../client/utils/ThemesProvider'

const games = [
  {
    name: "testGame",
    players: [2, 2],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1.5,
    status: 'idle',
    leaderId: 'randomId',
  },
  {
    name: "testInvisible",
    players: [2, 2],
    maxPlayers: 2,
    mode: 'invisible',
    speed: 2,
    status: 'idle',
    leaderId: 'randomId2',
  },
  {
    name: "testMarathon",
    players: [2, 2],
    maxPlayers: 2,
    mode: 'marathon',
    speed: 1,
    status: 'idle',
    leaderId: 'randomId3',
  }
]

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: jest.fn(),
      replace: jest.fn()
    })
  }
})

jest.mock('../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: (event, data, cb) => {
      if (event === 'get_games')
        return cb(null, games)
      else if (event === "join_game")
        return cb(null, data)
    }
  }
})

test('GamesList page renders without crashing', () => {
  render(
    <ThemesProvider>
      <GamesList />
    </ThemesProvider>
  )

  const tableRow = screen.getByText(games[0].name)
  expect(tableRow).toBeTruthy()

})

test('GamesList join game', async () => {
  render(
    <ThemesProvider>
      <GamesList />
    </ThemesProvider>
  )
  const tableRow = screen.getByText(games[0].name)
  userEvent.click(tableRow)
  expect(tableRow).toBeTruthy()
})

test('GamesList open Game', async () => {
  render(
    <ThemesProvider>
      <GamesList />
    </ThemesProvider>
  )
  const buttonCreateGame = screen.getByRole('button', { name: /multiplayer/i })
  const buttonCreateGameSolo = screen.getByRole('button', { name: /solo/i })
  userEvent.click(buttonCreateGame)
  userEvent.click(buttonCreateGameSolo)
})
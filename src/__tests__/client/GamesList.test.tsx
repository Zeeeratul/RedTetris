import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GamesList from '../../client/pages/GamesList'
import ThemesProvider from '../../client/utils/ThemesProvider'
import { BrowserRouter as Router } from 'react-router-dom'

const games = [
  {
    name: "testGame",
    players: [2, 2],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1.5,
    status: 'idle',
    leaderId: 'randomId',
  }
]

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

  const tableRow = screen.getByRole('cell', {name: games[0].name})
  expect(tableRow).toBeTruthy()

})

test('GamesList join game', async () => {
  render(
    <Router>
      <ThemesProvider>
        <GamesList />
      </ThemesProvider>
    </Router>
  )
  const tableRow = screen.getByRole('cell', {name: games[0].name})
  userEvent.click(tableRow)
  expect(tableRow).toBeTruthy()
})
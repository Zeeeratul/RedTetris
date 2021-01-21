import React from 'react'
import Game from '../../client/pages/Game'
import ThemesProvider from '../../client/utils/ThemesProvider'
import { render, screen } from '@testing-library/react'

jest.mock('../../client/middlewares/socket', () => {
  return {
    subscribeToEvent: (event, cb) => {
      if (event === 'get_game_info')
        return cb(null, {
          leaderId: 'random_id',
          maxPlayers: 2,
          status: 'idle',
          speed: 1,
          mode: 'classic',
          name: 'testGame',
          players: [],
        })
    },
    emitToEvent: () => console.log('emitToEvent'),
    cancelSubscribtionToEvent: () => console.log('cancelSubscribtionToEvent')
  }
})

test('Game page renders without crashing', () => {
  render(    
    <ThemesProvider>
      <Game />
    </ThemesProvider>
  )

  const gameName = screen.getByText('testGame')
  expect(gameName).toBeTruthy()
})

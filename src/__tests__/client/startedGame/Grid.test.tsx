import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Grid from '../../../client/components/startedGame/Grid'
import ThemesProvider from '../../../client/utils/ThemesProvider'
import * as mockSocketIo from '../../../client/middlewares/socket'

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
]

const piece = {
  "structure": [
      ["", "", "", ""],
      ["#", "#", "#", "#"],
      ["", "", "", ""],
      ["", "", "", ""]
  ],
  "type": "I",
  "leftTopPosition": {
      "x": 3,
      "y": 0
  },
  "positions": [
      {
          "x": 3,
          "y": 1
      },
      {
          "x": 4,
          "y": 1
      },
      {
          "x": 5,
          "y": 1
      },
      {
          "x": 6,
          "y": 1
      }
  ]
}

jest.mock('../../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: () => (event, data, cb) => {
      console.log('called')
      if (event === 'get_games')
        return cb(null, games)
      else if (event === "get_piece")
        return cb(null, piece)
      else if (event === "join_game")
        return cb(null, data)
    },
    subscribeToEvent: jest.fn(),
    emitToEvent: jest.fn(),
    cancelSubscribtionToEvent: jest.fn()
  }
})

test('Grid renders without crashing', () => {
  render(
    <ThemesProvider>
      <Grid speed={1.5} mode="classic" />
    </ThemesProvider>
  )

  setTimeout(() => {
    expect(mockSocketIo.subscribeToEvent).toHaveBeenCalledTimes(1)
  }, 100)
})

test('Grid move piece', () => {
  const { baseElement } = render(
    <ThemesProvider>
      <Grid speed={1.5} mode="classic" />
    </ThemesProvider>
  )

  fireEvent.keyUp(baseElement, { key: 'ArrowUp', code: 'ArrowUp' })
  fireEvent.keyUp(baseElement, { key: 'ArrowDown', code: 'ArrowDown' })
  fireEvent.keyUp(baseElement, { key: 'ArrowLeft', code: 'ArrowLeft' })
})
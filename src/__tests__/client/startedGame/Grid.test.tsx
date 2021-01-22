import React from 'react'
import { render } from '@testing-library/react'
import Grid from '../../../client/components/startedGame/Grid'
import ThemesProvider from '../../../client/utils/ThemesProvider'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import Piece from '../../../server/class/Piece'

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

jest.mock('../../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: (event, data, cb) => {
      if (event === 'get_games')
        return cb(null, games)
      else if (event === "get_piece")
        return cb(null, {
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
      },)
      else if (event === "join_game")
        return cb(null, data)
    },
    subscribeToEvent: () => {
      console.log('subscribeToEvent')
    },
    emitToEvent: () => {
      console.log('emitToEvent')
    },
    cancelSubscribtionToEvent: () => {
      console.log('cancelSubscribtionToEvent')
    }
  }
})


test('Grid renders without crashing', () => {
  render(
      <ThemesProvider>
          <Grid speed={1.5} mode="classic" />
      </ThemesProvider>
    )
})

// test('Test ', () => {
//   render(
//       <ThemesProvider>
//           <Grid speed={1.5} mode="classic" />
//       </ThemesProvider>
//     )
// })


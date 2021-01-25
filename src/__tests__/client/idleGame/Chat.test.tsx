import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import Chat from '../../../client/components/idleGame/Chat'
import ThemesProvider from '../../../client/utils/ThemesProvider'
import * as mockSocketIo from '../../../client/middlewares/socket'

const message = {
    sender: {
      username: 'random_user',
      id: 'random_id'
    },
    content: 'Hi guys !',
    id: 'random_id_message'
  }

jest.mock('../../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: jest.fn(() => (event, data, cb) => {

    }),
    subscribeToEvent: (event, cb) => {
      return cb(null, message)
    },
    emitToEvent: jest.fn(),
    cancelSubscribtionToEvent: jest.fn()
  }
})

test('Chat renders without crashing', () => {
  render(
    <ThemesProvider>
      <Chat />
    </ThemesProvider>
  )
  
  const messageInput = screen.getByRole('textbox')
  const messageButton = screen.getByRole('button')
  userEvent.type(messageInput, 'Hi from the chat !')
  userEvent.click(messageButton)

  expect(mockSocketIo.emitToEvent).toHaveBeenCalledTimes(1)
})

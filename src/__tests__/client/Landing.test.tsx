import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Landing from '../../client/pages/Landing'
import faker from 'faker'
import { SOCKET } from '../../client/config/constants.json'
import * as socketMock from '../../client/middlewares/socket'

jest.mock('../../client/middlewares/socket')

test('filling input', () => {
  const setUser = jest.fn()
  const username = faker.internet.userName()

  render(<Landing setUser={setUser} />)
  
  const input = screen.getByLabelText(/what's your username ?/i)
  userEvent.type(input, username)
  fireEvent.submit(input)
  expect(socketMock.emitToEventWithAcknowledgement).toHaveBeenCalled()
})

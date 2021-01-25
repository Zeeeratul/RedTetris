import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import Landing from '../../client/pages/Landing'

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: (path) => {
        console.log(path)
      }
    })
  }
})

jest.mock('../../client/middlewares/socket', () => {
  return {
    initiateSocket: jest.fn(),
    emitToEventWithAcknowledgement: (event, data, cb) => {
      if (event === 'login')
        return cb(null, {
          username: data,
          id: 'random_id'
        })
    },
  }
})

test('filling input', () => {
  const setUser = jest.fn()
  const username = "Zeeratul"

  render(<Landing setUser={setUser} />)
  
  const input = screen.getByLabelText(/what's your username ?/i)
  userEvent.type(input, username)
  fireEvent.submit(input)

  setTimeout(() => {
    expect(setUser).toHaveBeenCalledWith({
      username,
      id: 'random_id'
    })
  }, 100)
})
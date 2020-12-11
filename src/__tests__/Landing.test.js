import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Landing from '../client/pages/Landing'

it('Landing page renders without crashing', () => {
  render(<Landing />)
})

it('Input correctly filled', () => {
  
  render(<Landing />)
  const username = "Zeeeratul"
  
  const usernameInput = screen.getByRole('textbox')

  userEvent.type(usernameInput, username)
  expect(usernameInput.value).toBe(username)

})

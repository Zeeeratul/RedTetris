import React from 'react'
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Landing from '../client/pages/Landing'

it('Landing page renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Landing />, div)
})


it('Input correctly filled', () => {
  
  render(<Landing />)
  const username = "Zeeeratul"
  const usernameInput = screen.getByLabelText(/What's your nickname ?/i)

  userEvent.type(usernameInput, username)
  expect(usernameInput.value).toBe(username)

})

it('OnClick clear username input', () => {
  
  render(<Landing />)
  const submitButton = screen.getByRole('button', { name: /submit/i })
  const usernameInput = screen.getByLabelText(/What's your nickname ?/i)

  userEvent.click(submitButton)
  expect(usernameInput.value).toBe('')
})
import React from 'react'
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../../client/components/landing/LoginForm'
import { SOCKET } from '../../client/config/constants.json'

test('LoginForm page renders without crashing', () => {
    const onSubmit = jest.fn()
    render(<LoginForm onSubmit={onSubmit} />)
})

test('submitting the form calls onSubmit with username', () => {
    const onSubmit = jest.fn()
    const username = 'Zeeratul'
    render(<LoginForm onSubmit={onSubmit} />)

    const input = screen.getByLabelText(/what's your username ?/i)
    userEvent.type(input, username)
    fireEvent.submit(input)

    expect(onSubmit).toBeCalledWith(username)
})


test('error props get print', () => {
    const onSubmit = jest.fn()
    render(<LoginForm onSubmit={onSubmit} error={SOCKET.AUTH.ERROR.INVALID_USERNAME} />)

    const errorMessage = screen.getByTestId('error-text')

    expect(errorMessage).toBeInTheDocument()



})


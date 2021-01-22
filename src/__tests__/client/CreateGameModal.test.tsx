import React from 'react'
import { render, screen } from '@testing-library/react'
import CreateGameModal from '../../client/components/gamesList/CreateGameModal'
import ThemesProvider from '../../client/utils/ThemesProvider'
import userEvent from '@testing-library/user-event'
import * as socketMock from '../../client/middlewares/socket'

const CreateGameModalProps = {
    isOpen: true,
    isMultiplayer: true,
    close: null
}

jest.mock('../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: jest.fn()
  }
})

test('CreateGameModal page renders without crashing', () => {
  render(    
    <ThemesProvider>
        <CreateGameModal {...CreateGameModalProps} />
    </ThemesProvider>
  )

  const input = screen.getByTestId('gamename')
  const button = screen.getByRole('button', { name: /create/i })

  userEvent.type(input, 'randomGameName')
  userEvent.click(button)
  expect(socketMock.emitToEventWithAcknowledgement).toBeTruthy()
})

const CreateGameModalPropsHidden = {
    isOpen: false,
    isMultiplayer: false,
    close: null
}

test('CreateGameModalPropsHidden page renders without crashing', () => {

  render(    
    <ThemesProvider>
        <CreateGameModal {...CreateGameModalPropsHidden} />
    </ThemesProvider>
  )

  
})


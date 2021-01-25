import React from 'react'
import { render, screen } from '@testing-library/react'
import CreateGameModal from '../../client/components/gamesList/CreateGameModal'
import ThemesProvider from '../../client/utils/ThemesProvider'
import userEvent from '@testing-library/user-event'

const CreateGameModalProps = {
  isOpen: true,
  isMultiplayer: true,
  close: jest.fn()
}

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: (path) => {
        console.log('redirect to: ', path)
      }
    })
  }
})

jest.mock('../../client/middlewares/socket', () => {
  return {
    emitToEventWithAcknowledgement: (event, data, cb) => {
      if (event === 'create_game')
        return cb(null, data.name)
    }
  }
})

test('CreateGameModal page renders without crashing', () => {
  render(    
    <ThemesProvider>
        <CreateGameModal {...CreateGameModalProps} />
    </ThemesProvider>
  )

  const input = screen.getByRole('textbox')
  const button = screen.getByRole('button', { name: /create/i })

  userEvent.type(input, 'randomGameName')
  userEvent.click(button)

  expect(CreateGameModalProps.close).toHaveBeenCalled()
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
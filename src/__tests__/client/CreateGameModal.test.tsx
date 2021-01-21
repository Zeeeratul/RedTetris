import React from 'react'
import { render, screen } from '@testing-library/react'
import CreateGameModal from '../../client/components/gamesList/CreateGameModal'
import ThemesProvider from '../../client/utils/ThemesProvider'

const CreateGameModalProps = {
    isOpen: true,
    isMultiplayer: true,
    close: null
}

test('CreateGameModal page renders without crashing', () => {
  render(    
    <ThemesProvider>
        <CreateGameModal {...CreateGameModalProps} />
    </ThemesProvider>
  )
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


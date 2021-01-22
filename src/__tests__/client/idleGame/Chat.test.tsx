import React from 'react'
import { render } from '@testing-library/react'
import Chat from '../../../client/components/idleGame/Chat'
import ThemesProvider from '../../../client/utils/ThemesProvider'

test('Chat renders without crashing', () => {
  render(
    <ThemesProvider>
        <Chat />
    </ThemesProvider>
)   
})

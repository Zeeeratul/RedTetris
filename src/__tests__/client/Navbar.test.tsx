import React from 'react'
import { render } from '@testing-library/react'
import { Navbar } from '../../client/components/Navbar'
import ThemesProvider from '../../client/utils/ThemesProvider'

test('Navbar renders without crashing user not connected', () => {
  render(
      <ThemesProvider>
          <Navbar userConnected={false} userInGame={false}  />
      </ThemesProvider>
    )
})

test('Navbar renders without crashing user in game', () => {
  render(
      <ThemesProvider>
          <Navbar userConnected={true} userInGame={true}  />
      </ThemesProvider>
    )
})

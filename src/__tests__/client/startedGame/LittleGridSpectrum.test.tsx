import React from 'react'
import { render } from '@testing-library/react'
import LittleGridSpectrum from '../../../client/components/startedGame/LittleGridSpectrum'
import ThemesProvider from '../../../client/utils/ThemesProvider'
import faker from 'faker'

const LittleGridSpectrumProps = {
    gridPosition: 1,
    player: {
        spectrum: Array(10).fill(19),
        status: 'playing',
        id: faker.random.uuid()
    }
}

test('LittleGridSpectrum renders without crashing', () => {
  render(
      <ThemesProvider>
          <LittleGridSpectrum {...LittleGridSpectrumProps} />
      </ThemesProvider>
    )
})

const LittleGridSpectrumPropsKo = {
    gridPosition: 1,
    player: {
        spectrum: Array(10).fill(19),
        status: 'KO',
        id: faker.random.uuid()
    }
}

test('LittleGridSpectrum renders without crashing KO player', () => {
  render(
      <ThemesProvider>
          <LittleGridSpectrum {...LittleGridSpectrumPropsKo} />
      </ThemesProvider>
    )
})


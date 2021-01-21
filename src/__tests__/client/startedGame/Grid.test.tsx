import React from 'react'
import { render } from '@testing-library/react'
import Grid from '../../../client/components/startedGame/Grid'
import ThemesProvider from '../../../client/utils/ThemesProvider'

test('Grid renders without crashing', () => {
  render(
      <ThemesProvider>
          <Grid speed={1.5} mode="classic" />
      </ThemesProvider>
    )
})

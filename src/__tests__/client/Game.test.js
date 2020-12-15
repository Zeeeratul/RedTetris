import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Game from '../../client/pages/Game'

it('Game page renders without crashing', () => {
  render(<Game />)
})


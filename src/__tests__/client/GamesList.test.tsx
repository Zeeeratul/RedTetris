import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GamesList from '../../client/pages/GamesList'

test('GamesList page renders without crashing', () => {
  render(<GamesList />)
})
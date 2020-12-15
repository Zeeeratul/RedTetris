import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Landing from '../../client/pages/Landing'
import { Server } from 'mock-socket'


test('Landing page renders without crashing', () => {
  render(<Landing/>)
})
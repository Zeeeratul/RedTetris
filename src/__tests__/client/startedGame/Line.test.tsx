import React from 'react'
import { render } from '@testing-library/react'
import { Line, Cell } from '../../../client/components/startedGame/Line'

const LineProps = {
    invisible: false,
    piecePositions: [
        {
            x: 1,
            y: 1,
        },
        {
            x: 2,
            y: 1,
        },
        {
            x: 3,
            y: 1,
        },
        {
            x: 4,
            y: 1,
        },
    ],
    pieceType: 'I',
    cells: Array(10).fill(''),
    yCoord: 2,
}

const LinePropsBis = {
    invisible: true,
    piecePositions: null,
    pieceType: 'I',
    cells: Array(10).fill(''),
    yCoord: 2,
}

test('Line renders without crashing', () => {
  render(<Line {...LineProps} />)
})

test('Line renders without crashing bis', () => {
  render(<Line {...LinePropsBis} />)
})

test('Cell renders without crashing', () => {
  render(<Cell pieceType="I" />)
})


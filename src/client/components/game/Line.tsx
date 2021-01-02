/** @jsx jsx */
import { jsx } from '@emotion/react'
import React from 'react'
import _ from 'lodash'
import { Cell } from './Cell'

function Line({ piecePositions, pieceType, cells, yCoord }: any) {
    return (
        <React.Fragment>
            {cells.map((cell: any, index: number) => {
                const pieceHere = piecePositions.some((item: any) => _.isEqual(item, { x: index, y: yCoord }))
                return <Cell
                    key={`cell_${index}`}
                    value={pieceHere ? pieceType : cell}
                />
            })}
        </React.Fragment>
    )
}

export default Line

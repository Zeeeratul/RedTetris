/** @jsx jsx */
import { jsx } from '@emotion/react'
import React from 'react'
import _ from 'lodash'

function Cell({ value }: any) {
    let backgroundColor = 'grey'

    if (value === 'I') 
        backgroundColor = 'cyan'
    else if (value === 'J')
        backgroundColor = 'blue'
    else if (value === 'L')
        backgroundColor = 'orange'
    else if (value === 'O')
        backgroundColor = 'yellow'
    else if (value === 'S')
        backgroundColor = 'green'
    else if (value === 'T')
        backgroundColor = 'purple'
    else if (value === 'Z')
        backgroundColor = 'red'

    return (
        <div 
            css={{
                borderRadius: '6px',
                width: '100%',
                height: '100%',
                backgroundColor
            }}
        />
    )
}

function Line({ piecePositions, pieceType, cells, yCoord }: any) {

    const positionsInLine = _.filter(piecePositions, { 'y': yCoord })

    return (
        <React.Fragment>
            {cells.map((cell: any, index: number) => {
                if (positionsInLine.length > 0) {
                    const pieceHere = _.find(positionsInLine, { x: index })
                    return (
                        <Cell
                            key={`cell_${index}`}
                            value={pieceHere ? pieceType : cells[index]}
                        />
                    )
                }
                else {
                    return (
                        <Cell
                            key={`cell_${index}`}
                            // value={true ? pieceType : cells[index]}
                            value={cells[index]}
                        />
                    )
                }
            })}
        </React.Fragment>
    )
}

export default Line

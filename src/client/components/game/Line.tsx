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

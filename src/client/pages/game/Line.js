import React from 'react'
import _ from 'lodash'


function Line({ currentPiece, lineNumber, cells, currentType }) {

    return (
        <>
        {cells.map((cell, cellNumber) => {

            const isPieceHere = currentPiece.some((item) => _.isEqual(item, [cellNumber, lineNumber]))

            if (isPieceHere) {
                return (
                    <div key={`line_${cellNumber}`} className={`cell piece-${currentType}`}></div>
                )
            }
            else {
                return (
                    <div key={`line_${cellNumber}`} className={`cell ${cell === 0 ? null : `piece-${cell}` }`}></div>
                )
            }
        })}
        </>
    )
}

export default Line

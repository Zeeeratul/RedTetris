/** @jsx jsx */
import { jsx } from '@emotion/react'
import React from 'react'
import _ from 'lodash'

const cellsColors: { [index: string] : any } = {
    "I": {
        cell: "#00ffff",
        top: "#e6ffff",
        bottom: "#00b3b3",
        side: "#00e6e6",
    },
    "J": {
        cell: "blue",
        top: "#4d4dff",
        bottom: "#0000cc",
        side: "#0000e6",
    },
    "L": {
        cell: "#ff9900",
        top: "#ffb84d",
        bottom: "#cc7a00",
        side: "#e68a00",
    },
    "T": {
        cell: "#cc00cc",
        top: "#ff1aff",
        bottom: "#990099",
        side: "#b300b3",
    },
    "O": {
        cell: "#FFD500",
        top: "#ffdd33",
        bottom: "#ccaa00",
        side: "#e6bf00",
    },
    "S": {
        cell: "#72CB3B",
        top: "#8bd45e",
        bottom: "#58a12b",
        side: "#63b530",
    },
    "Z": {
        cell: "#ff3213",
        top: "#ff644d",
        bottom: "#cc1b00",
        side: "#e61f00",
    },
    // Penalty Line
    "*": {
        cell: "#A0A0A0",
        top: "#B0B0B0",
        bottom: "#787878",
        side: "#989898",
    },
}

function Cell({ pieceType }: { pieceType: PieceType }) {

    if (!pieceType)
        return (
            <div className="cell"
                css={{
                    width: 'calc(100% - 2px)',
                    height: 'calc(100% - 2px)',
                    backgroundColor: 'black',
                    border: '1px solid #303030',
                }}
            />
        )


    return (
        <div className="cell"
            css={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: cellsColors[pieceType].cell,
            }}
        >
            <div 
                id="top-shape"
                css={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 0%, 15% 15%, 85% 15%, 100% 0%)",
                    backgroundColor: cellsColors[pieceType].top,
                }}
            />

            <div 
                id="right-shape"
                css={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(100% 0%, 85% 15%, 85% 85%, 100% 100%)",
                    backgroundColor: cellsColors[pieceType].side,
                }}
            />

            <div 
                id="bottom-shape"
                css={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 100%, 15% 85%, 85% 85%, 100% 100%)",
                    backgroundColor: cellsColors[pieceType].bottom,
                }}
            />

            <div 
                id="left-shape"
                css={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 0%, 15% 15%, 15% 85%, 0% 100%)",
                    backgroundColor: cellsColors[pieceType].side,
                }}
            />
        </div>
    )
}

function Line({ piecePositions, pieceType, cells, yCoord, invisible }: {
    invisible: boolean,
    piecePositions: Position[] | null,
    pieceType: PieceType,
    cells: PieceType[],
    yCoord: number,
}) {

    if (invisible || !piecePositions)
        return (
            <React.Fragment>
                {cells.map((cell: any, index: number) => {
                    return <Cell
                        key={`cell_${index}`}
                        pieceType={cell}
                    />
                })}
            </React.Fragment>
        )
    else 
        return (
            <React.Fragment>
                {cells.map((cell: any, index: number) => {
                    const pieceHere = piecePositions.some((item: any) => _.isEqual(item, { x: index, y: yCoord }))
                    return <Cell
                        key={`cell_${index}`}
                        pieceType={pieceHere ? pieceType : cell}
                    />
                })}
            </React.Fragment>
        )
}

export {
    Cell,
    Line
}